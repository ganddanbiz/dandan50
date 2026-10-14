/**
 * 단단한 50 — AI 블로그 자동 글 생성 스크립트
 * 사용법: npm run generate
 *
 * 발행 규칙 (2026-10-14 건강 전용 전환 — 디자인 기획서):
 *   - 월·수·토 발행, 전부 건강 주제
 *   - 사이트 카테고리(topic.sub): diet·bloodsugar·meal·exercise·info·review 를 직전 2편과 겹치지 않게 순환
 *   - 재테크(money)·일상(life) 주제는 발행하지 않는다 (기존 글은 주소 유지)
 */

import Anthropic from "@anthropic-ai/sdk";
import { neon } from "@neondatabase/serverless";
import { allTopics, Topic } from "../src/lib/topics";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

// ── Claude 클라이언트 ─────────────────────────────
// ANTHROPIC_API_KEY는 Claude Code CLI가 자동으로 읽어 구독 인증을 덮어쓰므로 사용하지 않음.
// 우선순위: CLAUDE_CODE_OAUTH_TOKEN(구독) → BLOG_ANTHROPIC_API_KEY(스크립트 전용 API 키)
const oauthToken = process.env.CLAUDE_CODE_OAUTH_TOKEN;
const apiKey = process.env.BLOG_ANTHROPIC_API_KEY;
if (!oauthToken && !apiKey) {
  console.error(
    "❌ CLAUDE_CODE_OAUTH_TOKEN 또는 BLOG_ANTHROPIC_API_KEY가 .env.local에 필요합니다.\n" +
      "   구독 사용: `claude setup-token` 실행 후 CLAUDE_CODE_OAUTH_TOKEN에 토큰 입력"
  );
  process.exit(1);
}
const anthropic = oauthToken
  ? new Anthropic({ authToken: oauthToken })
  : new Anthropic({ apiKey: apiKey! });

// ── 카테고리 → Unsplash 검색어 맵 ─────────────────
const CATEGORY_QUERY: Record<string, string> = {
  money: "finance investment planning retirement Korean office people",
  health: "health fitness exercise lifestyle middle aged Korean people",
  life:   "Korean lifestyle daily routine office worker people",
};

// 건강 세부 카테고리별 검색어 (2026-10-14) — 'health' 한 검색어(최대 30장)는 이미 다 써서
// "미사용 이미지 없음"으로 발행이 멈췄다. 세부 검색어 → 일반 검색어 순으로 넓혀 찾는다.
const SUB_QUERIES: Record<string, string[]> = {
  diet:       ["healthy weight loss meal", "middle aged woman walking park", "diet salad vegetables"],
  bloodsugar: ["blood sugar healthy meal", "whole grains vegetables table", "walking after meal"],
  meal:       ["korean healthy food table", "balanced meal tofu vegetables", "home cooked healthy dinner"],
  exercise:   ["senior stretching exercise", "middle aged man jogging", "home workout mat"],
  info:       ["healthy lifestyle morning", "doctor consultation senior", "sleep rest bedroom morning"],
  review:     ["vitamin supplements bottle", "healthy kitchen products", "fitness equipment home"],
};
const FALLBACK_QUERIES = ["healthy lifestyle", "wellness nature walk", "fresh vegetables kitchen", "active senior couple"];

// ── 쿠팡 파트너스 배너 HTML ────────────────────────
const COUPANG_BANNER = `
<div style="margin:2.5em 0;padding:1.25em 1em;background:linear-gradient(135deg,#fff8f0 0%,#fff3e6 100%);border-radius:8px;border:1px solid #f5c97a;">
  <p style="font-size:0.78rem;color:#b45309;margin:0 0 0.75em 0;font-weight:600;">이 글과 함께 도움이 될 상품</p>
  <iframe src="/coupang-carousel.html?id=970543&h=140" title="쿠팡 파트너스 상품" loading="lazy" scrolling="no" style="display:block;width:100%;height:150px;border:0;margin:0 auto"></iframe>
  <p style="font-size:0.68rem;color:#999;text-align:right;margin:0.5em 0 0 0;">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
</div>`;

