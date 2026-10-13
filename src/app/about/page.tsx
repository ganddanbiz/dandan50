import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "운영자 소개",
  description: "단단한50은 50대 전후부터 건강한 몸과 생활습관을 만들어 가는 실용적인 건강 정보 매거진입니다.",
};

// 기획서 §1·§8 — 브랜드 방향, 작성자 소개, 편집 원칙(근거·게시일·의료 조언 구분)
export default function AboutPage() {
  return (
    <div className="read-wrap">
      <div className="page-head">
        <h1>단단한50을 소개합니다</h1>
        <p className="section-sub">50부터 더 건강하게, 더 단단하게</p>
      </div>
      <div className="page-body">
        <h2>어떤 블로그인가요</h2>
        <p>
          <strong>단단한50</strong>은 단순히 살을 빼는 블로그가 아니라, 50대 전후부터 건강한 몸과 생활습관을
          만들어 가는 실용적인 건강 정보 매거진입니다. 무리한 다이어트보다 오래 지킬 수 있는 식사와 운동,
          생활습관을 쉽게 정리해 전합니다.
        </p>

        <h2>다루는 주제</h2>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.key}><Link href={`/category/${c.key}`} style={{ color: "var(--primary)" }}>{c.label}</Link> — {c.intro}</li>
          ))}
        </ul>

        <h2>편집 원칙</h2>
        <ul>
          <li>건강 정보는 공공기관·학회·연구 자료 등 신뢰할 수 있는 근거를 바탕으로 작성하고, 게시일과 수정일을 표시합니다.</li>
          <li>질병·약물·영양 관련 내용은 일반 정보로만 다루며, 개인별 진단이나 치료를 대신하지 않습니다.</li>
          <li>효과를 단정하거나 과장하지 않습니다. 개인차가 있다는 점을 함께 안내합니다.</li>
          <li>직접 사용하지 않은 제품을 사용 후기처럼 쓰지 않습니다. 제품 글은 고르는 기준과 비교 중심으로 씁니다.</li>
          <li>글 작성에는 AI 도구의 도움을 받으며, 편집팀이 주제 선정과 표현 기준을 관리합니다.</li>
        </ul>

        <h2>광고와 제휴</h2>
        <p>
          단단한50은 광고(구글 애드센스)와 제휴 마케팅(쿠팡 파트너스)으로 운영됩니다. 제휴 링크가 포함된 글에는
          그 사실을 표시합니다. 자세한 내용은 <Link href="/disclosure" style={{ color: "var(--primary)" }}>광고·제휴 고지</Link>를 확인하세요.
        </p>

        <h2>문의</h2>
        <p>
          잘못된 정보 제보, 제휴 문의는 <Link href="/contact" style={{ color: "var(--primary)" }}>문의하기</Link>로 보내 주세요.
        </p>
      </div>
    </div>
  );
}
