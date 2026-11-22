
import './AiAnalysis.css'
import './AiResult.css'

const examples = {
  1: [
    { text: '안녕하세요.' },
    {
      text: '금융기관 고객보호팀입니다.',
      signal: {
        title: '금융기관 사칭 의심',
        description: '신원을 확인할 수 없는 발신자가 금융기관의 고객보호팀이라고 소개합니다.',
      },
    },
    { text: '고객님의 계좌에서 이상 거래가 감지되었습니다.' },
    {
      text: '지금 바로 안전 계좌로 이체하셔야 합니다.',
      signal: {
        title: '긴급 송금 요구',
        description: '‘안전 계좌’라고 부르는 별도 계좌로 즉시 이체하라고 요구합니다.',
      },
    },
    {
      text: '오늘 안에 처리하지 않으면 계좌가 정지됩니다.',
      signal: {
        title: '심리적 압박',
        description: '당일 기한과 계좌 정지를 내세워 확인할 시간을 주지 않습니다.',
      },
    },
  ],
  5: [
    {
      text: '엄마, 휴대폰이 고장 나서 다른 번호로 연락해.',
      signal: {
        title: '가족 사칭 의심',
        description: '평소와 다른 번호에서 휴대폰 고장을 이유로 가족이라고 주장합니다.',
      },
    },
    { text: '지금 결제할 게 있는데 내 계좌를 쓸 수 없어.' },
    {
      text: '이 계좌로 지금 바로 대신 보내 줄 수 있어?',
      signal: {
        title: '긴급 송금 요구',
        description: '신원을 확인하기 전에 지정한 계좌로 즉시 대신 송금해 달라고 요청합니다.',
      },
    },
  ],
  10: [
    {
      text: '기존 대출을 낮은 금리로 바꿔 드릴 수 있습니다.',
      signal: {
        title: '대출 상담 사칭 의심',
        description: '확인되지 않은 발신자가 저금리 대환 대출을 제안합니다.',
      },
    },
    { text: '대환 신청을 진행하려면 먼저 기존 대출을 상환해야 합니다.' },
    {
      text: '오늘 중으로 안내한 계좌에 상환금을 입금해 주세요.',
      signal: {
        title: '선입금 요구',
        description: '대환 대출을 진행하기 전에 발신자가 안내한 계좌로 입금하라고 요구합니다.',
      },
    },
  ],
}

function AiResult({ record, onNext, onBack, onBackToHistory }) {
  const { message, imagePreview, imageName } = record.analysisData || {}
  const example = record.isExample ? examples[record.id] : null
  const signalCount = example?.filter(({ signal }) => signal).length

  return (
    <main className="ai-analysis ai-result-page">
      <div className="ai-analysis-container result-layout">
        <h1 className="ai-result-page-title">AI 분석 결과</h1>

        {example && (
          <div className="ai-result-demo-notice">
            <strong>예시 기록 · {record.title}</strong>
            <p>아래 대화와 위험 신호는 가상 검사 기록입니다.</p>
          </div>
        )}

        <section className="ai-analysis-card ai-result-overview">
          <div className="ai-result-overview-text">
            <span className={example ? 'ai-result-tag ai-result-tag-danger' : 'ai-result-tag'}>
              {example ? '높은 위험 의심' : '입력 확인 완료'}
            </span>

            <h2>{example ? '송금을 유도하는 위험 신호가 발견되었습니다.' : 'AI 분석 연결 대기'}</h2>

            <p>
              {example
                ? '가상 대화에서 사칭과 송금 요구에 해당하는 표현을 확인할 수 있습니다.'
                : '입력한 대화와 첨부 파일을 아래에서 확인할 수 있습니다.'}
            </p>
            {example && <strong>상대방을 확인하기 전에는 송금이나 개인정보 제공을 멈춰주세요.</strong>}
          </div>

          <div className={example ? 'ai-result-risk-level' : 'ai-result-risk-level ai-result-risk-pending'}>
            <span>종합 위험도</span>
            <strong>{example ? '높음' : '분석 대기'}</strong>
            {example && (
              <>
                <p>위험 신호 {signalCount}개 감지 예시</p>
                <div className="ai-result-risk-bar"><span /></div>
              </>
            )}
          </div>
        </section>

        <section className="ai-analysis-card ai-result-conversation" aria-labelledby="analyzed-conversation">
          <h2 id="analyzed-conversation">분석된 대화</h2>

          {!example && (
            <p className="ai-result-section-description">문장별 위험 신호는 AI 서비스 연결 후 제공됩니다.</p>
          )}

          {message && (
            <div className="ai-result-user-input">
              <strong>직접 입력한 대화</strong>
              <p>{message}</p>
            </div>
          )}

          {imagePreview && (
            <div className="ai-result-uploaded-image">
              <h3>첨부한 대화 캡처</h3>
              <img src={imagePreview} alt="사용자가 업로드한 대화 캡처" />
              {imageName && <p>{imageName}</p>}
            </div>
          )}

          {example && (
            <ul className="ai-result-chat-list" role="list">
              {example.map(({ text, signal }) => (
                <li key={text} className={`ai-result-chat-line${signal ? ' ai-result-chat-highlight' : ''}`}>
                  <p>{text}</p>
                  {signal && (
                    <div className="ai-result-chat-signal">
                      <strong>{signal.title}</strong>
                      <p>{signal.description}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ai-result-action-panel">
          <div className="ai-result-action-copy">
            <h2>지금 이렇게 대응하세요</h2>
            <p>
              송금을 중단하고, 해당 기관의 공식 연락처로 직접 사실을 확인하세요.
            </p>
            {example && <small>이 분석은 참고용이며 사기 여부를 확정하지 않습니다.</small>}
          </div>

          <div className="ai-result-action-buttons">
            <button
              className="ai-analyze-button"
              type="button"
              onClick={onNext}
            >
              {example ? '맞춤형 대응 방법 보기' : '대응 방법 보기'} →
            </button>

            <button
              className="ai-result-back"
              type="button"
              onClick={onBackToHistory || onBack}
            >
              {onBackToHistory ? '검사 기록으로 돌아가기' : '다른 대화 다시 분석하기'}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AiResult
