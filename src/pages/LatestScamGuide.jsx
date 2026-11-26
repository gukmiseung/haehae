import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import KisaSummary from '../components/KisaSummary'
import './LatestScamGuide.css'

const categories = ['전체', '피싱', '스미싱', '보이스피싱', '기관 사칭', '개인정보 탈취', '사기 예방']

function LatestScamGuide({ onNavigate, initialScamId }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  // Legacy popup numeric IDs have no correspondence to official KISA notices.
  const [selectedId, setSelectedId] = useState(typeof initialScamId === 'string' ? initialScamId : null)
  const selectedPost = posts.find((post) => post.id === selectedId) ?? null
  const selectedPostId = selectedPost?.id
  const detailTitle = useRef(null)
  const listTitle = useRef(null)
  const listScroll = useRef(null)

  useEffect(() => {
    function handlePopState(event) {
      if (event.state?.scamGuide) {
        setSelectedId(event.state.scamPostId ?? null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function openPost(postId) {
    listScroll.current = window.scrollY

    window.history.replaceState({
      ...window.history.state,
      scamGuide: true,
      scamPostId: null,
    }, '')

    window.history.pushState({
      scamGuide: true,
      scamPostId: postId,
    }, '')

    setSelectedId(postId)
  }

  function backToList() {
    if (window.history.state?.scamPostId === selectedId &&
        window.history.state?.scamGuide) {
      window.history.back()
    } else {
      setSelectedId(null)
    }
  }

  useEffect(() => {
    let active = true
    let fetching = false
    let controller
    async function refresh() {
      if (fetching) return
      fetching = true
      controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 20_000)
      try {
        if (!supabase) throw new Error('Supabase is not configured')
        const nextPosts = []
        const batchSize = 500
        for (let offset = 0; ; offset += batchSize) {
          const { data, error: queryError } = await supabase.from('security_posts')
            .select('id,title,summary,category,source,source_url,published_at,created_at')
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .order('id', { ascending: false })
            .range(offset, offset + batchSize - 1)
            .abortSignal(controller.signal)
          if (queryError) throw queryError
          nextPosts.push(...data)
          if (data.length < batchSize) break
        }
        if (active) {
          setPosts([...new Map(nextPosts.map((post) => [post.id, post])).values()])
          setError('')
        }
      } catch {
        if (active) setError('공지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      } finally {
        clearTimeout(timeout)
        fetching = false
        if (active) setLoading(false)
      }
    }
    void refresh()
    const refreshVisible = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    const interval = setInterval(refreshVisible, 60_000)
    document.addEventListener('visibilitychange', refreshVisible)
    return () => {
      active = false
      controller?.abort()
      clearInterval(interval)
      document.removeEventListener('visibilitychange', refreshVisible)
    }
  }, [retry])

  useLayoutEffect(() => {
    if (selectedPostId) {
      window.scrollTo(0, 0)
      detailTitle.current?.focus({ preventScroll: true })
    } else if (listScroll.current !== null) {
      listTitle.current?.focus({ preventScroll: true })
      window.scrollTo(0, listScroll.current)
      listScroll.current = null
    }
    // Refreshing the same post must not reset the reader's scroll position.
  }, [selectedPostId])

  if (selectedPost) {
    return (
      <main className="sg-latest sg-latest-detail-page">
        <div className="sg-latest-detail-container">
          <div className="sg-latest-detail-brand">
            <span>SAFE GUARD</span>
            <span>· KISA 보호나라 보안공지</span>
          </div>
          <span className="sg-latest-category sg-latest-detail-category">{selectedPost.category}</span>
          <h1 className="sg-latest-detail-title" ref={detailTitle} tabIndex={-1}>{selectedPost.title}</h1>
          <p className="sg-latest-detail-description">
            {selectedPost.source} · {selectedPost.published_at || '게시 날짜 미제공'}
          </p>
          <KisaSummary key={selectedPost.id} post={selectedPost} />
          <section className="sg-latest-detail-panel sg-latest-detail-intro">
            <h2>KISA 공지 원문</h2>
            <iframe
              key={selectedPost.source_url}
              className="sg-latest-original"
              title={`KISA 원문 · ${selectedPost.title}`}
              src={`${selectedPost.source_url}#container`}
              sandbox="allow-scripts allow-same-origin allow-downloads"
              referrerPolicy="no-referrer"
            />
          </section>
          <div className="sg-latest-source">
            <p>출처 · KISA 보호나라</p>
            <a href={selectedPost.source_url} target="_blank" rel="noopener noreferrer">
              KISA 공식 원문 보기 →
            </a>
          </div>
          <div className="sg-latest-detail-back-wrap">
            <button type="button" className="sg-latest-detail-back" onClick={backToList}>
              ← 공식 사기 예방 정보 목록으로
            </button>
          </div>
        </div>
      </main>
    )
  }

  const filteredPosts = selectedCategory === '전체'
    ? posts
    : posts.filter((post) => post.category === selectedCategory)

  return (
    <main className="sg-latest">
      <section className="sg-latest-hero">
        <div className="sg-latest-container">
          <span className="sg-latest-eyebrow">SCAM PREVENTION GUIDE</span>
          <h1 ref={listTitle} tabIndex={-1}>공식 사기 예방 정보</h1>
          <p>KISA 보호나라의 피싱·스미싱 등 사기 예방 관련 보안공지를 확인하세요.</p>
        </div>
      </section>
      <section className="sg-latest-container sg-latest-content" aria-busy={loading}>
        <div className="sg-latest-filters">
          {categories.map((category) => (
            <button key={category} type="button" className={selectedCategory === category ? 'active' : ''}
              aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>
        <div className="sg-latest-section-heading">
          <h2>최신 보안공지</h2>
          <span>{filteredPosts.length}개 공지 · 최신순</span>
        </div>
        {loading && <p className="sg-latest-status" role="status">공지를 불러오는 중입니다.</p>}
        {error && (
          <div className="sg-latest-status" role="alert">
            <p>{error}{posts.length > 0 && ' 이전에 불러온 공지를 표시합니다.'}</p>
            <button type="button" onClick={() => setRetry((value) => value + 1)}>다시 불러오기</button>
          </div>
        )}
        {!loading && !error && filteredPosts.length === 0 && (
          <p className="sg-latest-status" role="status">
            {posts.length === 0 ? '아직 등록된 사기 예방 관련 공지가 없습니다.' : '선택한 분류의 공지가 없습니다.'}
          </p>
        )}
        <div className="sg-latest-grid">
          {filteredPosts.map((post) => (
            <article className="sg-latest-card" key={post.id}>
              <span className="sg-latest-category">{post.category}</span>
              <h3>{post.title}</h3>
              {post.summary && <p>{post.summary}</p>}
              <p className="sg-latest-post-meta">{post.source} · {post.published_at || '게시 날짜 미제공'}</p>
              <button type="button" aria-label={`${post.title} 자세히 보기`} onClick={() => openPost(post.id)}>
                자세히 보기 <span>→</span>
              </button>
            </article>
          ))}
        </div>
        <section className="sg-latest-cta">
          <h2>의심스러운 대화를 받으셨나요?</h2>
          <p>실제 대화 내용을 입력하고 AI 분석을 통해 위험 신호를 확인해 보세요.</p>
          <button type="button" onClick={() => onNavigate('analysis')}>AI 대화 분석하기 <span>→</span></button>
        </section>
      </section>
    </main>
  )
}

export default LatestScamGuide
