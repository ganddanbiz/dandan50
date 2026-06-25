/**
 * 이미지 없는 글에 Unsplash 이미지 추가 스크립트
 * 사용법: npx tsx scripts/fix-missing-images.ts
 */

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

// 카테고리 기본 검색어 (폴백용)
const CATEGORY_FALLBACK_QUERIES: Record<string, string[]> = {
  before:  ["personal finance planning desk", "savings money coins jar", "budget notebook calculator", "financial planning office"],
  bidding: ["stock market trading charts", "investment portfolio growth", "stock exchange broker"],
  after:   ["asset management wealth", "retirement planning couple", "portfolio diversification"],
  tax:     ["tax return documents", "accountant office calculator", "tax filing paperwork"],
  law:     ["legal contract documents", "lawyer office meeting", "financial compliance"],
  ai:      ["technology AI computer", "fintech digital payment", "machine learning data"],
};

// 한국어 제목 → 영어 키워드 매핑
function titleToKeywords(title: string): string {
  const map: [RegExp, string][] = [
    [/달러|환율|외환/, "dollar currency exchange rate"],
    [/금리|기준금리|이자/, "interest rate bank central"],
    [/인플레이션|물가/, "inflation economy prices"],
    [/GDP|경제 지표|경기/, "economy GDP growth chart"],
    [/주가|주식/, "stock market shares investment"],
    [/ETF|인덱스펀드|펀드/, "ETF index fund investment"],
    [/채권|국채/, "bonds government securities"],
    [/부동산|아파트|청약/, "real estate apartment building"],
    [/세금|연말정산|절세/, "tax return office documents"],
    [/가계부|지출|예산/, "budget planning notebook"],
    [/저축|적금|예금/, "savings bank account piggy"],
    [/자산.?배분|포트폴리오/, "asset allocation portfolio diversification"],
    [/투자.?성향|위험/, "investor personality risk"],
    [/종잣돈|목돈/, "saving money goal milestone"],
    [/배당|수익/, "dividend income investment"],
    [/PER|PBR|ROE|밸류에이션/, "stock valuation analysis"],
    [/가치.?투자/, "value investing strategy"],
    [/섹터|반도체|헬스케어/, "sector industry ETF market"],
    [/AI|인공지능|자동화/, "artificial intelligence technology"],
    [/보험/, "insurance protection family"],
    [/연금/, "pension retirement savings"],
    [/재테크|투자/, "personal finance investment planning"],
  ];
  for (const [pattern, keywords] of map) {
    if (pattern.test(title)) return keywords;
  }
  return "finance money investment people";
}

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

let rateLimitHit = false;

