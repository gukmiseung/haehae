begin;

create table public.security_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 500),
  summary text check (summary is null or char_length(summary) <= 300),
  category text not null check (category in (
    '피싱', '스미싱', '보이스피싱', '기관 사칭', '개인정보 탈취', '사기 예방'
  )),
  source text not null default 'KISA' check (source = 'KISA'),
  source_url text not null unique check (
    source_url ~ '^https://www\.boho\.or\.kr/kr/bbs/view\.do\?bbsId=B0000133&nttId=[0-9]+&menuNo=205020$'
  ),
  -- RSS provides a calendar date, without a time or timezone.
  published_at date,
  created_at timestamptz not null default now()
);

create index security_posts_published_at_idx
  on public.security_posts (published_at desc nulls last, created_at desc, id desc);
alter table public.security_posts enable row level security;
revoke all on public.security_posts from public, anon, authenticated;
grant select on public.security_posts to anon, authenticated;
grant select, insert on public.security_posts to service_role;
create policy "Public can read security posts" on public.security_posts
  for select to anon, authenticated using (true);

comment on column public.security_posts.summary is
  'Nullable RSS-provided introduction. No generated article summaries.';
comment on column public.security_posts.category is
  'Application classification based on explicit fraud-related title keywords.';
commit;
