
import { useState } from 'react'
import { authErrorMessage, authUnavailable, setSessionPersistence, supabase } from '../lib/supabase'
import './Signup.css'

function Signup({ onNavigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [message, setMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting || confirmationSent) return
    setMessage('')

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage('모든 항목을 입력해 주세요.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    if (!agreed) {
      setMessage('이용약관 및 개인정보 처리방침에 동의해 주세요.')
      return
    }

    if (!supabase) {
      setMessage(authUnavailable)
      return
    }

    setSubmitting(true)
    try {
      setSessionPersistence(true)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error
      if (data.session) {
        onNavigate('home')
      } else {
        setConfirmationSent(true)
        setMessage('받은 편지함에서 가입 확인 링크를 열어 주세요. 메일이 보이지 않으면 스팸함도 확인해 주세요.')
      }
    } catch (error) {
      setMessage(authErrorMessage(error, '회원가입을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="sg-signup-page">
      <div className="sg-signup-content">
        <div className="sg-signup-brand">
          <span className="sg-signup-brand-icon">✓</span>
          <strong>SAFE GUARD</strong>
        </div>
        <h2>처음이신가요?</h2>

        <section className="sg-signup-card">
          <h1>회원가입</h1>
          <p className="sg-signup-subtitle">
            SAFE GUARD와 함께 안전한 디지털 생활을 시작하세요.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="signup-name">이름</label>
            <input
              id="signup-name"
              autoComplete="name"
              type="text"
              placeholder="이름을 입력해 주세요."
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
              autoComplete="email"
              type="email"
              placeholder="사용할 이메일 주소를 입력해 주세요."
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (confirmationSent) {
                  setConfirmationSent(false)
                  setMessage('')
                }
              }}
              required
            />

            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              autoComplete="new-password"
              type="password"
              placeholder="영문, 숫자, 특수문자를 포함해 주세요."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <label htmlFor="signup-confirm">비밀번호 확인</label>
            <input
              id="signup-confirm"
              autoComplete="new-password"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요."
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <label className="sg-signup-agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
              />
              <span>(필수) 서비스 이용약관 및 개인정보 처리방침에 동의합니다.</span>
            </label>

            {message && (
              <p className="sg-signup-message" role="status">
                {message}
              </p>
            )}

            <button type="submit" className="sg-signup-submit" disabled={submitting || confirmationSent}>
              {submitting ? '가입 중…' : '회원가입'}
            </button>
          </form>

          <p className="sg-signup-login-text">
            이미 계정이 있으신가요?
            <button
              type="button"
              className="sg-signup-link"
              onClick={() => onNavigate?.('login')}
            >
              로그인
            </button>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Signup
