import Link from "next/link";
import { categoryLabel } from "@/lib/categories";

export interface CardPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  thumbnail_url: string | null;
  meta_description: string | null;
  published_at: string | null;
}

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "";

// 카드 구성(§3.4): 이미지, 카테고리, 제목, 짧은 설명, 게시일
export function PostCardItem({ post, rank }: { post: CardPost; rank?: number }) {
  return (
    <Link href={`/posts/${post.slug}`} className="pcard">
      <div className="pcard-thumb">
        {rank && <span className="rank">{rank}</span>}
        {post.thumbnail_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.thumbnail_url} alt="" loading="lazy" />
        )}
      </div>
      <div className="pcard-body">
        <span className={post.category === "review" ? "chip chip-peach" : "chip"}>{categoryLabel(post.category)}</span>
        <h3 className="pcard-title">{post.title}</h3>
        {post.meta_description && <p className="pcard-desc">{post.meta_description}</p>}
        <span className="pcard-date">{fmt(post.published_at)}</span>
      </div>
    </Link>
  );
}

export default function PostGrid({ posts }: { posts: CardPost[] }) {
  if (!posts.length) return <div className="empty">아직 이 주제의 글이 없습니다. 곧 새 글로 찾아올게요.</div>;
  return (
    <div className="card-grid">
      {posts.map((p) => <PostCardItem key={p.id} post={p} />)}
    </div>
  );
}
