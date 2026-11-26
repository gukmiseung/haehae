import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ScamPopup.css'

const STORAGE_KEY = 'safeGuardScamPopupHiddenDate'

function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function PopupSummary({ post }) {
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (post.summary) return
    const id = new URL(post.source_url).searchParams.get('nttId')
    if (!id) return
    const controller = new AbortController()
    const loadingTimeout = setTimeout(() => controller.abort(), 1000)
    async function load() {
      try {
        const response = await fetch('/api/kisa-summary?id=' + encodeURIComponent(id), { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        if (!controller.signal.aborted) setExcerpt(data.lines?.[0] || '')
      } catch {
        // The detail button remains available when the excerpt cannot be loaded.
      } finally {
        clearTimeout(loadingTimeout)
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => {
      clearTimeout(loadingTimeout)
      controller.abort()
    }
  }, [post.summary, post.source_url])
  return <p>{post.summary || excerpt || (loading ? '요약을 불러오는 중…' : '요약을 불러오지 못했습니다.')}</p>
}

function ScamPopup({ onNavigate }) {
  const [scams, setScams] = useState([])
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== getToday()
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
        localStorage.setItem(STORAGE_KEY, getToday())
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
          <svg viewBox="0 0 48 52" fill="none">
            <path
              d="M24 2L44 10V25C44 38 35 46 24 50C13 46 4 38 4 25V10L24 2Z"
              fill="currentColor"
            />
            <path
              d="M14 25L21 32L35 17"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
          <PopupSummary key={currentScam.id} post={currentScam} />
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
