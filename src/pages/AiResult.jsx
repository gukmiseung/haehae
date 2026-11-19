
import './AiAnalysis.css'

function AiResult({ onNext, onBack }) {
  const signals = [
    {
      title: '긴급한 송금 요구',
      description: '즉시 송금하도록 압박하는 표현이 발견되었습니다.',
      quote: '지금 바로 송금하지 않으면 계정이 정지됩니다.',
    },
    {
      title: '심리적 압박',
      description: '불안감을 유발해 빠른 결정을 유도할 가능성이 있습니다.',
      quote: '계정이 정지됩니다.',
    },
  ]

  return (
    <main className="ai-analysis">
      <div className="ai-analysis-container result-layout">
        <span className="ai-analysis-label">SAFE GUARD AI</span>
        <h1>AI 분석 결과</h1>
        <p className="ai-analysis-description">
          입력한 대화에서 발견된 위험 신호를 확인하세요.
        </p>

        <section className="ai-analysis-card">
          <h2>위험도 분석</h2>
          <div className="risk-level">높음</div>
          <p>사기 의심 표현이 발견되었습니다.</p>
          <p>위험 신호 {signals.length}개 감지</p>
        </section>

        <section className="ai-analysis-card">
          <h2>주요 위험 신호</h2>
          {signals.map((signal, index) => (
            <div className="risk-signal" key={index}>
              <h3>{signal.title}</h3>
              <p>{signal.description}</p>
              <blockquote>{signal.quote}</blockquote>
            </div>
          ))}
        </section>

        <p className="ai-analysis-notice">
          현재 결과는 화면 테스트용 예시이며 실제 AI 분석이 아닙니다.
        </p>

        <div className="ai-page-actions">
          <button onClick={onBack}>다시 분석하기</button>
          <button onClick={onNext}>안전 대응 안내 보기</button>
        </div>
      </div>
    </main>
  )
}

export default AiResult
