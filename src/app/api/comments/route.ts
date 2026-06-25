import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { sha256 } from "@/lib/hash";
import { getClientIp } from "@/lib/seo";
import { checkHoneypot, checkRateLimit, verifyCaptcha, logSpam } from "@/lib/spam";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = Number(searchParams.get("postId"));

    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const comments = await sql`
      SELECT id, post_id, nickname, content, created_at
      FROM comments
      WHERE post_id = ${postId} AND is_approved = 1
      ORDER BY created_at ASC
    `;

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = getClientIp(request);

    if (checkHoneypot(body)) {
      await logSpam(ip, "honeypot", JSON.stringify({ postId: body.postId }));
      return NextResponse.json({ id: 0, success: true });
    }

    const { limited, requireCaptcha } = await checkRateLimit(ip, "comment");
    if (limited) {
      const captchaToken = body.captchaToken;
      if (!captchaToken) {
        return NextResponse.json(
          { error: "Too many requests", captcha_required: true },
          { status: 429 }
        );
      }

      const captchaOk = await verifyCaptcha(captchaToken);
      if (!captchaOk) {
        await logSpam(ip, "captcha_fail", JSON.stringify({ postId: body.postId }));
        return NextResponse.json(
          { error: "Captcha verification failed", captcha_required: true },
          { status: 429 }
        );
      }
    }
    void requireCaptcha;

    const { postId, nickname, password, content } = body;

    if (!postId || !nickname || !password || !content) {
      return NextResponse.json(
        { error: "postId, nickname, password, content are required" },
        { status: 400 }
      );
    }

    if (nickname.length > 30) {
      return NextResponse.json({ error: "nickname too long" }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: "content too long" }, { status: 400 });
    }

    const postRows = await sql`SELECT id FROM posts WHERE id = ${postId}`;
    if (!postRows[0]) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const ipHash = sha256(ip);

    const [result] = await sql`
      INSERT INTO comments (post_id, nickname, password, content, ip_hash, is_approved)
      VALUES (${postId}, ${nickname}, ${passwordHash}, ${content}, ${ipHash}, 1)
      RETURNING id
    `;

    return NextResponse.json({ id: result.id, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
