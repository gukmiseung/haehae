# React + Vite

## 대화 위험 분석

- `.env.example`을 복사해 `.env.local`을 만들고, Supabase의 **Publishable key**를 입력합니다. 운영 프런트엔드에도 두 `VITE_SUPABASE_*` 환경변수를 설정합니다.
- 프로젝트 Owner 또는 Administrator가 [Edge Function Secrets](https://supabase.com/dashboard/project/rhmqkeilrvorlplhueqv/functions/secrets)에 Google AI Studio의 API 키를 `GEMINI_API_KEY`로 등록합니다. 기본 모델은 `gemini-3.5-flash-lite`이며, 필요하면 서버 Secret `GEMINI_MODEL`로 변경할 수 있습니다.
- Supabase CLI에 로그인한 후 아래 명령으로 분석 요청 한도와 함수를 적용합니다. 대시보드로 배포할 경우 SQL Editor에서 `supabase/migrations/20261122000000_conversation_analysis_quota.sql`을 적용하고, Edge Functions 에디터에서 `supabase/functions/analyze-conversation/index.ts`를 `analyze-conversation`으로 배포합니다.

```powershell
npx supabase link --project-ref rhmqkeilrvorlplhueqv
npx supabase db push
npx supabase functions deploy analyze-conversation --project-ref rhmqkeilrvorlplhueqv
```

`npm run dev`로 앱을 열고 **AI 위험 분석하기**를 누르면, 텍스트 및 PNG·JPG 캡처가 분석을 위해 Google Gemini로 전송됩니다. 성공한 분석은 현재 탭의 검사 기록에서 다시 볼 수 있습니다. 비회원 호출의 프로젝트 전체 요청 한도는 분당 20건, UTC 기준 일일 200건입니다.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Supabase 인증

1. Supabase 프로젝트의 Authentication에서 Email 공급자와 회원가입을 활성화합니다. 이메일 인증을 사용하려면 Confirm email도 활성화합니다.
2. `.env.example`을 `.env.local`로 복사한 뒤 프로젝트 URL과 Publishable key를 입력합니다. 두 값은 브라우저에 노출됩니다. Secret key 또는 `service_role` 키는 사용하지 마세요.
3. Authentication → URL Configuration에서 배포 주소를 Site URL로 지정하고, 개발 주소(예: `http://localhost:5173`)와 배포 주소를 Redirect URLs에 등록합니다. 가입 확인 링크는 가입 화면의 origin으로 돌아옵니다.
4. `npm ci` 후 `npm run dev`를 실행합니다. 같은 이메일로 가입, 확인 링크 열기, 로그인, 새로고침, 로그아웃을 확인합니다.

계정은 Supabase Auth에 생성되고 가입 화면의 이름은 사용자 메타데이터에 저장됩니다. 인증을 위해 별도 테이블이나 마이그레이션은 필요하지 않습니다. 로그인 상태 유지를 선택하면 브라우저를 닫았다 열어도 세션을 복원하며, 선택하지 않으면 해당 탭의 세션 저장소를 사용합니다.

## 공식 사기 예방 정보

기존 사기수법 가이드는 KISA 보안공지를 Supabase에서 읽는 게시판으로 연결됩니다. 테이블 생성, Edge Function 배포, Vault 비밀값 및 매시간 Cron 설정은 [KISA 게시판 운영 가이드](docs/kisa-security-board.md)를 따릅니다. 제목 검색 RSS 6개에서 사기 예방 관련 공지를 수집하며, 실제 확인한 공지 28건의 초기 등록 SQL도 제공합니다.
