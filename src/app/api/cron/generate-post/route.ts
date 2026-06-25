import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from "@neondatabase/serverless";
import { allTopics, Topic } from "@/lib/topics";

// 카테고리 폴백 쿼리
const CATEGORY_FALLBACK_QUERIES: Record<string, string[]> = {
  before:  ["personal finance planning desk", "savings money coins jar", "budget notebook calculator", "financial planning office"],
  bidding: ["stock market trading charts", "investment portfolio growth", "stock exchange broker"],
  after:   ["asset management wealth", "retirement planning couple", "portfolio diversification"],
  tax:     ["tax return documents", "accountant office calculator", "tax filing paperwork"],
  law:     ["legal contract documents", "lawyer office meeting", "financial compliance"],
  ai:      ["technology AI computer", "fintech digital payment", "machine learning data"],
};

// 한국어 제목 → 영어 키워드
function titleToKeywords(title: string): string {
  const map: [RegExp, string][] = [
    [/달러|환율|외환/, "dollar currency exchange rate"],
    [/금리|기준금리|이자/, "interest rate bank central"],
    [/인플레이션|물가/, "inflation economy prices"],
    [/GDP|경제 지표|경기/, "economy GDP growth chart"],
    [/레버리지/, "leverage risk trading chart"],
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

async function fetchUnsplashImages(category: string, title: string, count: number, usedIds: Set<string>): Promise<UnsplashResult[]> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) return [];

  const results: UnsplashResult[] = [];
  const titleQuery = titleToKeywords(title);
  const fallbacks = CATEGORY_FALLBACK_QUERIES[category] ?? ["finance investment people"];
  const allQueries = [titleQuery, ...fallbacks];

  for (const query of allQueries) {
    if (results.length >= count) break;

    for (let page = 1; page <= 2; page++) {
      if (results.length >= count) break;

      await new Promise((r) => setTimeout(r, 300));

      const url = new URL("https://api.unsplash.com/search/photos");
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", "30");
      url.searchParams.set("orientation", "landscape");
      url.searchParams.set("page", String(page));

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Client-ID ${unsplashKey}` },
      });
      if (!res.ok) break;

      const data = await res.json() as {
        results: Array<{ id: string; urls: { regular: string }; user: { name: string }; links: { html: string } }>;
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
    }
  }
  return results;
}

function injectImagesIntoContent(html: string, images: UnsplashResult[]): string {
  if (!images.length) return html;
  const DELIMITER = "</h2>";
  const parts = html.split(DELIMITER);
  const targets: [number, number][] = [[1, 0], [3, 1]];

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
4. "여러분", "독자님", "친구" 등 독자를 직접 부르는 호칭 절대 사용 금지
5. 글의 첫 문장은 반드시 강한 후킹으로 시작
   (의문형·충격적 사실·공감 유발 문장 중 하나)
   나쁜 예: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다" 금지
6. 3000자 내외
7. 표와 목록을 최대한 활용
8. 숫자로 설명 가능한 내용은 반드시 표로 제시
9. 글 마지막에 "💡 AI 도구 활용 팁" 섹션 필수 포함
   (AI 도구명 언급 금지, "AI 도구"라고만 표기, 실용 프롬프트 예시 1~2개)

[출력 형식]
- 순수 HTML만 출력 (마크다운 기호 절대 사용 금지)
- 사용 태그: <h2> <h3> <p> <ul> <ol> <li> <table> <thead> <tbody> <tr> <th> <td> <strong> <blockquote>
- <h1> 사용 금지

[AI 도구 활용 팁 HTML 형식]
<h2>💡 AI 도구 활용 팁</h2>
<p>...</p>
<ul><li>...</li></ul>
<blockquote>프롬프트 예시: "..."</blockquote>`;
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

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // 다음 발행할 주제 결정
    const publishedSlugs = await sql`SELECT slug FROM posts WHERE slug ~ '^(basic|mid|adv)-[0-9]+$'`;
    const existingSlugs = new Set(publishedSlugs.map((r) => r.slug as string));
    const topic = allTopics.find((t) => !existingSlugs.has(t.slug)) ?? null;

    if (!topic) {
      return NextResponse.json({ message: "모든 주제 발행 완료 (130개)" });
    }

    // Gemini로 글 생성
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const geminiResult = await model.generateContent(buildPrompt(topic));
    const content = cleanHtml(geminiResult.response.text());

    // 중복 이미지 제외하고 Unsplash 이미지 가져오기
    const usedRows = await sql`SELECT thumbnail_url, content FROM posts WHERE status = 'published'`;
    const usedIds = new Set<string>();
    const inlineRegex = /src="(https:\/\/images\.unsplash\.com\/[^"?]+)/g;
    for (const row of usedRows) {
      if (row.thumbnail_url) usedIds.add((row.thumbnail_url as string).split("?")[0]);
      let m;
      while ((m = inlineRegex.exec(row.content as string)) !== null) usedIds.add(m[1]);
      inlineRegex.lastIndex = 0;
    }

    const allImages = await fetchUnsplashImages(topic.category, topic.title, 3, usedIds);
    const thumbnail = allImages[0] ?? null;
    const contentWithImages = injectImagesIntoContent(content, allImages.slice(1, 3));

    // DB 저장
    const publishedAt = new Date().toISOString();
    const inserted = await sql`
      INSERT INTO posts
        (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
      VALUES (
        ${topic.title}, ${contentWithImages}, ${topic.slug}, ${topic.category},
        ${thumbnail?.url ?? null}, ${topic.meta_description}, ${topic.keywords},
        'published', ${publishedAt}
      )
      RETURNING id
    `;

    return NextResponse.json({
      ok: true,
      postId: inserted[0].id,
      slug: topic.slug,
      title: topic.title,
    });

  } catch (error) {
    console.error("[cron] generate-post error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
