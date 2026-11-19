
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

    onNext()
  }

  return (
    <main className="ai-analysis">
      <div className="ai-analysis-container">
        <div className="ai-page-heading">
          <h1>의심스러운 대화를 분석해 보세요</h1>
          <p>
            문자나 메신저 대화 내용을 입력하거나 캡처 파일을 선택해
            사기 위험 신호를 살펴보세요.
          </p>
        </div>

        <div className="ai-input-grid">
          <section className="ai-analysis-card">
            <h2>대화 캡처 업로드</h2>
            <p>카카오톡·문자 대화 화면을 이미지로 첨부해 주세요.</p>

            <label className="ai-upload-box">
              <span className="ai-upload-icon">▧</span>
              <strong>
                {image ? image.name : '이미지를 끌어다 놓거나'}
              </strong>
              <span className="ai-upload-link">파일 선택</span>
              <small>PNG, JPG 파일 · 개인정보는 가린 뒤 업로드해 주세요.</small>

              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <p className="ai-card-note">
              이미지 속 이름·전화번호·계좌번호 등 개인정보를 가리는 것을 권장합니다.
            </p>
          </section>

          <section className="ai-analysis-card">
            <h2>대화 내용 직접 입력</h2>
            <p>대화 내용을 복사해 붙여넣을 수 있어요.</p>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="대화 내용을 이곳에 붙여넣어 주세요."
              rows={7}
            />

            <div className="ai-example">
              <strong>입력 예시</strong>
              <p>“안전 계좌로 먼저 이체해 주시면 확인 후 환불해 드립니다.”</p>
            </div>

            <button
              className="ai-analyze-button"
              type="button"
              onClick={handleAnalyze}
            >
              AI 위험 분석하기
            </button>
          </section>
        </div>

        <p className="ai-analysis-notice">
          * 현재는 화면 테스트용 예시 결과가 표시됩니다. 실제 AI 분석은 연결 전입니다.
        </p>
      </div>
    </main>
  )
}

export default AiAnalysis
