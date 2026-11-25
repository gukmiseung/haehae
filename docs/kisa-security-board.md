# KISA 공식 사기 예방 정보 운영 가이드

## 구현과 실제 RSS

기존 `LatestScamGuide`의 목록, 필터, 카드, 상세 화면, 스크롤 복원과 반응형 CSS를 재사용한다. 제목은 **공식 사기 예방 정보**다. 프런트엔드는 `security_posts`를 최신순으로 조회하며 화면이 보이는 동안 1분마다, 다시 탭을 열 때 갱신한다. 조회 실패 시 현재 표시 중인 글을 유지하고 재시도 버튼을 보여준다. 수집 함수는 기존 글을 수정하거나 삭제하지 않는다.

2026-11-25에 아래 공식 RSS 응답을 직접 확인했고 테스트 fixture로 보관했다.

https://www.boho.or.kr/kr/rss.do?bbsId=B0000133

- RSS 2.0의 `rss.channel.item`에 `title`, `link`, `pubDate`, `guid`가 있다.
- `title`, `link`, `pubDate`는 CDATA를 사용하며 앞뒤 공백이 있다. 날짜는 `YYYY-MM-DD`다.
- 소개, 카테고리, 본문은 없다. `summary`는 NULL로 저장하며 UI에 원문 확인 안내를 표시한다. 본문을 크롤링하거나 생성하지 않는다.
- 현재 10개 공지는 모두 제품 보안 업데이트다. 사기 예방 관련 공지가 **0개인 것이 정상**이다. 최초 실행도 현재 RSS의 관련 글만 가져오며, RSS 범위 밖 과거 글을 추가 수집하지 않는다.
- 카테고리는 앱에서 제목의 명시적 키워드로 분류한다. 보이스피싱, 스미싱, 피싱, 기관 사칭, 개인정보·계정정보 탈취, 투자·금융 등 사기 예방 문구가 기준이다. 분류는 KISA가 제공한 분류라고 표시하지 않는다. 일반 취약점·제품 업데이트는 제외한다.
- 검색용 쿼리 값이 바뀌어도 `bbsId`와 `nttId`를 기준으로 같은 공식 URL로 정규화한다. DB의 UNIQUE 제약과 ON CONFLICT DO NOTHING으로 동시 실행과 재시도의 중복을 막는다.
- 제목, 날짜, 출처와 공식 링크 중심으로 안내한다. 원문 이미지·본문·가상 예시는 복제하지 않는다. 향후 본문 활용 범위를 늘릴 때는 KISA 해당 자료의 이용 조건을 확인한다.

## 1. 테이블 적용

프로젝트 관리 권한으로 Supabase SQL Editor에서 다음 파일 전체를 실행한다.

`supabase/migrations/20261125000000_security_posts.sql`

`security_posts`에는 UUID `id`, `title`, nullable `summary`, `category`, `source`, UNIQUE `source_url`, nullable DATE `published_at`, `created_at`이 생긴다. RSS가 시간대를 제공하지 않으므로 게시일은 DATE다. 유효하지 않거나 없는 날짜는 NULL이며 최신순에서 뒤에 배치한다.

RLS로 `anon`, `authenticated`에 SELECT만 허용한다. 브라우저에서 INSERT·UPDATE·DELETE할 수 없다. 기존 인증 및 다른 테이블은 건드리지 않는다. 마이그레이션 파일은 한 번 적용한다. CLI로 전체 `db push`를 사용할 때는 기존 대시보드 적용 이력과 CLI 마이그레이션 이력이 일치하는지 먼저 확인한다.

## 2. 수집 함수 비밀값

32바이트 이상의 무작위 비밀값을 생성해 비밀번호 관리자에 보관한다. 다음 명령은 본인 컴퓨터의 터미널에서 실행할 수 있다.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Supabase **Edge Functions → Secrets**에 이름 `KISA_CRON_SECRET`으로 이 값을 저장한다. 이 값은 프런트엔드 환경변수, Git, 대화, 공유 로그에 넣지 않는다.

Edge Functions의 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`는 Supabase가 제공하는 서버 환경변수다. 서비스 키는 브라우저에 넣지 않는다. 현재 프런트엔드의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`는 그대로 사용한다.

## 3. 함수 배포

저장소 루트에서 프로젝트 관리자가 실행한다.

```sh
npx supabase login
npx supabase functions deploy collect-kisa-rss --project-ref rhmqkeilrvorlplhueqv --no-verify-jwt
```

이 함수는 JWT 검사 대신 `x-cron-secret` 헤더의 전용 비밀값을 검증한다. Supabase 로그인 사용자나 공개 키만으로는 실행할 수 없다. 비밀값이 없는 서버 설정은 503, 잘못된 비밀값은 401, POST 이외 메서드는 405다. 인증 성공 후에만 RSS 및 DB에 접근한다.

## 4. Vault와 Cron 설정

Supabase **Vault**에서 다음 두 secret을 등록한다. 메뉴 위치가 달라졌다면 대시보드 검색에서 Vault를 찾는다.

