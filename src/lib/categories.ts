// 단단한50 카테고리 — 2026-10-14 건강 전용 전환 (디자인 기획서 §3.3·§5)
// key는 DB posts.category 값이다. 생성기(scripts/generate-post.ts)도 이 키로 저장한다.

export type CategoryKey = "diet" | "bloodsugar" | "meal" | "exercise" | "info" | "review";

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string; // 인라인 SVG path (24x24, stroke)
  intro: string;
  subtopics: string[];
}

export const CATEGORIES: Category[] = [
  {
    key: "diet",
    label: "다이어트",
    icon: "M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    intro: "무리한 감량보다 오래 지킬 수 있는 체중 관리. 50대 몸에 맞는 식사량과 습관을 다룹니다.",
    subtopics: ["체중관리", "식단계획", "단백질", "건강한 감량"],
  },
  {
    key: "bloodsugar",
    label: "혈당관리",
    icon: "M12 3c3 4 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 9 7 12 3Z M9.5 14.5h5",
    intro: "식사 순서, 걷기, 숨은 당 줄이기처럼 생활 속에서 혈당을 다루는 방법을 정리합니다.",
    subtopics: ["식사 구성", "혈당 관련 정보", "생활습관"],
  },
  {
    key: "meal",
    label: "건강식단",
    icon: "M4 11h16a8 8 0 0 1-16 0Z M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5",
    intro: "실제로 차릴 수 있는 한식 중심의 균형 잡힌 한 끼. 식단표, 장보기, 식재료 비교까지.",
    subtopics: ["레시피", "식품 비교", "장보기", "식단표"],
  },
  {
    key: "exercise",
    label: "운동",
    icon: "M13 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M9 21l2-6 2.5 2V21M7 12l3-4 3 1 2 3h3M10 8l1 5",
    intro: "걷기부터 근력운동, 스트레칭까지. 관절에 무리 없이 꾸준히 할 수 있는 루틴을 소개합니다.",
    subtopics: ["걷기", "근력운동", "스트레칭", "홈트레이닝"],
  },
  {
    key: "info",
    label: "건강정보",
    icon: "M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z M9 12h2l1-2 1.5 4 1-2H17",
    intro: "수면, 스트레스, 검진, 중년 건강 연구. 알아두면 좋은 정보를 근거와 함께 전합니다.",
    subtopics: ["수면", "스트레스", "건강검진", "중년 건강 연구"],
  },
  {
    key: "review",
    label: "제품리뷰",
    icon: "M4 7h16l-1.5 12h-13L4 7Z M9 7a3 3 0 0 1 6 0 M9 13l2 2 4-4",
    intro: "체중계, 혈압계, 운동용품, 주방용품을 고르는 기준과 비교. 제휴 링크는 명확히 표시합니다.",
    subtopics: ["운동기구", "주방용품", "건강식품", "생활용품"],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
export const HEALTH_KEYS = CATEGORIES.map((c) => c.key);

/** 카테고리 라벨. 전환 이전 글(money·health·life)도 이름이 나오게 한다. */
export function categoryLabel(key: string): string {
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key].label;
  if (key === "money") return "지난 글 · 재테크";
  if (key === "health") return "건강정보";
  if (key === "life") return "일상";
  return key;
}

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1680781014172-384cf2e54842?auto=format&fit=crop&w=1920&q=75";
