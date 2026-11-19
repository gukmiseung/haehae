
import { useState } from 'react'
import './AiAnalysis.css'

function AiAnalysis({ onNext }) {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState(null)

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    setImage(file)
  }

  function handleAnalyze() {
    if (!message.trim() && !image) {
      alert('대화 내용이나 이미지를 입력해 주세요.')
      return
    }

    // 실제 AI API 연결 전에는 예시 결과 페이지로 이동
    onNext()
  }

  return (
    <main className="ai-analysis">
      <div className="ai-analysis-container">
        <span className="ai-analysis-label">
          SAFE GUARD AI
        </span>

        <h1>AI 대화 분석</h1>

        <p className="ai-analysis-description">
          의심스러운 대화 내용을 입력하거나 대화 스크린샷을
          업로드해 주세요.
          <br />
          AI가 피싱 사기 위험 신호를 분석합니다.
        </p>

        <section className="ai-analysis-card">
          <h2>대화 스크린샷 업로드</h2>

          <p>
            카카오톡, 문자 등의 대화 이미지를 업로드하세요.
          </p>

          <label className="ai-upload-box">
            <span>+ 이미지 선택하기</span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          {image && (
            <p className="ai-selected-file">
              선택한 파일: {image.name}
            </p>
          )}
        </section>

        <section className="ai-analysis-card">
          <h2>대화 내용 직접 입력</h2>

          <p>
            분석하고 싶은 대화를 입력할 수도 있습니다.
          </p>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="예: 지금 바로 송금하지 않으면 계정이 정지됩니다."
            rows={7}
          />
        </section>

        <button
          type="button"
          className="ai-analyze-button"
          onClick={handleAnalyze}
        >
          AI 위험 분석 시작
        </button>

        <p className="ai-analysis-notice">
          AI 분석 결과는 참고용이며,
          사기 여부를 확정하지 않습니다.
        </p>
      </div>
    </main>
  )
}

export default AiAnalysis
