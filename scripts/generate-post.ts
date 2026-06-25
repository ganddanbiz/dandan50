/**
 * 단단한 50 — AI 블로그 자동 글 생성 스크립트
 * 사용법: npm run generate
 *
 * 발행 규칙:
 *   - 월·수·금·일 → money (재테크)
 *   - 화·목·토   → health (건강)
 *   - 재테크:건강 = 6:4 비율 유지
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from "@neondatabase/serverless";
import { allTopics, Topic } from "../src/lib/topics";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

// ── Gemini 클라이언트 ─────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY가 .env.local에 설정되어 있지 않습니다.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ── 카테고리 → Unsplash 검색어 맵 ─────────────────
const CATEGORY_QUERY: Record<string, string> = {
  money: "finance investment planning retirement Korean office people",
  health: "health fitness exercise lifestyle middle aged Korean people",
  life:   "Korean lifestyle daily routine office worker people",
};

// ── 쿠팡 파트너스 배너 HTML ────────────────────────
const COUPANG_BANNER = `
<div style="margin:2.5em 0;padding:1.25em 1em;background:linear-gradient(135deg,#fff8f0 0%,#fff3e6 100%);border-radius:8px;border:1px solid #f5c97a;">
  <p style="font-size:0.78rem;color:#b45309;margin:0 0 0.75em 0;font-weight:600;">이 글과 함께 도움이 될 상품</p>
  <script src="https://ads-partners.coupang.com/g.js"></script>
  <script>
    new PartnersCoupang.G({id: 970543, trackingCode: "AF9787280", subId: null, template: "carousel", width: "100%", height: "140"});
  </script>
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
async function fetchUnsplashImages(category: string, count: number, usedIds: Set<string> = new Set()): Promise<UnsplashResult[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    writeLog("⚠️  UNSPLASH_ACCESS_KEY 미설정 — 이미지 없이 진행");
    return [];
  }

  const query = CATEGORY_QUERY[category] ?? "lifestyle people";

  try {
    const results: UnsplashResult[] = [];
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

    if (!results.length) writeLog("⚠️  Unsplash 미사용 이미지 없음 — 이미지 없이 진행");
    return results;
  } catch (err) {
    writeLog(`⚠️  Unsplash fetch 실패: ${err instanceof Error ? err.message : String(err)} — 이미지 없이 진행`);
    return [];
  }
}

// ── 이미지 + 쿠팡 배너 + 면책문구 삽입 ───────────
function injectContent(html: string, images: UnsplashResult[], category: string): string {
  const DELIMITER = "</h2>";
  const parts = html.split(DELIMITER);

  // h2[1] 뒤 → 인라인 이미지 1
  if (parts.length > 1 && images[0]) {
    parts[1] = parts[1] + buildImgFigure(images[0]);
  }

  // h2[2] 뒤 → 쿠팡 파트너스 배너
  if (parts.length > 2) {
    parts[2] = parts[2] + COUPANG_BANNER;
  }

  // h2[3] 뒤 → 인라인 이미지 2
  if (parts.length > 3 && images[1]) {
    parts[3] = parts[3] + buildImgFigure(images[1]);
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

// ── 오늘 발행할 카테고리 결정 (KST 요일 기준) ────
function getTodayCategory(): "money" | "health" {
  const now = new Date();
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dayOfWeek = kstDate.getUTCDay(); // 0=일 1=월 2=화 3=수 4=목 5=금 6=토

  // 월(1)·수(3)·금(5)·일(0) → money / 화(2)·목(4)·토(6) → health
  return (dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5)
    ? "money"
    : "health";
}

// ── 다음 발행할 주제 결정 ─────────────────────────
async function getNextTopic(): Promise<Topic | null> {
  const rows = await sql`SELECT slug FROM posts WHERE slug ~ '^(money|health|life)-[0-9]+$'`;
  const existingSlugs = new Set(rows.map((r) => r.slug as string));

  const targetCategory = getTodayCategory();
  const categoryLabel = targetCategory === "money" ? "재테크" : "건강";
  writeLog(`📅 오늘 카테고리: ${categoryLabel} (${["일","월","화","수","목","금","토"][new Date(Date.now() + 9*3600000).getUTCDay()]}요일)`);

  // 오늘 카테고리에서 순서대로 탐색
  for (const topic of allTopics) {
    if (topic.category === targetCategory && !existingSlugs.has(topic.slug)) {
      return topic;
    }
  }

  // 오늘 카테고리 소진 → 나머지 카테고리(life 포함)에서 탐색
  writeLog(`⚠️  ${categoryLabel} 카테고리 소진 — 남은 주제에서 발행`);
  for (const topic of allTopics) {
    if (!existingSlugs.has(topic.slug)) {
      return topic;
    }
  }

  return null;
}

// ── 프롬프트 생성 ──────────────────────────────────
function buildPrompt(topic: Topic): string {
  if (topic.category === "money") {
    return `당신은 "단단한 50" 블로그의 운영자입니다. 50대 직장인 선배가 후배에게 알려주는 말투로 글을 씁니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
분류: ${topic.level}

[작성 규칙]
1. 타겟 독자: 40~60대 직장인·자영업자, 돈과 몸을 함께 챙기고 싶은 분들
2. 이론보다 실전 경험 중심, 어렵지 않게 핵심은 명확하게
3. 반드시 존댓말만 사용. 반말 절대 금지
4. "여러분", "독자님", "친구" 등 직접 호칭 절대 사용 금지
5. 글의 첫 문장은 반드시 강한 후킹으로 시작 (의문형·충격적 사실·공감 유발)
   금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다"
6. 3000자 내외
7. 표와 목록을 최대한 활용 — 숫자 비교는 반드시 표로
8. H2 섹션 3개 이상 작성
9. 글 마지막에 "💡 핵심 정리" 섹션 필수 포함
   <h2>💡 핵심 정리</h2>
   <ul><li>요약1</li><li>요약2</li><li>요약3</li></ul>
10. FAQ 3개 포함 (<h3>Q. ...</h3><p>A. ...</p>)

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지`;
  }

  if (topic.category === "health") {
    return `당신은 "단단한 50" 블로그의 운영자입니다. 50대 직장인 선배가 후배에게 건강 정보를 알려주는 말투로 글을 씁니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
분류: ${topic.level}

[작성 규칙]
1. 타겟 독자: 40~60대 직장인·자영업자, 몸 관리에 관심이 생긴 분들
2. 과학적 근거를 바탕으로 하되, 현실에서 바로 실천할 수 있는 내용 중심
3. 반드시 존댓말만 사용. 반말 절대 금지
4. "여러분", "독자님", "친구" 등 직접 호칭 절대 사용 금지
5. 글의 첫 문장은 반드시 강한 후킹으로 시작 (의문형·충격적 사실·공감 유발)
   금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다"
6. 3000자 내외
7. 표와 목록을 최대한 활용 — 수치 비교는 반드시 표로
8. H2 섹션 3개 이상 작성
9. 글 마지막에 "💡 핵심 정리" 섹션 필수 포함
   <h2>💡 핵심 정리</h2>
   <ul><li>요약1</li><li>요약2</li><li>요약3</li></ul>
10. FAQ 3개 포함 (<h3>Q. ...</h3><p>A. ...</p>)

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지`;
  }

  // life (일상 에세이)
  return `당신은 "단단한 50" 블로그의 운영자입니다. 50대 직장인의 솔직한 일상 이야기를 에세이 형식으로 씁니다.

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
- <h1> 사용 금지`;
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

// ── DB에 글 저장 ───────────────────────────────────
async function savePost(topic: Topic, content: string, thumbnailUrl: string | null): Promise<number> {
  const publishedAt = new Date().toISOString();

  const [result] = await sql`
    INSERT INTO posts
      (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
    VALUES (${topic.title}, ${content}, ${topic.slug}, ${topic.category}, ${thumbnailUrl}, ${topic.meta_description}, ${topic.keywords}, 'published', ${publishedAt})
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

    writeLog(`📝 주제 선택: [${topic.level}] ${topic.index}/130 - ${topic.title}`);

    writeLog("🤖 Gemini로 글 생성 중...");
    const prompt = buildPrompt(topic);
    const result = await model.generateContent(prompt);
    const rawContent = result.response.text();
    const content = cleanHtml(rawContent);
    writeLog(`✍️  생성 완료 (${content.length}자)`);

    writeLog("🖼️  Unsplash 이미지 가져오는 중...");
    const usedIds = await getUsedImageIds();
    const allImages = await fetchUnsplashImages(topic.category, 3, usedIds);
    const thumbnail = allImages[0] ?? null;
    const inlineImages = allImages.slice(1, 3);

    const finalContent = injectContent(content, inlineImages, topic.category);
    if (thumbnail) writeLog(`🖼️  썸네일: ${thumbnail.url}`);

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
