import Link from "next/link";
import sql from "@/lib/db";
import { CATEGORIES, HEALTH_KEYS, HERO_IMAGE } from "@/lib/categories";
import Icon from "@/components/Icon";
import PostGrid, { PostCardItem, CardPost } from "@/components/PostGrid";
import Subscribe from "@/components/Subscribe";

// 메인페이지 — 디자인 기획서 §3 권장 순서:
// 헤더 → 대표 배너 → 카테고리 → 인기 글 → 최신 글 → 추천 가이드 → 제품 리뷰 → 구독 → 푸터
export const revalidate = 600;

export default async function HomePage() {
  const keys = HEALTH_KEYS as string[];
  const [popular, latest, reviews, counts] = await Promise.all([
    sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
        WHERE status = 'published' AND category = ANY(${keys}) ORDER BY view_count DESC, published_at DESC LIMIT 3`,
    sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
        WHERE status = 'published' AND category = ANY(${keys}) ORDER BY published_at DESC LIMIT 9`,
    sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
        WHERE status = 'published' AND category = 'review' ORDER BY published_at DESC LIMIT 3`,
    sql`SELECT category, COUNT(*)::int AS n FROM posts WHERE status = 'published' GROUP BY category`,
  ]);
  const countOf = Object.fromEntries(counts.map((r) => [r.category, r.n]));
  const popularIds = new Set(popular.map((p) => p.id));
  const latestRest = (latest as CardPost[]).filter((p) => !popularIds.has(p.id)).slice(0, 6);

  const guides = [
    { key: "meal", title: "건강 식단표", desc: "한 주 식단을 짜는 법부터 장보기 목록까지, 바로 따라 할 수 있게." },
    { key: "exercise", title: "운동 루틴", desc: "걷기·근력·스트레칭을 관절에 무리 없이 꾸준히 하는 순서." },
    { key: "info", title: "생활습관 안내", desc: "수면, 스트레스, 검진까지 중년 건강의 기본기를 챙깁니다." },
  ];
  const catIcon = (k: string) => CATEGORIES.find((c) => c.key === k)!.icon;

  return (
    <>
      {/* ── 대표 배너 (§3.2) ── */}
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMAGE} alt="개나리가 핀 언덕길을 걷는 사람들" />
        <div className="wrap" style={{ width: "100%" }}>
          <div className="hero-inner">
            <span className="hero-eyebrow">중년 건강 매거진 · 단단한50</span>
            <h1>50부터 시작하는<br />건강한 변화</h1>
            <p>무리한 다이어트보다 지속 가능한 습관으로, 오늘보다 더 건강한 내일을 만듭니다.</p>
            <Link href="#guides" className="btn btn-primary">건강 가이드 살펴보기 →</Link>
          </div>
        </div>
      </section>

      {/* ── 카테고리 바로가기 (§3.3) ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="section-title">주제별로 찾아보기</h2>
              <p className="section-sub">관심 있는 건강 주제를 골라 보세요</p>
            </div>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.key} href={`/category/${c.key}`} className="cat-card">
                <span className="cat-icon"><Icon d={c.icon} /></span>
                <span className="cat-name">{c.label}</span>
                <span className="cat-count">글 {countOf[c.key] || 0}편</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 인기 글 TOP 3 (§3.4) ── */}
      {popular.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2 className="section-title">많이 읽은 글</h2>
                <p className="section-sub">독자들이 가장 많이 찾은 건강 정보</p>
              </div>
            </div>
            <div className="top-grid">
              {(popular as CardPost[]).map((p, i) => <PostCardItem key={p.id} post={p} rank={i + 1} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── 최신 글 ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="section-title">새로 올라온 글</h2>
              <p className="section-sub">월·수·토요일에 새 글이 올라옵니다</p>
            </div>
            <Link href="/search" className="more-link">전체 글 보기 →</Link>
          </div>
          <PostGrid posts={latestRest} />
        </div>
      </section>

      {/* ── 추천 가이드 (§3.5) ── */}
      <section className="section band" id="guides">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="section-title">단단한 건강 가이드</h2>
              <p className="section-sub">식단·운동·생활습관, 기본부터 차근차근</p>
            </div>
          </div>
          <div className="guide-grid">
            {guides.map((g) => (
              <Link key={g.key} href={`/category/${g.key}`} className="guide-card">
                <span className="cat-icon"><Icon d={catIcon(g.key)} size={26} /></span>
                <span>
                  <h3>{g.title}</h3>
                  <p>{g.desc}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 제품 리뷰 (§3.5) — 제휴 표시 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="section-title">제품 리뷰 · 선택 가이드</h2>
              <p className="section-sub">주방 저울, 운동용품, 측정기 — 고르는 기준을 정리합니다</p>
            </div>
            <span className="ad-note">제휴 링크 포함 · 구매 시 수수료를 받을 수 있어요</span>
          </div>
          {reviews.length ? (
            <PostGrid posts={reviews as CardPost[]} />
          ) : (
            <div className="empty">제품 선택 가이드를 준비하고 있습니다. 곧 첫 글이 올라옵니다.</div>
          )}
        </div>
      </section>

      {/* ── 구독 (§3.6) ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Subscribe />
        </div>
      </section>
    </>
  );
}