| Vault 이름 | 값 |
| --- | --- |
| `kisa_rss_function_url` | `https://rhmqkeilrvorlplhueqv.supabase.co/functions/v1/collect-kisa-rss` |
| `kisa_rss_cron_secret` | Edge Function의 `KISA_CRON_SECRET`과 동일한 값 |

SQL Editor에서 `supabase/setup/kisa_cron.sql` 전체를 실행한다. `pg_cron`, `pg_net`을 활성화하고 관리자 전용 `private.request_kisa_rss()`와 매시간 정각 실행 작업을 만든다. 마지막 줄은 최초 수집을 즉시 요청한다. 같은 파일을 다시 실행하면 같은 이름의 Cron 작업을 갱신하며, 새 작업을 중복 생성하지 않는다.

마지막 SELECT가 돌려주는 값은 HTTP 요청 ID다. **이 값만으로 수집 성공을 판정하지 않는다.** 몇 초 후 아래 조회의 `123`을 반환된 요청 ID로 바꿔 실행한다.

```sql
select id, status_code, error_msg, content
from net._http_response
where id = 123;
```

성공하면 HTTP 200과 `fetched`, `matched`, `inserted`, `existing`, `invalidItems`가 나온다. 현재 관측 RSS는 `fetched=10`, `matched=0`, `inserted=0`이다. 관련 글이 있을 때 동일 RSS를 다시 실행하면 새 `inserted`는 0이다.

Cron 상태와 실행 기록은 아래에서 확인한다. Cron 성공은 HTTP 요청 제출 성공일 수 있으므로 Edge Function 로그와 위 HTTP 응답도 확인한다.

```sql
select jobid, jobname, schedule, active
from cron.job where jobname = 'collect-kisa-rss';

select status, return_message, start_time, end_time
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'collect-kisa-rss')
order by start_time desc limit 10;
```

비밀값 교체 시 Edge Secrets와 Vault의 값을 함께 갱신한다. 수집을 일시 정지하려면 다음을 실행한다.

```sql
select cron.alter_job(jobid, active := false)
from cron.job where jobname = 'collect-kisa-rss';
```

## 5. 점검 방법

Deno 2가 설치된 환경에서 저장소 루트 기준으로 실행한다.

```sh
deno check --config supabase/functions/collect-kisa-rss/deno.json supabase/functions/collect-kisa-rss/index.ts
deno task --config supabase/functions/collect-kisa-rss/deno.json test
npm run build
```

테스트는 실제 RSS fixture의 0건 선별, 합성 테스트 데이터의 분류, CDATA, 잘못된 날짜·링크·XML, 중복 URL을 확인한다. 합성 공지는 운영 DB에 넣지 않는다.

SQL Editor에서 `select private.request_kisa_rss();`로 수동 수집 요청을 보낼 수 있다. 이후 해당 HTTP 응답과 Edge Function Logs를 확인한다. 실패해도 기존 `security_posts`는 유지되며 다음 정각에 재시도한다. 오류 응답에는 서버 비밀값을 포함하지 않는다.

사이트의 홈에서 **공식 사기 예방 정보**를 열어 목록, 분류, 상세, KISA 원문 링크를 확인한다. 등록된 관련 글이 없으면 빈 상태가 정상이다. 사용자·비회원 공개 키로 조회가 허용되고 쓰기는 거부되는지도 운영 프로젝트에서 확인한다.

## 적용 범위와 남은 확인

이 저장소에는 프런트엔드, 테이블 SQL, Edge Function, Cron SQL 및 테스트가 포함된다. 코드 푸시와 Vercel 배포만으로 Supabase 마이그레이션·함수·Vault·Cron이 생성되지는 않는다. 위 관리 작업은 프로젝트 관리자 권한으로 별도 적용한다. 운영 적용 및 실제 Cron 실행 결과는 해당 권한으로 확인해야 한다.

### 이번 구현에서 확인한 결과

- Deno 타입 검사와 파서 테스트 5개 통과. 실제 RSS 10건에서 관련 공지 0건을 확인했다.
- 로컬 수집 함수의 실제 RSS 요청은 HTTP 200. 비밀값 없음·불일치 요청은 401, GET은 405를 확인했다.
- 로컬 PostgreSQL 호환 PGlite에서 마이그레이션 실행, 공개 조회, anon/authenticated 쓰기 거부, service_role 등록, 중복·원문 URL 제약을 확인했다.
- Chromium의 모의 DB 응답으로 목록, 필터, 상세, 원문 링크, 데스크톱 3열·모바일 1열, 빈 목록, 실패 시 기존 목록 유지, 재시도 및 자동 갱신을 확인했다. 테스트 게시글은 운영 DB에 등록하지 않았다.
- Vite 빌드 통과. 번들 크기 500 kB 경고가 있다. 전체 ESLint는 기존 ScamPopup/RiskLookup의 set-state-in-effect 오류 2건이 남아 있다. 새 게시판 파일과 홈 파일의 ESLint는 통과했다.
- 운영 프로젝트 관리자 토큰이 없고 이 작업 환경에서 Supabase 도메인 요청은 403으로 차단되어, 실제 DB·함수·Vault·Cron 적용과 운영 RLS/정각 실행 결과는 확인하지 못했다.
