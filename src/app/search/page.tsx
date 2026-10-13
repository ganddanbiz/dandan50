import Link from "next/link";
import type { Metadata } from "next";
import sql from "@/lib/db";
import { CATEGORIES, HEALTH_KEYS } from "@/lib/categories";
import PostGrid, { CardPost } from "@/components/PostGrid";

export const metadata: Metadata = { title: "검색", robots: { index: false } };
const PER_PAGE = 12;

type Props = { searchParams: Promise<{ q?: string; cat?: string; page?: string }> };

// 검색·주제 필터 — 기획서 §5 권장. 검색어 없으면 전체 건강 글 목록
export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().slice(0, 50);
  const cat = CATEGORIES.some((c) => c.key === sp.cat) ? sp.cat! : null;
  const page = Math.max(1, Number(sp.page) || 1);
  const keys = cat ? [cat] : (HEALTH_KEYS as string[]);
  const like = `%${q}%`;

  const [rows, total] = await Promise.all([
    sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
        WHERE status = 'published' AND category = ANY(${keys})
          AND (${q} = '' OR title ILIKE ${like} OR meta_description ILIKE ${like} OR keywords ILIKE ${like})
        ORDER BY published_at DESC LIMIT ${PER_PAGE} OFFSET ${(page - 1) * PER_PAGE}`,
    sql`SELECT COUNT(*)::int AS n FROM posts
        WHERE status = 'published' AND category = ANY(${keys})
          AND (${q} = '' OR title ILIKE ${like} OR meta_description ILIKE ${like} OR keywords ILIKE ${like})`,
  ]);
  const pages = Math.ceil(total[0].n / PER_PAGE);
  const href = (o: { cat?: string | null; page?: number }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    const c = o.cat === undefined ? cat : o.cat;
    if (c) p.set("cat", c);
    if (o.page && o.page > 1) p.set("page", String(o.page));
    return `/search${p.toString() ? `?${p}` : ""}`;
  };

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{q ? `‘${q}’ 검색 결과` : "전체 글"}</h1>
        <form className="search-form" action="/search" role="search" style={{ marginTop: "1.25rem", maxWidth: "36rem" }}>
          <label htmlFor="sq" className="sr-only">검색어</label>
          <input id="sq" name="q" type="search" defaultValue={q} placeholder="예: 단백질, 걷기, 혈당" />
          {cat && <input type="hidden" name="cat" value={cat} />}
          <button className="btn btn-primary" type="submit">검색</button>
        </form>
        <div className="subtopics">
          <Link href={href({ cat: null })} className={cat ? "" : "chip"} style={{ textDecoration: "none" }}>전체</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={href({ cat: c.key })} className={cat === c.key ? "chip" : ""}
              style={{ textDecoration: "none", color: "var(--ink-mid)", padding: "0.35rem 0.9rem", border: "1px solid var(--border)", borderRadius: 999, background: "#fff" }}>
              {c.label}
            </Link>
          ))}
        </div>
        <p className="section-sub" style={{ marginTop: "1rem" }}>{total[0].n}편</p>
      </div>
      <div style={{ paddingBottom: "3.5rem" }}>
        <PostGrid posts={rows as CardPost[]} />
        {pages > 1 && (
          <nav className="pager" aria-label="페이지">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
              n === page ? <span key={n} className="on">{n}</span> : <Link key={n} href={href({ page: n })}>{n}</Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
