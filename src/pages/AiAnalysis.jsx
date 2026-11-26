
import { useEffect, useRef, useState } from 'react'
import { analyzeConversation, MAX_CONVERSATION_LENGTH } from '../lib/conversationAnalysis'
import './AiAnalysis.css'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function AiAnalysis({ onNext }) {
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [imageName, setImageName] = useState('')
  const [isReadingImage, setIsReadingImage] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const imageReader = useRef(null)
  const activeRequest = useRef(null)

  useEffect(() => () => {
    imageReader.current?.abort()
    activeRequest.current?.abort()
  }, [])

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return
    setError('')

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('PNG 또는 JPG 이미지 파일만 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert('이미지는 10MB 이하의 파일만 업로드할 수 있습니다.')
      event.target.value = ''
      return
    }

    imageReader.current?.abort()
    const reader = new FileReader()
    imageReader.current = reader
    setIsReadingImage(true)

    reader.onload = () => {
      setImagePreview(reader.result)
      setImageName(file.name)
      setIsReadingImage(false)
    }

    reader.onerror = () => {
      setError('이미지를 불러오지 못했습니다. 다시 선택해 주세요.')
      setIsReadingImage(false)
      event.target.value = ''
    }

    reader.readAsDataURL(file)
  }

  function handleImageRemove() {
    imageReader.current?.abort()
    setIsReadingImage(false)
    setImagePreview('')
    setImageName('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleAnalyze() {
    if (activeRequest.current || isReadingImage) return
    const input = { message: message.trim(), imagePreview, imageName }
    if (!input.message && !imagePreview) {
      setError('대화 내용이나 이미지를 입력해 주세요.')
      return
    }

    const controller = new AbortController()
    activeRequest.current = controller
    setIsAnalyzing(true)
    setError('')
    try {
      const result = await analyzeConversation({ ...input, signal: controller.signal })
      if (!controller.signal.aborted) onNext({ ...input, result })
    } catch (analysisError) {
      if (!controller.signal.aborted) setError(analysisError.message)
    } finally {
      activeRequest.current = null
      if (!controller.signal.aborted) setIsAnalyzing(false)
    }
  }

  if (isAnalyzing) {
    return (
      <main className="ai-analysis ai-loading-page">
        <section className="ai-loading-content" role="status" aria-live="polite">
          <div className="ai-loading-visual" aria-hidden="true">
            <div className="ai-loading-ring" />
            <img className="sg-brand-image" src="/favicon.svg" alt="" aria-hidden="true" />
          </div>

          <span className="ai-loading-label">AI CONVERSATION ANALYSIS</span>

          <h1>AI가 대화를 분석하고 있어요</h1>

          <p>
            대화의 맥락과 사기 위험 신호를 확인하고 있습니다.
          </p>

          <div className="ai-loading-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="ai-loading-notice">
            <strong>잠시만 기다려 주세요.</strong>
            <p>분석이 완료되면 결과 화면으로 자동 이동합니다.</p>
          </div>
        </section>
      </main>
    )
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

        <div className="ai-input-grid" aria-busy={isAnalyzing}>
          <section className="ai-analysis-card">
            <h2>대화 캡처 업로드</h2>
            <p>카카오톡·문자 대화 화면을 이미지로 첨부해 주세요.</p>

            <label className="ai-upload-box">
              <span className="ai-upload-icon">▧</span>

              <strong>
                {imageName || '이미지를 선택해 주세요'}
              </strong>

              <span className="ai-upload-link">파일 선택</span>

              <small>
                PNG, JPG 파일 · 최대 10MB
              </small>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                disabled={isAnalyzing}
                hidden
              />
            </label>

            {imagePreview && (
              <div className="ai-image-preview">
                <img
                  src={imagePreview}
                  alt="업로드한 대화 캡처 미리보기"
                />

                <button
                  type="button"
                  className="ai-image-remove"
                  onClick={handleImageRemove}
                  disabled={isAnalyzing}
                >
                  이미지 삭제
                </button>
              </div>
            )}

            <p className="ai-card-note">
              이미지 속 이름·전화번호·계좌번호 등 개인정보를
              가린 뒤 업로드하는 것을 권장합니다.
            </p>
          </section>

          <section className="ai-analysis-card">
            <h2>대화 내용 직접 입력</h2>
            <p>대화 내용을 복사해 붙여넣을 수 있어요.</p>

            <textarea
              value={message}
              aria-label="대화 내용 직접 입력"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="대화 내용을 이곳에 붙여넣어 주세요."
              rows={7}
              maxLength={MAX_CONVERSATION_LENGTH}
              disabled={isAnalyzing}
            />

            <div className="ai-example">
              <strong>입력 예시</strong>
              <p>
                “안전 계좌로 먼저 이체해 주시면 확인 후 환불해 드립니다.”
              </p>
            </div>

            <button
              className="ai-analyze-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || isReadingImage}
            >
              {isAnalyzing ? '대화 분석 중…' : isReadingImage ? '이미지 불러오는 중…' : 'AI 위험 분석하기'}
            </button>
            {error && <p className="ai-analysis-error" role="alert">{error}</p>}
          </section>
        </div>

        <p className="ai-analysis-notice">
          분석을 요청하면 입력한 대화와 첨부 이미지가 Google Gemini로 전송됩니다.
          이름·연락처·계좌번호 등 개인정보를 가린 뒤 분석해 주세요.
        </p>
      </div>
    </main>
  )
}

export default AiAnalysis
