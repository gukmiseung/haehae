import { canonicalSourceUrl, categoryForTitle, parseFeed } from './feed.ts'

function equal(actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`)
  }
}

// Synthetic notices below exercise classification only; they are never seeded into DB.
function item(title: string, id = '123', date = '2026-11-25') {
  return `<item><title><![CDATA[ ${title} ]]></title>
    <link><![CDATA[ https://www.boho.or.kr/kr/bbs/view.do?searchCnd=&bbsId=B0000133&nttId=${id}&pageIndex=1 ]]></link>
    <pubDate><![CDATA[ ${date} ]]></pubDate></item>`
}
function rss(items: string) {
  return `<rss version="2.0"><channel><title>보호나라&gt;보안공지</title>${items}</channel></rss>`
}

Deno.test('Observed KISA feed has 10 unrelated updates and no fabricated posts', async () => {
  const xml = await Deno.readTextFile(new URL('./fixtures/kisa-2026-11-25.xml', import.meta.url))
  const result = parseFeed(xml)
  equal(result, { fetched: 10, invalidItems: 0, posts: [] })
})

Deno.test('Fraud categories use explicit title evidence', () => {
  for (const [title, category] of [
    ['보이스피싱 주의', '보이스피싱'], ['스미싱 문자 주의', '스미싱'],
    ['피싱 메일 유포 주의', '피싱'], ['공공기관 사칭 주의', '기관 사칭'],
    ['개인정보 탈취 주의', '개인정보 탈취'], ['투자 사기 주의', '사기 예방'],
    ['VMware 제품 보안 업데이트 권고', null], ['OpenSSL 취약점 보안 업데이트', null],
    ['개인정보 보호 시스템 업데이트', null],
  ]) equal(categoryForTitle(title as string), category)
})

Deno.test('Single items, CDATA, missing summaries and exact dates', () => {
  const { posts } = parseFeed(rss(item('스미싱 주의')))
  equal(posts.length, 1)
  equal(posts[0], {
    title: '스미싱 주의', summary: null, category: '스미싱', source: 'KISA',
    source_url: 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=123&menuNo=205020',
    published_at: '2026-11-25',
  })
  equal(parseFeed(rss(item('피싱 주의', '124', '2026-02-30'))).posts[0].published_at, null)
})

Deno.test('URL normalization deduplicates differing query parameters', () => {
  const xml = rss(item('피싱 주의') + item('피싱 주의').replace('pageIndex=1', 'pageIndex=2'))
  equal(parseFeed(xml).posts.length, 1)
  equal(canonicalSourceUrl('https://evil.example/kr/bbs/view.do?bbsId=B0000133&nttId=123'), null)
  equal(canonicalSourceUrl('https://www.boho.or.kr/kr/bbs/view.do?bbsId=OTHER&nttId=123'), null)
  equal(canonicalSourceUrl('javascript:alert(1)'), null)
})

Deno.test('Empty valid channels are accepted; malformed and entity-bearing XML fail', () => {
  equal(parseFeed(rss('')).posts, [])
  for (const xml of ['<rss><broken>', '<html>Unavailable</html>',
    '<!DOCTYPE rss [<!ENTITY test SYSTEM "file:///etc/passwd">]>' + rss(''),
    rss(item('피싱 주의').replace('www.boho.or.kr', 'evil.example')),
  ]) {
    let failed = false
    try { parseFeed(xml) } catch { failed = true }
    equal(failed, true)
  }
})
