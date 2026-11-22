
import './Header.css'

function Header({ onNavigate, variant = 'default', session, onSignOut, signingOut, signOutError }) {
  const go = (page) => {
    if (onNavigate) onNavigate(page)
  }

  const follow = (event, page) => {
    if (!onNavigate || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    go(page)
  }

  if (variant === 'mypage') {
    return (
      <header className="sg-header sg-header-mypage">
        <div className="sg-header-inner">
          <a className="sg-header-logo" href="/" onClick={(event) => follow(event, 'home')}>
            <span className="sg-header-diamond" aria-hidden="true" />
            <span>SAFE GUARD</span>
          </a>
          <a className="sg-header-back" href="/" onClick={(event) => follow(event, 'home')}>나가기</a>
        </div>
      </header>
    )
  }

  return (
    <header className="sg-header">
      <div className="sg-header-inner">
        <button
          type="button"
          className="sg-header-logo"
          onClick={() => go('home')}
        >
          <span className="sg-header-shield">✓</span>
          <span>SAFE GUARD</span>
        </button>

        {variant === 'auth' ? (
          <button
            type="button"
            className="sg-header-back"
            onClick={() => go('home')}
          >
            메인으로 돌아가기
          </button>
        ) : session ? (
          <div className="sg-header-actions">
            {signOutError && <span role="alert">{signOutError}</span>}
            <button
              type="button"
              className="sg-header-login"
              onClick={onSignOut}
              disabled={signingOut}
            >
              {signingOut ? '로그아웃 중…' : '로그아웃'}
            </button>
          </div>
        ) : session === null ? (
          <div className="sg-header-actions">
            <a className="sg-header-mypage-link" href="/mypage" onClick={(event) => follow(event, 'mypage')}>
              마이페이지
            </a>

            <button
              type="button"
              className="sg-header-login"
              onClick={() => go('login')}
            >
              로그인
            </button>

            <button
              type="button"
              className="sg-header-signup"
              onClick={() => go('signup')}
            >
              회원가입
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header
