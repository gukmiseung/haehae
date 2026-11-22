
import './AiAnalysis.css'
import './AiResult.css'

const example = {
  riskCount: 3,
  suspiciousText:
    '지금 바로 안전 계좌로 이체하셔야 합니다.',
  conversation: [
    '안녕하세요. 금융기관 고객보호팀입니다.',
    '고객님의 계좌에서 이상 거래가 감지되었습니다.',
    '지금 바로 안전 계좌로 이체하셔야 합니다.',
    '확인 후 전액 환불해 드리겠습니다.',
  ],
  reasons: [
    {
      title: '금융기관 사칭 의심',
      description: '확인되지 않은 기관 신분을 내세웁니다.',
    },
    {
      title: '긴급 송금 요구',
      description: '안전 계좌로 즉시 이체하도록 유도합니다.',
    },
    {
      title: '심리적 압박 표현',
      description: '계좌 정지 등을 언급하며 서두르게 합니다.',
    },
  ],
}

function AiResult({ analysisData, onNext, onBack }) {
  const message = analysisData?.message || ''
  const imagePreview = analysisData?.imagePreview || ''
  const imageName = analysisData?.imageName || ''

  return (
    <main className="ai-analysis ai-result-page">
      <div className="ai-analysis-container result-layout">
        <h1 className="ai-result-page-title">AI 분석 결과</h1>

        <div className="ai-result-demo-notice">
          <strong>화면 테스트용 예시 결과</strong>
          <p>
            아래 위험 신호와 분석 내용은 디자인 확인을 위한 예시입니다.
            실제 AI 분석 기능은 아직 연결되지 않았습니다.
          </p>
        </div>

        {/* 위험도 요약 */}
        <section className="ai-analysis-card ai-result-overview">
          <div className="ai-result-overview-text">
            <span className="ai-result-tag ai-result-tag-danger">
              높은 위험 의심
            </span>

            <h2>송금을 유도하는 위험 신호가 발견되었습니다.</h2>

            <p>
              분석한 대화에서 사칭·송금 요구·긴급 강조 표현이
              확인되었다는 예시입니다.
            </p>

            <strong>
              상대방을 확인하기 전에는 송금이나 개인정보 제공을 멈춰주세요.
            </strong>
          </div>

          <div className="ai-result-risk-level">
            <span>종합 위험도</span>
            <strong>높음</strong>
            <p>위험 신호 {example.riskCount}개 감지 예시</p>
            <div className="ai-result-risk-bar">
              <span />
            </div>
          </div>
        </section>

        {/* 분석 내용과 위험 신호 */}
        <div className="ai-result-content-grid">
          <section className="ai-analysis-card ai-result-conversation">
            <div className="ai-result-section-heading">
              <div>
                <h2>분석된 대화</h2>
                <p>의심되는 문장을 강조하여 표시합니다.</p>
              </div>
              <span className="ai-result-tag ai-result-tag-danger">
                위험 표현 강조
              </span>
            </div>

            {message ? (
              <div className="ai-result-user-input">
                <strong>직접 입력한 대화</strong>
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
                {imageName && <p>{imageName}</p>}
              </div>
            )}

            <div className="ai-result-sample-conversation">
              <strong className="ai-result-sample-label">
                디자인 예시 대화
              </strong>

              {example.conversation.map((line, index) => (
                <div
                  className={
                    index === 2
                      ? 'ai-result-chat-line ai-result-chat-highlight'
                      : index === 3
                        ? 'ai-result-chat-line ai-result-chat-warning'
                        : 'ai-result-chat-line'
                  }
                  key={index}
                >
                  {index === 2 && (
                    <span className="ai-result-highlight-label">
                      위험 표현 ① · 긴급
                    </span>
                  )}
                  {line}
                </div>
              ))}
            </div>

            <p className="ai-result-caption">
              ※ 디자인 확인을 위한 가상 대화입니다.
            </p>
          </section>

          <section className="ai-analysis-card ai-result-signals">
            <h2>AI가 발견한 위험 신호</h2>
            <p className="ai-result-section-description">
              각 신호를 선택하여 관련 특징을 확인할 수 있습니다.
            </p>

            <div className="ai-result-signal-list">
              {example.reasons.map((reason, index) => (
                <article className="ai-result-signal" key={index}>
                  <strong>
                    0{index + 1} &nbsp;{reason.title}
                  </strong>
                  <p>{reason.description}</p>
                </article>
              ))}
            </div>

            <div className="ai-result-why">
              <strong>왜 위험할까요?</strong>
              <p>
                공식 기관 확인 없이 별도 계좌로 송금을 요구하는 행동은
                피싱 위험 신호일 수 있습니다.
              </p>
            </div>
          </section>
        </div>

        {/* 대응 안내 */}
        <section className="ai-result-action-panel">
          <div className="ai-result-action-copy">
            <h2>지금 이렇게 대응하세요</h2>
            <p>
              송금을 중단하고, 해당 기관의 공식 연락처로 직접 사실을 확인하세요.
            </p>
            <small>
              이 분석은 참고용이며 사기 여부를 확정하지 않습니다.
            </small>
          </div>

          <div className="ai-result-action-buttons">
            <button
              className="ai-analyze-button"
              type="button"
              onClick={onNext}
            >
              맞춤형 대응 방법 보기 →
            </button>

            <button
              className="ai-result-back"
              type="button"
              onClick={onBack}
            >
              다른 대화 다시 분석하기
            </button>
          </div>
        </section>

        <p className="ai-analysis-notice">
          * 현재 화면은 입력 내용 전달 및 예시 결과 확인을 위한 테스트 화면입니다.
          실제 AI 분석이나 사기 여부 판정이 아닙니다.
        </p>
      </div>
    </main>
  )
}

export default AiResult
