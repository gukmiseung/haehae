
import { useState } from 'react'
import { authErrorMessage, authUnavailable, setSessionPersistence, supabase } from '../lib/supabase'
import './Login.css'

function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setError('')

    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.')
      return
    }

    if (!supabase) {
      setError(authUnavailable)
      return
    }

    setSubmitting(true)
    try {
      setSessionPersistence(remember)
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      onNavigate('home')
    } catch (error) {
      setError(authErrorMessage(error, '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="sg-login-page">
      <div className="sg-login-content">
        <div className="sg-login-brand">
          <img className="sg-login-brand-icon sg-brand-image" src="/favicon.svg" alt="" aria-hidden="true" />
          <strong>SAFE GUARD</strong>
        </div>

        <h2>내 계정을 안전하게 관리하세요</h2>
        <p>AI 기반 피싱 예방 서비스 SAFE GUARD</p>

        <section className="sg-login-card">
          <h1>로그인</h1>
          <p className="sg-login-subtitle">
            SAFE GUARD에 오신 것을 환영합니다.
          </p>

          <div className="sg-login-guest-notice">
            <p>
              메시지 검사는 로그인 없이 이용할 수 있어요.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">이메일</label>
            <input
              id="login-email"
              autoComplete="email"
              type="email"
              placeholder="가입한 이메일을 입력해 주세요."
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              autoComplete="current-password"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <div className="sg-login-options">
              <label className="sg-login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                로그인 상태 유지
              </label>

              <button
                type="button"
                className="sg-login-link"
                onClick={() => onNavigate?.('resetPassword', { email })}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {error && (
              <p className="sg-login-error" role="status">
                {error}
              </p>
            )}

            <button type="submit" className="sg-login-submit" disabled={submitting}>
              {submitting ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <div className="sg-login-divider">
            <span>또는</span>
          </div>

          <button
            type="button"
            className="sg-login-guest-button"
            onClick={() => onNavigate?.('analysis')}
          >
            비회원으로 메시지 검사하기
          </button>

          <p className="sg-login-signup-text">
            아직 회원이 아니신가요?
            <button
              type="button"
              className="sg-login-link"
              onClick={() => onNavigate?.('signup')}
            >
              회원가입
            </button>
          </p>

          <p className="sg-login-notice">
            로그인하면 SAFE GUARD의 서비스 이용약관 및 개인정보
            처리방침에 동의하는 것으로 간주됩니다.
          </p>
        </section>
      </div>
    </main>
  )
}

export default Login
