
import './Home.css'
import ScamPopup from '../components/ScamPopup'

function Home({ onNavigate }) {
  return (
    <main className="sg-home">
      <ScamPopup onNavigate={onNavigate} />

      <section className="sg-home-hero">
        <div className="sg-home-container sg-home-hero-inner">
          <div className="sg-home-hero-text">
            <span className="sg-home-eyebrow">
              AI 기반 피싱 예방 서비스
            </span>

            <h1>
              의심스러운 순간,
              <br />
              SAFE GUARD가 함께 확인합니다.
            </h1>

            <p>
              문자·카카오톡 대화부터 URL, 계좌번호까지
              <br />
              AI가 위험 신호를 분석하고 안전한 대응 방법을 알려드려요.
            </p>
          </div>

          <div className="sg-home-hero-visual">
            <div className="sg-home-shield-circle">
              <svg viewBox="0 0 100 110" fill="none" aria-hidden="true">
                <path
                  d="M50 5L91 21V57C91 82 74 99 50 107C26 99 9 82 9 57V21L50 5Z"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <path
                  d="M30 55L44 69L72 39"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p>
              내 정보와 소중한 자산을
              <br />
              안전하게 지켜요
            </p>
          </div>
        </div>
      </section>

      <section className="sg-home-services" id="services">
        <div className="sg-home-container">
          <div className="sg-home-section-heading">
            <h2>무엇이 의심스러우신가요?</h2>
            <p>
              확인이 필요한 내용을 선택하고 간편하게 분석해 보세요.
            </p>
          </div>

          <div className="sg-home-card-grid">
            <article className="sg-home-card">
              <div className="sg-home-card-heading">
                <span className="sg-home-card-icon" aria-hidden="true">
                  ▤
                </span>
                <h3>대화 내용 분석</h3>
              </div>

              <p>
                문자·카카오톡 대화 캡처를
                <br />
                업로드하고 위험 표현을 확인해요.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('analysis')}
              >
                이미지 업로드 <span aria-hidden="true">→</span>
              </button>
            </article>

            <article className="sg-home-card">
              <div className="sg-home-card-heading">
                <span className="sg-home-card-icon" aria-hidden="true">
                  ⌕
                </span>
                <h3>통합 위험 정보 조회</h3>
              </div>

              <p>의심스러운 URL, 계좌번호, 전화번호의 위험 징후를 확인해요.</p>

              <button type="button" onClick={() => onNavigate('risk')}>
                바로가기 <span aria-hidden="true">→</span>
              </button>
            </article>

            <article className="sg-home-card">
              <div className="sg-home-card-heading">
                <span className="sg-home-card-icon" aria-hidden="true">
                  ✓
                </span>
                <h3>공식 사기 예방 정보</h3>
              </div>

              <p>
                KISA의 공식 보안공지에서
                <br />
                사기 예방 정보를 확인해 보세요.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('latestScams')}
              >
                바로 가기 <span aria-hidden="true">→</span>
              </button>
            </article>
          </div>

          <div className="sg-home-disclaimer">
            <span aria-hidden="true">✓</span>
            분석 결과는 참고 정보이며, 신고 이력만으로 안전 여부를 단정하지 않습니다.
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
