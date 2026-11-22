import { useEffect, useState } from 'react'
import './LatestScamGuide.css'

const scamData = [
  {
    id: 1,
    category: '보이스피싱',
    title: '금융기관 사칭 전화',
    description: '계좌 이상을 핑계로 별도 송금을 요구하는 유형',
    method:
      '금융회사 직원을 사칭해 계좌가 범죄에 이용되었거나 금융정보가 유출되었다고 접근합니다.',
    message:
      '[금융 안내] 고객님의 계좌가 범죄에 연루된 것으로 확인되었습니다. 안전한 자산 보호를 위해 안내받은 계좌로 자금을 이체해 주세요.',
    warning: [
      '안전 계좌로 돈을 옮기라고 요구',
      '계좌 비밀번호나 OTP 번호 요구',
      '전화 통화를 유지한 채 송금 유도',
    ],
    prevention:
      '전화를 끊고 해당 금융기관의 공식 대표번호로 직접 확인하세요. 전화로 송금을 요구하면 응하지 마세요.',
  },
  {
    id: 2,
    category: '스미싱',
    title: '택배 배송 문자 사칭',
    description: '배송 문제를 핑계로 문자 링크 접속을 유도',
    method:
      '배송 주소 오류, 배송 조회, 반송 안내 등을 가장한 문자에 인터넷 주소를 포함해 전송합니다.',
    message:
      '[택배 안내] 배송지 정보에 문제가 있습니다. 아래 링크에서 주소를 확인해 주세요.',
    warning: [
      '출처를 알 수 없는 문자 속 링크',
      '개인정보 또는 인증번호 입력 요구',
      '즉각적인 확인이나 조치를 재촉하는 표현',
    ],
    prevention:
      '택배회사 공식 앱이나 홈페이지에 직접 접속해 배송 상태를 확인하세요. 문자 속 링크는 바로 열지 말고, 개인정보를 입력했다면 공식 기관의 안내를 확인하세요.',
  },
  {
    id: 3,
    category: '중고거래',
    title: '안전결제 사칭',
    description: '거래 플랫폼 외부 결제 사이트로 이동 유도',
    method:
      '안전결제를 진행해야 한다며 가짜 결제 페이지나 외부 메신저로 이동하도록 유도합니다.',
    message:
      '[안전결제 안내] 안전한 거래를 위해 아래 결제 페이지에서 결제를 진행해 주세요. 결제 확인 후 상품을 발송하겠습니다.',
    warning: [
      '플랫폼 외부 링크로 결제 요청',
      '별도 계좌로 입금 요구',
      '결제 오류를 이유로 추가 입금 요구',
    ],
    prevention:
      '거래 플랫폼이 제공하는 공식 결제 기능만 이용하고 외부 링크로 결제하지 마세요. 플랫폼 외부에서 결제를 유도하면 거래를 중단하세요.',
  },
  {
    id: 4,
    category: '기관 사칭',
    title: '수사기관 사칭',
    description: '수사나 자산 보호를 명목으로 송금을 요구',
    method:
      '검찰이나 경찰을 사칭해 범죄 연루 또는 계좌 도용을 주장하며 수사 협조를 요구합니다.',
    message:
      '[수사기관 안내] 귀하의 계좌가 범죄에 이용된 정황이 확인되었습니다. 수사 보안을 위해 외부에 알리지 말고 안내에 따라 조치해 주세요.',
    warning: [
      '수사 비밀을 이유로 주변에 알리지 말라고 함',
      '현금 인출이나 특정 계좌 이체 요구',
      '앱 설치 또는 원격제어 허용 요구',
    ],
    prevention:
      '수사기관은 전화로 개인에게 자산 보호를 위한 송금을 요구하지 않습니다. 전화를 끊고 112에 확인하세요.',
  },
  {
    id: 5,
    category: '투자 사기',
    title: '고수익 투자 권유',
    description: '높은 수익을 보장한다며 투자를 요구',
    method:
      'SNS나 메신저에서 투자 전문가를 사칭하고 가짜 투자 사이트나 앱으로 입금을 유도합니다.',
    message:
      '[투자 안내] 이번 특별 투자 상품은 원금이 보장되며 단기간에 높은 수익을 얻을 수 있습니다. 참여를 원하시면 안내된 계좌로 입금해 주세요.',
    warning: [
      '원금 보장이나 확정 수익을 강조',
      '출금하려면 추가 수수료 요구',
      '검증되지 않은 투자 앱 설치 유도',
    ],
    prevention:
      '투자 업체의 등록 여부를 확인하고 원금 보장이나 고수익을 확정적으로 약속하는 제안은 경계하세요. 출금을 위해 추가 입금을 요구하면 응하지 마세요.',
  },
  {
    id: 6,
    category: '보이스피싱',
    title: '개인정보 유출 빙자 대출 사기',
    description: '개인정보 유출 보상이나 저금리 대출을 미끼로 접근',
    method:
      '유출된 개인정보를 알고 있는 것처럼 접근해 특별 대출이나 피해 보상을 안내한다며 URL 클릭, 선입금, 기존 대출 상환, 악성 앱 설치를 유도합니다.',
    message:
      '[대출 안내] 고객님의 개인정보 유출 피해 확인을 위해 보안 앱을 설치해 주세요. 특별 저금리 대출 상담도 함께 도와드리겠습니다.',
    warning: [
      '개인정보 유출 보상이나 특별 대출 안내 문자',
      '대출 실행 전 보증료나 선입금 요구',
      '기존 대출을 먼저 상환하라고 요구',
      '보안 점검을 이유로 앱 설치 요구',
    ],
    prevention:
      '대출을 이유로 선입금하거나 기존 대출을 특정 계좌로 상환하지 마세요. 앱 설치를 요구하면 중단하고 금융회사 공식 대표번호로 확인하세요.',
    source: '금융위원회 소비자경보 2026-26호 (2026.10.06)',
    sourceUrl: 'https://www.fsc.go.kr/no010101/87882',
  },
]

