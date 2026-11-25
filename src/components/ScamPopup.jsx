import { useEffect, useState } from 'react'
import './ScamPopup.css'

const scams = [
  {
    category: '최신 사기수법 안내',
    title: '택배 배송 문자 사칭 주의',
    description:
      '배송 주소 오류를 핑계로 문자 속 링크를 누르도록 유도하는 사기 수법입니다.',
    warning: '출처가 불분명한 링크 · 개인정보 입력 요구',
  },
  {
    category: '최신 사기수법 안내',
    title: '금융기관 사칭 전화 주의',
    description:
      '금융기관 직원을 사칭해 계좌 이상을 이유로 송금이나 개인정보를 요구하는 수법입니다.',
    warning: '안전 계좌 안내 · 비밀번호 및 인증번호 요구',
  },
  {
    category: '최신 사기수법 안내',
    title: '중고거래 안전결제 사칭 주의',
    description:
      '안전결제를 핑계로 플랫폼 외부의 가짜 결제 사이트 접속을 유도하는 수법입니다.',
    warning: '외부 결제 링크 · 별도 계좌 입금 요구',
  },
]

const STORAGE_KEY = 'safeGuardScamPopupHiddenDate'

function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function ScamPopup({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hideToday, setHideToday] = useState(false)

  useEffect(() => {
    try {
      const hiddenDate = localStorage.getItem(STORAGE_KEY)

      if (hiddenDate !== getToday()) {
        setIsOpen(true)
      }
    } catch {
      setIsOpen(true)
    }
  }, [])

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
    onNavigate('latestScams')
  }

  if (!isOpen) return null

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
          <span>{currentScam.category}</span>

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
          <p>{currentScam.description}</p>
        </div>

        <div className="sg-scam-popup-warning">
          <strong>
            <span aria-hidden="true">!</span>
            이런 신호를 조심하세요
          </strong>
          <p>{currentScam.warning}</p>
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
                key={scam.title}
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
          공식 예방 정보 보기 <span aria-hidden="true">→</span>
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