import { useLayoutEffect, useRef } from 'react'
import './LookupOutcome.css'

const lookupCopy = {
  url: {
    label: 'URL',
    description: '입력한 URL에 대한 검사 결과를 확인하세요.',
    exampleDescription: 'URL의 위험 신호를 보여주는 예시입니다.',
    warning: 'URL 위험정보 조회 연동 전 화면 예시입니다.',
    valueLabel: '입력한 URL',
    retryLabel: '다른 URL 다시 검사하기',
    tipsTitle: '안전한 인터넷 이용을 위한 작은 습관',
    tips: [
      ['주소 다시 확인하기', '주소 철자와 공식 도메인인지 확인하세요.'],
      ['개인정보 입력 전 확인', '비밀번호·인증번호 요청을 받으면 공식 채널에서 확인하세요.'],
    ],
  },
  phone: {
    label: '전화번호',
    description: '입력한 전화번호의 신고 이력과 위험 신호를 확인하세요.',
    exampleDescription: '전화번호 신고 이력과 위험 신호를 보여주는 예시입니다.',
    warning: '전화번호 피해 이력 조회 연동 전 화면 예시입니다.',
    valueLabel: '조회한 전화번호',
    retryLabel: '다른 전화번호 조회하기',
    tipsTitle: '안전한 전화 이용을 위한 작은 습관',
    tips: [
      ['발신자 신원 확인', '기관에서 걸려온 전화라면 공식 대표번호로 다시 확인하세요.'],
      ['민감정보 전달 주의', '인증번호나 계좌 비밀번호는 전화로 알려주지 마세요.'],
    ],
  },
  account: {
    label: '계좌번호',
    description: '입력한 계좌번호의 신고 이력과 위험 신호를 확인하세요.',
    exampleDescription: '계좌번호 신고 이력과 위험 신호를 보여주는 예시입니다.',
    warning: '더치트 연동 전 화면 예시입니다. 실제 신고 이력 조회는 연동 후 제공됩니다.',
    valueLabel: '조회한 계좌번호',
    retryLabel: '다른 계좌번호 조회하기',
    tipsTitle: '안전한 송금을 위한 확인 사항',
    tips: [
      ['거래 상대 확인', '입금 전 거래 상대와 거래 조건을 다시 확인하세요.'],
      ['외부 송금 요청 주의', '안전결제를 빙자한 외부 계좌 송금 요청을 주의하세요.'],
    ],
  },
}

function LookupOutcome({ type, result, onNavigate }) {
  const { value, suspicious, isExample, reportCount } = result
  const copy = lookupCopy[type]
  const { label } = copy
  const hasReportCount = type !== 'url'
  const heading = hasReportCount
    ? Number.isInteger(reportCount) ? `피해사례 ${reportCount}건` : `${label} 신고 이력 미확인`
    : suspicious ? '피싱 의심 징후 감지' : '위험 여부가 확인되지 않은 URL'
  const titleRef = useRef(null)

  useLayoutEffect(() => titleRef.current.focus({ preventScroll: true }), [])

  return (
    <main className={`sg-url-outcome${hasReportCount ? ' sg-report-outcome' : ''}`}>
      <div className="sg-url-outcome-inner">
        <header className="sg-url-outcome-heading">
          <h1 ref={titleRef} tabIndex={-1}>{label} 위험정보 조회 결과</h1>
          <p>{isExample ? copy.exampleDescription : copy.description}</p>
        </header>

        <section className={`sg-url-outcome-card${suspicious ? ' sg-url-outcome-card-warning' : ''}`}>
          <div className={`sg-url-outcome-status${!isExample ? ' sg-url-outcome-status-unchecked' : ''}`}>
            <svg viewBox="0 0 48 52" width="52" height="54" aria-hidden="true">
              <path fill="currentColor" d="M24 1 46 10v16c0 12-9 21-22 25C11 47 2 38 2 26V10z" />
              {isExample && !suspicious ? (
                <path d="m14 26 7 7 13-15" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <path d="M24 14v16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="24" cy="38" r="2.5" fill="#fff" />
                </>
              )}
            </svg>
            <div>
              <h2>{heading}</h2>
              {!suspicious && (
                <p>{isExample
                  ? '이 예시는 뚜렷한 위험 신호가 탐지되지 않은 경우를 보여 줍니다.'
                  : `${label} 형식을 확인했습니다. 실제 위험 조회는 API 연결 후 제공됩니다.`}</p>
              )}
            </div>
          </div>
          {hasReportCount && suspicious && (
            <div className="sg-report-risk">
              <div><span>위험 신호 수준</span><strong>높음</strong></div>
              <div className="sg-report-risk-track" aria-hidden="true" />
            </div>
          )}
          {suspicious && (
            <p className="sg-url-outcome-warning-copy">{copy.warning}</p>
          )}
          <div className="sg-url-outcome-address">
            <span>{isExample ? `예시 ${label}` : copy.valueLabel}</span>
            <strong>{value}</strong>
          </div>
          <p className="sg-url-outcome-note">
            <span aria-hidden="true">ⓘ</span>
            조회 결과는 사이트 이용이나 거래의 안전성을 보장하지 않습니다.
          </p>
        </section>

        {!suspicious && (
          <section className="sg-url-outcome-card sg-url-outcome-tips">
            <h2>{copy.tipsTitle}</h2>
            <div className="sg-url-outcome-tip-grid">
              {copy.tips.map(([title, description]) => (
                <div key={title}><h3>{title}</h3><p>{description}</p></div>
              ))}
            </div>
          </section>
        )}

        <div className="sg-url-outcome-actions">
          <button type="button" onClick={() => onNavigate('risk', { type })}>
            {copy.retryLabel}
          </button>
          <button type="button" onClick={() => onNavigate('home')}>홈으로 돌아가기 <span aria-hidden="true">→</span></button>
        </div>
        {isExample && <p className="sg-url-outcome-example">※ 디자인용 예시이며 실제 조회 결과가 아닙니다.</p>}
      </div>
    </main>
  )
}

export default LookupOutcome
