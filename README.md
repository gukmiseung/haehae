# React + Vite

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
