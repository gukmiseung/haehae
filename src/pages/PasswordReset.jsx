import { useState } from 'react'
import { authErrorMessage, authUnavailable, passwordRecoveryRedirectUrl, supabase } from '../lib/supabase'
import './PasswordReset.css'

function PasswordReset({ initialEmail, recovering, checkingLink, invalidLink, onPasswordChanged, backHref, onBack }) {
  const [feedback, setFeedback] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const title = recovering ? '새 비밀번호 설정' : '비밀번호 재설정'
  const hasEmailError = feedback?.field === 'email'
  const hasPasswordError = feedback?.field === 'confirmation'

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting || checkingLink || passwordChanged) return

    const fields = event.currentTarget.elements
    const email = fields.namedItem('email')
    const password = fields.namedItem('password')
    const confirmation = fields.namedItem('confirmation')

    if (recovering) {
      if (!password.value) {
        setFeedback({ error: true, message: '새 비밀번호를 입력해 주세요.' })
        password.focus()
        return
      }
      if (password.value !== confirmation.value) {
        setFeedback({ error: true, field: 'confirmation', message: '비밀번호가 일치하지 않습니다.' })
        confirmation.focus()
        return
      }
    } else if (!email.validity.valid) {
      setFeedback({
        error: true,
        field: 'email',
        message: email.validity.valueMissing ? '이메일 주소를 입력해 주세요.' : '올바른 이메일 주소를 입력해 주세요.',
      })
      email.focus()
      return
    }

    if (!supabase) {
      setFeedback({ error: true, message: authUnavailable })
      return
    }

    setFeedback(null)
    setSubmitting(true)
    try {
      if (recovering) {
        const { error } = await supabase.auth.updateUser({ password: password.value })
        if (error) throw error
        onPasswordChanged()
        setPasswordChanged(true)
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.value.trim(), {
          redirectTo: passwordRecoveryRedirectUrl,
        })
        if (error) throw error
        setFeedback({ message: '가입된 이메일이라면 재설정 링크가 발송됩니다. 메일이 보이지 않으면 스팸함도 확인해 주세요.' })
      }
    } catch (error) {
      const fallback = recovering
        ? '비밀번호를 변경하지 못했습니다. 다시 시도해 주세요.'
        : '재설정 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.'
      setFeedback({ error: true, message: authErrorMessage(error, fallback) })
    } finally {
      setSubmitting(false)
    }
  }

  function followBackLink(event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onBack()
  }

  return (
    <main className="sg-reset-page">
      <div className="sg-reset-container">
        <nav className="sg-reset-breadcrumb" aria-label="현재 위치">
          <a href={backHref} onClick={followBackLink}>{backHref === '/' ? '홈' : '로그인'}</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{title}</span>
        </nav>

        <div className="sg-reset-layout">
          <section className="sg-reset-card" aria-labelledby="reset-title">
            <h1 id="reset-title">{title}</h1>
            {checkingLink ? (
              <p className="sg-reset-description" role="status">재설정 링크를 확인하는 중입니다.</p>
            ) : passwordChanged ? (
              <p className="sg-reset-feedback" role="status">비밀번호가 변경되었습니다.</p>
            ) : (
              <>
                <p className="sg-reset-description">
                  {recovering ? '사용할 새 비밀번호를 입력해 주세요.' : '가입한 이메일 주소로 비밀번호 재설정 링크를 보내 드립니다.'}
                </p>
                {invalidLink && (
                  <p className="sg-reset-feedback sg-reset-feedback-error" role="alert">
                    재설정 링크가 만료되었거나 유효하지 않습니다. 새 링크를 요청해 주세요.
                  </p>
                )}
                <form className="sg-reset-form" onSubmit={handleSubmit} noValidate>
                  {recovering ? (
                    <>
                      <label htmlFor="reset-new-password">새 비밀번호</label>
                      <div className="sg-reset-input">
                        <input id="reset-new-password" name="password" type="password" autoComplete="new-password" required disabled={submitting} />
                      </div>
                      <label htmlFor="reset-confirm-password">새 비밀번호 확인</label>
                      <div className="sg-reset-input">
                        <input
                          id="reset-confirm-password"
                          name="confirmation"
                          type="password"
                          autoComplete="new-password"
                          required
                          disabled={submitting}
                          aria-invalid={hasPasswordError}
                          aria-describedby={hasPasswordError ? 'reset-feedback' : undefined}
                          onChange={() => setFeedback(null)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                          disabled={submitting}
                          aria-invalid={hasEmailError}
                          aria-describedby={hasEmailError ? 'reset-feedback' : undefined}
                          onChange={() => setFeedback(null)}
                        />
                      </div>
                    </>
                  )}

                  <button type="submit" className="sg-reset-submit" disabled={submitting}>
                    {recovering
                      ? (submitting ? '변경 중…' : '비밀번호 변경하기')
                      : (submitting ? '보내는 중…' : '재설정 링크 보내기')}
                  </button>

                  {feedback && (
                    <p
                      id="reset-feedback"
                      className={`sg-reset-feedback${feedback.error ? ' sg-reset-feedback-error' : ''}`}
                      role={feedback.error ? 'alert' : 'status'}
                    >
                      {feedback.message}
                    </p>
                  )}
                </form>
              </>
            )}

            <a className="sg-reset-back" href={backHref} onClick={followBackLink}>
              <span aria-hidden="true">←</span> {backHref === '/' ? '홈으로 돌아가기' : '로그인으로 돌아가기'}
            </a>
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
