-- IMPORTANT: Replace YOUR_ADMIN_EMAIL below with your real email before running.

create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_content (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.admins (email)
values (lower('syedaraaziafatima@gmail.com'))
on conflict (email) do nothing;

insert into public.portfolio_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.admins enable row level security;
alter table public.portfolio_content enable row level security;

drop policy if exists "Admin reads own access" on public.admins;
create policy "Admin reads own access"
on public.admins for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "Everyone reads portfolio" on public.portfolio_content;
create policy "Everyone reads portfolio"
on public.portfolio_content for select
to anon, authenticated
using (true);

drop policy if exists "Admin inserts portfolio" on public.portfolio_content;
create policy "Admin inserts portfolio"
on public.portfolio_content for insert
to authenticated
with check (
  exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
);

drop policy if exists "Admin updates portfolio" on public.portfolio_content;
create policy "Admin updates portfolio"
on public.portfolio_content for update
to authenticated
using (
  exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
)
with check (
  exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads portfolio images" on storage.objects;
create policy "Public reads portfolio images"
on storage.objects for select
to public
using (bucket_id = 'portfolio-images');

drop policy if exists "Admin uploads portfolio images" on storage.objects;
create policy "Admin uploads portfolio images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-images'
  and exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
);

drop policy if exists "Admin updates portfolio images" on storage.objects;
create policy "Admin updates portfolio images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio-images'
  and exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
)
with check (
  bucket_id = 'portfolio-images'
  and exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
);

drop policy if exists "Admin deletes portfolio images" on storage.objects;
create policy "Admin deletes portfolio images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-images'
  and exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'))
);
