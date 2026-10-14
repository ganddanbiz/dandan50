# 105 단단한 50 — CLAUDE.md

## 블로그 기본 정보
| 항목 | 내용 |
|------|------|
| 블로그명 | 단단한 50 |
| 슬로건 | 50부터 더 건강하게, 더 단단하게 |
| 도메인 | dandan50-blog.vercel.app (정식, git 연동 자동 배포). dandan50.com 미구매. dandan50.vercel.app은 멈춘 중복 프로젝트 — 2026-10-14 삭제 |
| 언어 | 한국어 |
| 주제 | **건강 전용** (2026-10-14 디자인 기획서로 전환) — 다이어트·혈당관리·건강식단·운동·건강정보·제품리뷰 |
| 타겟 독자 | 40~60대 남녀, 중년 건강·체중 관리 관심층 |
| AI 모델 | Claude Haiku 4.5 |
| 이미지 | Unsplash API |
| DB | Neon PostgreSQL (ap-southeast-1, dandan50 DB) |

## 2026-10-14 리뉴얼 (디자인 기획서)
- 디자인: 딥그린 #315F46 · 세이지 #A8BE9B · 크림 #F7F4EC · 피치 #DDAE85, Pretendard. 토큰은 `src/app/globals.css` 상단
- 카테고리 정의: `src/lib/categories.ts` (DB `posts.category` 키 = diet·bloodsugar·meal·exercise·info·review)
- 페이지: 메인(히어로→카테고리→인기→최신→가이드→리뷰→구독), `/category/[key]`, `/search`, `/disclosure`, 글 페이지(목차·건강 포인트 박스·관련 글)
- 본문 가공: `src/lib/content.ts` — h2 안에 박힌 이미지/배너 분리(구 생성기 버그), '핵심 정리'→정보 박스, 목차
- 구독: `/api/subscribe` → `subscribers` 테이블(첫 요청 시 생성)
- 생성기: 건강 주제만, `topic.sub`를 카테고리로 저장, 직전 2편과 다른 카테고리 순환. 재테크(money-*) 16편은 주소 유지·메뉴 제외
- **검수관 게이트(2026-10-14)**: 워크플로가 `POST_STATUS: draft`로 저장 → 컨트롤타워 검수관(`Media/컨트롤타워/검수관.js`)이 검수 후 공개. 이 채널은 `교차검수: true`(Gemini 교차 확인). 옛 Vercel 크론 `/api/cron/generate-post`는 410으로 막음(`vercel.json` crons 비움)
- 이미지: 세부 카테고리별 Unsplash 검색어(`SUB_QUERIES`) → 일반 검색어 순. 검색어 하나(30장)만 쓰다 10/14 '미사용 이미지 없음'으로 발행 실패
- **아래 '핵심 차별화'·'주제 구조'의 재테크·요일 규칙은 지난 내용이다.**

## 코드베이스 출처
- **110 재테크스토리 코드를 복사·수정한 프로젝트**
- 코드 참조 시: `100 Blog_Manger/101 Blog_Jaetechstory/`

## 핵심 차별화 (50대 특화)
- **듀얼 카테고리**: money(재테크) + health(건강) + life(일상) — 다른 블로그와 다름
- **요일별 카테고리**: 월·수·금·일 → money / 화·목·토 → health
- **쿠팡 파트너스**: H2 2번째 뒤에 캐러셀 배너 자동 삽입 (id=970543, AF9787280)
  - 2026-10-14: 캐러셀은 `public/coupang-carousel.html?id=&h=` iframe으로만 그린다. 스크립트(g.js)를 동적으로 넣거나 본문 HTML에 넣으면 광고가 푸터 아래 왼쪽에 붙거나 빈칸이 된다. 예전 글의 본문 스크립트는 `src/lib/content.ts`가 렌더할 때 iframe으로 바꾼다. 같은 사이트 iframe이 필요해서 `next.config.ts`의 `X-Frame-Options`는 `SAMEORIGIN`이다 (DENY 금지)
  - 날개 배너(`.wing-banner`): 본문 틀 오른쪽, 헤더 아래(`top: 7rem`), 1520px 이상에서만 보임
- **면책문구**: 재테크 글 → 투자 면책 / 건강 글 → 의료 면책 자동 삽입

## 프로젝트 구조
```
105 Blog_Dandan50/
├── src/lib/topics.ts         ← 130개 주제 (money 78 + health 48 + life 4)
├── scripts/generate-post.ts  ← AI 글 자동 생성 (요일 기반 카테고리 선택)
├── scripts/generate.log      ← 발행 로그
├── .env.local                ← 환경변수
└── .github/workflows/
    └── daily-post.yml        ← 매일 KST 09:00 자동 발행
```

