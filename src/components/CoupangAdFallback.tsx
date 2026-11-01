"use client";

import { useEffect } from "react";

// 광고 차단 프로그램이 쿠팡 광고를 막으면 iframe 자리에 깨진 그림(회색 상자)만 남는다 (2026-11-01).
// 못 불러온 광고는 감싼 상자째 숨긴다 — 광고가 정상으로 뜨는 방문자에게는 아무 변화 없음.
//  - /coupang-carousel.html 자체가 막힘 → 오류 페이지라 contentDocument가 null
//  - 페이지는 떴지만 g.js가 막힘 → PartnersCoupang이 없음
function failed(f: HTMLIFrameElement): boolean {
  const d = f.contentDocument;
  if (!d) return true;
  if (d.location.href === "about:blank" || d.readyState !== "complete") return false; // 아직 안 불러옴(lazy)
  return !(f.contentWindow as (Window & { PartnersCoupang?: unknown }) | null)?.PartnersCoupang;
}

export default function CoupangAdFallback() {
  useEffect(() => {
    const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe[src^="/coupang-carousel.html"]')];
    const check = (f: HTMLIFrameElement) => {
      if (!failed(f)) return;
      // 본문 속 상품 상자(생성기가 넣은 div)나 글 아래 광고 칸을 통째로 숨긴다
      const box = (f.closest(".ad-slot") || f.parentElement) as HTMLElement | null;
      if (box) box.style.display = "none";
    };
    const onLoad = (e: Event) => setTimeout(() => check(e.target as HTMLIFrameElement), 500);
    frames.forEach((f) => {
      f.addEventListener("load", onLoad);
      check(f); // 이 컴포넌트가 붙기 전에 이미 불러온 경우
    });
    return () => frames.forEach((f) => f.removeEventListener("load", onLoad));
  }, []);
  return null;
}
