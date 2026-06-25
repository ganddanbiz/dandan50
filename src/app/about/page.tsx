export const metadata = {
  title: "소개",
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: "56rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem", color: "var(--ink)" }}>
        재테크스토리 소개
      </h1>
      <p style={{ lineHeight: 1.8, color: "var(--ink-mid)", marginBottom: "1.5rem" }}>
        <strong>재테크스토리</strong>는 30~50대 직장인을 위한 재테크·투자 전문 블로그입니다.
        재테크아저씨가 직접 경험하고 공부한 투자 지식을 쉽고 실용적으로 전달합니다.
      </p>
      <p style={{ lineHeight: 1.8, color: "var(--ink-mid)", marginBottom: "1.5rem" }}>
        주식, ETF, 부동산, 세금 절세, 노후 준비까지 — 월급 받는 직장인이라면 반드시 알아야 할
        재테크 정보를 매일 새롭게 업데이트합니다.
      </p>
      <div style={{
        background: "var(--accent-faint)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "1.5rem",
        marginTop: "2rem",
      }}>
        <p style={{ margin: 0, color: "var(--ink-mid)", lineHeight: 1.7 }}>
          💡 이 블로그의 모든 콘텐츠는 정보 제공 목적이며 투자 권유가 아닙니다.
          투자 결정은 반드시 본인의 판단으로 하시기 바랍니다.
        </p>
      </div>
    </main>
  );
}
