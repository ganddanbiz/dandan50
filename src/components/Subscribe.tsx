"use client";

import { useState } from "react";

// 기획서 §3.6 — '단단한50 건강 레터' 구독. 이메일은 /api/subscribe 로 저장(동의 필수)
export default function Subscribe() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!form.get("agree")) return setMsg("개인정보 수집·이용에 동의해 주세요.");
    setBusy(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website") }),
      });
      const j = await res.json();
      setMsg(j.message || (res.ok ? "구독 신청이 완료됐습니다." : "잠시 후 다시 시도해 주세요."));
      if (res.ok) e.currentTarget.reset();
    } catch {
      setMsg("잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="subscribe">
      <div>
        <h2>단단한50 건강 레터</h2>
        <p>일주일에 한 번, 새로 올라온 건강 정보와 실천하기 쉬운 식단·운동 팁을 메일로 보내드립니다.</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="row">
          <label htmlFor="sub-email" className="sr-only">이메일</label>
          <input id="sub-email" name="email" type="email" required placeholder="이메일 주소" autoComplete="email" />
          {/* 스팸봇 함정 필드 — 사람에게는 보이지 않는다 */}
          <input name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "신청 중…" : "구독하기"}</button>
        </div>
        <label>
          <input type="checkbox" name="agree" value="1" />
          <span>건강 레터 발송을 위해 이메일 주소를 수집·이용하는 데 동의합니다. 언제든 구독을 해지할 수 있으며, 자세한 내용은 <a href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>개인정보처리방침</a>을 참고하세요.</span>
        </label>
        <p className="msg" role="status">{msg}</p>
      </form>
    </div>
  );
}
