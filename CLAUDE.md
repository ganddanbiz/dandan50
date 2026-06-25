# 150 단단한 50 — CLAUDE.md

## 블로그 기본 정보
| 항목 | 내용 |
|------|------|
| 블로그명 | 단단한 50 |
| 부제목 | 50대 직장인의 돈과 몸, 둘 다 단단하게 |
| 도메인 | dandan50.com (미정 — Vercel 배포 후 연결) |
| 언어 | 한국어 |
| 주제 | 재테크 + 건강 (50대 타겟 듀얼 카테고리) |
| 타겟 독자 | 40~60대 직장인·자영업자 |
| AI 모델 | Gemini 2.5 Flash |
| 이미지 | Unsplash API |
| DB | Neon PostgreSQL (신규 생성 필요) |

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
- `GEMINI_API_KEY` — Gemini API
- `UNSPLASH_ACCESS_KEY` — 이미지
- `DATABASE_URL` — Neon PostgreSQL
- `NEXT_PUBLIC_SITE_URL=https://dandan50.com`
- `NEXT_PUBLIC_SITE_NAME=단단한 50`

## GitHub Actions 시크릿 (ganddanbiz/dandan50 — 저장소 생성 필요)
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 발행 현황
- 총 0편 발행 (초기 설정 중)
- 다음 주제: money-001 (오늘 요일에 따라 결정)

## 설정 완료 체크리스트
- [ ] Neon DB 생성 + `sql/init.pg.sql` 실행
- [ ] `.env.local` API 키 입력
- [ ] Vercel 프로젝트 생성 + 환경변수 등록
- [ ] GitHub 저장소 `ganddanbiz/dandan50` 생성
- [ ] GitHub Secrets 등록
- [ ] `npm run generate` 로컬 테스트
- [ ] Manager `CLAUDE.md` 대시보드에 150 추가