async function unsplashSearch(
  query: string,
  page: number,
  unsplashKey: string
): Promise<Array<{ id: string; urls: { regular: string }; user: { name: string }; links: { html: string } }> | null> {
  if (rateLimitHit) return null;

  await new Promise((r) => setTimeout(r, 300));

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "30");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${unsplashKey}` },
  });

  if (res.status === 403 || res.status === 429) {
    console.log(`  ⚠️  Unsplash 레이트 리밋 (${res.status}) — 스크립트 중단. 1시간 후 재실행하세요.`);
    rateLimitHit = true;
    return null;
  }

  if (!res.ok) {
    console.log(`  ⚠️  Unsplash API 오류 (${res.status})`);
    return null;
  }

  const data = await res.json() as {
    results: Array<{ id: string; urls: { regular: string }; user: { name: string }; links: { html: string } }>;
  };
  return data.results ?? [];
}

async function fetchUnsplashImages(
  category: string,
  title: string,
  count: number,
  usedIds: Set<string>
): Promise<UnsplashResult[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    console.log("⚠️  UNSPLASH_ACCESS_KEY 미설정");
    return [];
  }

  const results: UnsplashResult[] = [];

  // 1순위: 제목 기반 키워드 (가장 구체적 → API 호출 최소화)
  const titleQuery = titleToKeywords(title);
  // 2순위: 카테고리 폴백 쿼리들
  const fallbackQueries = CATEGORY_FALLBACK_QUERIES[category] ?? ["finance investment people"];
  const allQueries = [titleQuery, ...fallbackQueries];

  for (const query of allQueries) {
    if (results.length >= count || rateLimitHit) break;

    for (let page = 1; page <= 2; page++) {
      if (results.length >= count || rateLimitHit) break;

      const photos = await unsplashSearch(query, page, unsplashKey);
      if (!photos || photos.length === 0) break;

      for (const photo of photos) {
        const baseUrl = photo.urls.regular.split("?")[0];
        if (usedIds.has(baseUrl)) continue;
        usedIds.add(baseUrl);
        results.push({
          url: photo.urls.regular,
          attribution: `<a href="${photo.links.html}?utm_source=jaetechstory&utm_medium=referral" rel="noopener noreferrer" style="color:rgba(255,255,255,0.9);">${photo.user.name}</a> / Unsplash`,
        });
        if (results.length >= count) break;
      }
    }
  }

  return results;
}

function injectImagesIntoContent(html: string, images: UnsplashResult[]): string {
  if (!images.length) return html;

  const DELIMITER = "</h2>";
  const parts = html.split(DELIMITER);

  const targets: Array<[number, number]> = [
    [1, 0],
    [3, 1],
  ];

  for (const [partIdx, imgIdx] of targets) {
    if (partIdx >= parts.length || !images[imgIdx]) continue;

    const img = images[imgIdx];
    const figure = [
      `<figure style="margin:1.75em 0;position:relative;display:block;">`,
      `<img src="${img.url}" alt="관련 이미지" loading="lazy"`,
      ` style="width:100%;height:auto;border-radius:10px;border:1px solid var(--border);display:block;" />`,
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

async function main() {
  console.log("=== 이미지 없는 글 수정 시작 ===\n");

  // 이미지 없는 글 조회
  const rows = await sql`
    SELECT id, title, slug, category, thumbnail_url, content
    FROM posts
    WHERE status = 'published'
    ORDER BY published_at ASC
  `;

  const postsNeedingFix = rows.filter((r) => {
    const noThumb = !r.thumbnail_url;
    const noInline = !(r.content as string).includes("images.unsplash.com");
    return noThumb || noInline;
  });

  console.log(`전체 글: ${rows.length}개`);
  console.log(`수정 필요 글: ${postsNeedingFix.length}개\n`);

  if (postsNeedingFix.length === 0) {
    console.log("✅ 모든 글에 이미지가 있습니다!");
    return;
  }

  // 사용된 이미지 ID 수집 (중복 방지)
  const usedIds = await getUsedImageIds();
  console.log(`기존 사용 이미지: ${usedIds.size}개\n`);

  let fixed = 0;
  let failed = 0;

  for (const post of postsNeedingFix) {
    const noThumb = !post.thumbnail_url;
    const noInline = !(post.content as string).includes("images.unsplash.com");

    console.log(`\n[${fixed + failed + 1}/${postsNeedingFix.length}] ${post.slug} (${post.category})`);
    console.log(`  - 썸네일 없음: ${noThumb}, 본문 이미지 없음: ${noInline}`);

    // 필요한 이미지 수: 썸네일 + 본문 2장 (없는 것만)
    const neededCount = (noThumb ? 1 : 0) + (noInline ? 2 : 0);

    const images = await fetchUnsplashImages(post.category as string, post.title as string, neededCount, usedIds);
    if (rateLimitHit) {
      console.log("\n레이트 리밋으로 중단됨. 1시간 후 재실행하세요.");
      break;
    }

    if (images.length === 0) {
      console.log("  ⚠️  이미지를 가져오지 못했습니다. 건너뜁니다.");
      failed++;
      continue;
    }

    let imageIdx = 0;
    let newThumbnail = post.thumbnail_url as string | null;
    let newContent = post.content as string;

    if (noThumb && images[imageIdx]) {
      newThumbnail = images[imageIdx].url;
      console.log(`  🖼️  썸네일 설정: ${newThumbnail}`);
      imageIdx++;
    }

    if (noInline) {
      const inlineImages = images.slice(imageIdx, imageIdx + 2);
      if (inlineImages.length > 0) {
        newContent = injectImagesIntoContent(newContent, inlineImages);
        console.log(`  🖼️  본문 이미지 ${inlineImages.length}장 삽입`);
      }
    }

    await sql`
      UPDATE posts
      SET thumbnail_url = ${newThumbnail}, content = ${newContent}
      WHERE id = ${post.id as number}
    `;

    console.log(`  ✅ 완료`);
    fixed++;

    // API 레이트 리밋 방지
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n=== 완료 ===`);
  console.log(`수정 성공: ${fixed}개, 실패: ${failed}개`);
}

main().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
