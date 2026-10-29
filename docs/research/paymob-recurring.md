# Can Paymob charge a monthly Subscription on its own?

Research for issue #22 (child of map #21). Checked 2026-10-29 against Paymob's own developer portal (developers.paymob.com) and Paymob's official Postman collections on GitHub (github.com/PaymobAccept/API-Postman-Collections). Anything not from those is marked **[secondary]** or **[unconfirmed]**.

## Short answer

Yes, for **cards only**. Paymob Egypt has a **Subscription Module**: we create a Plan (amount, every 30 days), the Student pays once on the hosted checkout with a 3DS card, Paymob saves the card, and Paymob then charges it every cycle by itself through a MOTO integration. Mobile wallets cannot be used for a Subscription. Both sides can stop it: we cancel/suspend by API; there is no documented Student-facing cancel page, so the Student cancels on our site and we call the API.

## 1. Is there a subscriptions / recurring API? Cards or wallets?

- **Subscription Module exists for Egypt.** Base URL for Egypt is `https://accept.paymob.com`. "Once a customer is enrolled, Paymob handles the recurring charges according to the defined schedule." — [Subscriptions overview](https://developers.paymob.com/paymob-docs/payments-and-features/core-features/subscriptions); [Subscription Module Postman collection](https://github.com/PaymobAccept/API-Postman-Collections/blob/main/Paymob%20Subscription%20Module%20API.postman_collection.json).
- **Two integration IDs are needed** (collection overview, "Integration Requirements"):
  1. an **Online 3DS card** integration ID, for the first payment that enrolls the Student and saves the card;
  2. a **MOTO** integration ID, "used for automated recurring payments". The Plan's `integration` field must be the MOTO ID: "Please make sure to use the Moto integration ID while creating a subscription plan." — [Create Subscription Plan](https://developers.paymob.com/paymob-docs/developers/subscription/create-subscription-plan).
  - Our current account only has the 3DS card + wallet integrations used by `create-checkout`. A MOTO integration is normally enabled by Paymob on request (older Paymob docs: "ask your technical contact for a recurring payment setup, you should receive extra integration ID in your dashboard" — docs.paymob.com/docs/pay-with-saved-token, **[secondary: read via search snippet; the page's TLS certificate failed]**).
- **Flow** (collection "Quick Start Guide"):
  1. `POST /api/acceptance/subscription-plans` (Bearer auth token from `POST /api/auth/tokens` with the API key; token lasts 60 min). Body: `frequency` (one of 7, 15, 30, 60, 90, 180, 360 days; 30 = monthly), `name`, `amount_cents` (piasters), `integration` (MOTO ID), optional `reminder_days`, `retrial_days`, `number_of_deductions` (null = forever), `use_transaction_amount`, `webhook_url`, `is_active`.
  2. `POST /v1/intention/` (same Intention API and `Token <secret key>` auth we already use) with `subscription_plan_id`, `payment_methods: [<3DS card ID>]` ("only a 3DS card Integration ID will be used"), optional `subscription_start_date`, plus the usual `special_reference`, `notification_url`, `redirection_url`.
  3. Send the Student to `https://accept.paymob.com/unifiedcheckout/?publicKey=…&clientSecret=…`. "Once the transaction completed successfully, the subscription will be created." — [Create Subscription](https://developers.paymob.com/paymob-docs/developers/subscription/create-subscription).
- **First payment vs. renewals:** with `use_transaction_amount: true` the first payment counts as the first deduction and renewals use its amount; with `false` the first payment only saves the card and renewals use the Plan's `amount_cents` (comment in the collection's Create Plan body). A "3DS verification" integration (charge-free card check, e.g. free trial) exists on request via support@paymob.com.
- **Wallets: not supported.** The subscription intention takes only a 3DS card ID; tokenization docs describe cards only ("the customer enters their card data and chooses to save their card" — [Create Card Token](https://developers.paymob.com/paymob-docs/developers/pay-with-saved-cards/create-card-token)); the Egypt wallets page lists only "Refund (Full/Partial)" as a supported action — [Mobile Wallets](https://developers.paymob.com/paymob-docs/payments-and-features/payment-methods/mobile-wallets-egy-ksa). No official page shows a saved wallet or wallet mandate. **[unconfirmed by Paymob in writing that wallets can never recur; ask support if it matters]**
- Alternative lower-level path: "Pay with saved card" MIT (save a card token, then charge it ourselves with `POST /api/acceptance/payments/pay` using a MOTO payment key). That needs our own scheduler (cron), so the Subscription Module is the closer fit. — [Pay with saved card collection](https://github.com/PaymobAccept/API-Postman-Collections/blob/main/Pay%20with%20saved%20card.postman_collection.json).

## 2. How is a Subscription cancelled?

All by API with the auth token (collection, "Subscriptions" folder):

| Action | Endpoint | Effect (as documented) |
|---|---|---|
| Suspend | `POST /api/acceptance/subscriptions/{id}/suspend` | state `suspended`, no charges until resumed |
| Resume | `POST /api/acceptance/subscriptions/{id}/resume` | back to `active`, billing from next scheduled date |
| Cancel | `POST /api/acceptance/subscriptions/{id}/cancel` | state `canceled`, permanent; "customer must create a new subscription to re-enroll" |
| Update | `PUT /api/acceptance/subscriptions/{id}` | change `amount_cents`, `ends_at`, `next_billing` |
| Read | `GET /api/acceptance/subscriptions/{id}`, `/transactions`, `/last-transaction`, `/card-tokens` | state, next billing date, charge history |

- Plans can also be suspended/resumed (stops new enrollments only; existing subscriptions keep running).
- The Student can change card via a new 3DS intention with `subscriptionv2_id` (add secondary card) + `change-primary-card`.
- **No documented Student self-service cancel page from Paymob.** So "the Student cancels" means a button on SkillBridge that calls an Edge Function, which calls `/cancel`. **[unconfirmed whether Paymob's emails/receipts offer a cancel link]**

## 3. Callbacks on renewal / failure, HMAC, retries

- **Subscription webhook:** set per Plan (`webhook_url`) or per subscription (`POST /api/acceptance/subscriptions/{id}/register_webhook`). Paymob POSTs `{paymob_request_id, subscription_data, trigger_type, hmac}` on every action — [Subscription Callback and HMAC](https://developers.paymob.com/paymob-docs/developers/subscription/hmac-calculation-for-subscription-callback).
- **trigger_type values:** `Subscription Created`, `suspended`, `canceled`, `resumed`, `updated`, `add_secondry_card`, `change_primary_card`, `delete_card`, `register_webhook`, **`Successful Transaction`** (renewal charged), **`Failed Transaction`** (renewal failed), **`Failed Overdue Transaction`** (retry failed).
- **HMAC is different from our current callback:** it is in the **body** (not the query string), and it is SHA-512 HMAC (merchant HMAC secret) of just the string `"{trigger_type}for{subscription_data.id}"`, e.g. `suspendedfor1264`. So `paymob-webhook`'s 20-field transaction HMAC will not validate it; a separate check is needed. Note the signature does **not** cover amount or state, so after a valid callback it is safer to re-read the subscription/last transaction from the API before granting access.
- **Does the renewal MOTO charge also fire the normal "Transaction Processed" callback** to the integration's callback URL? **[unconfirmed]** — not stated anywhere official. Transaction callbacks are sent when a transaction "succeeds or is declined" — [Webhook callbacks and HMAC](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac). Verify in test mode.
- **Retries of the charge:** yes, Paymob retries a failed renewal itself; `retrial_days` = "the days on which the subscription will be attempted again in case of a failure to collect". Exact semantics (one retry after N days vs. daily for N days) **[unconfirmed]**. A failed retry sends `Failed Overdue Transaction`. Whether the subscription then auto-suspends/cancels is **not documented** — we must decide our own rule (e.g. end access when the `Failed Overdue Transaction` arrives).
- **Reminder:** `reminder_days` makes Paymob email the customer N days before a charge ("currently supporting email notifications").
- **Retries of webhook delivery** (if our endpoint is down): **not documented**. Use `GET /api/acceptance/subscriptions/{id}` / `/transactions` as a reconcile fallback.

## 4. Test mode

- Test vs live is chosen by which keys and integration IDs you use (dashboard toggle "Test Mode / Live Mode"); test IDs only work with test keys. The subscription collection's examples come back with `"live": false` and `pi_test_…` / `egy_csk_test_…` IDs, so enrollment works in test mode. **A test MOTO integration ID is required** (dashboard → Developers → Payment Integrations, in Test Mode); if it isn't there, ask Paymob support to add it.
- Test cards (official): Mastercard `5123456789012346`, `5123450000000008`; Visa `4111111111111111`; name "Test Account", expiry 01/39, CVV 123. Test wallet `01010101010`, MPin/OTP `123456` (wallet irrelevant for subscriptions) — [Test Credentials](https://developers.paymob.com/paymob-docs/need-help/setup-guides/test-credentials). How to force a **declined** renewal in test mode is not documented officially (community: CVV 111 or expiry year 20 **[secondary: pub.dev Flutter package]**).
- **Testing a renewal without waiting a month:** no official "advance clock" tool. Options from the documented API: (a) a test Plan with `frequency: 7` (shortest allowed) and/or (b) `PUT /api/acceptance/subscriptions/{id}` with `next_billing` set to today/tomorrow. Whether Paymob's scheduler picks up a same-day `next_billing` in test mode, and at what time of day it runs, is **[unconfirmed]** — try it. The webhook handler itself can be tested by POSTing a hand-built body with a correct HMAC (the formula is simple).

## 5. If not supported: nearest alternative

Not needed for cards. For Students who only have a wallet, the nearest option is a manual monthly payment: a one-off checkout (what we have today) for "one month of Subscription", plus a reminder email before it ends. Paymob's own `reminder_days` email only works inside the Subscription Module, so wallet reminders would be sent by us.

## Open questions to confirm with Paymob support

1. Enable a MOTO integration (test + live) on our Egypt account for the Subscription Module; any extra fees?
2. Are mobile wallets (Vodafone Cash etc.) definitely impossible for subscriptions?
3. Does a renewal also send the normal Transaction Processed callback?
4. Exact `retrial_days` behavior, and what state the subscription ends in after the last failed retry.
5. Are subscription webhooks re-delivered if our endpoint returns an error?
