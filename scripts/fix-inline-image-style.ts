import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const result = await sql`
    UPDATE posts
    SET content = REPLACE(
      content,
      'width:100%;max-height:400px;object-fit:cover;border-radius:10px;border:1px solid var(--border);display:block;',
      'width:100%;height:auto;border-radius:10px;border:1px solid var(--border);display:block;'
    )
    WHERE content LIKE '%max-height:400px%'
  `;
  console.log("본문 이미지 스타일 수정 완료:", result);
}

main().catch(console.error);
