import './Header.css'

const accountLinks = [
  { page: 'mypage', href: '/mypage', label: '마이페이지', className: 'sg-header-mypage-link' },
  { page: 'login', href: '/login', label: '로그인', className: 'sg-header-login' },
  { page: 'signup', href: '/signup', label: '회원가입', className: 'sg-header-signup' },
]

function Header({ onNavigate, activePage, session, onSignOut, signingOut, signOutError }) {
  function follow(event, page) {
    if (!onNavigate || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate(page)
  }

  return (
    <header className="sg-header">
      <div className="sg-header-inner">
        <a className="sg-header-logo" href="/" onClick={(event) => follow(event, 'home')}>
          <img className="sg-header-shield sg-brand-image" src="/favicon.svg" alt="" aria-hidden="true" />
          <span>SAFE GUARD</span>
        </a>

        <nav className="sg-header-actions" aria-label="계정">
          {accountLinks.filter(({ page }) => page === 'mypage' || session === null).map(({ page, href, label, className }) => (
            <a
              key={page}
              href={href}
              className={className}
              aria-current={activePage === page ? 'page' : undefined}
              onClick={(event) => follow(event, page)}
            >
              {label}
            </a>
          ))}
          {session && (
            <button className="sg-header-login" type="button" onClick={onSignOut} disabled={signingOut}>
              {signingOut ? '로그아웃 중…' : '로그아웃'}
            </button>
          )}
          {session && signOutError && <span className="sg-header-error" role="alert">{signOutError}</span>}
        </nav>
      </div>
    </header>
  )
}

export default Header
