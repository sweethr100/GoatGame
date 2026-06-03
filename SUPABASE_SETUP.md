# Supabase 리더보드 설정

운영 사이트 주소는 `https://jjack.netlify.app/`입니다. 리더보드 API도 같은
Netlify 배포에서 실행됩니다.

브라우저는 `/.netlify/functions/leaderboard` 경로의 Netlify Function으로
리더보드 요청을 보냅니다. 이 함수는 점수를 검증하고 서버에서 Supabase
service-role 키를 사용합니다. 이 키를 브라우저 코드에 노출하면 안 됩니다.

## 1. 테이블 생성

Supabase SQL Editor를 열고 [`supabase/leaderboard.sql`](supabase/leaderboard.sql)을
실행합니다.

## 2. Netlify 환경 변수 추가

Netlify 사이트 설정에 다음 환경 변수를 추가합니다.

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
LEADERBOARD_HASH_SECRET=ANY_LONG_RANDOM_SECRET
```

환경 변수를 추가한 뒤 Netlify에서 새 배포를 실행합니다.

저장소의 개발 서버에서 로컬 테스트를 하려면 `npm run dev`를 실행하기 전에
셸에 동일한 환경 변수를 설정합니다.

## 검증 항목

서버는 형식에 맞지 않는 닉네임, 지원하지 않는 모드, 불가능한 기록 조합,
비정상적으로 높은 점수, 동일한 클라이언트에서 10분 이내에 6회를 초과하여
제출한 기록을 거부합니다. 닉네임별로 각 연습 모드의 상위 5개 기록만
유지하며, 6위 이하 기록은 새 점수를 저장한 직후 자동으로 삭제합니다.

이 방식은 에임 트레이너 리더보드에 적용할 수 있는 실용적인 1차 방어입니다.
게임 플레이 로직은 여전히 클라이언트에서 실행되므로, 그럴듯한 기록을
자동으로 만드는 치팅까지 완전히 차단할 수는 없습니다. 더 강한 보호가
필요하다면 서명된 플레이 세션 프로토콜이나 서버 측 이벤트 검증을 추가해야
합니다.
