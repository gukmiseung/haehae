create table if not exists public.conversation_analysis_quota (
  singleton boolean primary key default true check (singleton),
  minute_start timestamptz not null,
  minute_count integer not null,
  utc_day date not null,
  day_count integer not null
);

alter table public.conversation_analysis_quota enable row level security;
revoke all on table public.conversation_analysis_quota from public, anon, authenticated;
grant select, insert, update on table public.conversation_analysis_quota to service_role;

create or replace function public.reserve_conversation_analysis()
returns boolean
language sql
set search_path = ''
as $$
  with reservation as (
    insert into public.conversation_analysis_quota as quota
      (singleton, minute_start, minute_count, utc_day, day_count)
    values (true, date_trunc('minute', statement_timestamp()), 1,
      (statement_timestamp() at time zone 'UTC')::date, 1)
    on conflict (singleton) do update
    set minute_start = excluded.minute_start,
        minute_count = case when quota.minute_start = excluded.minute_start
          then quota.minute_count + 1 else 1 end,
        utc_day = excluded.utc_day,
        day_count = case when quota.utc_day = excluded.utc_day
          then quota.day_count + 1 else 1 end
    where (quota.minute_start < excluded.minute_start
      or (quota.minute_start = excluded.minute_start and quota.minute_count < 20))
      and (quota.utc_day < excluded.utc_day
        or (quota.utc_day = excluded.utc_day and quota.day_count < 200))
    returning true
  )
  select exists (select 1 from reservation);
$$;

revoke execute on function public.reserve_conversation_analysis() from public, anon, authenticated;
grant execute on function public.reserve_conversation_analysis() to service_role;
