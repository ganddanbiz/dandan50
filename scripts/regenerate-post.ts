/**
 * 특정 글 재생성 스크립트
 * 사용법: npx tsx scripts/regenerate-post.ts basic-002
 *         npx tsx scripts/regenerate-post.ts basic-002 --new-image
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from "@neondatabase/serverless";
import { allTopics, Topic } from "./topics";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY가 .env.local에 설정되어 있지 않습니다.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const CATEGORY_QUERY: Record<string, string> = {
  before:  "investment planning finance people office",
  bidding: "stock market trading finance people",
  after:   "portfolio management wealth people",
  tax:     "tax planning accounting finance people",
  law:     "financial regulation law people office",
  ai:      "technology AI finance people computer",
};

interface UnsplashResult {
  url: string;
  attribution: string;
}

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

async function fetchUnsplashImages(category: string, count: number, usedIds: Set<string> = new Set()): Promise<UnsplashResult[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    console.log("⚠️  UNSPLASH_ACCESS_KEY 미설정 — 이미지 없이 진행");
    return [];
  }

  const query = CATEGORY_QUERY[category] ?? "finance investment people";

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
        console.log(`⚠️  Unsplash API 오류 (${res.status}) — 이미지 없이 진행`);
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
          attribution: `<a href="${photo.links.html}?utm_source=jaetechstory&utm_medium=referral" rel="noopener noreferrer" style="color:rgba(255,255,255,0.9);">${photo.user.name}</a> / Unsplash`,
        });
        if (results.length >= count) break;
      }

      page++;
    }

    if (!results.length) console.log("⚠️  Unsplash 미사용 이미지 없음 — 이미지 없이 진행");
    return results;
  } catch (err) {
    console.log(`⚠️  Unsplash fetch 실패: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

function injectImagesIntoContent(html: string, images: UnsplashResult[]): string {
  if (!images.length) return html;

  const DELIMITER = "</h2>";
  const parts = html.split(DELIMITER);

  const targets: Array<[partIndex: number, imageIndex: number]> = [
    [1, 0],
    [3, 1],
  ];

  for (const [partIdx, imgIdx] of targets) {
    if (partIdx >= parts.length || !images[imgIdx]) continue;

    const img = images[imgIdx];
    const figure = [
      `<figure style="margin:1.75em 0;position:relative;display:block;">`,
      `<img src="${img.url}" alt="관련 이미지" loading="lazy"`,
      ` style="width:100%;max-height:400px;object-fit:cover;border-radius:10px;border:1px solid var(--border);display:block;" />`,
      `<figcaption style="position:absolute;bottom:8px;right:10px;font-size:0.65rem;`,
      `color:rgba(255,255,255,0.85);background:rgba(0,0,0,0.45);`,
      `padding:2px 7px;border-radius:4px;line-height:1.5;white-space:nowrap;">`,
      img.attribution,
      `</figcaption></figure>`,
    ].join("");

    parts[partIdx] = parts[partIdx] + figure;
  }

  return parts.join(DELIMITER);
}

function buildPrompt(topic: Topic): string {
  return `당신은 "재테크스토리" 블로그의 운영자 '재테크아저씨'입니다.

아래 주제로 블로그 글을 작성해주세요.

주제: ${topic.title}
난이도: ${topic.level}
카테고리: ${topic.category}

[작성 규칙]
1. 타겟 독자: 30~50대 직장인, 재테크와 투자로 자산을 불리고 싶은 분들
2. 누구나 이해할 수 있는 쉽고 친근한 말투로 작성
3. 반드시 존댓말만 사용. 반말 절대 금지
4. "여러분", "독자님" 등 호칭 사용 금지
5. 첫 문장은 강한 후킹으로 시작 (인사말 금지)
6. 3000자 내외, 표와 목록을 최대한 활용
7. 글 마지막에 "💡 AI 도구 활용 팁" 섹션 포함

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지`;
}

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

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("❌ slug를 인자로 전달하세요. 예: npx tsx scripts/regenerate-post.ts basic-002");
    process.exit(1);
  }

  const topic = allTopics.find((t) => t.slug === slug);
  if (!topic) {
    console.error(`❌ slug '${slug}'에 해당하는 주제를 찾을 수 없습니다.`);
    process.exit(1);
  }

  const forceNewImage = process.argv.includes("--new-image");

  console.log(`📝 재생성 대상: [${topic.level}] ${topic.title}`);
  console.log("🤖 Gemini로 글 생성 중...");

  const prompt = buildPrompt(topic);
  const result = await model.generateContent(prompt);
  const rawContent = result.response.text();
  const content = cleanHtml(rawContent);
  console.log(`✍️  생성 완료 (${content.length}자)`);

  console.log("🖼️  Unsplash 이미지 가져오는 중...");
  const usedIds = await getUsedImageIds();
  const allImages = await fetchUnsplashImages(topic.category, 3, usedIds);
  const inlineImages = allImages.slice(forceNewImage ? 1 : 0, forceNewImage ? 3 : 2);
  const contentWithImages = injectImagesIntoContent(content, inlineImages);

  if (forceNewImage) {
    const thumbnail = allImages[0] ?? null;
    if (thumbnail) console.log(`🖼️  새 썸네일: ${thumbnail.url}`);
    await sql`UPDATE posts SET content = ${contentWithImages}, thumbnail_url = ${thumbnail?.url ?? null}, updated_at = NOW() WHERE slug = ${slug}`;
  } else {
    await sql`UPDATE posts SET content = ${contentWithImages}, updated_at = NOW() WHERE slug = ${slug}`;
  }

  console.log(`💾 DB 업데이트 완료 (slug: ${slug})`);
  console.log(`🌐 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`);
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
