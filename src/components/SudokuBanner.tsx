export default function SudokuBanner() {
  return (
    <a
      className="sudoku-banner"
      href="https://tugman77.github.io/maeil-sudoku/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="오늘의 두뇌 운동, 매일 스도쿠 한 판. 하루 5분, 무료로 즐기는 스도쿠. 새 탭에서 열기"
    >
      <span className="sudoku-banner-copy">
        <strong>오늘의 두뇌 운동, 매일 스도쿠 한 판</strong>
        <span>하루 5분, 무료로 즐기는 스도쿠</span>
      </span>
      <span className="sudoku-banner-action" aria-hidden="true">스도쿠 시작하기 <span>↗</span></span>
    </a>
  );
}
