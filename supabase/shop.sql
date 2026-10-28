-- جداول الكورسات والطلبات ولوحة الأدمن في SkillBridge.
-- شغّليه مرة واحدة من SQL Editor في لوحة Supabase، بعد contact_messages.sql.
-- بعده شغّلي seed_courses.sql علشان الكورسات الحالية تتنقل للقاعدة.

-- الأدمن = مستخدم في Supabase Auth عنده app_metadata.skillbridge_admin = true.
-- app_metadata ما يقدرش يغيّرها غير صاحب المشروع، فمحدش يقدر يعمل نفسه أدمن من الموقع.
create or replace function public.skillbridge_is_admin()
returns boolean
language sql stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'skillbridge_admin')::boolean, false)
$$;

-- ===== الكورسات =====
create table public.skillbridge_courses (
  id text primary key check (id ~ '^[a-z0-9-]{2,60}$'),
  category text not null check (category in ('frontend', 'data', 'ux', 'marketing', 'security', 'product', 'career')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  hours integer not null check (hours between 1 and 500),
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  learners integer not null default 0 check (learners >= 0),
  -- لينك صورة كامل
  image text not null check (image ~* '^https://'),
  instructor text not null,
  skills text[] not null default '{}',
  title_en text not null,
  title_ar text not null,
  description_en text not null,
  description_ar text not null,
  -- عناوين الدروس بس (ظاهرة لأي حد): [{"en": "...", "ar": "..."}]
  lessons jsonb not null check (jsonb_typeof(lessons) = 'array' and jsonb_array_length(lessons) between 1 and 100),
  -- السعر بالقرش (100 قرش = 1 جنيه). صفر = كورس مجاني.
  price_piasters integer not null default 0 check (price_piasters >= 0),
  hidden boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== الطلبات =====
-- بيتعملوا بس من Edge Functions (بمفتاح السيرفر)، مش من المتصفح.
create table public.skillbridge_orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete restrict,
  course_id text not null references public.skillbridge_courses (id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_piasters integer not null check (amount_piasters > 0),
  currency text not null default 'EGP',
  -- نسخة من بيانات الطالب وقت الطلب، علشان الأدمن يشوفها
  student_name text not null,
  student_email text not null,
  paymob_intention_id text,
  paymob_transaction_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  refunded_at timestamptz,
  updated_at timestamptz not null default now()
);

create index skillbridge_orders_student_idx on public.skillbridge_orders (student_id);
create index skillbridge_orders_course_idx on public.skillbridge_orders (course_id);
create index skillbridge_orders_created_idx on public.skillbridge_orders (created_at desc);
-- الطالب ما يدفعش في نفس الكورس مرتين
create unique index skillbridge_orders_one_paid
  on public.skillbridge_orders (student_id, course_id) where status = 'paid';

-- هل الطالب الحالي يمتلك الكورس؟ (مجاني ومش مخفي، أو عنده طلب مدفوع)
create or replace function public.skillbridge_owns_course(p_course_id text)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select auth.uid() is not null and (
    exists (select 1 from public.skillbridge_courses c
            where c.id = p_course_id and c.price_piasters = 0 and not c.hidden)
    or exists (select 1 from public.skillbridge_orders o
               where o.course_id = p_course_id and o.student_id = auth.uid() and o.status = 'paid')
  )
$$;

-- ===== محتوى الدروس (للي يمتلك الكورس بس) =====
create table public.skillbridge_lesson_content (
  course_id text not null references public.skillbridge_courses (id) on delete cascade,
  lesson_index integer not null check (lesson_index >= 0),
  body_en text not null default '',
  body_ar text not null default '',
  video_url text check (video_url is null or video_url ~* '^https://'),
  updated_at timestamptz not null default now(),
  primary key (course_id, lesson_index)
);

-- ===== رسايل تواصل معنا: الأدمن يقرا ويعلّم "اتعاملنا معاها" =====
alter table public.skillbridge_contact_messages
  add column handled boolean not null default false,
  add column handled_at timestamptz;

-- ===== updated_at تلقائي =====
create or replace function public.skillbridge_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger skillbridge_courses_touch before update on public.skillbridge_courses
  for each row execute function public.skillbridge_touch();
create trigger skillbridge_orders_touch before update on public.skillbridge_orders
  for each row execute function public.skillbridge_touch();
create trigger skillbridge_lesson_content_touch before update on public.skillbridge_lesson_content
  for each row execute function public.skillbridge_touch();

-- لما الأدمن يعلّم رسالة، نسجّل الوقت
create or replace function public.skillbridge_contact_handled()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.handled_at := case when new.handled then coalesce(new.handled_at, now()) else null end;
  return new;
end
$$;

create trigger skillbridge_contact_handled before update on public.skillbridge_contact_messages
  for each row execute function public.skillbridge_contact_handled();

-- لما الأدمن يعمل استرجاع، نسجّل الوقت
create or replace function public.skillbridge_order_refunded()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'refunded' and old.status <> 'refunded' then
    new.refunded_at := now();
  end if;
  return new;
end
$$;

create trigger skillbridge_order_refunded before update on public.skillbridge_orders
  for each row execute function public.skillbridge_order_refunded();

-- ===== الصلاحيات (RLS) =====
alter table public.skillbridge_courses enable row level security;
alter table public.skillbridge_orders enable row level security;
alter table public.skillbridge_lesson_content enable row level security;

revoke all on public.skillbridge_courses, public.skillbridge_orders, public.skillbridge_lesson_content
  from anon, authenticated;

-- الكورسات: أي حد يشوف الظاهرة، والطالب يشوف المخفية اللي اشتراها، والأدمن يشوف كله ويعدّل.
grant select on public.skillbridge_courses to anon, authenticated;
grant insert, update, delete on public.skillbridge_courses to authenticated;

create policy "visible courses are public" on public.skillbridge_courses
  for select to anon, authenticated
  using (not hidden or public.skillbridge_is_admin() or public.skillbridge_owns_course(id));

create policy "admin inserts courses" on public.skillbridge_courses
  for insert to authenticated with check (public.skillbridge_is_admin());
create policy "admin updates courses" on public.skillbridge_courses
  for update to authenticated using (public.skillbridge_is_admin()) with check (public.skillbridge_is_admin());
create policy "admin deletes courses" on public.skillbridge_courses
  for delete to authenticated using (public.skillbridge_is_admin());

-- محتوى الدروس: اللي يمتلك الكورس يقرا، والأدمن يقرا ويعدّل.
grant select, insert, update, delete on public.skillbridge_lesson_content to authenticated;

create policy "owners read lesson content" on public.skillbridge_lesson_content
  for select to authenticated
  using (public.skillbridge_is_admin() or public.skillbridge_owns_course(course_id));
create policy "admin inserts lesson content" on public.skillbridge_lesson_content
  for insert to authenticated with check (public.skillbridge_is_admin());
create policy "admin updates lesson content" on public.skillbridge_lesson_content
  for update to authenticated using (public.skillbridge_is_admin()) with check (public.skillbridge_is_admin());
create policy "admin deletes lesson content" on public.skillbridge_lesson_content
  for delete to authenticated using (public.skillbridge_is_admin());

-- الطلبات: الطالب يشوف طلباته، والأدمن يشوف كله.
-- التعديل الوحيد المسموح من الموقع: الأدمن يحوّل طلب مدفوع لـ "اترد".
grant select on public.skillbridge_orders to authenticated;
grant update (status) on public.skillbridge_orders to authenticated;

create policy "students read own orders" on public.skillbridge_orders
  for select to authenticated
  using (student_id = auth.uid() or public.skillbridge_is_admin());
create policy "admin marks paid orders refunded" on public.skillbridge_orders
  for update to authenticated
  using (public.skillbridge_is_admin() and status = 'paid')
  with check (public.skillbridge_is_admin() and status = 'refunded');

-- رسايل تواصل معنا: الطالب اللي عامل تسجيل دخول يبعت زي الزائر بالظبط.
grant insert (name, email, topic, message, lang) on public.skillbridge_contact_messages to authenticated;

create policy "students can insert contact messages" on public.skillbridge_contact_messages
  for insert to authenticated
  with check (
    char_length(btrim(name)) between 3 and 100
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
    and topic in ('general', 'support', 'partnership', 'feedback')
    and char_length(btrim(message)) between 20 and 2000
    and lang in ('en', 'ar')
  );

-- الأدمن بس يقرا ويغيّر "handled".
grant select on public.skillbridge_contact_messages to authenticated;
grant update (handled) on public.skillbridge_contact_messages to authenticated;

create policy "admin reads contact messages" on public.skillbridge_contact_messages
  for select to authenticated using (public.skillbridge_is_admin());
create policy "admin marks contact messages" on public.skillbridge_contact_messages
  for update to authenticated
  using (public.skillbridge_is_admin()) with check (public.skillbridge_is_admin());
