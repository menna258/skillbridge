# Paymob takes the payments, and only its signed callback marks an Order Paid

Students pay in Egyptian pounds, and Stripe doesn't accept merchants based in Egypt, so we use Paymob's hosted checkout (cards and mobile wallets). The browser never decides whether an Order is Paid: an Edge Function creates a Pending Order and a Paymob payment intention, and a second Edge Function marks the Order Paid or Failed only after checking the HMAC signature on Paymob's server-to-server callback. The Admin Inbox email is sent from that callback, so it goes out only for money that actually arrived.

## Consequences

- The site owner needs their own Paymob merchant account; its secret key and HMAC secret live only in Edge Function secrets.
- Refunds are done by the Admin in the Paymob dashboard, then marked Refunded in the SkillBridge dashboard, which removes the Course from the Student.
