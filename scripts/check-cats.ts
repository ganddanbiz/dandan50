import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
const sql = neon(process.env.DATABASE_URL!);
async function main() {
  const rows = await sql`SELECT id, slug, category FROM posts`;
  console.log(JSON.stringify(rows, null, 2));
}
main();
