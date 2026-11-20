
import './AiAnalysis.css'
import './AiResult.css'

const example = {
  riskCount: 3,
  suspiciousText:
    '안전 계좌로 먼저 이체해 주시면 확인 후 환불해 드립니다.',
  reasons: [
    '송금을 요구하는 표현이 포함되어 있습니다.',
    '안전 계좌라는 표현으로 송금을 유도하고 있습니다.',
    '실제 계좌의 신고 이력은 별도로 확인이 필요합니다.',
  ],
  timeline: [
    {
      step: '1 · 거래 제안',
      description: '상대방이 거래를 제안했습니다.',
    },
    {
      step: '2 · 계좌 안내',
      description: '안전 계좌로 먼저 이체할 것을 요구했습니다.',
    },
    {
      step: '3 · 송금 요구',
      description: '환불을 약속하며 송금을 유도했습니다.',
    },
  ],
}

function AiResult({ onNext, onBack }) {
  return (
    <main className="ai-analysis">
      <div className="ai-analysis-container result-layout">
        <p className="ai-result-breadcrumb">
          SAFE GUARD · AI 기반 피싱 예방 서비스
        </p>

        <h1>AI 분석 결과</h1>

        <p className="ai-analysis-description">
          입력한 대화에서 발견된 위험 신호와 판단 근거를 확인해 보세요.
        </p>

        <div className="ai-result-summary">
          <section className="ai-analysis-card ai-result-main-summary">
            <span className="ai-result-tag">
              주의가 필요한 표현
            </span>

            <h2>송금 유도 관련 위험 신호가 발견되었습니다.</h2>

            <p>
              상대방의 요구를 확인하기 전에는 송금하거나
              개인정보를 전달하지 마세요.
            </p>

            <strong className="ai-result-warning">
              판단 근거 · 송금 유도 요구 / 안전 계좌 언급
            </strong>
          </section>

          <section className="ai-analysis-card ai-result-count-card">
            <h2>위험 신호 요약</h2>

            <div className="ai-result-count">
              {example.riskCount}개
            </div>

            <p>의심 표현이 감지되었습니다.</p>
            <small>※ 현재는 예시 분석 결과입니다.</small>
          </section>
        </div>

        <section className="ai-analysis-card ai-result-section">
          <h2>의심 표현 확인</h2>

          <div className="ai-result-quote">
            <span className="ai-result-tag">송금 유도</span>

            <strong>“{example.suspiciousText}”</strong>

            <p>
              별도 계좌 송금을 요구하는 내용으로,
              거래 전 추가 확인이 필요합니다.
            </p>
          </div>

          <h3>분석 근거</h3>

          <ul className="ai-result-reasons">
            {example.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </section>

        <section className="ai-analysis-card ai-result-section">
          <h2>대화 흐름 타임라인</h2>

          <div className="ai-result-timeline">
            {example.timeline.map((item, index) => (
              <div className="ai-result-timeline-item" key={index}>
                <span className="ai-result-timeline-step">
                  {item.step}
                </span>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <p className="ai-result-caption">
            대화 단계는 실제 입력 내용과 무관한 예시입니다.
          </p>
        </section>

        <button
          className="ai-analyze-button"
          type="button"
          onClick={onNext}
        >
          안전한 대응 방법 보기
        </button>

        <button
          className="ai-result-back"
          type="button"
          onClick={onBack}
        >
          다시 분석하기
        </button>

        <p className="ai-analysis-notice">
          * 현재 결과는 화면 테스트용 예시입니다.
          실제 AI 분석이나 사기 여부 판정이 아닙니다.
        </p>
      </div>
    </main>
  )
}

export default AiResult
