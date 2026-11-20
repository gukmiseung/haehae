
import { useState } from 'react'
import './Signup.css'

function Signup({ onNavigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
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

    setMessage('회원가입 기능은 백엔드 연결 후 사용할 수 있습니다.')
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
              type="text"
              placeholder="이름을 입력해 주세요."
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="signup-email">이메일</label>
            <input
              id="signup-email"
              type="email"
              placeholder="사용할 이메일 주소를 입력해 주세요."
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              placeholder="영문, 숫자, 특수문자를 포함해 주세요."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <label htmlFor="signup-confirm">비밀번호 확인</label>
            <input
              id="signup-confirm"
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

            <button type="submit" className="sg-signup-submit">
              회원가입
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
