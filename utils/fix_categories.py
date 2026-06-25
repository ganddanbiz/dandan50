#!/usr/bin/env python3
"""
fix_categories.py — Neon DB의 posts.category 값을 올바른 영어 키로 일괄 교정

실행:
  pip install psycopg2-binary python-dotenv
  python utils/fix_categories.py          # 현황 조회만
  python utils/fix_categories.py --fix    # 실제 UPDATE 실행
"""

import os
import sys
import argparse
from dotenv import load_dotenv

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("psycopg2-binary 설치 필요: pip install psycopg2-binary python-dotenv")
    sys.exit(1)

# ── 한국어/구버전 카테고리 → 올바른 영어 키 매핑 ──────────────────────
CATEGORY_REMAP: dict[str, str] = {
    # 구버전 한국어 값
    "입찰·낙찰": "bidding",
    "입찰_낙찰": "bidding",
    "투자실전":  "bidding",   # 이미 한국어로 저장된 경우
    "투자준비":  "before",
    "자산관리":  "after",
    "세금·절세": "tax",
    "세금_절세": "tax",
    "법률·규정": "law",
    "법률_규정": "law",
    "AI활용":    "ai",
    "general":   "before",    # 기본값으로 설정된 경우
}

# 유효한 영어 키 (이 값들은 수정 불필요)
VALID_KEYS = {"before", "bidding", "after", "tax", "law", "ai"}


def get_db_url() -> str:
    # .env.local → .env 순서로 로드
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for env_file in [".env.local", ".env"]:
        path = os.path.join(base_dir, env_file)
        if os.path.exists(path):
            load_dotenv(path)
            break

    url = os.getenv("DATABASE_URL", "")
    if not url:
        print("DATABASE_URL 환경 변수를 찾을 수 없습니다.")
        sys.exit(1)
    return url


def audit(cur) -> list[dict]:
    """현재 DB의 category 값 현황을 반환합니다."""
    cur.execute("""
        SELECT category, COUNT(*) as cnt
        FROM posts
        GROUP BY category
        ORDER BY cnt DESC
    """)
    return [{"category": row[0], "count": row[1]} for row in cur.fetchall()]


def find_broken(rows: list[dict]) -> list[dict]:
    return [r for r in rows if r["category"] not in VALID_KEYS]


def apply_fix(cur, dry_run: bool) -> int:
    """
    잘못된 category 값을 올바른 영어 키로 교정합니다.
    dry_run=True 이면 실제 UPDATE를 실행하지 않습니다.
    교정된 행 수를 반환합니다.
    """
    total_fixed = 0
    for old_val, new_val in CATEGORY_REMAP.items():
        cur.execute(
            "SELECT COUNT(*) FROM posts WHERE category = %s",
            (old_val,)
        )
        count = cur.fetchone()[0]
        if count == 0:
            continue

        if dry_run:
            print(f"  [DRY-RUN] '{old_val}' → '{new_val}'  ({count}건)")
        else:
            cur.execute(
                "UPDATE posts SET category = %s WHERE category = %s",
                (new_val, old_val)
            )
            print(f"  [UPDATED] '{old_val}' → '{new_val}'  ({count}건)")
        total_fixed += count

    return total_fixed


def main():
    parser = argparse.ArgumentParser(
        description="posts.category 값을 올바른 영어 키로 교정합니다."
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="실제 UPDATE를 실행합니다 (없으면 조회만 합니다)",
    )
    args = parser.parse_args()

    db_url = get_db_url()
    conn = psycopg2.connect(db_url)
    conn.autocommit = False

    try:
        cur = conn.cursor()

        # ── 1. 현황 조회 ──────────────────────────────
        print("\n── 현재 DB category 분포 ──")
        rows = audit(cur)
        for r in rows:
            flag = "✅" if r["category"] in VALID_KEYS else "❌"
            print(f"  {flag}  {r['category']:<20}  {r['count']}건")

        broken = find_broken(rows)
        if not broken:
            print("\n모든 category 값이 올바릅니다. 수정 불필요.")
            return

        print(f"\n❌ 교정 필요한 category 값: {len(broken)}종류")
        for r in broken:
            target = CATEGORY_REMAP.get(r["category"], "(매핑 없음)")
            print(f"    '{r['category']}' ({r['count']}건)  →  '{target}'")

        # ── 2. 교정 실행 ──────────────────────────────
        print("\n── 교정 작업 ──")
        fixed = apply_fix(cur, dry_run=not args.fix)

        if args.fix:
            conn.commit()
            print(f"\n✅ 총 {fixed}건 교정 완료. 커밋 완료.")
            print("   Next.js ISR 캐시 초기화를 위해 Vercel 재배포를 권장합니다.")
        else:
            conn.rollback()
            print(f"\n총 {fixed}건 교정 예정.")
            print("실제 반영하려면: python utils/fix_categories.py --fix")

    except Exception as e:
        conn.rollback()
        print(f"\n오류 발생: {e}")
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
