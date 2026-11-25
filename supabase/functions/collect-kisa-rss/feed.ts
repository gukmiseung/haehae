import { XMLParser, XMLValidator } from 'npm:fast-xml-parser@5.12.1'

export const RSS_URL = 'https://www.boho.or.kr/kr/rss.do?bbsId=B0000133'
export const MAX_FEED_BYTES = 2_000_000

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
  if (/피싱|phishing/i.test(title)) return '피싱'
  if (/(?:공공기관|정부기관|금융기관|수사기관|경찰|검찰|국세청|택배|기관).{0,20}사칭/.test(title)) return '기관 사칭'
  if (/(?:개인정보|금융정보|계정정보|인증정보|자격증명|비밀번호).{0,15}(?:탈취|도용)/.test(title)) return '개인정보 탈취'
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
    const title = typeof item.title === 'string' ? item.title.trim() : ''
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
