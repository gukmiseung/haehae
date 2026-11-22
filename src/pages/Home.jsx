
import './Home.css'

function Home({ onNavigate }) {
  return (
    <main className="sg-home">
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
              <svg
                viewBox="0 0 100 110"
                fill="none"
                aria-hidden="true"
              >
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
            <h2>어떤 도움이 필요하신가요?</h2>
            <p>
              필요한 서비스를 선택하고 안전을 확인해 보세요.
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
                문자·카카오톡 대화 내용을
                <br />
                AI로 분석하고 위험 신호를 확인해요.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('analysis')}
              >
                대화 분석하기 →
              </button>
            </article>

            <article className="sg-home-card">
              <div className="sg-home-card-heading">
                <span className="sg-home-card-icon" aria-hidden="true">
                  ⌕
                </span>
                <h3>URL·계좌·전화번호 조회</h3>
              </div>

              <p>
                의심스러운 URL과 계좌번호,
                <br />
                전화번호의 위험 여부를 확인해요.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('risk', { type: 'url' })}
              >
                위험 조회하기 →
              </button>
            </article>

            <article className="sg-home-card">
              <div className="sg-home-card-heading">
                <span className="sg-home-card-icon" aria-hidden="true">
                  ✓
                </span>
                <h3>피싱 예방·대응 가이드</h3>
              </div>

              <p>
                피싱 예방법부터 의심 상황에서의
                <br />
                대처 방법까지 알아봐요.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('guide')}
              >
                가이드 확인하기 →
              </button>
            </article>
          </div>

          <div className="sg-home-disclaimer">
            <span aria-hidden="true">✓</span>
            분석 결과는 참고 정보이며, 신고 이력만으로 안전 여부를 단정하지 않습니다.
          </div>
        </div>
      </section>

      <section className="sg-home-safety">
        <div className="sg-home-container">
          <h2>피싱 예방을 위한 안전 수칙</h2>

          <div className="sg-home-safety-grid">
            <button
              type="button"
              className="sg-home-safety-card"
              onClick={() => onNavigate('latestScams')}
            >
              <span className="sg-home-safety-tag">INFO</span>
              <span className="sg-home-safety-copy">
                <strong>최신 피싱 수법 확인하기</strong>
                <small>새로운 사기 유형과 예방 방법 알아보기</small>
              </span>
            </button>

            <button
              type="button"
              className="sg-home-safety-card"
              disabled
              title="준비 중인 기능입니다."
            >
              <span className="sg-home-safety-tag">FAMILY</span>
              <span className="sg-home-safety-copy">
                <strong>가족과 함께 피싱 예방하기</strong>
                <small>가족과 공유하는 안전한 디지털 생활 수칙</small>
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
