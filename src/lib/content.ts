// 글 본문 가공 — 목차, '단단한 건강 포인트' 박스, 읽기 시간 (디자인 기획서 §4.2)

export interface TocItem {
  id: string;
  text: string;
}

const strip = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();

/** H2에 id를 붙이고 목차를 만든다. '핵심 정리' 섹션은 정보 박스로 바꾼다. */
export function prepareArticle(html: string): { html: string; toc: TocItem[]; minutes: number } {
  const toc: TocItem[] = [];
  let n = 0;

  // ⓪ 2026-10-14 이전 글은 생성기 버그로 이미지·쿠팡 배너가 <h2> 안에 들어가 있다.
  //    제목 텍스트 뒤의 블록 요소를 </h2> 밖으로 빼낸다.
  let out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
    const cut = inner.search(/<(figure|div|script|p|img)\b/i);
    if (cut <= 0) return m;
    return `<h2${attrs}>${inner.slice(0, cut).trim()}</h2>${inner.slice(cut)}`;
  });

  // ⓪-2 본문 속 쿠팡 스크립트 쌍은 dangerouslySetInnerHTML이라 실행되지 않아 빈칸으로 남는다 → iframe
  out = out.replace(
    /<script\s+src="https:\/\/ads-partners\.coupang\.com\/g\.js"><\/script>\s*<script>\s*new PartnersCoupang\.G\(\{\s*id:\s*(\d+)[\s\S]*?<\/script>/g,
    (_m, id) =>
      `<iframe src="/coupang-carousel.html?id=${id}&h=140" title="쿠팡 파트너스 상품" loading="lazy" scrolling="no" style="display:block;width:100%;height:150px;border:0;margin:0 auto"></iframe>`
  );

  // ① 생성기가 넣는 "💡 핵심 정리" h2 + 바로 뒤 ul → 정보 박스
  out = out.replace(
    /<h2[^>]*>\s*(?:💡\s*)?핵심\s*정리\s*<\/h2>\s*(<ul[\s\S]*?<\/ul>)/,
    (_m, ul) =>
      `<div class="point-box"><div class="point-title">🌿 단단한 건강 포인트</div>${ul}</div>`
  );

  // ② 나머지 H2에 앵커 id 부여 + 목차 수집 (FAQ·면책 성격 제목도 목차에는 넣는다)
  out = out.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_m, attrs, inner) => {
    const text = strip(inner).replace(/^[\p{Extended_Pictographic}\s]+/u, "");
    if (!text) return _m;
    const id = `sec-${++n}`;
    toc.push({ id, text });
    const cleanAttrs = String(attrs).replace(/\sid="[^"]*"/, "");
    return `<h2${cleanAttrs} id="${id}">${inner}</h2>`;
  });

  // 한국어 기준 분당 약 500자
  const minutes = Math.max(1, Math.round(strip(out).replace(/\s+/g, "").length / 500));
  return { html: out, toc, minutes };
}
