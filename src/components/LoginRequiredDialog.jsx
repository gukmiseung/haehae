import { useLayoutEffect, useRef } from 'react'
import './LoginRequiredDialog.css'

function LoginRequiredDialog({ onLogin, onDismiss }) {
  const dialogRef = useRef(null)
  const loginRef = useRef(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    loginRef.current.focus({ preventScroll: true })
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="sg-login-required"
      aria-labelledby="sg-login-required-title"
      aria-describedby="sg-login-required-description sg-login-required-detail"
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
    >
      <button className="sg-login-required-close" type="button" aria-label="닫기" onClick={onDismiss}>
        <span aria-hidden="true">×</span>
      </button>
      <span className="sg-login-required-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="7" r="3.3" />
          <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2z" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 id="sg-login-required-title">로그인이 필요합니다</h2>
      <p id="sg-login-required-description">마이페이지는 로그인 후 이용할 수 있어요.</p>
      <p id="sg-login-required-detail">
        로그인하면 검사 기록을 확인하고<br />
        이전에 분석한 결과를 다시 볼 수 있습니다.
      </p>
      <button ref={loginRef} className="sg-login-required-primary" type="button" onClick={onLogin}>
        로그인하러 가기 <span aria-hidden="true">→</span>
      </button>
      <button className="sg-login-required-back" type="button" onClick={onDismiss}>
        이전 페이지로 돌아가기
      </button>
    </dialog>
  )
}

export default LoginRequiredDialog