const categories = [
  '전체',
  '보이스피싱',
  '스미싱',
  '중고거래',
  '기관 사칭',
  '투자 사기',
]

function LatestScamGuide({ onNavigate, initialScamId }) {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const [selectedScam, setSelectedScam] = useState(
    () => scamData.find((scam) => scam.id === initialScamId) || null
  )

  useEffect(() => {
    if (initialScamId) {
      const targetScam = scamData.find(
        (scam) => scam.id === initialScamId
      )

      setSelectedScam(targetScam || null)
    }
  }, [initialScamId])

  const filteredScams =
    selectedCategory === '전체'
      ? scamData
      : scamData.filter(
          (scam) => scam.category === selectedCategory
        )

  // 상세 화면
  if (selectedScam) {
    return (
      <main className="sg-latest sg-latest-detail-page">
        <div className="sg-latest-detail-container">
          <div className="sg-latest-detail-brand">
            <span>SAFE GUARD</span>
            <span>· 본 콘텐츠는 교육용 예시입니다.</span>
          </div>

          <span className="sg-latest-category sg-latest-detail-category">
            {selectedScam.category}
          </span>

          <h1 className="sg-latest-detail-title">
            {selectedScam.title}
          </h1>

          <p className="sg-latest-detail-description">
            {selectedScam.description}
          </p>

          <section className="sg-latest-detail-panel sg-latest-detail-intro">
            <h2>이런 사기예요</h2>
            <p>{selectedScam.method}</p>
          </section>

          <section className="sg-latest-detail-panel">
            <h2>의심 메시지 예시</h2>
            <div className="sg-latest-message">
              <p>{selectedScam.message}</p>
              <small>※ 실제 링크가 포함되지 않은 교육용 가상 메시지입니다.</small>
            </div>
          </section>

          <section className="sg-latest-detail-panel">
            <h2>이런 위험 신호를 확인하세요</h2>
            <ol className="sg-latest-warning-list">
              {selectedScam.warning.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="sg-latest-detail-panel sg-latest-detail-prevention">
            <h2>예방 및 대응 방법</h2>
            <p>{selectedScam.prevention}</p>
          </section>

          {selectedScam.source && (
            <div className="sg-latest-source">
              <p>{selectedScam.source}</p>
              <a
                href={selectedScam.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                공식 자료 확인하기 →
              </a>
            </div>
          )}

          <button
            type="button"
            className="sg-latest-detail-analysis"
            onClick={() => onNavigate('analysis')}
          >
            내 대화도 AI로 분석하기 →
          </button>

          <div className="sg-latest-detail-back-wrap">
            <button
              type="button"
              className="sg-latest-detail-back"
              onClick={() => setSelectedScam(null)}
            >
              ← 사기수법 목록으로
            </button>
          </div>
        </div>
      </main>
    )
  }

  // 목록 화면
  return (
    <main className="sg-latest">
      <section className="sg-latest-hero">
        <div className="sg-latest-container">
          <span className="sg-latest-eyebrow">
            SCAM PREVENTION GUIDE
          </span>
          <h1>사기수법 가이드</h1>
          <p>
            다양한 피싱 수법을 알아보고 위험 신호와 예방법을 확인해 보세요.
          </p>
        </div>
      </section>

      <section className="sg-latest-container sg-latest-content">
        <div className="sg-latest-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category ? 'active' : ''
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="sg-latest-section-heading">
          <h2>사기 유형 살펴보기</h2>
          <span>{filteredScams.length}개 콘텐츠 · 안내 자료</span>
        </div>

        <div className="sg-latest-grid">
          {filteredScams.map((scam) => (
            <article className="sg-latest-card" key={scam.id}>
              <span className="sg-latest-category">
                {scam.category}
              </span>

              <h3>{scam.title}</h3>

              <p>{scam.description}</p>

              <button
                type="button"
                onClick={() => setSelectedScam(scam)}
              >
                자세히 보기 <span>→</span>
              </button>
            </article>
          ))}
        </div>

        <section className="sg-latest-cta">
          <h2>의심스러운 대화를 받으셨나요?</h2>
          <p>
            실제 대화 내용을 입력하고 AI 분석을 통해 위험 신호를 확인해 보세요.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('analysis')}
          >
            AI 대화 분석하기 <span>→</span>
          </button>
        </section>
      </section>
    </main>
  )
}

export default LatestScamGuide