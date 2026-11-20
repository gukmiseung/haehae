
import { useState } from 'react'
import './AiAnalysis.css'
import './SafetyGuide.css'

const checklist = [
  '상대방의 신원을 공식 경로로 확인했나요?',
  '계좌 명의와 거래 상대방이 일치하나요?',
  '별도 계좌나 안전 계좌로 송금을 요구하나요?',
  '개인정보·인증번호 제공을 요구하나요?',
]

const emergencySteps = [
  {
    number: '01',
    title: '거래 중단 및 추가 연락 차단',
    description: '추가 송금이나 개인정보 제공을 중단하세요.',
  },
  {
    number: '02',
    title: '대화·송금 내역 등 증거 보관',
    description: '대화 내용과 송금 내역을 캡처해 보관하세요.',
  },
  {
    number: '03',
    title: '경찰청 ECRM 또는 112를 통해 신고',
    description: '피해 상황에 맞는 신고 및 상담을 진행하세요.',
  },
  {
    number: '04',
    title: '금융 관련 상담은 금융감독원 1332에 문의',
    description: '송금했다면 해당 금융기관에도 즉시 연락하세요.',
  },
]

function SafetyGuide({ onBack }) {
  const [checkedItems, setCheckedItems] = useState([])
  const [copied, setCopied] = useState(false)

  const recommendedReply =
    '안전 확인을 위해 해당 기관의 공식 대표번호로 직접 문의한 뒤 진행하겠습니다.'

  function toggleCheck(index) {
    setCheckedItems((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    )
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(recommendedReply)
      setCopied(true)
    } catch {
      alert('복사하지 못했습니다. 문구를 직접 선택해 주세요.')
    }
  }

  return (
    <main className="ai-analysis safety-guide-page">
      <div className="ai-analysis-container guide-layout">
        <div className="safety-guide-heading">
          <h1>어떻게 대응하면 좋을까요?</h1>
          <p>
            현재 상황에 맞는 안전한 답장 예시와 다음 행동을 확인하세요.
          </p>
        </div>

        <div className="safety-guide-top-grid">
          <section className="ai-analysis-card safety-reply-card">
            <span className="safety-guide-tag">
              AI 답장 추천 예시
            </span>

            <h2>상대방에게 이렇게 답해 보세요.</h2>

            <div className="safety-reply-message">
              “{recommendedReply}”
            </div>

            <p className="safety-guide-helper">
              답장을 보내기 전 상대방의 신원과 거래 내용을
              별도로 확인하세요.
            </p>

            <button
              type="button"
              className="safety-primary-button"
              onClick={handleCopy}
            >
              {copied ? '답장 복사 완료' : '답장 문구 복사하기'}
            </button>

            <p className="safety-guide-demo">
              * 현재는 AI 생성 답장이 아닌 예시 문구입니다.
            </p>
          </section>

          <section className="ai-analysis-card safety-check-card">
            <h2>송금 전 안전 점검</h2>
            <p>
              아래 항목을 확인하기 전에는 송금을 진행하지 마세요.
            </p>

            <div className="safety-checklist">
              {checklist.map((item, index) => (
                <label className="safety-check-item" key={index}>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(index)}
                    onChange={() => toggleCheck(index)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <p className="safety-check-progress">
              {checkedItems.length} / {checklist.length}개 확인
            </p>

            <p className="safety-guide-demo">
              체크 여부와 관계없이 거래 안전성이 보장되지는 않습니다.
            </p>
          </section>
        </div>

        <section className="ai-analysis-card safety-emergency-card">
          <h2>이미 송금했거나 피해가 의심되나요?</h2>
          <p className="safety-emergency-description">
            추가 송금이나 연락을 중단하고 아래 순서에 따라
            필요한 조치를 확인하세요.
          </p>

          <div className="safety-emergency-steps">
            {emergencySteps.map((step) => (
              <div className="safety-emergency-step" key={step.number}>
                <span className="safety-step-number">
                  {step.number}
                </span>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="safety-emergency-warning">
            긴급 상황에서는 112에 신고하고,
            송금했다면 즉시 금융기관에 연락해 피해 구제 가능 여부를
            확인하세요.
          </p>

          <a
            className="safety-report-link"
            href="https://ecrm.police.go.kr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            경찰청 사이버범죄 신고시스템 바로가기
          </a>
        </section>

        <div className="safety-guide-footer">
          <span>
            SAFE GUARD · AI 기반 피싱 예방 서비스
          </span>
          <span>
            분석 및 안내 내용은 참고용이며 사기 여부를 확정하지 않습니다.
          </span>
        </div>

        <button
          type="button"
          className="safety-back-button"
          onClick={onBack}
        >
          ← 분석 결과로 돌아가기
        </button>
      </div>
    </main>
  )
}

export default SafetyGuide
