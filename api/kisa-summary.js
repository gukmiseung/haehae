import { Parser } from 'htmlparser2'

// Keep complete source statements. Inline formatting often splits Korean words
// across spans; only block elements and explicit line breaks separate lines.
export function extractSummary(html) {
  const lines = []
  let depth = 0
  let line = ''
  const blocks = new Set(['p', 'div', 'br', 'li', 'tr', 'h3', 'h4'])
  function flush() {
    const text = line.replace(/\s+/g, ' ').trim()
    if (text) lines.push(text)
    line = ''
  }
  const parser = new Parser({
    onopentag(name, attrs) {
      if (depth) {
        if (blocks.has(name)) flush()
        depth++
      } else if (attrs.class?.split(/\s+/).includes('content_html')) depth = 1
    },
    ontext(text) { if (depth) line += text },
    onclosetag(name) {
      if (!depth) return
      if (blocks.has(name) || depth === 1) flush()
      depth--
    },
  })
  parser.end(html)
  const candidates = lines.map(text => text.replace(/^[o○ㅇ•\-]\s+/, ''))
    .filter(text => text.length >= 18 && text.length <= 250 && !/https?:|www\.|^[<※□]|첨부파일|국번없이/.test(text))
  const threat = candidates.find(text => /사칭|스미싱|보이스피싱|피싱|큐싱|사기/.test(text) && !/[,，]$/.test(text))
  const advice = candidates.find(text => text !== threat && /응대하지|직접 확인|사실 여부 확인|클릭하지|접속하지|설치하지|확인하시|신고하시|주의하시|중단하고/.test(text))
  return [...new Set([threat, advice].filter(Boolean))]
}

export default async function handler(req, res) {
  const id = new URL(req.url, 'http://localhost').searchParams.get('id')
  if (req.method !== 'GET' || !/^\d{1,12}$/.test(id ?? '')) {
    res.statusCode = 400
    return res.end()
  }
  try {
    const response = await fetch(`https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=${id}&menuNo=205020`, {
      signal: AbortSignal.timeout(8000), redirect: 'error',
    })
    if (!response.ok) throw new Error('Source unavailable')
    const lines = extractSummary(await response.text())
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    res.end(JSON.stringify({ lines }))
  } catch {
    res.statusCode = 502
    res.end()
  }
}
