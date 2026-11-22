
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

function AiResult({ analysisData, onNext, onBack }) {
  const message = analysisData?.message || ''
  const imagePreview = analysisData?.imagePreview || ''
  const imageName = analysisData?.imageName || ''

  return (
    <main className="ai-analysis">
      <div className="ai-analysis-container result-layout">
        <p className="ai-result-breadcrumb">
          SAFE GUARD · AI 기반 피싱 예방 서비스
        </p>

        <h1>AI 분석 결과</h1>

        <p className="ai-analysis-description">
          입력한 대화 내용과 첨부한 이미지를 확인해 보세요.
        </p>

        <section className="ai-analysis-card ai-result-section">
          <h2>내가 입력한 대화</h2>

          {message ? (
            <div className="ai-result-input-content">
              <p>{message}</p>
            </div>
          ) : (
            <p className="ai-result-empty">
              직접 입력한 대화 내용은 없습니다.
            </p>
          )}

          {imagePreview && (
            <div className="ai-result-uploaded-image">
              <h3>첨부한 대화 캡처</h3>

              <img
                src={imagePreview}
                alt="사용자가 업로드한 대화 캡처"
              />

              <p>{imageName}</p>
            </div>
          )}
        </section>

        <div className="ai-result-demo-notice">
          <strong>화면 테스트용 예시 결과</strong>
          <p>
            아래 위험 신호와 분석 근거는 실제 입력 내용에서
            추출한 결과가 아닙니다. 실제 AI 분석 기능은 아직 연결되지 않았습니다.
          </p>
        </div>

        <div className="ai-result-summary">
          <section className="ai-analysis-card ai-result-main-summary">
            <span className="ai-result-tag">
              예시 위험 신호
            </span>

            <h2>송금 유도 관련 위험 신호가 발견된 예시입니다.</h2>

            <p>
              상대방의 요구를 확인하기 전에는 송금하거나
              개인정보를 전달하지 마세요.
            </p>

            <strong className="ai-result-warning">
              예시 판단 근거 · 송금 유도 요구 / 안전 계좌 언급
            </strong>
          </section>

          <section className="ai-analysis-card ai-result-count-card">
            <h2>위험 신호 요약</h2>

            <div className="ai-result-count">
              {example.riskCount}개
            </div>

            <p>예시 의심 표현입니다.</p>
            <small>※ 실제 입력 내용의 분석 결과가 아닙니다.</small>
          </section>
        </div>

        <section className="ai-analysis-card ai-result-section">
          <h2>의심 표현 예시</h2>

          <div className="ai-result-quote">
            <span className="ai-result-tag">송금 유도 예시</span>

            <strong>“{example.suspiciousText}”</strong>

            <p>
              별도 계좌 송금을 요구하는 내용으로,
              거래 전 추가 확인이 필요합니다.
            </p>
          </div>

          <h3>예시 분석 근거</h3>

          <ul className="ai-result-reasons">
            {example.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </section>

        <section className="ai-analysis-card ai-result-section">
          <h2>대화 흐름 타임라인 예시</h2>

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
            이 타임라인은 실제 입력한 대화와 무관한 예시입니다.
          </p>
        </section>

        <section className="ai-analysis-card ai-result-save">
          <h2>검사 결과 저장 기능</h2>

          <p>
            분석 결과 저장 기능은 현재 준비 중입니다.
            기능이 구현되면 로그인한 사용자가 결과를 보관할 수 있도록 제공할 예정입니다.
          </p>

          <button
            className="ai-analyze-button ai-save-disabled"
            type="button"
            disabled
          >
            결과 저장 기능 준비 중
          </button>

          <small>
            현재는 실제 결과 저장이 지원되지 않습니다.
          </small>
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
          * 현재 화면은 입력 내용 전달 및 예시 결과 확인을 위한 테스트 화면입니다.
          실제 AI 분석이나 사기 여부 판정이 아닙니다.
        </p>
      </div>
    </main>
  )
}

export default AiResult
