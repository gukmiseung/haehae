
import './Footer.css'

const footerNotes = {
  default: '위험이 의심되면 송금과 개인정보 제공을 멈추고 공식 기관에 확인하세요.',
  mypage: '검사 결과는 참고 정보이며 사기 여부를 확정하지 않습니다.',
  urlResult: '검사 결과는 참고 정보이며 사기 여부를 확정하지 않습니다.',
  resetPassword: '안전한 계정 관리',
}

function Footer({ variant = 'default' }) {
  const className = variant === 'resetPassword'
    ? 'sg-footer sg-footer-simple sg-footer-reset'
    : variant === 'mypage' ? 'sg-footer sg-footer-simple'
      : variant === 'urlResult' ? 'sg-footer sg-footer-url-result' : 'sg-footer'
  return (
    <footer className={className}>
      <div className="sg-footer-inner">
        <span>SAFE GUARD · AI 기반 피싱 예방 서비스</span>
        <span>{footerNotes[variant] || footerNotes.default}</span>
      </div>
    </footer>
  )
}

export default Footer
