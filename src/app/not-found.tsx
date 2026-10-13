import Link from "next/link";

export default function NotFound() {
  return (
    <div className="read-wrap" style={{ textAlign: "center", padding: "5rem 1.25rem" }}>
      <p style={{ fontSize: "4rem", fontWeight: 800, color: "var(--sage)" }}>404</p>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0.5rem 0" }}>페이지를 찾을 수 없습니다</h1>
      <p style={{ color: "var(--ink-muted)", marginBottom: "2rem" }}>요청하신 글이 없거나 주소가 바뀌었습니다.</p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" className="btn btn-primary">홈으로</Link>
        <Link href="/search" className="btn btn-ghost">전체 글 보기</Link>
      </div>
    </div>
  );
}