## 발행 명령
```bash
cd "100 Blog_Manger/105 Blog_Dandan50"
npm run generate
```

## 주제 구조
| category | slug 패턴 | 개수 | 발행 요일 |
|----------|-----------|------|-----------|
| money | money-001 ~ money-078 | 78개 | 월·수·금·일 |
| health | health-001 ~ health-048 | 48개 | 화·목·토 |
| life | life-001 ~ life-004 | 4개 | 카테고리 소진 후 |

## slug 패턴 (getNextTopic 쿼리)
```sql
WHERE slug ~ '^(money|health|life)-[0-9]+$'
```

## 환경변수 (.env.local)
- `CLAUDE_CODE_OAUTH_TOKEN` — 구독 인증 (우선). `claude setup-token`으로 발급
- `BLOG_ANTHROPIC_API_KEY` — API 키 폴백. **`ANTHROPIC_API_KEY`라는 이름은 쓰지 않는다** — SDK가 자동으로 집어 구독 인증을 덮어쓴다
- `UNSPLASH_ACCESS_KEY` — 이미지
- `DATABASE_URL` — Neon PostgreSQL
- `NEXT_PUBLIC_SITE_URL=https://dandan50-blog.vercel.app`
- `NEXT_PUBLIC_SITE_NAME=단단한 50`

## GitHub Actions 시크릿 (ganddanbiz/dandan50)
- `DATABASE_URL`
- `CLAUDE_CODE_OAUTH_TOKEN`
- `BLOG_ANTHROPIC_API_KEY` (폴백, 없어도 동작)
- `UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_SITE_URL` (현재: https://dandan50-blog.vercel.app)

## 발행 현황
- 총 2편 발행 (health-001, health-002 / 2026-06-25)
- 다음 주제: 오늘 요일에 따라 money 또는 health 자동 선택

## 설정 완료 체크리스트
- [x] Neon DB 생성 + `sql/init.pg.sql` 실행 (ap-southeast-1, dandan50 DB)
- [x] `.env.local` API 키 입력
- [x] Vercel 프로젝트 생성 + 환경변수 등록 (tugman77-8039s-projects/dandan50)
- [x] GitHub 저장소 `ganddanbiz/dandan50` 생성
- [x] GitHub Secrets 등록 (DATABASE_URL, GEMINI_API_KEY, UNSPLASH_ACCESS_KEY, NEXT_PUBLIC_SITE_URL)
- [x] `npm run generate` 로컬 테스트 (health-001 생성 확인)
- [x] Manager `CLAUDE.md` 대시보드에 150 추가
- [x] 도메인: dandan50.com 미구매 결정 (2026-10-14) — dandan50-blog.vercel.app 사용


## 검수 및 수정 절차

### 검수 시점
- 글 발행 후 자동 검수 또는 수동 요청 시 실행

### 검수 항목
| 항목 | 기준 |
|------|------|
| 내용 적합성 | 블로그 주제에 맞는지, 독자에게 유용한지 |
| 이미지 적합성 | 내용과 이미지가 일치하는지, 저작권 문제 없는지 |
| 사실 기반 | 통계·수치·고유명사를 웹 검색으로 팩트체크 |
| 문체·품질 | 맞춤법, 가독성, 블로그 감성 일치 여부 |

### 자주 발생하는 오류 유형
- AI가 그럴듯한 수치를 생성(hallucination) → 반드시 출처 검색 후 대조
- 이미지 키워드 미스매치 → 본문 주제와 이미지 일치 확인
- 시사 내용 outdated → 발행일 기준 최신 정보인지 확인

### 오류 수정 방법 (DB 직접 수정)
```bash
# 1. .env.local에서 DATABASE_URL 로드
source .env.local  # 또는 직접 export

# 2. 특정 slug의 content/thumbnail_url 수정
psql $DATABASE_URL -c "
UPDATE posts
SET content = $content_수정본$,
    updated_at = NOW()
WHERE slug = '수정할-slug';
"

# 3. 썸네일 교체
psql $DATABASE_URL -c "
UPDATE posts SET thumbnail_url = '새이미지URL' WHERE slug = 'slug';
"

# 4. 수정 확인
psql $DATABASE_URL -c "SELECT slug, title, updated_at FROM posts WHERE slug = 'slug';"
```

### 검수 결과 기록
- 검수 후 이슈가 있으면 `scripts/review.log`에 날짜·slug·내용·처리결과 기록
- 형식: `[YYYY-MM-DD] slug | 이슈 | 처리결과`

