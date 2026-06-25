import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import PostShareButton from "./PostShareButton";
import AdBanner from "./AdBanner";

interface PostListProps {
  posts: Partial<Post>[];
}

const catBadgeClass: Record<string, string> = {
  before: "badge badge-before",
  bidding: "badge badge-bidding",
  after:   "badge badge-after",
  tax:     "badge badge-tax",
  law:     "badge badge-law",
  ai:      "badge badge-ai",
};

const catLabels: Record<string, string> = {
  before:  "투자준비",
  bidding: "투자실전",
  after:   "자산관리",
  tax:     "세금·절세",
  law:     "법률·규정",
  ai:      "AI활용",
};

function getLevelBadge(slug?: string): { cls: string; label: string } | null {
  if (!slug) return null;
  if (slug.startsWith("basic-")) return { cls: "badge badge-basic", label: "기초" };
  if (slug.startsWith("mid-"))   return { cls: "badge badge-mid",   label: "중급" };
  if (slug.startsWith("adv-"))   return { cls: "badge badge-adv",   label: "고급" };
  return null;
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--ink-muted)" }}>
        <p style={{ fontSize: "1rem" }}>아직 게시된 글이 없습니다.</p>
      </div>
    );
  }

  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST || "";

  return (
    <div>
      {posts.map((post, index) => {
        const cat = post.category || "before";
        const level = getLevelBadge(post.slug);
        const publishedDate = post.published_at
          ? new Date(post.published_at).toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric",
            })
          : "";

        return (
          <div key={post.id}>
          <article className="feed-article">
            {/* 메타 */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              marginBottom: "0.75rem", flexWrap: "wrap",
            }}>
              <span className={catBadgeClass[cat] || "badge"}>
                {catLabels[cat] || cat}
              </span>
              {level && <span className={level.cls}>{level.label}</span>}
              {publishedDate && (
                <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)", marginLeft: "0.25rem" }}>
                  {publishedDate}
                </span>
              )}
              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>
                · 조회 {(post.view_count || 0).toLocaleString()}
              </span>
            </div>

            {/* 제목 + 썸네일 (가로 배치) */}
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/posts/${post.slug}`} className="feed-title">
                  {post.title}
                </Link>
                {post.meta_description && (
                  <p style={{
                    fontSize: "0.875rem",
                    color: "var(--ink-muted)",
                    lineHeight: 1.65,
                    marginTop: "0.5rem",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}>
                    {post.meta_description}
                  </p>
                )}
              </div>
              {post.thumbnail_url && (
                <div style={{
                  flexShrink: 0, width: "8rem", height: "5.5rem",
                  borderRadius: "10px", overflow: "hidden",
                  border: "1px solid var(--border)", position: "relative",
                }}>
                  <Image
                    src={post.thumbnail_url}
                    alt={post.title || ""}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
            </div>

            {/* 본문 */}
            {post.content && (
              <div
                className="prose"
                style={{ marginTop: "1.25rem" }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* 하단 */}
            <div style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}>
              <Link href={`/posts/${post.slug}`} className="feed-more-link">
                자세히 보기 →
              </Link>
              <PostShareButton slug={post.slug || ""} title={post.title || ""} />
            </div>
          </article>
          {index % 3 === 2 && index < posts.length - 1 && (
            <div className="feed-ad-slot">
              <AdBanner slot={adSlot} format="horizontal" />
            </div>
          )}
          </div>
        );
      })}
    </div>
  );
}