// ── 면책문구 ───────────────────────────────────────
const DISCLAIMER: Record<string, string> = {
  money:  `<p style="font-size:0.8rem;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:1em;margin-top:2em;">※ 본 포스팅은 정보 제공 목적으로 작성되었으며, 특정 종목의 매수·매도를 권유하지 않습니다. 투자 결과에 대한 책임은 투자자 본인에게 있습니다.</p>`,
  health: `<p style="font-size:0.8rem;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:1em;margin-top:2em;">※ 본 포스팅은 일반적인 건강 정보 제공을 목적으로 하며, 의학적 진단이나 치료를 대신하지 않습니다. 건강 문제는 반드시 전문의와 상담하세요.</p>`,
  life:   "",
};

interface UnsplashResult {
  url: string;
  attribution: string;
}

// ── DB에서 이미 사용된 이미지 URL 조회 ──
async function getUsedImageIds(): Promise<Set<string>> {
  const rows = await sql`SELECT thumbnail_url, content FROM posts WHERE status = 'published'`;
  const ids = new Set<string>();
  const inlineRegex = /src="(https:\/\/images\.unsplash\.com\/[^"?]+)/g;

  for (const row of rows) {
    if (row.thumbnail_url) {
      ids.add((row.thumbnail_url as string).split("?")[0]);
    }
    let match;
    while ((match = inlineRegex.exec(row.content as string)) !== null) {
      ids.add(match[1]);
    }
    inlineRegex.lastIndex = 0;
  }
  return ids;
}

