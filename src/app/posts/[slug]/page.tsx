import { SITE_URL } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import sql from "@/lib/db";
import { Post } from "@/types";
import JsonLd from "@/components/JsonLd";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import CoupangAd from "@/components/CoupangAd";
import { CATEGORY_MAP, HEALTH_KEYS, categoryLabel } from "@/lib/categories";
import { prepareArticle } from "@/lib/content";
import { PostCardItem, CardPost } from "@/components/PostGrid";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} AND status = 'published'`;
  return (rows[0] as Post) || null;
}

async function getLikeCount(postId: number): Promise<number> {
  const rows = await sql`SELECT COUNT(*) as count FROM likes WHERE post_id = ${postId}`;
  return Number(rows[0]?.count) || 0;
}

export async function generateStaticParams() {
  const rows = await sql`SELECT slug FROM posts WHERE status = 'published'`;
  return rows.map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const siteUrl = SITE_URL;
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return {
    title: post.title,
    description: post.meta_description || post.title,
    keywords: post.keywords || undefined,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.title,
      url: `${siteUrl}/posts/${post.slug}`,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      ...(post.thumbnail_url && { images: [{ url: post.thumbnail_url }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description || post.title,
      ...(post.thumbnail_url && { images: [post.thumbnail_url] }),
    },
  };
}

async function getRelated(post: Post): Promise<CardPost[]> {
  const same = await sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
    WHERE status = 'published' AND category = ${post.category} AND id <> ${post.id}
    ORDER BY published_at DESC LIMIT 3`;
  if (same.length >= 3) return same as CardPost[];
  const keys = HEALTH_KEYS as string[];
  const more = await sql`SELECT id, slug, title, category, thumbnail_url, meta_description, published_at FROM posts
    WHERE status = 'published' AND category = ANY(${keys}) AND id <> ${post.id} AND category <> ${post.category}
    ORDER BY view_count DESC LIMIT ${3 - same.length}`;
  return [...same, ...more] as CardPost[];
}

const fmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : null;

// 게시글 페이지 — 디자인 기획서 §4: 이동 경로 → 제목·메타 → 대표 이미지 → 요약 → 목차 → 본문(정보 박스) → 관련 글
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  await sql`UPDATE posts SET view_count = view_count + 1 WHERE id = ${post.id}`;
  const [likeCount, related] = await Promise.all([getLikeCount(post.id), getRelated(post)]);

  const { html, toc, minutes } = prepareArticle(post.content);
  const cat = CATEGORY_MAP[post.category];
  const published = fmt(post.published_at);
  const updated = fmt(post.updated_at);
  const showUpdated = updated && post.published_at &&
    new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 864e5;

  return (
    <>
      <JsonLd post={post} />
      <div className="read-wrap">
        <header className="article-head">
          <nav className="crumb" aria-label="이동 경로">
            <Link href="/">홈</Link> ›
            {cat ? <Link href={`/category/${cat.key}`}>{cat.label}</Link> : <span>{categoryLabel(post.category)}</span>}
          </nav>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span className="author">
              <i aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" fill="#A8BE9B" /></svg></i>
              단단한50 편집팀
            </span>
            {published && <span>게시 {published}</span>}
            {showUpdated && <span>수정 {updated}</span>}
            <span className={post.category === "review" ? "chip chip-peach" : "chip"}>{categoryLabel(post.category)}</span>
            <span>읽는 시간 약 {minutes}분</span>
          </div>
        </header>

        {post.thumbnail_url && (
          <div className="article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.thumbnail_url} alt={post.title} />
          </div>
        )}

        {post.meta_description && (
          <div className="summary-box">
            <strong>이 글의 핵심</strong>
            {post.meta_description}
          </div>
        )}

        {post.category === "review" && (
          <p className="ad-note" style={{ marginBottom: "1.25rem" }}>
            이 글에는 제휴 링크가 포함되어 있으며, 구매 시 일정액의 수수료를 받을 수 있습니다.
          </p>
        )}

        {toc.length >= 3 && (
          <nav className="toc" aria-label="목차">
            <div className="toc-title">목차</div>
            <ol>{toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
          </nav>
        )}

        <article className="article-body">
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          {post.category !== "money" && (
            <div className="caution-box">
              <strong>실천 전 확인하세요.</strong> 이 글은 일반적인 건강 정보이며 개인별 진단이나 치료를 대신하지 않습니다.
              지병이 있거나 약을 복용 중이라면 식단·운동을 바꾸기 전에 의사나 전문가와 상담하세요.
            </div>
          )}
          <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <LikeButton postId={post.id} initialCount={likeCount} />
            <ShareButton title={post.title} />
          </div>
        </article>

        <div className="ad-slot">
          <span className="ad-label">광고 · 쿠팡 파트너스</span>
          <CoupangAd />
        </div>

        {related.length > 0 && (
          <section className="related">
            <h2>함께 읽으면 좋은 글</h2>
            <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
              {related.map((r) => <PostCardItem key={r.id} post={r} />)}
            </div>
          </section>
        )}

        <CommentSection postId={post.id} />
        <div style={{ height: "3rem" }} />
      </div>
    </>
  );
}
