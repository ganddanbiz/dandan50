import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { generateSlug, verifyAdminKey } from "@/lib/seo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const category = searchParams.get("category") || null;
    const offset = (page - 1) * limit;

    const countRows = category
      ? await sql`SELECT COUNT(*) as total FROM posts WHERE status = 'published' AND category = ${category}`
      : await sql`SELECT COUNT(*) as total FROM posts WHERE status = 'published'`;
    const total = Number(countRows[0].total);

    const posts = category
      ? await sql`SELECT id, title, slug, category, thumbnail_url, meta_description, published_at, created_at, view_count FROM posts WHERE status = 'published' AND category = ${category} ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}`
      : await sql`SELECT id, title, slug, category, thumbnail_url, meta_description, published_at, created_at, view_count FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}`;

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 });
    }

    const finalSlug = slug || generateSlug(title);
    const publishedAt = published_at ? new Date(published_at).toISOString() : null;

    const [result] = await sql`
      INSERT INTO posts (title, content, slug, category, thumbnail_url, meta_description, keywords, status, published_at)
      VALUES (${title}, ${content}, ${finalSlug}, ${category || "general"}, ${thumbnail_url || null}, ${meta_description || null}, ${keywords || null}, ${status || "draft"}, ${publishedAt})
      RETURNING id
    `;

    revalidatePath("/");
    if (status === "published") {
      revalidatePath(`/posts/${finalSlug}`);
    }

    return NextResponse.json({ id: result.id, slug: finalSlug }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "23505") {
      return NextResponse.json({ error: "slug already exists" }, { status: 409 });
    }
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
