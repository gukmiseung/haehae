
import './Footer.css'

function Footer({ variant = 'default' }) {
  const isMyPage = variant === 'mypage'

  return (
    <footer className={isMyPage ? 'sg-footer sg-footer-mypage' : 'sg-footer'}>
      <div className="sg-footer-inner">
        <span>SAFE GUARD · AI 기반 피싱 예방 서비스</span>
        <span>
          {isMyPage
            ? '검사 결과는 참고 정보이며 사기 여부를 확정하지 않습니다.'
            : '위험이 의심되면 송금과 개인정보 제공을 멈추고 공식 기관에 확인하세요.'}
        </span>
      </div>
    </footer>
  )
}

export default Footer
