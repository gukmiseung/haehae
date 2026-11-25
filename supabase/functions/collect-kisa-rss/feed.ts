import { XMLParser, XMLValidator } from 'npm:fast-xml-parser@5.12.1'
import { decodeHTML } from 'npm:entities@9.0.0'

export const RSS_URL = 'https://www.boho.or.kr/kr/rss.do?bbsId=B0000133'
export const MAX_FEED_BYTES = 2_000_000
export const SEARCH_TERMS = ['피싱', '스미싱', '사칭', '탈취', '큐싱', '사기'] as const

export function rssUrlFor(term: string): string {
  const url = new URL(RSS_URL)
  url.searchParams.set('searchCnd', '1')
  url.searchParams.set('searchWrd', term)
  return url.toString()
}

export type SecurityPost = {
  title: string
  summary: null
  category: string
  source: 'KISA'
  source_url: string
  published_at: string | null
}

export function categoryForTitle(title: string): string | null {
  if (/보이스\s*피싱|전화\s*금융\s*사기/i.test(title)) return '보이스피싱'
  if (/스미싱|smishing/i.test(title)) return '스미싱'
  if (/피싱|phishing|큐싱|quishing|파밍|pharming/i.test(title)) return '피싱'
  if (/(?:공공기관|정부기관|금융기관|수사기관|경찰|검찰|국세청|택배|기관).{0,20}사칭/.test(title)) return '기관 사칭'
  if (/사칭/.test(title)) return '사기 예방'
  if (/제품|서버|취약점|보안 업데이트|패치/.test(title)) return null
  if (/(?:개인정보|금융정보|계정정보|계정|인증정보|자격증명|비밀번호).{0,15}(?:탈취|도용)/.test(title)) return '개인정보 탈취'
  if (/(?:투자|대출|중고거래|금융|온라인|인터넷|결제).{0,12}사기|사기.{0,12}(?:예방|주의|피해)/.test(title)) return '사기 예방'
  return null
}

export function canonicalSourceUrl(link: string): string | null {
  try {
    const url = new URL(link.trim())
    const id = url.searchParams.get('nttId')
    if (!['https:', 'http:'].includes(url.protocol) ||
      !['www.boho.or.kr', 'boho.or.kr'].includes(url.hostname) ||
      url.username || url.password || url.port ||
      url.pathname !== '/kr/bbs/view.do' ||
      url.searchParams.get('bbsId') !== 'B0000133' || !id || !/^\d+$/.test(id)) return null
    return `https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=${id}&menuNo=205020`
  } catch {
    return null
  }
}

function publicationDate(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const date = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const parsed = new Date(`${date}T00:00:00Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : null
}

export function parseFeed(xml: string) {
  if (new TextEncoder().encode(xml).byteLength > MAX_FEED_BYTES ||
    /<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) {
    throw new Error('Invalid or oversized RSS XML')
  }
  const parser = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: false,
    trimValues: true,
    isArray: (_name, path) => path === 'rss.channel.item',
  })
  const channel = parser.parse(xml)?.rss?.channel
  if (!channel || typeof channel.title !== 'string' || !channel.title.includes('보안공지')) {
    throw new Error('Unexpected KISA RSS structure')
  }
  const items = channel.item ?? []
  if (!Array.isArray(items)) throw new Error('Unexpected RSS items')
  const posts = new Map<string, SecurityPost>()
  let invalidItems = 0
  for (const item of items) {
    const title = typeof item.title === 'string' ? decodeHTML(item.title).trim() : ''
    const link = typeof item.link === 'string' ? item.link : ''
    const sourceUrl = canonicalSourceUrl(link)
    if (!title || title.length > 500 || !sourceUrl) {
      invalidItems++
      continue
    }
    const category = categoryForTitle(title)
    if (!category) continue
    posts.set(sourceUrl, {
      title,
      // Observed KISA RSS has no description/body. Do not invent an introduction.
      summary: null,
      category,
      source: 'KISA',
      source_url: sourceUrl,
      published_at: publicationDate(item.pubDate),
    })
  }
  if (items.length > 0 && invalidItems === items.length) throw new Error('All RSS items are invalid')
  return { fetched: items.length, invalidItems, posts: [...posts.values()] }
}

export async function collectFeeds(fetchXml: (url: string) => Promise<string>) {
  // Search the same official RSS by subject so busy patch announcements do not
  // crowd fraud prevention notices out of its latest ten entries.
  const results = await Promise.allSettled(SEARCH_TERMS.map(async (term) =>
    parseFeed(await fetchXml(rssUrlFor(term)))
  ))
  let fetched = 0
  let invalidItems = 0
  const failedQueries: string[] = []
  const posts = new Map<string, SecurityPost>()
  for (let index = 0; index < results.length; index++) {
    const result = results[index]
    if (result.status === 'rejected') {
      failedQueries.push(SEARCH_TERMS[index])
      continue
    }
    fetched += result.value.fetched
    invalidItems += result.value.invalidItems
    for (const post of result.value.posts) posts.set(post.source_url, post)
  }
  if (failedQueries.length === SEARCH_TERMS.length) throw new Error('All fraud RSS searches failed')
  return {
    fetched,
    invalidItems,
    completedQueries: SEARCH_TERMS.length - failedQueries.length,
    failedQueries,
    posts: [...posts.values()].sort((a, b) =>
      (b.published_at ?? '').localeCompare(a.published_at ?? '') || a.source_url.localeCompare(b.source_url)
    ),
  }
}
