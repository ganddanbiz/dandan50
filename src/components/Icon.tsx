// 선 아이콘 — categories.ts의 path 문자열을 그린다
export default function Icon({ d, size = 28, stroke = 1.8 }: { d: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split(/ (?=M)/).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export function LeafMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" fill="#A8BE9B" />
      <path d="M5 19c3-4 6-7 10-9" stroke="#F7F4EC" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
