import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "광고·제휴 고지" };

// 기획서 §3.6·§6·§8 — 광고·협찬·제휴 사실 공개
export default function DisclosurePage() {
  return (
    <div className="read-wrap">
      <div className="page-head"><h1>광고·제휴 고지</h1></div>
      <div className="page-body">
        <h2>제휴 마케팅</h2>
        <p>
          이 블로그의 일부 글에는 <strong>쿠팡 파트너스</strong> 링크와 배너가 포함되어 있습니다.
          링크를 통해 구매가 이뤄지면 단단한50은 일정액의 수수료를 받을 수 있으며, 구매자에게 추가 비용은 발생하지 않습니다.
        </p>
        <p>“이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.”</p>

        <h2>디스플레이 광고</h2>
        <p>구글 애드센스 광고가 표시될 수 있습니다. 광고는 독서를 방해하지 않는 위치(본문 중간·하단)에만 배치합니다.</p>

        <h2>협찬·브랜드 협업</h2>
        <p>현재 협찬받은 글은 없습니다. 향후 협찬이나 제품 제공을 받는 경우 글 상단에 그 사실을 명확히 표시합니다.</p>

        <h2>제품 글 작성 원칙</h2>
        <ul>
          <li>직접 사용하지 않은 제품은 사용 후기처럼 쓰지 않고, 고르는 기준과 비교 정보 중심으로 씁니다.</li>
          <li>건강식품·기구의 효능을 단정하거나 의학적 효과를 과장하지 않습니다.</li>
          <li>제품 사진은 판매처 공식 이미지 또는 출처가 표시된 이미지를 사용합니다.</li>
        </ul>
        <p>문의: <Link href="/contact" style={{ color: "var(--primary)" }}>문의하기</Link></p>
      </div>
    </div>
  );
}
