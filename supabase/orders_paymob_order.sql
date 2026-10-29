-- ربط كل طلب برقم الطلب عند Paymob، علشان دفعة واحدة ما تفتحش طلبين.
-- شغّليه مرة واحدة من SQL Editor في لوحة Supabase، بعد shop.sql.
-- لازم يتشغّل قبل نشر create-checkout وpaymob-webhook الجداد.

-- رقم الطلب عند Paymob: الـ webhook بيدوّر بيه، لأنه الرقم الوحيد اللي Paymob بيوقّع عليه.
alter table public.skillbridge_orders
  add column if not exists paymob_order_id text;

create unique index if not exists skillbridge_orders_paymob_order
  on public.skillbridge_orders (paymob_order_id) where paymob_order_id is not null;

-- نفس عملية الدفع ما تتسجّلش على طلبين
create unique index if not exists skillbridge_orders_paymob_transaction
  on public.skillbridge_orders (paymob_transaction_id) where paymob_transaction_id is not null;
