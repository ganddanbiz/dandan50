import { Suspense } from "react";
import sql from "@/lib/db";
import PostList from "@/components/PostList";
import PostCard from "@/components/PostCard";
import ViewToggle from "@/components/ViewToggle";
import Pagination from "@/components/Pagination";

const LIMIT = 10;

const categories: { key: string | null; label: string }[] = [
  { key: null,      label: "전체" },
  { key: "money",   label: "단단한 돈" },
  { key: "health",  label: "단단한 몸" },
  { key: "life",    label: "단단한 일상" },
];

type SearchParams = Promise<{
  view?: string;
  page?: string;
  category?: string;
}>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { view = "card", page = "1", category } = await searchParams;

  const currentView = view === "card" ? "card" : "list";
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * LIMIT;

  const countRows = category
    ? await sql`SELECT COUNT(*) as total FROM posts WHERE status = 'published' AND category = ${category}`
    : await sql`SELECT COUNT(*) as total FROM posts WHERE status = 'published'`;
  const total = Number(countRows[0].total);

  const posts = category
    ? await sql`SELECT id, title, slug, category, thumbnail_url, meta_description, content, published_at, view_count FROM posts WHERE status = 'published' AND category = ${category} ORDER BY published_at DESC LIMIT ${LIMIT} OFFSET ${offset}`
    : await sql`SELECT id, title, slug, category, thumbnail_url, meta_description, content, published_at, view_count FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT ${LIMIT} OFFSET ${offset}`;

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── 헤더 ──────────────────────────────────── */}
      <header style={{
        background: "var(--header-bg)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 배경 그라데이션 오브 */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }} />
        <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2.75rem 1.5rem 2.25rem", position: "relative" }}>
          {/* 상단 레이블 */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#60a5fa",
            background: "rgba(37,99,235,0.15)", borderRadius: "999px",
            padding: "0.3em 0.85em", marginBottom: "1.25rem",
            border: "1px solid rgba(96,165,250,0.25)",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#60a5fa", display: "inline-block" }} />
            50대 재테크 · 건강 블로그
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "0.875rem",
            background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {process.env.NEXT_PUBLIC_SITE_NAME || "내 블로그"}
          </h1>

          <p style={{
            fontSize: "0.9375rem",
            color: "var(--header-muted)",
            lineHeight: 1.6,
            maxWidth: "28rem",
          }}>
            50대 직장인 선배가 알려주는 <strong style={{ color: "#e2e8f0", fontWeight: 600 }}>돈과 몸, 둘 다 단단하게</strong> 만드는 재테크 · 건강 인사이트
          </p>

          {/* 하단 구분선 */}
          <div style={{
            marginTop: "2rem",
            height: "1px",
            background: "linear-gradient(90deg, rgba(37,99,235,0.6) 0%, rgba(124,58,237,0.4) 50%, transparent 100%)",
          }} />
        </div>
      </header>

      {/* ── 카테고리 탭 ───────────────────────────── */}
      <div style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "0.625rem 1.5rem" }}>
          <div
            className="scrollbar-hide"
            style={{ display: "flex", gap: "0.25rem", overflowX: "auto", alignItems: "center" }}
          >
            {categories.map(({ key, label }) => {
              const isActive = (!key && !category) || key === category;
              const href = key
                ? `/?view=${currentView}&category=${key}`
                : `/?view=${currentView}`;
              return (
                <a
                  key={key ?? "all"}
                  href={href}
                  className={`cat-tab${isActive ? " active" : ""}`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 메인 콘텐츠 ───────────────────────────── */}
      <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* 뷰 토글 + 글 수 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 0",
        }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
            총{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{total}</strong>
            개의 글
          </span>
          <Suspense>
            <ViewToggle currentView={currentView} />
          </Suspense>
        </div>

        {/* 글 목록 */}
        <div style={{
          background: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          {currentView === "card" ? (
            <div style={{ padding: "1.25rem" }}>
              <PostCard posts={posts as unknown as Partial<import("@/types").Post>[]} />
            </div>
          ) : (
            <PostList posts={posts as unknown as Partial<import("@/types").Post>[]} />
          )}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          view={currentView}
          category={category}
        />
        <div style={{ height: "3rem" }} />
      </main>
    </div>
  );
}
