import { useState } from 'react'
import './PasswordReset.css'

const feedbackMessages = {
  required: '이메일 주소를 입력해 주세요.',
  invalid: '올바른 이메일 주소를 입력해 주세요.',
  unavailable: '이메일 형식을 확인했습니다. 재설정 메일 발송은 백엔드 연결 후 사용할 수 있습니다.',
}

function PasswordReset({ initialEmail, onBack }) {
  const [feedback, setFeedback] = useState('')
  const hasEmailError = feedback === 'required' || feedback === 'invalid'

  function handleSubmit(event) {
    event.preventDefault()
    const email = event.currentTarget.elements.namedItem('email')

    if (!email.validity.valid) {
      setFeedback(email.validity.valueMissing ? 'required' : 'invalid')
      email.focus()
      return
    }

    setFeedback('unavailable')
  }

  function returnToLogin(event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onBack()
  }

  return (
    <main className="sg-reset-page">
      <div className="sg-reset-container">
        <nav className="sg-reset-breadcrumb" aria-label="현재 위치">
          <a href="/login" onClick={returnToLogin}>로그인</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">비밀번호 재설정</span>
        </nav>

        <div className="sg-reset-layout">
          <section className="sg-reset-card" aria-labelledby="reset-title">
            <h1 id="reset-title">비밀번호 재설정</h1>
            <p className="sg-reset-description">
              가입한 이메일을 입력해 주세요.<br />
              비밀번호 재설정 링크를 받을 주소를 확인합니다.
            </p>

            <form className="sg-reset-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="reset-email">이메일 주소</label>
              <div className="sg-reset-input">
                <span className="sg-reset-envelope" aria-hidden="true" />
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="이메일 주소를 입력해 주세요"
                  defaultValue={initialEmail}
                  required
                  aria-invalid={hasEmailError}
                  aria-describedby={hasEmailError ? 'reset-feedback' : undefined}
                  onChange={() => setFeedback('')}
                />
              </div>

              <button type="submit" className="sg-reset-submit">재설정 링크 보내기</button>

              {feedback && (
                <p
                  id="reset-feedback"
                  className={hasEmailError ? 'sg-reset-feedback sg-reset-feedback-error' : 'sg-reset-feedback'}
                  role={hasEmailError ? 'alert' : 'status'}
                >
                  {feedbackMessages[feedback]}
                </p>
              )}
            </form>

            <a className="sg-reset-back" href="/login" onClick={returnToLogin}>
              <span aria-hidden="true">←</span> 로그인으로 돌아가기
            </a>

            <p className="sg-reset-note">재설정 메일 발송 기능은 준비 중입니다.</p>
          </section>

          <div className="sg-reset-intro">
            <div className="sg-reset-illustration" aria-hidden="true">
              <div className="sg-reset-screen">
                <span className="sg-reset-lock" />
                <span className="sg-reset-dots">••••</span>
              </div>
              <div className="sg-reset-laptop-base" />
            </div>
            <p className="sg-reset-intro-title">
              안전하게 비밀번호를<br /><strong>재설정하세요</strong>
            </p>
            <p className="sg-reset-intro-note">계정 보안을 위해 비밀번호를 안전하게 관리하세요.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PasswordReset
