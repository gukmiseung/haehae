# SAFE GUARD

**AI 기반 피싱 및 사기 예방 서비스**

의심스러운 순간, SAFE GUARD가 함께 확인합니다.

SAFE GUARD는 문자, 카카오톡 대화, 대화 캡처 이미지 등을 AI로 분석하여 사기 위험 신호를 탐지하고, 사용자가 안전하게 대응할 수 있도록 돕는 웹 서비스입니다.

🔗 **서비스 바로가기:** https://haehae.vercel.app/

## 1. 프로젝트 배경

보이스피싱, 스미싱, 중고 거래 사기 등 디지털 환경에서 발생하는 금융 사기 수법이 다양해지고 있습니다.

그러나 일반 사용자가 대화 내용만으로 사기 여부를 판단하거나 적절한 대응 방법을 찾는 데에는 어려움이 있습니다.

SAFE GUARD는 AI 기반 대화 분석과 공식 보안 정보를 통해 이러한 문제를 해결하고, 사용자의 안전한 디지털 생활을 지원하고자 개발되었습니다.

## 2. 주요 기능

### AI 대화 분석

- 문자 및 메신저 대화 내용 직접 입력
- 대화 캡처 이미지 업로드 및 분석
- 대화의 맥락을 고려한 사기 위험도 분석
- 위험 신호 및 판단 근거 제공
- 분석 중 로딩 화면 제공
- 분석 완료 후 결과 화면 자동 전환

### AI 분석 결과

- 높음, 주의, 낮음, 판단 어려움의 위험도 분류
- 의심스러운 대화 내용 및 위험 요소 안내
- 분석 결과에 따른 안전 대응 방법 제공

### 위험 정보 조회

- 전화번호, 계좌번호, URL별 조회 인터페이스
- 더치트 외부 서비스 연결
- 사기 피해 이력 확인 지원

※ 외부 사기 신고 데이터 API를 통한 직접 조회 기능은 현재 미연동 상태입니다.

### 안전 대응 안내

- 사기 의심 상황별 대응 방법 안내
- 피해 예방을 위한 행동 지침 제공
- 관련 신고 및 상담 기관 안내

### 공식 사기 예방 정보

- KISA 보호나라 최신 보안공지 제공
- 피싱, 스미싱, 보이스피싱, 기관 사칭, 사기 예방 등 카테고리별 정보 확인
- AI 기반 보안공지 요약
- 공식 공지 원문 확인

### 회원 관리 및 마이페이지

- 회원가입 및 로그인
- 비밀번호 재설정
- 회원별 검사 기록 확인
- 사용자 계정에 따른 검사 기록 분리

## 3. 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Supabase Edge Functions, Vercel Functions |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| AI | Google Gemini API |
| External Data | KISA 보호나라 |
| Deployment | Vercel |
| Version Control | Git, GitHub |
| Design | Figma |

## 4. 서비스 구조

사용자 입력 → React 프론트엔드 → Supabase Edge Functions → Gemini API → 위험도 분석 결과 → 안전 대응 안내

Supabase를 활용하여 사용자 인증 및 보안공지 데이터를 관리하며, Vercel을 통해 웹 서비스를 배포합니다.

## 5. 프로젝트 실행 방법

### 저장소 복제

```bash
git clone https://github.com/gukmiseung/haehae.git
cd haehae
```

### 패키지 설치

```bash
npm ci
```

### 환경 변수 설정

프로젝트 루트 디렉터리에 `.env.local` 파일을 생성합니다.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Gemini API 키 등 서버 측 비밀 키는 Supabase 환경 변수에서 별도로 관리합니다.

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

## 6. 프로젝트 디렉터리 구조

```text
haehae/
├── api/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AiAnalysis.jsx
│   │   ├── AiResult.jsx
│   │   ├── SafetyGuide.jsx
│   │   ├── RiskLookup.jsx
│   │   ├── LatestScamGuide.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── MyPage.jsx
│   ├── App.jsx
│   └── App.css
├── supabase/
│   └── functions/
├── package.json
└── README.md
```

## 7. 기대 효과

- AI를 활용한 사기 위험 신호 조기 탐지
- 사용자의 디지털 금융 사기 대응 역량 향상
- 공식 보안 정보에 대한 접근성 개선
- 사기 피해 예방 및 안전한 디지털 거래 환경 조성

## 8. 향후 개선 방향

- 실제 사기 피해 신고 데이터 API 연동
- 전화번호 및 계좌번호 위험 정보 직접 조회
- URL 보안 검사 기능 고도화
- 사용자별 검사 기록 영구 저장
- AI 분석 정확도 및 응답 속도 개선
- 사용자 참여형 사기 피해 제보 기능

## 9. 유의 사항

SAFE GUARD의 AI 분석 결과는 사기 위험을 판단하기 위한 참고 정보이며, 실제 사기 여부를 확정하지 않습니다.

의심스러운 상황에서는 추가적인 공식 정보 확인 및 관련 기관을 통한 상담을 권장합니다.

---

**SAFE GUARD**

당신의 안전한 디지털 생활을 위한 AI 기반 사기 예방 서비스
