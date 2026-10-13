import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import sql from "@/lib/db";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import Icon from "@/components/Icon";
import PostGrid, { PostCardItem, CardPost } from "@/components/PostGrid";

// 카테고리 페이지 — 기획서 §5: 대표 소개 + 인기 글 3개 + 최신 글 목록
export const revalidate = 600;
const PER_PAGE = 9;

type Props = { params: Promise<{ key: string }>; searchParams: Promise<{ page?: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ key: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const c = CATEGORY_MAP[key];
  if (!c) return { title: "카테고리를 찾을 수 없습니다" };
  return { title: `${c.label} — 50대 건강 정보`, description: c.intro, alternates: { canonical: `/category/${key}` } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { key } = await params;
  const c = CATEGORY_MAP[key];
  if (!c) notFound();
  const page = Math.max(1, Number((await searchParams).page) || 1);

  const [popular, rows, total] = await Promise.all([
    sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
        WHERE status = 'published' AND category = ${key} ORDER BY view_count DESC LIMIT 3`,
    sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
        WHERE status = 'published' AND category = ${key} ORDER BY published_at DESC
        LIMIT ${PER_PAGE} OFFSET ${(page - 1) * PER_PAGE}`,
    sql`SELECT COUNT(*)::int AS n FROM posts WHERE status = 'published' AND category = ${key}`,
  ]);
  const pages = Math.ceil(total[0].n / PER_PAGE);

  return (
    <>
      <section className="cat-hero">
        <div className="wrap">
          <nav className="crumb" aria-label="이동 경로"><Link href="/">홈</Link> › <span>{c.label}</span></nav>
          <div style={{ marginTop: "1.25rem" }}>
            <span className="cat-icon"><Icon d={c.icon} size={30} /></span>
            <h1>{c.label}</h1>
            <p>{c.intro}</p>
            <div className="subtopics">{c.subtopics.map((s) => <span key={s}>{s}</span>)}</div>
          </div>
        </div>
      </section>

      {page === 1 && popular.length >= 3 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="section-head"><h2 className="section-title">{c.label} 인기 글</h2></div>
            <div className="top-grid">
              {(popular as CardPost[]).map((p, i) => <PostCardItem key={p.id} post={p} rank={i + 1} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">최신 글</h2>
            <span className="section-sub">총 {total[0].n}편</span>
          </div>
          {key === "review" && (
            <p className="ad-note" style={{ marginBottom: "1.25rem" }}>
              이 카테고리의 글에는 쿠팡 파트너스 등 제휴 링크가 포함되며, 구매 시 일정액의 수수료를 받을 수 있습니다.
            </p>
          )}
          <PostGrid posts={rows as CardPost[]} />
          {pages > 1 && (
            <nav className="pager" aria-label="페이지">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
                n === page ? <span key={n} className="on">{n}</span>
                  : <Link key={n} href={`/category/${key}?page=${n}`}>{n}</Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
