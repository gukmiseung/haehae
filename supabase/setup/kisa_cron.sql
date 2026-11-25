-- Run AFTER saving kisa_rss_function_url and kisa_rss_cron_secret in Vault.
-- KISA_CRON_SECRET in Edge Function Secrets must equal the Vault secret.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
create schema if not exists private;

create or replace function private.request_kisa_rss()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  function_url text;
  cron_secret text;
  request_id bigint;
begin
  select decrypted_secret into function_url from vault.decrypted_secrets
    where name = 'kisa_rss_function_url';
  select decrypted_secret into cron_secret from vault.decrypted_secrets
    where name = 'kisa_rss_cron_secret';
  if function_url is null or function_url !~ '^https://[a-z0-9]+\.supabase\.co/functions/v1/collect-kisa-rss$'
    or cron_secret is null or length(cron_secret) < 32 then
    raise exception 'Configure the KISA URL and secret in Vault first';
  end if;
  select net.http_post(
    url := function_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', cron_secret),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  ) into request_id;
  return request_id;
end;
$$;
revoke all on function private.request_kisa_rss() from public, anon, authenticated;

-- A repeated call with the same job name updates the existing hourly job.
select cron.schedule('collect-kisa-rss', '0 * * * *', 'select private.request_kisa_rss();');
commit;

-- Initial import includes all matching posts currently available in the RSS.
select private.request_kisa_rss();
