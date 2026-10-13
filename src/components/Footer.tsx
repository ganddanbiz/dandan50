import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

// 기획서 §3.6 — 운영자 소개 / 문의 / 개인정보처리방침 / 광고·제휴 고지
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <h4>단단한50</h4>
            <p className="note">
              50부터 더 건강하게, 더 단단하게.<br />
              무리한 다이어트보다 지속 가능한 습관을 전하는 중년 건강 매거진입니다.<br />
              이 블로그의 건강 정보는 일반적인 정보이며 개인별 의료 조언을 대신하지 않습니다.
            </p>
          </div>
          <div>
            <h4>카테고리</h4>
            {CATEGORIES.map((c) => <Link key={c.key} href={`/category/${c.key}`}>{c.label}</Link>)}
          </div>
          <div>
            <h4>안내</h4>
            <Link href="/about">운영자 소개</Link>
            <Link href="/contact">문의하기</Link>
            <Link href="/privacy">개인정보처리방침</Link>
            <Link href="/disclosure">광고·제휴 고지</Link>
          </div>
        </div>
        <div className="copy">
          <span>© {year} 단단한50. All rights reserved.</span>
          <span>일부 글에는 쿠팡 파트너스 등 제휴 링크가 포함되며, 구매 시 일정액의 수수료를 받을 수 있습니다. · 사진: Unsplash</span>
        </div>
      </div>
    </footer>
  );
}