// ── Unsplash 이미지 여러 장 가져오기 ──────────────
async function fetchUnsplashImages(category: string, count: number, usedIds: Set<string> = new Set(), sub?: string): Promise<UnsplashResult[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    writeLog("⚠️  UNSPLASH_ACCESS_KEY 미설정 — 이미지 없이 진행");
    return [];
  }

  const queries = [...(sub ? SUB_QUERIES[sub] ?? [] : []), CATEGORY_QUERY[category] ?? "lifestyle people", ...FALLBACK_QUERIES];

  try {
    const results: UnsplashResult[] = [];
    for (const query of queries) {
      if (results.length >= count) break;
      let page = 1;

      while (results.length < count && page <= 3) {
        const url = new URL("https://api.unsplash.com/search/photos");
        url.searchParams.set("query", query);
        url.searchParams.set("per_page", "10");
        url.searchParams.set("orientation", "landscape");
        url.searchParams.set("page", String(page));

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Client-ID ${unsplashKey}` },
        });

        if (!res.ok) {
          writeLog(`⚠️  Unsplash API 오류 (${res.status}) — 이미지 없이 진행`);
          break;
        }

        const data = await res.json() as {
          results: Array<{
            id: string;
            urls: { regular: string };
            user: { name: string };
            links: { html: string };
          }>;
        };

        if (!data.results?.length) break;

        for (const photo of data.results) {
          const baseUrl = photo.urls.regular.split("?")[0];
          if (usedIds.has(baseUrl)) continue;
          usedIds.add(baseUrl);
          results.push({
            url: photo.urls.regular,
            attribution: `<a href="${photo.links.html}?utm_source=dandan50&utm_medium=referral" rel="noopener noreferrer" style="color:rgba(255,255,255,0.9);">${photo.user.name}</a> / Unsplash`,
          });
          if (results.length >= count) break;
        }

        page++;
      }
      }

    if (!results.length) writeLog("⚠️  Unsplash 미사용 이미지 없음 — 이미지 없이 진행");
    return results;
  } catch (err) {
    writeLog(`⚠️  Unsplash fetch 실패: ${err instanceof Error ? err.message : String(err)} — 이미지 없이 진행`);
    return [];
  }
}

// ── 이미지 + 쿠팡 배너 + 면책문구 삽입 ───────────
function injectContent(html: string, images: UnsplashResult[], category: string): string {
  // parts[i]는 i번째 </h2> 바로 뒤에서 시작한다. 반드시 앞에 붙일 것 —
  // 뒤에 붙이면 다음 <h2> 제목 안으로 들어가 소제목 속에 이미지·배너가 박힌다 (2026-10-14 수정)
  const DELIMITER = "</h2>";
  const parts = html.split(DELIMITER);

  // h2[1] 뒤 → 인라인 이미지 1
  if (parts.length > 1 && images[0]) {
    parts[1] = buildImgFigure(images[0]) + parts[1];
  }

  // h2[2] 뒤 → 쿠팡 파트너스 배너
  if (parts.length > 2) {
    parts[2] = COUPANG_BANNER + parts[2];
  }

  // h2[3] 뒤 → 인라인 이미지 2
  if (parts.length > 3 && images[1]) {
    parts[3] = buildImgFigure(images[1]) + parts[3];
  }

  // 면책문구 → 마지막 파트에 추가
  const lastIdx = parts.length - 1;
  parts[lastIdx] = parts[lastIdx] + (DISCLAIMER[category] ?? "");

  return parts.join(DELIMITER);
}

function buildImgFigure(img: UnsplashResult): string {
  return [
    `<figure style="margin:1.75em 0;position:relative;display:block;">`,
    `<img src="${img.url}" alt="관련 이미지" loading="lazy"`,
    ` style="width:100%;max-height:400px;object-fit:cover;border-radius:10px;border:1px solid var(--border);display:block;" />`,
    `<figcaption style="position:absolute;bottom:8px;right:10px;font-size:0.65rem;`,
    `color:rgba(255,255,255,0.85);background:rgba(0,0,0,0.45);`,
    `padding:2px 7px;border-radius:4px;line-height:1.5;white-space:nowrap;">`,
    img.attribution,
    `</figcaption></figure>`,
  ].join("");
}

// ── 최근 발행 제목 조회 (중복 방지용) ───────────
async function getRecentTitles(count: number = 7): Promise<string[]> {
  const rows = await sql`SELECT title FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT ${count}`;
  return rows.map((r) => r.title as string);
}

// ── 다음 발행할 주제 결정 ─────────────────────────
// 2026-10-14 건강 전용 전환(디자인 기획서): 재테크(money)·일상(life) 주제는 더 이상 발행하지 않는다.
// 건강 주제 중, 직전 2편과 다른 사이트 카테고리(sub)를 우선 골라 다이어트·혈당·식단·운동·정보·리뷰를 고르게 돌린다.
async function getNextTopic(): Promise<Topic | null> {
  const rows = await sql`SELECT slug FROM posts WHERE slug ~ '^(money|health|life|hx)-[0-9]+$'`;
  const existingSlugs = new Set(rows.map((r) => r.slug as string));
  const unused = allTopics.filter((t) => t.category === "health" && t.sub && !existingSlugs.has(t.slug));
  if (unused.length === 0) return null;

  const recent = await sql`SELECT category FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 2`;
  const recentCats = new Set(recent.map((r) => r.category as string));
  const pick = unused.find((t) => !recentCats.has(t.sub!)) ?? unused[0];
  writeLog(`📅 건강 카테고리: ${pick.sub} (남은 건강 주제 ${unused.length}개)`);
  return pick;
}

// ── 프롬프트 생성 ──────────────────────────────────
function buildPrompt(topic: Topic, recentTitles: string[] = []): string {
  const avoidSection = recentTitles.length > 0
    ? `[최근 발행된 글 — 다른 각도로 작성할 것]\n아래 글들과 핵심 사례·설명 방식이 겹치지 않도록 새로운 관점으로 접근해주세요:\n${recentTitles.map(t => `- ${t}`).join('\n')}\n\n`
    : '';
  if (topic.category === "money") {
    return avoidSection + `당신은 "단단한 50" 블로그의 운영자입니다. 50대 직장인 선배가 후배에게 알려주는 말투로 글을 씁니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
분류: ${topic.level}

[작성 규칙]
1. 타겟 독자: 40~60대 직장인·자영업자, 돈과 몸을 함께 챙기고 싶은 분들
2. 이론보다 실전 경험 중심, 어렵지 않게 핵심은 명확하게
3. 반드시 존댓말만 사용. 반말 절대 금지
4. "여러분", "독자님", "친구" 등 직접 호칭 절대 사용 금지
5. 글의 첫 문장은 공감·의문형으로 시작 (과장·공포 조성 금지)
   금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다"
6. 3000자 내외
7. 표와 목록을 최대한 활용 — 숫자 비교는 반드시 표로
8. H2 섹션 3개 이상 작성
9. 글 마지막에 "💡 핵심 정리" 섹션 필수 포함
   <h2>💡 핵심 정리</h2>
   <ul><li>요약1</li><li>요약2</li><li>요약3</li></ul>
10. FAQ 3개 포함 (<h3>Q. ...</h3><p>A. ...</p>)
11. 투자 권유·수익 보장 금지 — "지금 사야 한다", "무조건 오른다", 특정 종목 매수 권유 표현을 쓰지 않는다. 수익률은 과거 수치임을 밝힌다

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지
- <strong>은 핵심 용어·수치에만 최소 사용 (문장 전체를 감싸거나 연속 사용 금지)
- 인라인 style 속성 절대 사용 금지`;
  }

  if (topic.category === "health") {
    return avoidSection + `당신은 "단단한 50" 블로그의 운영자입니다. 50대 직장인 선배가 후배에게 건강 정보를 알려주는 말투로 글을 씁니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
분류: ${topic.level}

[작성 규칙]
1. 타겟 독자: 40~60대 직장인·자영업자, 몸 관리에 관심이 생긴 분들
2. 과학적 근거를 바탕으로 하되, 현실에서 바로 실천할 수 있는 내용 중심
3. 반드시 존댓말만 사용. 반말 절대 금지
4. "여러분", "독자님", "친구" 등 직접 호칭 절대 사용 금지
5. 글의 첫 문장은 공감·의문형으로 시작 (과장·공포 조성 금지)
   금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다"
6. 3000자 내외
7. 표와 목록을 최대한 활용 — 수치 비교는 반드시 표로
8. H2 섹션 3개 이상 작성
9. 글 마지막에 "💡 핵심 정리" 섹션 필수 포함
   <h2>💡 핵심 정리</h2>
   <ul><li>요약1</li><li>요약2</li><li>요약3</li></ul>
10. FAQ 3개 포함 (<h3>Q. ...</h3><p>A. ...</p>)
11. 식품표시광고법 준수 — 효과·효능을 단정하지 않는다
   식품·식단·영양제에 치료·예방·완치·처방·특효 효능을 붙이지 않는다 (운동·생활습관·검진의 일반적 예방 정보는 가능)
   금지 표현: "이것만 바꿔도 몸이 달라진다", "확실히 좋아진다", "~만 먹으면"
   허용 표현: "도움이 될 수 있다", "연구에서 ~로 보고됐다", "개인차가 있다"
12. 핵심 정리 바로 위에 "개인 건강 상태에 따라 다를 수 있으니 전문가와 상담하세요" 한 문장을 넣는다${topic.sub === "review" ? `
13. 제품 선택 가이드 글이다 — 직접 써본 사용 후기처럼 쓰지 않는다 ("써봤더니", "제가 사용해 보니" 금지).
    고르는 기준 3~5가지 → 비교표(유형·가격대·장단점) → 이런 분께 맞아요 → 구매 전 체크사항 순서로 쓴다.
    특정 브랜드·모델을 단정 추천하지 않고, 건강 효능을 과장하지 않는다.` : ""}

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지
- <strong>은 핵심 용어·수치에만 최소 사용 (문장 전체를 감싸거나 연속 사용 금지)
- 인라인 style 속성 절대 사용 금지`;
  }

  // life (일상 에세이)
  return avoidSection + `당신은 "단단한 50" 블로그의 운영자입니다. 50대 직장인의 솔직한 일상 이야기를 에세이 형식으로 씁니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}

[작성 규칙]
1. 따뜻하고 진솔한 에세이 형식
2. 재테크와 건강을 함께 챙기려는 50대의 현실적인 이야기
3. 존댓말 사용, 반말 금지
4. 2000자 내외
5. H2 섹션 2~3개

[출력 형식]
- 순수 HTML만 출력
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <strong> <blockquote>
- <h1> 사용 금지
- <strong>은 핵심 용어·수치에만 최소 사용 (문장 전체를 감싸거나 연속 사용 금지)
- 인라인 style 속성 절대 사용 금지`;
}

// ── HTML 정리 ──────────────────────────────────────
function cleanHtml(raw: string): string {
  return raw
    .replace(/```html\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,6}\s+(.+)$/gm, "<p>$1</p>")
    .replace(/<i\b[^>]*class="[^"]*(?:material-icons|fa|fas|far|fab)[^"]*"[^>]*>.*?<\/i>/gi, "")
    .replace(/<span\b[^>]*class="[^"]*(?:material-icons|material-symbols)[^"]*"[^>]*>.*?<\/span>/gi, "")
    .replace(/<i\b[^>]*>([a-z_]{3,30})<\/i>/gi, "")
    .trim();
}

// 검수관 게이트(2026-10-14): 워크플로가 POST_STATUS=draft로 저장하면 컨트롤타워 검수관이 검수 후 공개한다. 로컬 수동 실행은 바로 공개.
const POST_STATUS = process.env.POST_STATUS === "draft" ? "draft" : "published";

// ── DB에 글 저장 ───────────────────────────────────
async function savePost(topic: Topic, content: string, thumbnailUrl: string | null): Promise<number> {
  const publishedAt = new Date().toISOString();

  const [result] = await sql`
    INSERT INTO posts
      (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
    VALUES (${topic.title}, ${content}, ${topic.slug}, ${topic.sub ?? topic.category}, ${thumbnailUrl}, ${topic.meta_description}, ${topic.keywords}, ${POST_STATUS}, ${publishedAt})
    RETURNING id
  `;
  return result.id as number;
}

// ── 로그 파일 기록 ─────────────────────────────────
function writeLog(message: string): void {
  const logPath = path.resolve(process.cwd(), "scripts/generate.log");
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, line, "utf-8");
  console.log(message);
}

// ── 메인 실행 ──────────────────────────────────────
async function main() {
  writeLog("=== 단단한 50 글 자동 생성 시작 ===");

  try {
    const topic = await getNextTopic();

    if (!topic) {
      writeLog("✅ 모든 주제(130개)가 발행 완료됐습니다!");
      return;
    }

    writeLog(`📝 주제 선택: [${topic.level}] ${topic.index}/${allTopics.length} - ${topic.title}`);

    writeLog("🤖 Claude로 글 생성 중...");
    const recentTitles = await getRecentTitles(7);
    const prompt = buildPrompt(topic, recentTitles);
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    const rawContent = (message.content[0] as { type: string; text: string }).text;
    const content = cleanHtml(rawContent);
    writeLog(`✍️  생성 완료 (${content.length}자)`);

    writeLog("🖼️  Unsplash 이미지 가져오는 중...");
    const usedIds = await getUsedImageIds();
    const allImages = await fetchUnsplashImages(topic.category, 3, usedIds, topic.sub);
    const thumbnail = allImages[0] ?? null;
    const inlineImages = allImages.slice(1, 3);

    const finalContent = injectContent(content, inlineImages, topic.category);
    if (thumbnail) writeLog(`🖼️  썸네일: ${thumbnail.url}`);

    // 이미지 없이 발행 방지: 썸네일과 본문 이미지가 모두 있어야 발행한다.
    // 이미지 수집 실패(레이트리밋/키 문제) 시 slug를 소비하지 않고 중단 → 다음 실행 때 재시도.
    if (!thumbnail || !/<img\s/i.test(finalContent)) {
      writeLog("❌ 이미지 없이 발행 방지 — 썸네일 또는 본문 이미지가 없어 발행을 중단합니다 (이미지 API 레이트리밋/키 점검 필요).");
      process.exit(1);
    }

    const postId = await savePost(topic, finalContent, thumbnail?.url ?? null);
    writeLog(`💾 DB 저장 완료 (id: ${postId}, slug: ${topic.slug})`);
    writeLog(`🌐 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/posts/${topic.slug}`);
    writeLog("=== 완료 ===\n");

  } catch (error) {
    writeLog(`❌ 오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
