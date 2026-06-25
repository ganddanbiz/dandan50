import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { verifyAdminKey } from "@/lib/seo";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
    const post = rows[0];

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await sql`UPDATE posts SET view_count = view_count + 1 WHERE id = ${postId}`;

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = ["title", "content", "slug", "category", "thumbnail_url", "meta_description", "keywords", "status", "published_at"];
    const updates: string[] = [];
    const values: unknown[] = [];

    for (const field of allowedFields) {
      if (field in body) {
        values.push(field === "published_at" && body[field] ? new Date(body[field]).toISOString() : body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(postId);
    await sql(`UPDATE posts SET ${updates.join(", ")} WHERE id = $${values.length}`, values as string[]);

    const rows = await sql`SELECT slug FROM posts WHERE id = ${postId}`;
    if (rows[0]) {
      revalidatePath(`/posts/${rows[0].slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const rows = await sql`SELECT slug FROM posts WHERE id = ${postId}`;
    await sql`DELETE FROM posts WHERE id = ${postId}`;

    if (rows[0]) {
      revalidatePath(`/posts/${rows[0].slug}`);
    }
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
