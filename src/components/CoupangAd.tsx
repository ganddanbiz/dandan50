interface Props {
  variant?: "banner" | "square" | "leaderboard";
}

// 쿠팡 캐러셀은 iframe(/coupang-carousel.html)으로 그린다.
// 예전엔 스크립트를 동적으로 끼웠는데, g.js가 document.currentScript를 못 찾아
// 광고가 이 자리가 아니라 페이지 맨 끝(푸터 아래 왼쪽)에 붙었다 (2026-10-14 수정).
export default function CoupangAd({ variant = "banner" }: Props) {
  if (variant === "leaderboard") {
    return (
      <div style={{ margin: "1.75rem 0", overflow: "hidden" }}>
        <p style={{
          fontSize: "0.6875rem",
          color: "var(--ink-faint)",
          textAlign: "right",
          marginBottom: "4px",
          lineHeight: 1.4,
        }}>
          이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a
          href="https://link.coupang.com/a/eVzgl7H5pY"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="unsafe-url"
          style={{ display: "block" }}
        >
          <img
            src="https://ads-partners.coupang.com/banners/1000915?trackingCode=AF9787280&subId=&traceId=V0-301-969b06e95b87326d-I1000915&w=728&h=90"
            alt=""
            style={{ display: "block", width: "100%", maxWidth: "728px", height: "auto" }}
          />
        </a>
      </div>
    );
  }

  const isSquare = variant === "square";
  const id = isSquare ? 970543 : 970645;
  const h = isSquare ? 300 : 140;

  return (
    <div style={{ margin: "1.75rem auto", width: "100%", maxWidth: isSquare ? "300px" : "680px", textAlign: "center" }}>
      <p style={{ fontSize: "0.6875rem", color: "var(--ink-faint)", textAlign: "right", marginBottom: "4px", lineHeight: 1.4 }}>
        이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.
      </p>
      <iframe
        src={`/coupang-carousel.html?id=${id}&h=${h}`}
        title="쿠팡 파트너스 상품"
        loading="lazy"
        scrolling="no"
        style={{ display: "block", width: "100%", height: `${h + 10}px`, border: 0, margin: "0 auto" }}
      />
    </div>
  );
}
