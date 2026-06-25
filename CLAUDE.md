# 150 단단한 50 — CLAUDE.md

## 블로그 기본 정보
| 항목 | 내용 |
|------|------|
| 블로그명 | 단단한 50 |
| 부제목 | 50대 직장인의 돈과 몸, 둘 다 단단하게 |
| 도메인 | dandan50.vercel.app (dandan50.com 연결 예정) |
| 언어 | 한국어 |
| 주제 | 재테크 + 건강 (50대 타겟 듀얼 카테고리) |
| 타겟 독자 | 40~60대 직장인·자영업자 |
| AI 모델 | Claude Haiku 4.5 |
| 이미지 | Unsplash API |
| DB | Neon PostgreSQL (ap-southeast-1, dandan50 DB) |

## 코드베이스 출처
- **110 재테크스토리 코드를 복사·수정한 프로젝트**
- 코드 참조 시: `010 Blog_Manger/110 Blog_Jaetechstory/`

## 핵심 차별화 (50대 특화)
- **듀얼 카테고리**: money(재테크) + health(건강) + life(일상) — 다른 블로그와 다름
- **요일별 카테고리**: 월·수·금·일 → money / 화·목·토 → health
- **쿠팡 파트너스**: H2 2번째 뒤에 캐러셀 배너 자동 삽입 (id=970543, AF9787280)
- **면책문구**: 재테크 글 → 투자 면책 / 건강 글 → 의료 면책 자동 삽입

## 프로젝트 구조
```
150 blog_Dandan50/
├── src/lib/topics.ts         ← 130개 주제 (money 78 + health 48 + life 4)
├── scripts/generate-post.ts  ← AI 글 자동 생성 (요일 기반 카테고리 선택)
├── scripts/generate.log      ← 발행 로그
├── .env.local                ← 환경변수
└── .github/workflows/
    └── daily-post.yml        ← 매일 KST 09:00 자동 발행
```

## 발행 명령
```bash
cd "150 blog_Dandan50"
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
- `ANTHROPIC_API_KEY` — Claude API
- `UNSPLASH_ACCESS_KEY` — 이미지
- `DATABASE_URL` — Neon PostgreSQL
- `NEXT_PUBLIC_SITE_URL=https://dandan50.vercel.app`
- `NEXT_PUBLIC_SITE_NAME=단단한 50`

## GitHub Actions 시크릿 (ganddanbiz/dandan50)
- `DATABASE_URL`
- `ANTHROPIC_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_SITE_URL` (현재: https://dandan50.vercel.app — 도메인 연결 후 갱신)

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
- [ ] 도메인 `dandan50.com` 구매 + Vercel 연결
- [ ] GitHub Secret `NEXT_PUBLIC_SITE_URL` → `https://dandan50.com` 갱신
