"use client";

import { useState } from "react";

// 공유는 링크 복사만 둔다 — 카카오·X 버튼은 사용자 요청으로 뺐다 (2026-11-01)
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const getUrl = () => window.location.href;

  const handleCopy = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 1rem",
    borderRadius: "999px",
    border: "1.5px solid var(--border)",
    background: "var(--bg)",
    color: "var(--ink-muted)",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
      {/* 링크 복사 */}
      <button
        onClick={handleCopy}
        aria-label="링크 복사"
        style={{
          ...btnBase,
          ...(copied
            ? { background: "#f0fdf4", borderColor: "#86efac", color: "#16a34a" }
            : {}),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M13 7H15C16.657 7 18 8.343 18 10C18 11.657 16.657 13 15 13H13M7 13H5C3.343 13 2 11.657 2 10C2 8.343 3.343 7 5 7H7M7 10H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        {copied ? "복사됨!" : "링크 복사"}
      </button>
    </div>
  );
}
