import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ScamPopup.css'

const STORAGE_KEY = 'safeGuardScamPopupHiddenUntil'

function getDismissalKey(userId) {
  return userId ? `${STORAGE_KEY}:${userId}` : `${STORAGE_KEY}:guest`
}

const excerpts = new Map()
const pendingExcerpts = new Map()

function loadExcerpt(url) {
  if (excerpts.has(url)) return Promise.resolve(excerpts.get(url))
  if (pendingExcerpts.has(url)) return pendingExcerpts.get(url)
  async function request() {
    const id = new URL(url).searchParams.get('nttId')
    if (!id) return ''
    const response = await fetch('/api/kisa-summary?id=' + encodeURIComponent(id), {
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok) return ''
    const data = await response.json()
    const excerpt = data.lines?.[0] || ''
    if (excerpt) excerpts.set(url, excerpt)
    return excerpt
  }
  const pending = request().catch(() => '').finally(() => pendingExcerpts.delete(url))
  pendingExcerpts.set(url, pending)
  return pending
}

function ScamPopup({ onNavigate, userId }) {
  const [summaries, setSummaries] = useState({})
  const [scams, setScams] = useState([])
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return Number(localStorage.getItem(getDismissalKey(userId))) <= Date.now()
    } catch {
      return true
    }
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hideToday, setHideToday] = useState(false)

  useEffect(() => {
    if (!isOpen || !supabase) return
    const controller = new AbortController()
    let pending = false
    async function refresh() {
      if (pending || document.hidden) return
      pending = true
      try {
        const { data, error } = await supabase.from('security_posts')
          .select('id,title,category,summary,source_url,published_at')
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
          .limit(3)
          .abortSignal(controller.signal)
        if (!error && !controller.signal.aborted) {
          setScams(data)
          for (const post of data) {
            if (post.summary) continue
            void loadExcerpt(post.source_url).then(excerpt => {
              if (excerpt && !controller.signal.aborted) {
                setSummaries(previous => ({ ...previous, [post.source_url]: excerpt }))
              }
            })
          }
          setCurrentIndex(index => Math.max(0, Math.min(index, data.length - 1)))
        }
      } finally {
        pending = false
      }
    }
    void refresh()
    const interval = setInterval(refresh, 60_000)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      controller.abort()
      clearInterval(interval)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [isOpen])

  const closePopup = () => {
    if (hideToday) {
      try {
        localStorage.setItem(getDismissalKey(userId), String(Date.now() + 24 * 60 * 60 * 1000))
      } catch {
        // 브라우저 저장 기능을 사용할 수 없는 경우 팝업만 닫습니다.
      }
    }

    setIsOpen(false)
  }

  const changeSlide = (direction) => {
    setCurrentIndex((previous) => {
      return (previous + direction + scams.length) % scams.length
    })
  }

  const handleDetailClick = () => {
    setIsOpen(false)
    onNavigate('latestScams', { scamId: currentScam.id })
  }

  if (!isOpen || !scams.length) return null

  const currentScam = scams[currentIndex]

  return (
    <div
      className="sg-scam-popup-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePopup()
        }
      }}
    >
      <section
        className="sg-scam-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sg-scam-popup-title"
      >
        <header className="sg-scam-popup-header">
          <span>최신 사기수법 안내</span>

          <button
            type="button"
            className="sg-scam-popup-close"
            onClick={closePopup}
            aria-label="팝업 닫기"
          >
            ×
          </button>
        </header>

        <div className="sg-scam-popup-shield" aria-hidden="true">
          <img className="sg-brand-image" src="/favicon.svg" alt="" aria-hidden="true" />
        </div>

        <div className="sg-scam-popup-intro">
          <h2 id="sg-scam-popup-title">{currentScam.title}</h2>
          <p>{[currentScam.category, 'KISA', currentScam.published_at?.slice(0, 10)].filter(Boolean).join(' · ')}</p>
        </div>

        <div className="sg-scam-popup-warning">
          <strong>
            <span aria-hidden="true">!</span>
            공지 한 눈에 보기
          </strong>
          <p>{currentScam.summary || summaries[currentScam.source_url] || excerpts.get(currentScam.source_url) || currentScam.title}</p>
        </div>

        <div className="sg-scam-popup-slider">
          <button
            type="button"
            onClick={() => changeSlide(-1)}
            aria-label="이전 사기수법"
          >
            ‹
          </button>

          <div className="sg-scam-popup-dots">
            {scams.map((scam, index) => (
              <button
                key={scam.id}
                type="button"
                className={index === currentIndex ? 'active' : ''}
                onClick={() => setCurrentIndex(index)}
                aria-label={`${index + 1}번째 사기수법 보기`}
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => changeSlide(1)}
            aria-label="다음 사기수법"
          >
            ›
          </button>
        </div>

        <button
          type="button"
          className="sg-scam-popup-detail"
          onClick={handleDetailClick}
        >
          공식 사기 예방 정보 보기 <span aria-hidden="true">→</span>
        </button>

        <footer className="sg-scam-popup-footer">
          <label>
            <input
              type="checkbox"
              checked={hideToday}
              onChange={(event) => setHideToday(event.target.checked)}
            />
            오늘 하루 보지 않기
          </label>

          <button type="button" onClick={closePopup}>
            닫기
          </button>
        </footer>
      </section>
    </div>
  )
}

export default ScamPopup
