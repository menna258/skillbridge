# Paymob webhook HMAC: how Paymob signs it, and whether `paymob-webhook` checks it safely

Researched 2026-10-29 against `supabase/functions/paymob-webhook/index.ts`, `supabase/functions/create-checkout/index.ts`, `supabase/shop.sql` and [ADR 0002](../adr/0002-paymob-for-payments.md). No code was changed.

## Short answer

- Paymob signs the Transaction Processed callback with **HMAC-SHA512** over the **values of 20 fixed fields, concatenated with no separator**, keyed with the merchant's HMAC secret. The result is sent as lowercase hex in the `?hmac=` **query parameter** ([Paymob: HMAC Transaction Callback](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac/hmac-transaction-callback), [Paymob: HMAC overview](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac)).
- Our code gets the algorithm, the field list, the field order, the boolean format and the compare right.
- **The main gap is what the signature leaves out.** `obj.order.merchant_order_id`, the field we use to find our Order, is **not signed**. Nothing ties a signed Paymob transaction to one SkillBridge Order, and nothing stops the same transaction from being used twice. A student who paid once could replay that payment's signed fields against a second Pending Order with the same price (details under Gap 1). This is serious but **not yet tested** against the Paymob sandbox.

## How Paymob signs the transaction callback

| Fact | Source |
|---|---|
| Algorithm is HMAC with SHA-512, keyed with the merchant's HMAC secret | [HMAC Transaction Callback](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac/hmac-transaction-callback) |
| Every callback (Processed, Response, Card token) carries an `hmac` **query parameter** | [HMAC overview](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac) |
| Field order: `amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, order.id, owner, pending, source_data.pan, source_data.sub_type, source_data.type, success` | [HMAC Transaction Callback](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac/hmac-transaction-callback) |
| POST (Processed): `id` = `obj.id` and `order.id` = `obj.order.id` (nested). GET (Response): the same fields come as flat query params, with `id` and `order_id` | same page |
| Booleans are written as lowercase `true` / `false` (the official sample string reads `...EGPfalsefalse...`) | same page; also Paymob's own WooCommerce plugin, which maps each boolean to `'true'`/`'false'` before hashing ([admin-helper.php](https://github.com/PaymobAccept/accept-woocommerce/blob/eff368a744e13491147dc2be6a403e952b82c0df/helpers/admin-helper.php), lines 244-253, 406-456) |
| How `null` is written is **not documented**. Paymob's PHP plugin concatenates `null` as an empty string | plugin as above (PHP behaviour, not a documented rule) |
| The plugin compares with `===`, which is not constant-time. Paymob's own integration guide says to compare in constant time and to treat a missing or wrong-length `hmac` as a mismatch | [Paymob-AI-Integration-Skill hmac-verification.md](https://github.com/PaymobAccept/Paymob-AI-Integration-Skill/blob/bd76bdc39104fe336a528d4d0db02602fccc3371/skills/paymob-integration/references/hmac-verification.md) (Paymob org repo, but a guide, not the API reference) |
| Intention API: `special_reference` is "returned in the transaction callback under merchant_order_id"; `notification_url` gets a POST with full transaction details; `redirection_url` gets transaction details as query params (Card and Wallet only); amounts are in cents | [Create Intention](https://developers.paymob.com/paymob-docs/developers/intention-apis/create-intention), [Update Intention](https://developers.paymob.com/paymob-docs/developers/intention-apis/update-intention) |
| The Intention API docs never describe a separate signing scheme. The callback sample on the HMAC page comes from a unified checkout (it has `next_payment_intention`), so the same 20-field scheme applies | [HMAC Transaction Callback](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac/hmac-transaction-callback) (inferred, not stated) |
| The create-intention response includes `intention_order_id`, which is the Paymob Order ID that the callback sends back as `order.id` | [Create Intention](https://developers.paymob.com/paymob-docs/developers/intention-apis/create-intention) ("Order ID ... received in the transaction callback and can be used to correlate"); field name from [intention-api.md](https://github.com/PaymobAccept/Paymob-AI-Integration-Skill/blob/bd76bdc39104fe336a528d4d0db02602fccc3371/skills/paymob-integration/references/intention-api.md) |
| Refunds and voids: callbacks are sent "after the payment or after any action on the payment". The processed payload has `is_refunded`, `refunded_amount_cents`, `is_voided`, and the unsigned `is_refund`, `is_void`, `has_parent_transaction` and `parent_transaction` | [Transaction callbacks](https://developers.paymob.com/paymob-docs/manage-callback/transaction-callbacks) |
| Don't update order status from the Response (redirect) callback; use the Processed callback | same page |
| Idempotency: use `obj.id` as a unique key under a DB unique constraint, and set the order to paid with an atomic compare-and-set | [hmac-verification.md](https://github.com/PaymobAccept/Paymob-AI-Integration-Skill/blob/bd76bdc39104fe336a528d4d0db02602fccc3371/skills/paymob-integration/references/hmac-verification.md) (Paymob org guide; **the official API docs say nothing about retries or duplicates**) |
| Supabase: a webhook must have JWT checking turned off, with `verify_jwt = false` per function in `config.toml` or with `--no-verify-jwt` | [Supabase function configuration](https://supabase.com/docs/guides/functions/function-configuration) |

## What our code does

`supabase/functions/paymob-webhook/index.ts`:

- L8-13: the 20 fields, in the documented order. **Correct.**
- L15, L68: reads each value from `body.obj` by dotted path. `String(true)` gives `"true"`, which is **correct**. `null`/`undefined` become `''`, which matches Paymob's PHP plugin but is undocumented.
- L17-22: Web Crypto HMAC with SHA-512, lowercase hex. **Correct.**
- L24-29, L71: XOR-accumulate compare after an early return on length. The length (128 hex characters) isn't secret, so this is effectively constant-time. **Acceptable.** The incoming hmac is lowercased first, which is fine.
- L70: takes `hmac` from the query string, falling back to `body.hmac`. That fallback is harmless: the value still has to match.
- L66: ignores anything whose `type` isn't `TRANSACTION`, such as card-token callbacks. Fine.
- L76-85: finds the Order by `tx.order.merchant_order_id`, which is our `special_reference` (`create-checkout/index.ts` L80). **This field is not signed.**
- L88: ignores `is_refunded`, `is_voided` and `pending`. All three are signed.
- L90: marks the Order paid if `success === true` and `amount_cents` equals the Order's `amount_piasters`. It **does not check `currency`** (signed), `integration_id` (signed), or that `order.id` matches the Paymob order we created.
- L91-97: compare-and-set from `pending`/`failed` to `paid`. That makes repeats of the same callback on the same Order harmless. **Good.**
- L100-111: when the student already owns the Course, the unique-index violation (`shop.sql` L65-66) triggers a "refund needed" email. It is sent once per Order, guarded by `paymob_transaction_id IS NULL`.
- `create-checkout/index.ts` L92 stores only `intention.id`. It doesn't store the Paymob order id (`intention_order_id`).
- `shop.sql` L53-54: `paymob_transaction_id` has **no unique constraint**.

## Gaps, ranked by severity

### 1. High: the signed transaction isn't tied to our Order, and one payment can unlock two Orders
`index.ts` L76 trusts the unsigned `obj.order.merchant_order_id`. Only `order.id` (Paymob's order) is signed, and we never stored it (`create-checkout/index.ts` L92). There is also no unique key on `paymob_transaction_id` (`shop.sql` L54). Here is how that could be abused:

- **How the signed fields get out:** Paymob's docs say the Response (GET) callback carries an `hmac` over the same 20 fields ([HMAC overview](https://developers.paymob.com/paymob-docs/developers/webhook-callbacks-and-hmac/hmac)), and it arrives as query params on the redirect into the student's own browser. So a student who pays once ends up holding a valid signed set of fields.
- **The replay:** they can POST those fields to `paymob-webhook` in a JSON `obj`, with `order.merchant_order_id` set to a second Pending Order of theirs. The `amount_cents` check (L90) passes whenever both Courses cost the same, and that Order becomes Paid.
- **Fix, defence in depth:**
  - (a) Save `intention_order_id` when the Order is created, and require `String(tx.order.id) === order.paymob_order_id`. Ideally, look the Order up by that signed id in the first place.
  - (b) Add a unique index on `paymob_transaction_id`.
  - (c) Check `tx.currency === 'EGP'` too.
- **Not yet tested:** this hasn't been reproduced in the sandbox. That needs confirming that the Intention flow's `redirection_url` really carries `hmac` and the signed fields (see Open questions).

### 2. Medium: some Paid Orders can't be traced back to Paymob
Paymob suggests `obj.id` as the unique idempotency key. Our compare-and-set covers repeats on the same Order but not across Orders, which is the same root cause as Gap 1. Also, `paymob_transaction_id` is only written on the paid path (L93) and the duplicate path (L105). A Failed Order keeps no transaction id, so later reconciliation is harder.

### 3. Medium: refund and void callbacks are silently ignored
`index.ts` L88 returns `ok` when `is_refunded`/`is_voided` is true. The ADR says refunds are handled by hand, so a refund made in the Paymob dashboard leaves the Order Paid until the Admin also marks it Refunded. That's a process risk, not a security bug. The unsigned `is_refund`/`is_void`/`has_parent_transaction` aren't checked either. Paymob's plugin checks them, but they are unsigned, so they shouldn't be relied on for a decision.

### 4. Low: no `currency` or `integration_id` check
Both fields are signed, and `create-checkout` only ever asks for EGP. The amount check (L90) still compares a bare number without its currency.

### 5. Low: `null` is stringified by guesswork
`index.ts` L68 turns `null` into `''`. That matches Paymob's PHP plugin, but Paymob doesn't document it. If a wallet callback carries a null `source_data.*` field and Paymob hashes something else, genuine payments would be rejected with a 401. That fails safe: no money is lost, but the Order stays Pending.

### 6. Info: a 500 or 401 depends on Paymob retrying
On an exception (L119-121) we return 500. Paymob's API docs don't describe retries, so a payment whose callback hits a transient error may never be confirmed. The Order would stay Pending, and the student would see the "contact us" screen (`src/pages/PaymentResult.jsx` L49-54). A reconciliation job using Paymob's Transaction Inquiry API would close this gap.

## Open questions and things not verified

- **Does the Intention / unified checkout `redirection_url` carry `hmac` and the 20 signed fields?** The general HMAC page says every Response callback does. Paymob's AI-integration guide says redirect params are "not signed/verifiable the same way". This decides how easy Gap 1 is to exploit. Test with one sandbox payment and log the redirect query string.
- **Null stringification** (Gap 5): undocumented. Capture a real wallet callback.
- **Retry policy and the expected response code** for `notification_url`: not in Paymob's public docs.
- **Refund and void callbacks:** does Paymob re-send the original transaction (`is_refunded: true`) or send a child transaction (`has_parent_transaction: true`)? The public docs show neither payload.
- **Name of the Paymob order id in the create-intention response** (`intention_order_id`): this comes from Paymob's GitHub guide, not the API reference page. Check it against a real response.
- **Deno and SHA-512 HMAC:** Deno's API page doesn't list supported hashes. SHA-512 is part of the W3C Web Crypto standard, and the deployed function presumably already verifies real callbacks, but no test in this repo proves it. A unit test against Paymob's documented sample string would.
- docs.paymob.com wouldn't load during this research because of a TLS certificate mismatch. Everything here comes from developers.paymob.com and the PaymobAccept GitHub org.
