"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { LeafMark } from "./Icon";

// 기획서 §3.1 — 좌측 잎사귀 로고·슬로건 / 중앙 메뉴 / 우측 검색, 스크롤 시 상단 고정
// 모바일(§7) — 로고 + 햄버거 메뉴, 메뉴는 2열 큰 버튼
export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const nav = [{ href: "/", label: "홈" }, ...CATEGORIES.map((c) => ({ href: `/category/${c.key}`, label: c.label }))];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="wrap">
        <div className="bar">
          <Link href="/" className="logo" aria-label="단단한50 홈">
            <span className="logo-mark"><LeafMark /></span>
            <span>
              <span className="logo-name">단단한50</span>
              <span className="logo-slogan">50부터 더 건강하게, 더 단단하게</span>
            </span>
          </Link>

          <nav className="main-nav" aria-label="주요 메뉴">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(n.href) ? "active" : ""}>{n.label}</Link>
            ))}
          </nav>

          <button className="icon-btn" aria-label="검색" aria-expanded={searchOpen}
            onClick={() => { setSearchOpen((v) => !v); setMenuOpen(false); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
          <button className="icon-btn menu-btn" aria-label="메뉴" aria-expanded={menuOpen}
            onClick={() => { setMenuOpen((v) => !v); setSearchOpen(false); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {searchOpen && (
          <div className="search-panel">
            <form className="search-form" action="/search" role="search">
              <label htmlFor="q" className="sr-only">검색어</label>
              <input id="q" name="q" type="search" placeholder="궁금한 건강 주제를 검색하세요 (예: 단백질, 걷기)" autoFocus />
              <button className="btn btn-primary" type="submit">검색</button>
            </form>
          </div>
        )}

        {menuOpen && (
          <nav className="mobile-nav" aria-label="모바일 메뉴">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>{n.label}</Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
