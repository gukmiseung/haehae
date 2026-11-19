
import { useState } from 'react'
import './AiAnalysis.css'

function SafetyGuide({ onBack }) {
  const [checked, setChecked] = useState([])

  const checklist = [
    '상대방의 신원과 연락처를 확인했나요?',
    '송금을 요구하는 이유를 확인했나요?',
    '의심스러운 링크를 클릭하지 않았나요?',
    '개인정보나 인증번호를 전달하지 않았나요?',
  ]

  function toggleCheck(index) {
    setChecked((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    )
  }

  async function copyReply() {
    const reply = '안전 확인 전에는 송금하거나 개인정보를 제공하지 않겠습니다.'
    try {
      await navigator.clipboard.writeText(reply)
      alert('추천 답장이 복사되었습니다.')
    } catch {
      alert('복사에 실패했습니다. 직접 문구를 선택해 주세요.')
    }
  }

  return (
    <main className="ai-analysis">
      <div className="ai-analysis-container guide-layout">
        <span className="ai-analysis-label">SAFE GUARD AI</span>
        <h1>안전 대응 안내</h1>
        <p className="ai-analysis-description">
          의심스러운 상황에서 안전하게 대응하는 방법을 확인하세요.
        </p>

        <section className="ai-analysis-card">
          <h2>AI 추천 답장 예시</h2>
          <p className="recommended-reply">
            안전 확인 전에는 송금하거나 개인정보를 제공하지 않겠습니다.
          </p>
          <button onClick={copyReply}>답장 복사하기</button>
          <p>현재 문구는 AI가 생성한 답장이 아닌 예시입니다.</p>
        </section>

        <section className="ai-analysis-card">
          <h2>송금 전 안전 체크리스트</h2>
          {checklist.map((item, index) => (
            <label className="safety-check" key={index}>
              <input
                type="checkbox"
                checked={checked.includes(index)}
                onChange={() => toggleCheck(index)}
              />
              <span>{item}</span>
            </label>
          ))}
          <p>{checked.length} / {checklist.length}개 확인</p>
          <p>체크리스트 완료 여부는 거래의 안전성을 보장하지 않습니다.</p>
        </section>

        <section className="ai-analysis-card">
          <h2>피해가 의심된다면?</h2>
          <p>1. 상대방에게 추가 송금이나 개인정보 제공을 중단하세요.</p>
          <p>2. 대화 내용과 송금 내역 등 증거를 보관하세요.</p>
          <p>3. 송금했다면 즉시 금융기관에 연락해 지급정지 가능 여부를 문의하세요.</p>
          <p>4. 긴급한 범죄 신고는 112를 이용하세요.</p>
          <a href="https://ecrm.police.go.kr/" target="_blank" rel="noreferrer">
            경찰청 사이버범죄 신고시스템 바로가기
          </a>
        </section>

        <button className="ai-analyze-button" onClick={onBack}>
          분석 결과로 돌아가기
        </button>
      </div>
    </main>
  )
}

export default SafetyGuide
