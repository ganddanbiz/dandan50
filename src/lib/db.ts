import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Lazy initialization: DATABASE_URL is a runtime-only secret on Vercel.
// Calling neon() at module load time causes build failures because the
// env var is not available during Next.js' static analysis phase.
let _conn: NeonQueryFunction<false, false> | null = null;
function getConn(): NeonQueryFunction<false, false> {
  if (!_conn) _conn = neon(process.env.DATABASE_URL!);
  return _conn;
}

const sql: NeonQueryFunction<false, false> = new Proxy(
  ((...args: Parameters<NeonQueryFunction<false, false>>) =>
    getConn()(...args)) as NeonQueryFunction<false, false>,
  {
    get(_target, prop) {
      return (getConn() as unknown as Record<string, unknown>)[prop as string];
    },
  }
);

export default sql;
