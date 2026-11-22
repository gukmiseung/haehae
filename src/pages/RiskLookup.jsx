
import { useState, useEffect } from 'react'
import './RiskLookup.css'

const lookupTypes = {
  url: {
    label: 'URL 조회',
    title: '의심스러운 URL을 확인하세요',
    description: '문자나 메신저로 받은 링크가 의심된다면 주소를 입력해 주세요.',
    placeholder: 'https://example.com',
    inputLabel: 'URL 주소',
  },
  account: {
    label: '계좌번호 조회',
    title: '의심스러운 계좌번호를 확인하세요',
    description: '송금하기 전, 상대방의 은행과 계좌번호를 확인해 보세요.',
    placeholder: '계좌번호를 입력해 주세요.',
    inputLabel: '계좌번호',
  },
  phone: {
    label: '전화번호 조회',
    title: '의심스러운 전화번호를 확인하세요',
    description: '모르는 번호로 연락이 왔다면 전화번호를 확인해 보세요.',
    placeholder: '010-1234-5678',
    inputLabel: '전화번호',
  },
}

const banks = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'NH농협은행',
  'IBK기업은행',
  'SC제일은행',
  '한국씨티은행',
  '카카오뱅크',
  '케이뱅크',
  '토스뱅크',
  '수협은행',
  'iM뱅크(대구은행)',
  '부산은행',
  '경남은행',
  '광주은행',
  '전북은행',
  '제주은행',
  'KDB산업은행',
  '우체국',
  '새마을금고',
  '신협',
  '저축은행',
]

function RiskLookup({ onNavigate, initialType = 'url' }) {
  const validInitialType = lookupTypes[initialType]
    ? initialType
    : 'url'

  const [type, setType] = useState(validInitialType)
  const [values, setValues] = useState({
    url: '',
    account: '',
    phone: '',
  })
  const [selectedBank, setSelectedBank] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    setType(lookupTypes[initialType] ? initialType : 'url')
    setResult(null)
  }, [initialType])

  const current = lookupTypes[type]

  const handleTypeChange = (nextType) => {
    setType(nextType)
    setResult(null)
  }

  const handleSearch = (event) => {
    event.preventDefault()

    const value = values[type].trim()

    if (type === 'account' && !selectedBank) {
      setResult({
        status: 'error',
        message: '은행을 먼저 선택해 주세요.',
      })
      return
    }

    if (!value) {
      setResult({
        status: 'error',
        message: `${current.inputLabel}를 입력해 주세요.`,
      })
      return
    }

    if (type === 'url') {
      try {
        const parsed = new URL(value)

        if (!['http:', 'https:'].includes(parsed.protocol)) {
          throw new Error('Invalid protocol')
        }
      } catch {
        setResult({
          status: 'error',
          message: 'http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.',
        })
        return
      }
    }

    if (type === 'phone' && !/^[0-9+\-\s()]{8,20}$/.test(value)) {
      setResult({
        status: 'error',
        message: '전화번호 형식을 확인해 주세요.',
      })
      return
    }

    if (type === 'account' && !/^[0-9-\s]{6,30}$/.test(value)) {
      setResult({
        status: 'error',
        message: '계좌번호는 숫자와 하이픈(-)으로 입력해 주세요.',
      })
      return
    }

    setResult({
      status: 'pending',
      type: current.inputLabel,
      value,
      bank: type === 'account' ? selectedBank : '',
    })
  }

  return (
    <main className="sg-risk-page">
      <div className="sg-risk-container">
        <div className="sg-risk-heading">
          <span className="sg-risk-eyebrow">RISK LOOKUP</span>
          <h1>통합 위험 정보 조회</h1>
          <p>
            의심스러운 URL, 계좌번호, 전화번호를 확인하고
            피싱 피해를 예방하세요.
          </p>
        </div>

        <section className="sg-risk-panel">
          <div
            className="sg-risk-tabs"
            role="tablist"
            aria-label="조회 유형"
          >
            {Object.entries(lookupTypes).map(([key, item]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={type === key}
                className={`sg-risk-tab ${type === key ? 'active' : ''}`}
                onClick={() => handleTypeChange(key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="sg-risk-form-content">
            <div className="sg-risk-form-heading">
              <div
                className="sg-risk-form-icon"
                aria-hidden="true"
              >
                {type === 'url'
                  ? '↗'
                  : type === 'account'
                    ? '₩'
                    : '☎'}
              </div>

              <h2>{current.title}</h2>
              <p>{current.description}</p>
            </div>

            <form onSubmit={handleSearch}>
              {type === 'account' && (
                <div className="sg-risk-bank-field">
                  <label htmlFor="sg-risk-bank">
                    은행 선택
                  </label>

                  <select
                    id="sg-risk-bank"
                    value={selectedBank}
                    onChange={(event) => {
                      setSelectedBank(event.target.value)
                      setResult(null)
                    }}
                  >
                    <option value="">은행을 선택해 주세요.</option>

                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label htmlFor="sg-risk-input">
                {current.inputLabel}
              </label>

              <div className="sg-risk-input-row">
                <input
                  id="sg-risk-input"
                  type="text"
                  placeholder={current.placeholder}
                  value={values[type]}
                  onChange={(event) => {
                    setValues((previous) => ({
                      ...previous,
                      [type]: event.target.value,
                    }))
                    setResult(null)
                  }}
                />

                <button type="submit">
                  위험 정보 조회
                </button>
              </div>
            </form>

            <p className="sg-risk-form-hint">
              조회 결과는 참고용이며, 실제 안전 여부를 보장하지 않습니다.
            </p>
          </div>
        </section>

        {result && (
          <section
            className={`sg-risk-result sg-risk-result-${result.status}`}
            aria-live="polite"
          >
            {result.status === 'error' ? (
              <p>{result.message}</p>
            ) : (
              <>
                <div className="sg-risk-result-title">
                  <span className="sg-risk-result-symbol">
                    !
                  </span>
                  <h2>위험 정보 조회 준비 중</h2>
                </div>

                <div className="sg-risk-result-detail">
                  <span>{result.type}</span>

                  {result.bank && (
                    <strong>은행: {result.bank}</strong>
                  )}

                  <strong>{result.value}</strong>
                </div>

                <p>
                  입력한 정보의 형식을 확인했습니다.
                  실제 위험 정보 조회는 백엔드 API 연결 후 제공됩니다.
                </p>

                <p className="sg-risk-result-warning">
                  아직 위험 여부를 확인하지 않았으므로
                  안전한 정보라고 판단해서는 안 됩니다.
                </p>
              </>
            )}
          </section>
        )}

        <section className="sg-risk-bottom">
          <div>
            <h2>의심스러운 대화도 받으셨나요?</h2>
            <p>
              AI 대화 분석 화면에서 내용을 확인해 보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('analysis')}
          >
            AI 대화 분석하기 →
          </button>
        </section>
      </div>
    </main>
  )
}

export default RiskLookup
