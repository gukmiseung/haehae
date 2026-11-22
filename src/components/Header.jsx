
import './Header.css'

function Header({ onNavigate, variant = 'default' }) {
  const go = (page, options) => {
    if (onNavigate) onNavigate(page, options)
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
          <>
            <nav className="sg-header-nav" aria-label="주 메뉴">
              <button
                type="button"
                className="sg-header-home"
                onClick={() => go('home')}
              >
                홈
              </button>

              <button
                type="button"
                onClick={() =>
                  go('home', { scrollTo: 'services' })
                }
              >
                서비스 소개
              </button>

              <button
                type="button"
                disabled
                title="준비 중인 기능입니다."
              >
                최신 피싱 정보
              </button>

              <button
                type="button"
                onClick={() => go('guide')}
              >
                이용 안내
              </button>
            </nav>

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
          </>
        )}
      </div>
    </header>
  )
}

export default Header
