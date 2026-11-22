
import './Header.css'

function Header({ onNavigate, variant = 'default' }) {
  const go = (page) => {
    if (onNavigate) onNavigate(page)
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
        ) : (
          <div className="sg-header-actions">
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
        )}
      </div>
    </header>
  )
}

export default Header
