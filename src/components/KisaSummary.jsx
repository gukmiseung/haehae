import { useEffect, useState } from 'react'

export default function KisaSummary({ post }) {
  const [lines, setLines] = useState([])
  useEffect(() => {
    if (post.summary) return
    const controller = new AbortController()
    const id = new URL(post.source_url).searchParams.get('nttId')
    async function load() {
      try {
        const response = await fetch('/api/kisa-summary?id=' + encodeURIComponent(id), { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        if (!controller.signal.aborted && Array.isArray(data.lines)) setLines(data.lines)
      } catch {
        // The official notice is available independently of the summary.
      }
    }
    void load()
    return () => controller.abort()
  }, [post.source_url, post.summary])
  const paragraphs = post.summary ? [post.summary] : lines
  if (!paragraphs.length) return null
  return <section className="sg-latest-detail-panel">
    <h2>{'원문 한 눈에 보기'}</h2>
    {paragraphs.map(text => <p key={text}>{text}</p>)}
  </section>
}
