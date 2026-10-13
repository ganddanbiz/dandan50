import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { checkHoneypot, checkRateLimit, logSpam } from "@/lib/spam";

// 단단한50 건강 레터 구독 (2026-10-14 리뉴얼). 이메일만 저장하며 동의는 클라이언트에서 필수로 받는다.
// 테이블은 첫 요청 때 만든다 — 별도 마이그레이션 없이 배포만으로 동작.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  if (checkHoneypot(body)) {
    await logSpam(ip, "honeypot", "subscribe");
    return NextResponse.json({ message: "구독 신청이 완료됐습니다." });
  }
  const { limited } = await checkRateLimit(ip, "subscribe");
  if (limited) return NextResponse.json({ message: "잠시 후 다시 시도해 주세요." }, { status: 429 });

  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json({ message: "이메일 주소를 확인해 주세요." }, { status: 400 });
  }

  try {
    await sql`CREATE TABLE IF NOT EXISTS subscribers (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email VARCHAR(254) NOT NULL UNIQUE,
      consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      unsubscribed_at TIMESTAMPTZ
    )`;
    await sql`INSERT INTO subscribers (email) VALUES (${email})
              ON CONFLICT (email) DO UPDATE SET unsubscribed_at = NULL, consented_at = NOW()`;
    return NextResponse.json({ message: "구독 신청이 완료됐습니다. 고맙습니다!" });
  } catch {
    return NextResponse.json({ message: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
