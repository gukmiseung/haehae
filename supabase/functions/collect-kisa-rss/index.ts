import { createClient } from 'npm:@supabase/supabase-js@2.119.2'
import { MAX_FEED_BYTES, collectFeeds } from './feed.ts'

async function authorized(request: Request, expected: string): Promise<boolean> {
  const supplied = request.headers.get('x-cron-secret') ?? ''
  if (supplied.length < 32 || supplied.length > 256) return false
  const encode = new TextEncoder()
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', encode.encode(supplied)),
    crypto.subtle.digest('SHA-256', encode.encode(expected)),
  ])
  const a = new Uint8Array(left)
  const b = new Uint8Array(right)
  let difference = 0
  for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index]
  return difference === 0
}

async function fetchFeed(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(20_000),
    redirect: 'error',
  })
  if (!response.ok || !response.body) throw new Error(`RSS HTTP ${response.status}`)
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0
  let xml = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_FEED_BYTES) throw new Error('RSS exceeds size limit')
      xml += decoder.decode(value, { stream: true })
    }
    return xml + decoder.decode()
  } finally {
    await reader.cancel().catch(() => {})
  }
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
  const secret = Deno.env.get('KISA_CRON_SECRET')
  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!secret || secret.length < 32 || secret.length > 256 || !url || !serviceKey) {
    console.error('KISA collector configuration missing')
    return Response.json({ error: 'Collector not configured' }, { status: 503 })
  }
  if (!await authorized(request, secret)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { fetched, invalidItems, completedQueries, failedQueries, posts } = await collectFeeds(fetchFeed)
    if (failedQueries.length) console.warn('Some KISA RSS searches failed', { failedQueries })
    let inserted = 0
    if (posts.length) {
      const db = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      // ON CONFLICT DO NOTHING handles retries and concurrent invocations atomically.
      const { data, error } = await db.from('security_posts')
        .upsert(posts, { onConflict: 'source_url', ignoreDuplicates: true })
        .select('id')
        .abortSignal(AbortSignal.timeout(15_000))
      if (error) throw new Error(`Database write failed (${error.code})`)
      inserted = data?.length ?? 0
    }
    const result = { fetched, matched: posts.length, inserted, existing: posts.length - inserted, invalidItems, completedQueries, failedQueries }
    console.info('KISA collection completed', result)
    return Response.json(result)
  } catch (error) {
    console.error('KISA collection failed', error instanceof Error ? error.message : 'Unknown error')
    return Response.json({ error: 'Collection failed; stored posts retained' }, { status: 502 })
  }
})
