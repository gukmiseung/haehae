
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
              의심스러운 연락,
              <br />
              <span>SAFE GUARD</span>로 확인하세요.
            </h1>

            <p>
              보이스피싱부터 스미싱까지,
              <br />
              AI가 의심스러운 대화를 분석하고
              안전한 대응 방법을 안내합니다.
            </p>

            <div className="sg-home-hero-actions">
              <button
                type="button"
                className="sg-home-primary"
                onClick={() => onNavigate('analysis')}
              >
                AI 피싱 분석 시작하기
                <span aria-hidden="true"> →</span>
              </button>

              <button
                type="button"
                className="sg-home-secondary"
                onClick={() => onNavigate('risk')}
              >
                위험 정보 조회하기
              </button>
            </div>
          </div>

          <div className="sg-home-hero-visual" aria-hidden="true">
            <div className="sg-home-shield">
              <span>✓</span>
            </div>
            <div className="sg-home-floating sg-home-floating-top">
              <span>✓</span> AI 위험 분석
            </div>
            <div className="sg-home-floating sg-home-floating-bottom">
              <span>✓</span> 안전한 대응 안내
            </div>
          </div>
        </div>
      </section>

      <section className="sg-home-services">
        <div className="sg-home-container">
          <div className="sg-home-section-heading">
            <span className="sg-home-section-label">OUR SERVICES</span>
            <h2>SAFE GUARD의 주요 서비스</h2>
            <p>
              피싱이 의심되는 순간부터 안전한 대응까지,
              필요한 기능을 한곳에서 이용하세요.
            </p>
          </div>

          <div className="sg-home-card-grid">
            <article className="sg-home-card">
              <div className="sg-home-card-icon sg-home-card-icon-blue">
                <span>✦</span>
              </div>
              <h3>AI 대화 분석</h3>
              <p>
                의심스러운 메시지나 대화 내용을 입력하면
                AI가 위험 신호를 분석합니다.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('analysis')}
              >
                분석 시작하기 <span aria-hidden="true">→</span>
              </button>
            </article>

            <article className="sg-home-card">
              <div className="sg-home-card-icon sg-home-card-icon-purple">
                <span>⌕</span>
              </div>
              <h3>통합 위험 정보 조회</h3>
              <p>
                의심스러운 URL, 전화번호, 계좌번호를
                한곳에서 조회할 수 있습니다.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('risk')}
              >
                위험 정보 조회 <span aria-hidden="true">→</span>
              </button>
            </article>

            <article className="sg-home-card">
              <div className="sg-home-card-icon sg-home-card-icon-green">
                <span>✓</span>
              </div>
              <h3>맞춤형 대응 가이드</h3>
              <p>
                위험 상황에 맞는 대응 방법과
                긴급 신고 정보를 확인하세요.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('guide')}
              >
                대응 방법 확인 <span aria-hidden="true">→</span>
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="sg-home-safety">
        <div className="sg-home-container">
          <div className="sg-home-safety-box">
            <div className="sg-home-safety-icon" aria-hidden="true">
              !
            </div>
            <div>
              <h2>피싱이 의심된다면 잠시 멈추세요.</h2>
              <p>
                송금이나 개인정보 제공을 요구받았다면
                즉시 행동하지 말고 공식 기관을 통해 확인하세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('guide')}
            >
              대응 가이드 보기 →
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
