export interface Topic {
  index: number;
  slug: string;
  level: "재테크" | "건강" | "일상";
  category: "money" | "health" | "life";
  title: string;
  keywords: string;
  meta_description: string;
}

export const allTopics: Topic[] = [
  // ── 재테크 편 78개 ──────────────────────────────────────

  // 연금·절세 (1-10)
  {
    index: 1, slug: "money-001", level: "재테크", category: "money",
    title: "50대가 지금 당장 만들어야 할 IRP 계좌 완전정복",
    keywords: "IRP계좌,개인형퇴직연금,50대IRP,IRP세액공제",
    meta_description: "50대 직장인이라면 IRP 계좌는 선택이 아닌 필수입니다. 세액공제 혜택부터 운용 방법까지 한 번에 정리했습니다.",
  },
  {
    index: 2, slug: "money-002", level: "재테크", category: "money",
    title: "ISA 계좌 세금 혜택, 직장인이 꼭 써야 하는 이유",
    keywords: "ISA계좌,개인종합자산관리계좌,ISA세금혜택,ISA비과세",
    meta_description: "ISA 계좌로 투자 수익에 붙는 세금을 줄이는 방법. 50대 직장인에게 왜 ISA가 꼭 필요한지 설명합니다.",
  },
  {
    index: 3, slug: "money-003", level: "재테크", category: "money",
    title: "연금저축 vs IRP, 50대에게 유리한 것은",
    keywords: "연금저축,IRP비교,연금계좌,세액공제비교",
    meta_description: "연금저축과 IRP, 둘 다 세액공제를 받을 수 있습니다. 50대 직장인 기준으로 어느 쪽이 더 유리한지 비교합니다.",
  },
  {
    index: 4, slug: "money-004", level: "재테크", category: "money",
    title: "퇴직금 IRP 넣으면 세금 얼마나 아끼나",
    keywords: "퇴직금IRP,퇴직소득세,IRP퇴직금절세,퇴직금운용",
    meta_description: "퇴직금을 IRP에 넣으면 퇴직소득세를 내지 않아도 됩니다. 실제로 얼마나 절세가 되는지 계산해 드립니다.",
  },
  {
    index: 5, slug: "money-005", level: "재테크", category: "money",
    title: "50대 직장인 절세 방법 5가지 총정리",
    keywords: "직장인절세,50대절세,연말정산절세,세금줄이기",
    meta_description: "50대 직장인이 합법적으로 세금을 줄이는 5가지 방법을 구체적인 숫자와 함께 정리했습니다.",
  },
  {
    index: 6, slug: "money-006", level: "재테크", category: "money",
    title: "소득공제 vs 세액공제, 헷갈리면 이것만 기억해라",
    keywords: "소득공제,세액공제,연말정산,공제차이",
    meta_description: "소득공제와 세액공제, 비슷해 보여도 세금 환급액이 완전히 다릅니다. 한 번에 이해할 수 있도록 쉽게 설명합니다.",
  },
  {
    index: 7, slug: "money-007", level: "재테크", category: "money",
    title: "50대 국민연금 수령액 높이는 전략",
    keywords: "국민연금,국민연금수령액,임의가입,추납,연기연금",
    meta_description: "국민연금 수령액을 높이는 세 가지 전략: 임의계속가입, 추납, 연기연금. 50대라면 지금 바로 확인하세요.",
  },
  {
    index: 8, slug: "money-008", level: "재테크", category: "money",
    title: "주택청약, 50대도 계속 유지해야 하나",
    keywords: "주택청약,청약통장,50대청약,청약해지",
    meta_description: "50대에도 주택청약이 필요한지, 해지하면 어떤 혜택을 잃는지 솔직하게 정리했습니다.",
  },
  {
    index: 9, slug: "money-009", level: "재테크", category: "money",
    title: "퇴직연금 DC형 vs DB형, 50대 선택법",
    keywords: "DC형퇴직연금,DB형퇴직연금,퇴직연금비교,확정기여형",
    meta_description: "DC형과 DB형 퇴직연금, 어느 쪽이 더 유리한가? 50대 입장에서 구체적인 기준을 제시합니다.",
  },
  {
    index: 10, slug: "money-010", level: "재테크", category: "money",
    title: "연금 수령 시기, 언제가 가장 유리한가",
    keywords: "연금수령시기,국민연금수령,연기연금,조기노령연금",
    meta_description: "연금을 언제부터 받는 게 유리할까? 조기 수령과 연기 수령의 손익분기점을 계산해 드립니다.",
  },

  // 주식·ETF (11-25)
  {
    index: 11, slug: "money-011", level: "재테크", category: "money",
    title: "월급쟁이 ETF 투자, 이것만 알면 시작할 수 있다",
    keywords: "ETF투자,ETF입문,직장인ETF,ETF종류",
    meta_description: "ETF가 뭔지도 몰랐던 직장인이 투자를 시작한 방법. 계좌 개설부터 첫 매수까지 단계별로 안내합니다.",
  },
  {
    index: 12, slug: "money-012", level: "재테크", category: "money",
    title: "미국 ETF vs 한국 ETF, 50대 선택 기준",
    keywords: "미국ETF,한국ETF,ETF비교,해외ETF투자",
    meta_description: "S&P500 ETF와 KODEX 200, 50대 입장에서 어느 쪽이 더 적합한지 세금·환율·접근성 기준으로 비교합니다.",
  },
  {
    index: 13, slug: "money-013", level: "재테크", category: "money",
    title: "배당주 투자로 월세 받듯 용돈 만드는 법",
    keywords: "배당주투자,배당금,월배당,배당포트폴리오",
    meta_description: "매달 배당금을 받는 포트폴리오를 만드는 방법. 소액으로 시작해서 월 용돈을 버는 현실적인 전략입니다.",
  },
  {
    index: 14, slug: "money-014", level: "재테크", category: "money",
    title: "50대가 고르는 안전한 배당 ETF 5가지",
    keywords: "배당ETF,고배당ETF,KODEX배당,배당ETF추천",
    meta_description: "안정성과 수익성을 동시에 잡을 수 있는 배당 ETF 5가지를 선정 기준과 함께 소개합니다.",
  },
  {
    index: 15, slug: "money-015", level: "재테크", category: "money",
    title: "S&P500 ETF, 지금 시작해도 늦지 않은 이유",
    keywords: "S&P500,미국ETF,TIGER미국S&P500,장기투자",
    meta_description: "50대에 S&P500 ETF를 시작하는 게 늦었다고 생각하시나요? 10년 후 수익률 시뮬레이션을 보여드립니다.",
  },
  {
    index: 16, slug: "money-016", level: "재테크", category: "money",
    title: "KODEX 월배당 ETF, 실제로 얼마나 받나",
    keywords: "KODEX월배당,월배당ETF,배당금계산,월분배금",
    meta_description: "KODEX 월배당 ETF에 1000만원을 넣으면 매달 얼마를 받을 수 있는지 실제 수치로 확인해 보겠습니다.",
  },
  {
    index: 17, slug: "money-017", level: "재테크", category: "money",
    title: "개별 주식 vs ETF, 50대는 어느 쪽이 유리한가",
    keywords: "개별주식,ETF비교,주식투자방법,50대투자",
    meta_description: "시간과 정보가 제한적인 50대 직장인에게 개별 주식과 ETF 중 어느 쪽이 더 현실적인지 비교합니다.",
  },
  {
    index: 18, slug: "money-018", level: "재테크", category: "money",
    title: "주식 계좌 개설부터 첫 매수까지 완전 가이드",
    keywords: "주식계좌개설,MTS,주식첫매수,증권사추천",
    meta_description: "주식 계좌 한 번도 만들어 본 적 없는 분을 위한 가이드. 증권사 선택부터 첫 주식 매수까지 따라 하세요.",
  },
  {
    index: 19, slug: "money-019", level: "재테크", category: "money",
    title: "고배당주 함정, 이것만 확인하면 피할 수 있다",
    keywords: "고배당주,배당함정,배당컷,배당주선택기준",
    meta_description: "배당률이 높다고 무조건 좋은 주식이 아닙니다. 배당 함정을 피하는 체크리스트를 알려드립니다.",
  },
  {
    index: 20, slug: "money-020", level: "재테크", category: "money",
    title: "리밸런싱이란? 포트폴리오 관리의 핵심",
    keywords: "리밸런싱,포트폴리오관리,자산배분,투자비중조정",
    meta_description: "리밸런싱을 안 하면 내 포트폴리오가 어느새 엉뚱한 방향으로 흘러갑니다. 올바른 리밸런싱 타이밍과 방법을 설명합니다.",
  },
  {
    index: 21, slug: "money-021", level: "재테크", category: "money",
    title: "분할 매수 전략, 시장 타이밍 신경 쓰지 않는 법",
    keywords: "분할매수,적립식투자,코스트에버리징,DCA",
    meta_description: "주가가 올라도 내려도 꾸준히 수익을 쌓는 분할 매수 전략. 자동화까지 하면 더 강력해집니다.",
  },
  {
    index: 22, slug: "money-022", level: "재테크", category: "money",
    title: "50대 투자 성향 진단, 나에게 맞는 포트폴리오는",
    keywords: "투자성향,포트폴리오구성,위험자산,안전자산비율",
    meta_description: "공격형인지 안정형인지 모르겠다면 이 체크리스트로 진단하고 적절한 포트폴리오 비율을 찾아보세요.",
  },
  {
    index: 23, slug: "money-023", level: "재테크", category: "money",
    title: "채권 투자 입문, 주식보다 안전한 투자처",
    keywords: "채권투자,국채,회사채,채권ETF",
    meta_description: "주식이 불안할 때 채권이 대안이 될 수 있습니다. 50대에게 적합한 채권 투자 방법을 쉽게 설명합니다.",
  },
  {
    index: 24, slug: "money-024", level: "재테크", category: "money",
    title: "리츠(REITs) 투자, 부동산을 주식처럼 사는 방법",
    keywords: "리츠투자,REITs,부동산간접투자,리츠ETF",
    meta_description: "수억 원이 없어도 부동산에서 임대 수익을 받을 수 있습니다. 리츠 투자의 원리와 장단점을 정리했습니다.",
  },
  {
    index: 25, slug: "money-025", level: "재테크", category: "money",
    title: "월 배당 포트폴리오 만들기, 현실적인 목표 금액",
    keywords: "월배당포트폴리오,배당수익,현금흐름투자,배당목표",
    meta_description: "월 50만원 배당 수익을 만들려면 얼마가 필요할까? 현실적인 숫자로 월 배당 포트폴리오 목표를 세워봅니다.",
  },

  // 암호화폐 (26-29)
  {
    index: 26, slug: "money-026", level: "재테크", category: "money",
    title: "비트코인 소액 투자, 50대도 해도 될까",
    keywords: "비트코인투자,암호화폐입문,50대코인,비트코인소액",
    meta_description: "비트코인에 관심은 있지만 선뜻 시작하지 못하는 50대를 위한 현실적인 접근법. 얼마까지가 적정 비중인가.",
  },
  {
    index: 27, slug: "money-027", level: "재테크", category: "money",
    title: "비트코인 ETF란? 직접 투자와 무엇이 다른가",
    keywords: "비트코인ETF,현물ETF,암호화폐ETF,비트코인투자방법",
    meta_description: "비트코인을 직접 사지 않고도 투자하는 방법, 비트코인 ETF. 장단점과 국내 접근 방법을 설명합니다.",
  },
  {
    index: 28, slug: "money-028", level: "재테크", category: "money",
    title: "코인 투자 전 반드시 알아야 할 세금 문제",
    keywords: "코인세금,암호화폐세금,가상자산세금,코인양도세",
    meta_description: "암호화폐 수익에도 세금이 붙습니다. 가상자산 세금 내용과 절세 포인트를 정리했습니다.",
  },
  {
    index: 29, slug: "money-029", level: "재테크", category: "money",
    title: "암호화폐 투자 비중, 50대에게 적합한 수준은",
    keywords: "코인비중,암호화폐비중,포트폴리오코인,위험자산비중",
    meta_description: "투자 포트폴리오에서 암호화폐 비중을 어느 정도로 가져가야 할까? 50대 입장에서 현실적인 기준을 제시합니다.",
  },

  // 저축·현금 관리 (30-40)
  {
    index: 30, slug: "money-030", level: "재테크", category: "money",
    title: "월급 자동이체 설정으로 강제 저축하는 법",
    keywords: "자동이체저축,강제저축,자동저축,통장관리",
    meta_description: "의지력에 기대지 않고 자동으로 돈이 모이는 시스템을 만드는 방법. 월급날 설정 하나로 저축 습관이 완성됩니다.",
  },
  {
    index: 31, slug: "money-031", level: "재테크", category: "money",
    title: "CMA 통장 완전정복, 이자 극대화 방법",
    keywords: "CMA통장,CMA금리,CMA추천,입출금통장이자",
    meta_description: "CMA 통장을 활용하면 보통예금보다 훨씬 높은 이자를 받을 수 있습니다. 어떤 CMA가 유리한지 비교합니다.",
  },
  {
    index: 32, slug: "money-032", level: "재테크", category: "money",
    title: "파킹통장 추천, 50대 비상금 굴리는 법",
    keywords: "파킹통장,고금리통장,비상금통장,파킹통장금리",
    meta_description: "비상금이 그냥 통장에 잠들어 있다면 파킹통장으로 이자를 챙기세요. 금리 좋은 파킹통장을 비교합니다.",
  },
  {
    index: 33, slug: "money-033", level: "재테크", category: "money",
    title: "적금 vs 예금, 50대 자금 성격별 선택법",
    keywords: "적금예금비교,정기예금,정기적금,안전자산",
    meta_description: "언제 쓸 돈인지, 얼마를 모을 건지에 따라 적금과 예금 중 어느 쪽이 더 유리한지 달라집니다.",
  },
  {
    index: 34, slug: "money-034", level: "재테크", category: "money",
    title: "달러 투자, 환율 오를 때 직장인이 할 수 있는 것",
    keywords: "달러투자,달러예금,환율투자,외화예금",
    meta_description: "달러를 직접 사거나 달러 예금에 넣는 방법부터 달러 ETF까지. 환율 변화를 수익으로 만드는 전략입니다.",
  },
  {
    index: 35, slug: "money-035", level: "재테크", category: "money",
    title: "금 투자, 실물 vs ETF vs 통장 비교",
    keywords: "금투자,금ETF,금통장,금실물,금현물",
    meta_description: "금 투자를 시작하려는데 어떤 방법이 좋을지 모르겠다면. 실물·ETF·통장 세 가지를 꼼꼼하게 비교합니다.",
  },
  {
    index: 36, slug: "money-036", level: "재테크", category: "money",
    title: "달러 예금 vs 달러 ETF, 환율 방어 전략",
    keywords: "달러예금,달러ETF,TIGER달러,환율헤지",
    meta_description: "달러 투자를 할 때 외화 예금과 달러 ETF 중 어느 쪽이 더 유리할까? 세금과 유동성까지 비교합니다.",
  },
  {
    index: 37, slug: "money-037", level: "재테크", category: "money",
    title: "재테크 시작 전 반드시 없애야 할 나쁜 습관",
    keywords: "재테크습관,나쁜소비습관,돈새는곳,지출줄이기",
    meta_description: "재테크를 시작하기 전에 먼저 해야 할 일이 있습니다. 돈이 새는 습관을 먼저 잡지 않으면 투자도 소용없습니다.",
  },
  {
    index: 38, slug: "money-038", level: "재테크", category: "money",
    title: "신용카드 혜택 제대로 쓰는 법, 포인트 극대화",
    keywords: "신용카드혜택,카드포인트,신용카드추천,연회비혜택",
    meta_description: "신용카드를 어떻게 쓰느냐에 따라 연간 수십만 원의 혜택 차이가 납니다. 포인트와 캐시백 극대화 방법을 공유합니다.",
  },
  {
    index: 39, slug: "money-039", level: "재테크", category: "money",
    title: "50대 보험 리모델링, 불필요한 보험 정리법",
    keywords: "보험정리,보험리모델링,50대보험,보험해지",
    meta_description: "20~30대에 가입한 보험이 50대에도 필요한지 점검해야 합니다. 불필요한 보험을 정리하고 보험료를 줄이는 방법입니다.",
  },
  {
    index: 40, slug: "money-040", level: "재테크", category: "money",
    title: "50대 재무 점검 체크리스트 완전판",
    keywords: "재무점검,자산점검,50대재무,노후준비체크",
    meta_description: "50대라면 지금 자신의 재무 상태를 점검해야 합니다. 자산·부채·보험·연금까지 한 번에 정리하는 체크리스트입니다.",
  },

  // 노후·은퇴 설계 (41-50)
  {
    index: 41, slug: "money-041", level: "재테크", category: "money",
    title: "퇴직 후 생활비 얼마나 필요한가? 현실적인 계산",
    keywords: "노후생활비,은퇴생활비,노후자금계산,퇴직후생활",
    meta_description: "은퇴 후 실제로 얼마가 필요한지 계산해 보셨나요? 국민연금과 필요 생활비의 갭을 현실적으로 확인합니다.",
  },
  {
    index: 42, slug: "money-042", level: "재테크", category: "money",
    title: "퇴직금 운용, 받자마자 해야 할 일",
    keywords: "퇴직금운용,퇴직금IRP,퇴직금투자,퇴직금관리",
    meta_description: "퇴직금을 받은 직후 어떻게 해야 세금을 아끼고 수익도 올릴 수 있는지 단계별로 정리했습니다.",
  },
  {
    index: 43, slug: "money-043", level: "재테크", category: "money",
    title: "퇴직 후 건강보험 전략, 지역가입자 vs 임의계속",
    keywords: "퇴직후건강보험,지역가입자,임의계속가입,건강보험료",
    meta_description: "퇴직하면 건강보험료가 갑자기 올라갑니다. 어떤 방식을 선택해야 보험료를 줄일 수 있는지 비교합니다.",
  },
  {
    index: 44, slug: "money-044", level: "재테크", category: "money",
    title: "퇴직 전 3년이 중요한 이유, 노후 대비 마지막 전략",
    keywords: "퇴직준비,은퇴3년전,노후대비,퇴직전략",
    meta_description: "퇴직 3년 전부터 해야 할 일이 있습니다. 연금·보험·세금·생활 설계를 미리 준비해야 후회가 없습니다.",
  },
  {
    index: 45, slug: "money-045", level: "재테크", category: "money",
    title: "부동산 vs 주식, 50대는 어디에 투자해야 하나",
    keywords: "부동산주식비교,50대투자,부동산투자,주식투자비교",
    meta_description: "부동산과 주식, 50대 입장에서 어느 쪽이 더 유리한지 수익성·유동성·세금 기준으로 비교합니다.",
  },
  {
    index: 46, slug: "money-046", level: "재테크", category: "money",
    title: "50대 부채 관리, 대출 갚을 것인가 투자할 것인가",
    keywords: "50대대출,부채관리,대출상환vs투자,금리비교",
    meta_description: "대출이 있을 때 빨리 갚는 게 나을까, 아니면 투자를 먼저 해야 할까? 금리 기준으로 현실적인 답을 드립니다.",
  },
  {
    index: 47, slug: "money-047", level: "재테크", category: "money",
    title: "건강보험료 줄이는 절세 방법",
    keywords: "건강보험료절감,피부양자등재,건강보험절세,건강보험피부양자",
    meta_description: "건강보험료를 합법적으로 줄이는 방법이 있습니다. 피부양자 요건부터 금융소득 관리까지 정리했습니다.",
  },
  {
    index: 48, slug: "money-048", level: "재테크", category: "money",
    title: "연말정산 환급 극대화, 놓치는 공제 항목 총정리",
    keywords: "연말정산공제,연말정산환급,연말정산항목,세금환급",
    meta_description: "연말정산을 제대로 하지 않으면 돌려받을 돈을 그냥 놓칩니다. 자주 빠뜨리는 공제 항목을 한 번에 정리했습니다.",
  },
  {
    index: 49, slug: "money-049", level: "재테크", category: "money",
    title: "자녀에게 증여하는 법, 세금 없이 넘기는 방법",
    keywords: "자녀증여,증여세,비과세증여,증여한도",
    meta_description: "자녀에게 돈을 줄 때 증여세 없이 줄 수 있는 한도와 방법. 10년 단위 증여 계획을 미리 세우는 것이 중요합니다.",
  },
  {
    index: 50, slug: "money-050", level: "재테크", category: "money",
    title: "상속세 vs 증여세, 50대가 알아야 할 기본 지식",
    keywords: "상속세,증여세비교,상속계획,증여계획",
    meta_description: "상속과 증여 중 어느 쪽이 유리한지는 상황에 따라 다릅니다. 50대가 알아야 할 기본 지식을 정리했습니다.",
  },

  // 부업·수익화 (51-60)
  {
    index: 51, slug: "money-051", level: "재테크", category: "money",
    title: "부업으로 월 50만원 버는 현실적인 방법",
    keywords: "직장인부업,월50만원,부업추천,재택부업",
    meta_description: "투잡이 부담스러운 직장인도 할 수 있는 현실적인 부업 방법. 시간 대비 수익이 좋은 것들만 골랐습니다.",
  },
  {
    index: 52, slug: "money-052", level: "재테크", category: "money",
    title: "직장인 블로그 수익화, 얼마나 벌 수 있나",
    keywords: "블로그수익화,블로그광고,애드센스수익,블로그부업",
    meta_description: "블로그 수익화가 현실적으로 가능한지, 직장 다니면서 얼마나 벌 수 있는지 솔직한 수치를 공유합니다.",
  },
  {
    index: 53, slug: "money-053", level: "재테크", category: "money",
    title: "스마트스토어 부업, 직장 다니면서 가능한가",
    keywords: "스마트스토어,네이버쇼핑,직장인부업,온라인쇼핑몰",
    meta_description: "스마트스토어를 직장 다니면서 운영할 수 있을까? 현실적인 준비 과정과 수익까지 정리했습니다.",
  },
  {
    index: 54, slug: "money-054", level: "재테크", category: "money",
    title: "강의 플랫폼 부업, 내 전문성을 돈으로 만드는 법",
    keywords: "클래스101,탈잉강의,온라인강의부업,전문성수익화",
    meta_description: "30년 직장 경험이 콘텐츠가 될 수 있습니다. 강의 플랫폼에서 나만의 전문성을 수익으로 연결하는 방법입니다.",
  },
  {
    index: 55, slug: "money-055", level: "재테크", category: "money",
    title: "퇴직 후 재취업 vs 창업, 현실적인 비교",
    keywords: "퇴직후재취업,50대창업,은퇴후일,재취업창업비교",
    meta_description: "퇴직 후 다시 취업할 것인가, 창업할 것인가. 50대 현실에서 어느 쪽이 더 안전하고 지속 가능한지 비교합니다.",
  },
  {
    index: 56, slug: "money-056", level: "재테크", category: "money",
    title: "프리랜서 세금 신고, 3.3% 떼고 끝이 아니다",
    keywords: "프리랜서세금,3.3%원천징수,종합소득세신고,프리랜서종소세",
    meta_description: "프리랜서 수입에서 3.3%를 떼면 끝난 게 아닙니다. 종합소득세 신고를 제대로 해야 환급도 받고 세금도 줄입니다.",
  },
  {
    index: 57, slug: "money-057", level: "재테크", category: "money",
    title: "50대 창업 성공률 높이는 현실적인 준비",
    keywords: "50대창업,창업준비,은퇴창업,창업성공",
    meta_description: "50대 창업 실패율이 높다는 말, 어디서 차이가 날까? 성공한 50대 창업자들의 공통점을 정리했습니다.",
  },
  {
    index: 58, slug: "money-058", level: "재테크", category: "money",
    title: "프랜차이즈 창업, 50대가 꼭 확인해야 할 것들",
    keywords: "프랜차이즈창업,가맹점창업,창업정보공개서,프랜차이즈주의",
    meta_description: "프랜차이즈 창업이 안전해 보이지만 함정이 있습니다. 50대가 계약서 쓰기 전에 반드시 확인해야 할 것들입니다.",
  },
  {
    index: 59, slug: "money-059", level: "재테크", category: "money",
    title: "종합소득세 신고, 직장인도 해야 하는 경우",
    keywords: "종합소득세,직장인종소세,부업세금,금융소득종합과세",
    meta_description: "직장인도 종합소득세 신고를 해야 하는 경우가 있습니다. 어떤 경우인지, 신고하면 오히려 환급을 받는 경우는 언제인지.",
  },
  {
    index: 60, slug: "money-060", level: "재테크", category: "money",
    title: "주택 양도세 절세, 1세대 1주택 비과세 조건",
    keywords: "양도세절세,1세대1주택비과세,주택양도세,비과세요건",
    meta_description: "집을 팔 때 양도세를 안 낼 수 있는 조건이 있습니다. 1세대 1주택 비과세 요건을 정확히 알아야 손해가 없습니다.",
  },

  // 추가 재테크 (61-78)
  {
    index: 61, slug: "money-061", level: "재테크", category: "money",
    title: "50대 투자 실수 10가지, 선배들이 후회한 것들",
    keywords: "투자실수,50대투자실패,투자후회,재테크실수",
    meta_description: "50대 직장인들이 가장 많이 후회하는 투자 실수 10가지. 남의 실패에서 배우는 것이 가장 빠른 지름길입니다.",
  },
  {
    index: 62, slug: "money-062", level: "재테크", category: "money",
    title: "주택담보대출 금리 낮추는 현실적인 방법",
    keywords: "주담대금리,대출금리인하,주담대갈아타기,금리협상",
    meta_description: "지금 납부하는 주택담보대출 금리가 최선인지 확인해 보셨나요? 금리를 낮추는 실질적인 방법을 알려드립니다.",
  },
  {
    index: 63, slug: "money-063", level: "재테크", category: "money",
    title: "대환대출 제대로 활용하는 법, 이자 줄이기",
    keywords: "대환대출,대출갈아타기,저금리대출,이자절약",
    meta_description: "대환대출을 활용하면 이자를 크게 줄일 수 있습니다. 대환 조건과 절차, 주의사항을 정리했습니다.",
  },
  {
    index: 64, slug: "money-064", level: "재테크", category: "money",
    title: "노령연금 최대화 전략, 임의가입과 추납 활용",
    keywords: "노령연금,국민연금추납,임의계속가입,연금극대화",
    meta_description: "국민연금 납부 기간이 부족하다면 추납이나 임의 계속 가입으로 채울 수 있습니다. 연금을 최대한 받는 전략입니다.",
  },
  {
    index: 65, slug: "money-065", level: "재테크", category: "money",
    title: "의료비 공제, 생각보다 많이 돌려받을 수 있다",
    keywords: "의료비공제,연말정산의료비,의료비세액공제,의료비환급",
    meta_description: "의료비 세액공제는 놓치면 그냥 날아가는 돈입니다. 어떤 의료비가 공제되는지, 가족 합산이 되는지 확인하세요.",
  },
  {
    index: 66, slug: "money-066", level: "재테크", category: "money",
    title: "기부금 세액공제, 절세와 나눔 동시에",
    keywords: "기부금공제,기부세액공제,연말정산기부금,절세기부",
    meta_description: "기부를 하면 세금도 줄어듭니다. 기부금 세액공제 방법과 공제율, 한도를 정확히 알고 신고하세요.",
  },
  {
    index: 67, slug: "money-067", level: "재테크", category: "money",
    title: "해외 주식 투자, 세금과 환전 수수료 줄이는 법",
    keywords: "해외주식세금,해외주식양도세,해외주식환전,해외주식투자",
    meta_description: "해외 주식을 살 때 세금과 환전 수수료를 줄이는 방법. 놓치면 수익의 상당 부분이 사라집니다.",
  },
  {
    index: 68, slug: "money-068", level: "재테크", category: "money",
    title: "50대 금융 사기 예방, 이런 투자 제안은 무조건 의심",
    keywords: "금융사기예방,투자사기,유사수신,불법투자",
    meta_description: "50대를 노리는 금융 사기 수법이 진화하고 있습니다. 절대 속으면 안 되는 패턴과 대처법을 정리했습니다.",
  },
  {
    index: 69, slug: "money-069", level: "재테크", category: "money",
    title: "임대사업자 등록, 지금도 유리한가",
    keywords: "임대사업자등록,임대사업자혜택,임대사업자세금,주택임대",
    meta_description: "임대사업자 등록이 예전만큼 유리하지 않다는 말이 있습니다. 지금 시점에서 득실을 따져봤습니다.",
  },
  {
    index: 70, slug: "money-070", level: "재테크", category: "money",
    title: "오피스텔 투자, 지금도 수익이 나는가",
    keywords: "오피스텔투자,오피스텔수익률,소형오피스텔,오피스텔임대",
    meta_description: "오피스텔 투자 수익률이 예전만 못하다는데 지금도 할 만할까? 실제 수익 계산과 리스크를 정직하게 분석합니다.",
  },
  {
    index: 71, slug: "money-071", level: "재테크", category: "money",
    title: "P2P 투자, 안전하게 하는 방법이 있나",
    keywords: "P2P투자,P2P금융,크라우드펀딩,P2P위험",
    meta_description: "P2P 투자는 수익률이 높지만 리스크도 큽니다. 안전하게 접근하는 방법과 반드시 피해야 할 플랫폼 유형입니다.",
  },
  {
    index: 72, slug: "money-072", level: "재테크", category: "money",
    title: "전세 vs 월세, 50대에게 유리한 선택은",
    keywords: "전세월세비교,전세보증금,월세전환,50대주거",
    meta_description: "전세를 줄 때와 월세를 줄 때 수익이 어떻게 다른지. 50대 집주인 입장에서 어느 쪽이 더 유리한지 비교합니다.",
  },
  {
    index: 73, slug: "money-073", level: "재테크", category: "money",
    title: "50대 포트폴리오 총정리, 이 구성이 정답이다",
    keywords: "50대포트폴리오,자산배분,투자비율,안정성장형",
    meta_description: "50대에게 맞는 투자 포트폴리오 구성 비율은 어떻게 될까? 위험 감수 능력과 은퇴 시점을 고려한 기준을 제시합니다.",
  },
  {
    index: 74, slug: "money-074", level: "재테크", category: "money",
    title: "온라인 쇼핑몰 창업, 50대도 할 수 있는 소자본 방법",
    keywords: "온라인쇼핑몰창업,소자본창업,위탁판매,해외구매대행",
    meta_description: "자본금 적게, 리스크 작게 시작할 수 있는 온라인 쇼핑몰 창업 방법. 50대가 시작하기 좋은 아이템까지 정리했습니다.",
  },
  {
    index: 75, slug: "money-075", level: "재테크", category: "money",
    title: "돈 공부 시작하는 법, 50대에게 추천하는 재테크 책 5권",
    keywords: "재테크책추천,금융책,투자책,돈공부",
    meta_description: "재테크를 배우고 싶은데 어디서 시작해야 할지 모르겠다면. 50대가 읽기 좋은 재테크·투자 책 5권을 추천합니다.",
  },
  {
    index: 76, slug: "money-076", level: "재테크", category: "money",
    title: "금융문맹 탈출, 꼭 알아야 할 경제 용어 20가지",
    keywords: "금융용어,경제용어,재테크용어,투자용어",
    meta_description: "뉴스를 봐도 무슨 말인지 모르겠다면. 50대 직장인이 알아야 할 금융·경제 용어 20가지를 쉽게 정리했습니다.",
  },
  {
    index: 77, slug: "money-077", level: "재테크", category: "money",
    title: "목돈 굴리기, 1억이 생겼을 때 50대의 선택",
    keywords: "목돈투자,1억투자,목돈운용,자산분산",
    meta_description: "1억 원이 생겼을 때 어떻게 굴려야 할까? 50대 입장에서 안전하고 수익률도 챙기는 포트폴리오를 제안합니다.",
  },
  {
    index: 78, slug: "money-078", level: "재테크", category: "money",
    title: "50대 재테크 1년 결산, 자산 점검과 내년 계획",
    keywords: "재테크결산,자산점검,연간재무,재테크계획",
    meta_description: "1년을 마무리하며 자산을 점검하고 다음 해 재테크 계획을 세우는 방법. 50대 직장인을 위한 연간 재무 루틴입니다.",
  },

  // ── 건강 편 48개 ──────────────────────────────────────

  // 운동 (79-90)
  {
    index: 79, slug: "health-001", level: "건강", category: "health",
    title: "직장인 퇴근 후 20분 스트레칭 루틴",
    keywords: "직장인스트레칭,퇴근후운동,사무직스트레칭,20분운동",
    meta_description: "하루 종일 앉아 있는 직장인에게 꼭 필요한 퇴근 후 20분 스트레칭 루틴. 피로 회복과 통증 예방에 효과적입니다.",
  },
  {
    index: 80, slug: "health-002", level: "건강", category: "health",
    title: "50대 골프, 몸 망치지 않는 준비운동 5가지",
    keywords: "골프준비운동,50대골프,골프부상예방,골프스트레칭",
    meta_description: "골프 치기 전 준비운동을 건너뛰면 50대 몸은 바로 반응합니다. 부상 없이 오래 골프 즐기는 필수 준비운동 5가지입니다.",
  },
  {
    index: 81, slug: "health-003", level: "건강", category: "health",
    title: "무릎 안 아프게 걷는 법, 중장년 필수 상식",
    keywords: "무릎건강,올바른걷기,무릎통증예방,중장년걷기",
    meta_description: "걸을 때 무릎이 아프다면 걷는 방법이 잘못됐을 수 있습니다. 50대 무릎을 지키는 올바른 보행법을 알려드립니다.",
  },
  {
    index: 82, slug: "health-004", level: "건강", category: "health",
    title: "50대 뱃살 빼는 현실적인 방법",
    keywords: "50대뱃살,내장지방,뱃살빼기,복부비만",
    meta_description: "50대 뱃살은 20~30대와 다릅니다. 중장년 대사에 맞는 현실적인 뱃살 감량 방법을 운동과 식단으로 나눠 설명합니다.",
  },
  {
    index: 83, slug: "health-005", level: "건강", category: "health",
    title: "50대 어깨 통증, 방치하면 안 되는 이유",
    keywords: "어깨통증,오십견,회전근개파열,어깨건강",
    meta_description: "어깨가 아프다고 그냥 두면 오십견이나 회전근개 파열로 악화됩니다. 어깨 통증 원인별 대처법과 예방 운동입니다.",
  },
  {
    index: 84, slug: "health-006", level: "건강", category: "health",
    title: "중장년 관절 건강, 지금부터 관리하는 법",
    keywords: "관절건강,연골관리,무릎관절,관절건강식품",
    meta_description: "한 번 닳으면 돌아오지 않는 연골을 지키는 방법. 50대부터 시작하는 관절 건강 관리 루틴을 소개합니다.",
  },
  {
    index: 85, slug: "health-007", level: "건강", category: "health",
    title: "직장인 점심시간 10분 운동법",
    keywords: "점심운동,직장인운동,짧은운동,틈새운동",
    meta_description: "바쁜 직장인도 점심시간 10분이면 충분합니다. 자리에서 할 수 있는 간단한 운동부터 계단 운동까지 정리했습니다.",
  },
  {
    index: 86, slug: "health-008", level: "건강", category: "health",
    title: "걷기 vs 달리기, 50대에게 유리한 운동은",
    keywords: "걷기달리기비교,50대운동,유산소운동,관절부담",
    meta_description: "걷기와 달리기 중 어느 쪽이 50대 몸에 더 좋을까? 칼로리 소모와 관절 부담을 기준으로 비교합니다.",
  },
  {
    index: 87, slug: "health-009", level: "건강", category: "health",
    title: "홈트레이닝, 기구 없이 50대 근력 키우는 법",
    keywords: "홈트레이닝,50대근력운동,집에서운동,자체중량운동",
    meta_description: "헬스장 등록 없이도 집에서 근력을 키울 수 있습니다. 50대 체력에 맞는 홈트레이닝 루틴 4주 플랜입니다.",
  },
  {
    index: 88, slug: "health-010", level: "건강", category: "health",
    title: "50대 수영 시작하기, 관절에 가장 좋은 유산소",
    keywords: "수영운동,50대수영,수영관절,유산소운동추천",
    meta_description: "수영은 관절에 부담을 주지 않으면서 전신 운동이 됩니다. 50대에게 수영이 추천되는 이유와 시작 방법입니다.",
  },
  {
    index: 89, slug: "health-011", level: "건강", category: "health",
    title: "50대 근감소증 예방, 지금 당장 해야 할 운동",
    keywords: "근감소증,근육감소,50대근력,사르코페니아",
    meta_description: "50대부터 근육이 본격적으로 줄어듭니다. 근감소증을 예방하는 운동 방법과 단백질 섭취 기준을 정리했습니다.",
  },
  {
    index: 90, slug: "health-012", level: "건강", category: "health",
    title: "자전거 타기, 50대 체중 관리와 심폐 기능 향상",
    keywords: "자전거운동,50대자전거,사이클링운동,유산소자전거",
    meta_description: "자전거 타기는 관절 부담은 낮고 칼로리 소모는 높은 50대 최적 유산소 운동입니다. 실내자전거도 효과적입니다.",
  },

  // 식단·영양 (91-102)
  {
    index: 91, slug: "health-013", level: "건강", category: "health",
    title: "중장년 단백질 섭취, 하루 얼마나 먹어야 하나",
    keywords: "단백질섭취,50대단백질,근육단백질,단백질권장량",
    meta_description: "50대 이상은 젊을 때보다 더 많은 단백질이 필요합니다. 하루 권장량과 단백질 식품 선택 방법을 알려드립니다.",
  },
  {
    index: 92, slug: "health-014", level: "건강", category: "health",
    title: "직장인 점심 식단, 이것만 바꿔도 몸이 달라진다",
    keywords: "직장인점심,점심식단관리,건강한점심,혈당관리식단",
    meta_description: "점심 한 끼만 바꿔도 오후 피로도와 혈당이 달라집니다. 직장인이 실천할 수 있는 건강한 점심 식단 가이드입니다.",
  },
  {
    index: 93, slug: "health-015", level: "건강", category: "health",
    title: "50대 혈압 낮추는 음식 vs 올리는 음식",
    keywords: "혈압낮추는음식,혈압올리는음식,고혈압식단,나트륨",
    meta_description: "음식 선택만 잘해도 혈압을 조절할 수 있습니다. 혈압을 낮추는 음식과 피해야 할 음식을 구체적으로 정리했습니다.",
  },
  {
    index: 94, slug: "health-016", level: "건강", category: "health",
    title: "중장년 필수 영양제 5가지, 이것만 챙겨도 충분",
    keywords: "50대영양제,중장년영양제,영양제추천,비타민D",
    meta_description: "50대가 꼭 챙겨야 할 영양제 5가지. 효과와 복용법, 식품으로 대체 가능한지 여부까지 정리했습니다.",
  },
  {
    index: 95, slug: "health-017", level: "건강", category: "health",
    title: "50대 당뇨 예방 식단, 혈당 스파이크 막는 법",
    keywords: "당뇨예방식단,혈당스파이크,혈당관리,당뇨식이요법",
    meta_description: "혈당 스파이크가 반복되면 당뇨로 이어집니다. 혈당을 안정적으로 유지하는 식사 순서와 식품 선택법을 알려드립니다.",
  },
  {
    index: 96, slug: "health-018", level: "건강", category: "health",
    title: "콜레스테롤 낮추는 식습관, 약 먹기 전에 해볼 것",
    keywords: "콜레스테롤낮추기,LDL콜레스테롤,콜레스테롤식단,지질이상",
    meta_description: "콜레스테롤 수치가 높게 나왔다면 약 처방 전에 식습관부터 바꿔보세요. 효과 입증된 방법들을 정리했습니다.",
  },
  {
    index: 97, slug: "health-019", level: "건강", category: "health",
    title: "간헐적 단식, 50대에게 맞는 방법이 있나",
    keywords: "간헐적단식,16:8단식,50대단식,간헐적단식효과",
    meta_description: "간헐적 단식이 50대에게도 효과적일까? 주의해야 할 점과 50대 체질에 맞는 단식 방법을 설명합니다.",
  },
  {
    index: 98, slug: "health-020", level: "건강", category: "health",
    title: "술 줄이는 현실적인 방법, 50대 간 건강 지키기",
    keywords: "음주줄이기,50대음주,간건강,알코올간손상",
    meta_description: "직장 회식과 술자리가 많은 50대. 술을 완전히 끊기 어렵다면 최소한 이것만이라도 지켜서 간을 보호하세요.",
  },
  {
    index: 99, slug: "health-021", level: "건강", category: "health",
    title: "커피와 건강, 하루 몇 잔까지 괜찮은가",
    keywords: "커피건강,카페인권장량,커피효능,커피부작용",
    meta_description: "커피가 몸에 좋다는 연구와 나쁘다는 연구가 공존합니다. 50대에게 커피는 어떤 영향을 미치는지 정리했습니다.",
  },
  {
    index: 100, slug: "health-022", level: "건강", category: "health",
    title: "50대 뱃살 제거에 효과적인 식단 방법",
    keywords: "내장지방식단,뱃살제거식이,저탄고지,복부지방",
    meta_description: "운동만으로는 뱃살이 잘 안 빠집니다. 식단으로 내장지방을 줄이는 데 효과적인 방법을 소개합니다.",
  },
  {
    index: 101, slug: "health-023", level: "건강", category: "health",
    title: "지중해 식단, 50대 심혈관 건강에 최고인 이유",
    keywords: "지중해식단,심혈관건강식단,건강한지방,올리브오일",
    meta_description: "지중해 식단이 심혈관 질환과 치매 예방에 효과적이라는 연구가 많습니다. 한국인이 실천하는 방법을 알아봅니다.",
  },
  {
    index: 102, slug: "health-024", level: "건강", category: "health",
    title: "장 건강 지키기, 유산균 먹기 전에 알아야 할 것",
    keywords: "장건강,유산균효과,장내미생물,프로바이오틱스",
    meta_description: "장 건강이 전신 건강의 기본입니다. 유산균 제품을 선택하기 전에 먼저 알아야 할 것들을 정리했습니다.",
  },

  // 멘탈·수면 (103-112)
  {
    index: 103, slug: "health-025", level: "건강", category: "health",
    title: "수면의 질 높이는 직장인 루틴",
    keywords: "수면질개선,수면루틴,50대수면,불면증예방",
    meta_description: "잠을 충분히 자도 피곤하다면 수면의 질이 문제입니다. 수면의 질을 높이는 취침 전 루틴과 수면 환경 개선법입니다.",
  },
  {
    index: 104, slug: "health-026", level: "건강", category: "health",
    title: "갱년기 증상, 남성도 겪는다",
    keywords: "남성갱년기,남성호르몬,테스토스테론감소,갱년기증상",
    meta_description: "여성만 갱년기를 겪는 게 아닙니다. 50대 남성에게 찾아오는 갱년기 증상과 관리 방법을 솔직하게 정리했습니다.",
  },
  {
    index: 105, slug: "health-027", level: "건강", category: "health",
    title: "50대 직장 스트레스 관리, 마음 건강 지키는 법",
    keywords: "스트레스관리,직장스트레스,50대스트레스,마음건강",
    meta_description: "50대 직장인의 스트레스는 몸으로 먼저 나타납니다. 스트레스를 줄이는 현실적인 방법과 마음 건강 관리법입니다.",
  },
  {
    index: 106, slug: "health-028", level: "건강", category: "health",
    title: "번아웃 증후군, 직장인이 회복하는 현실적인 방법",
    keywords: "번아웃,소진증후군,직장인번아웃,번아웃회복",
    meta_description: "더 이상 아무것도 하기 싫다는 느낌이 든다면 번아웃 신호입니다. 빠르게 회복하는 현실적인 방법을 소개합니다.",
  },
  {
    index: 107, slug: "health-029", level: "건강", category: "health",
    title: "50대 우울감, 무시하면 안 되는 이유",
    keywords: "50대우울,중장년우울증,남성우울증,직장인우울",
    meta_description: "50대에 찾아오는 우울감은 의지 문제가 아닙니다. 증상을 인식하고 적절히 대처하는 방법을 알려드립니다.",
  },
  {
    index: 108, slug: "health-030", level: "건강", category: "health",
    title: "명상 입문, 5분으로 시작하는 마음 챙김",
    keywords: "명상방법,마음챙김,5분명상,스트레스명상",
    meta_description: "명상이 어렵게 느껴진다면 5분부터 시작하세요. 복잡한 테크닉 없이도 효과를 볼 수 있는 마음 챙김 방법입니다.",
  },
  {
    index: 109, slug: "health-031", level: "건강", category: "health",
    title: "50대 수면 장애, 자꾸 새벽에 깨는 이유",
    keywords: "수면장애,새벽각성,50대불면증,수면각성",
    meta_description: "새벽 3~4시에 잠이 깨서 다시 잠들지 못한다면 50대 수면 장애의 신호입니다. 원인과 개선 방법을 알려드립니다.",
  },
  {
    index: 110, slug: "health-032", level: "건강", category: "health",
    title: "디지털 디톡스, 스마트폰을 줄이면 뭔가 달라지나",
    keywords: "디지털디톡스,스마트폰중독,SNS줄이기,디지털건강",
    meta_description: "스마트폰을 줄이면 수면의 질이 올라가고 집중력이 회복됩니다. 실천 가능한 디지털 디톡스 방법을 소개합니다.",
  },
  {
    index: 111, slug: "health-033", level: "건강", category: "health",
    title: "50대 사회적 고립 예방, 인간관계 지키는 법",
    keywords: "사회적고립,50대인간관계,외로움,사회적건강",
    meta_description: "50대에 친구가 줄어드는 건 자연스럽지만 고립은 건강에 위험합니다. 건강한 인간관계를 유지하는 현실적인 방법입니다.",
  },
  {
    index: 112, slug: "health-034", level: "건강", category: "health",
    title: "공황장애와 과호흡, 직장인이 알아야 할 대처법",
    keywords: "공황장애증상,과호흡대처,공황발작,심리응급처치",
    meta_description: "갑자기 심장이 두근거리고 숨이 막히는 느낌이 든다면. 공황 증상을 알아채고 즉시 대처하는 방법을 정리했습니다.",
  },

  // 만성질환 관리 (113-122)
  {
    index: 113, slug: "health-035", level: "건강", category: "health",
    title: "혈압 관리, 약 먹기 전에 해볼 것들",
    keywords: "혈압관리,고혈압생활습관,혈압낮추기,혈압약전",
    meta_description: "혈압이 조금 높다고 바로 약을 먹어야 할까? 생활습관 개선만으로 혈압을 낮출 수 있는 방법을 먼저 시도해 보세요.",
  },
  {
    index: 114, slug: "health-036", level: "건강", category: "health",
    title: "직장인 눈 건강, 하루 종일 모니터 보는 사람 필독",
    keywords: "눈건강,안구건조증,눈피로,VDT증후군",
    meta_description: "하루 8시간 이상 모니터를 보는 직장인의 눈 건강은 적신호입니다. 눈 피로를 줄이는 습관과 눈 운동법을 정리했습니다.",
  },
  {
    index: 115, slug: "health-037", level: "건강", category: "health",
    title: "50대 피로 만성이라면 이것부터 확인하라",
    keywords: "만성피로,50대피로원인,피로회복,갑상선피로",
    meta_description: "충분히 자도 피곤하고 늘 무기력하다면 원인을 찾아야 합니다. 만성 피로의 숨은 원인 7가지와 대처법입니다.",
  },
  {
    index: 116, slug: "health-038", level: "건강", category: "health",
    title: "50대 당뇨 전단계, 지금 잡아야 하는 이유",
    keywords: "당뇨전단계,공복혈당장애,당뇨예방,혈당관리",
    meta_description: "당뇨 전단계는 아직 되돌릴 수 있습니다. 지금 생활습관을 바꾸면 당뇨로 가는 것을 막을 수 있습니다.",
  },
  {
    index: 117, slug: "health-039", level: "건강", category: "health",
    title: "허리 디스크 예방, 사무직 직장인 필수 습관",
    keywords: "허리디스크예방,요통예방,허리건강,앉는자세교정",
    meta_description: "앉아서 일하는 사무직 직장인은 허리 디스크 위험이 높습니다. 올바른 자세와 허리를 지키는 생활 습관을 정리했습니다.",
  },
  {
    index: 118, slug: "health-040", level: "건강", category: "health",
    title: "50대 심혈관 건강, 지금부터 챙겨야 할 것들",
    keywords: "심혈관건강,심장건강,50대심장,심혈관예방",
    meta_description: "심혈관 질환은 갑자기 찾아옵니다. 50대부터 심혈관 건강을 챙기기 위해 지금 당장 실천할 수 있는 것들을 정리했습니다.",
  },
  {
    index: 119, slug: "health-041", level: "건강", category: "health",
    title: "위장 건강 지키기, 역류성 식도염 예방",
    keywords: "역류성식도염,위건강,소화불량,위장건강",
    meta_description: "역류성 식도염은 방치하면 식도암으로 이어질 수 있습니다. 50대 위장 건강을 지키는 생활 습관을 알려드립니다.",
  },
  {
    index: 120, slug: "health-042", level: "건강", category: "health",
    title: "50대 전립선 건강, 남성이 꼭 알아야 할 것들",
    keywords: "전립선건강,전립선비대증,빈뇨,50대남성건강",
    meta_description: "50대 남성의 절반 이상이 전립선 문제를 경험합니다. 전립선 비대증 증상과 예방 생활습관을 솔직하게 정리했습니다.",
  },
  {
    index: 121, slug: "health-043", level: "건강", category: "health",
    title: "갑상선 이상, 피로와 체중 변화의 숨은 원인",
    keywords: "갑상선기능저하,갑상선건강,갑상선증상,갑상선검사",
    meta_description: "이유 없이 피곤하고 체중이 변한다면 갑상선을 확인해 보세요. 갑상선 이상 증상과 검사 항목을 정리했습니다.",
  },
  {
    index: 122, slug: "health-044", level: "건강", category: "health",
    title: "치주염과 전신 건강, 잇몸이 몸 전체에 미치는 영향",
    keywords: "치주염,잇몸건강,구강건강,치주질환",
    meta_description: "잇몸이 안 좋으면 심혈관 질환, 당뇨 위험까지 올라갑니다. 치주염이 전신에 미치는 영향과 예방 방법입니다.",
  },

  // 건강검진·예방 (123-126)
  {
    index: 123, slug: "health-045", level: "건강", category: "health",
    title: "국가건강검진 완전정복, 50대가 챙겨야 할 항목",
    keywords: "건강검진항목,50대건강검진,암검진,건강보험검진",
    meta_description: "국가에서 무료로 해주는 건강검진, 어떤 항목이 있는지 아시나요? 50대가 챙겨야 할 검진 항목과 추가 검사를 정리했습니다.",
  },
  {
    index: 124, slug: "health-046", level: "건강", category: "health",
    title: "50대 암 검진, 위암·대장암·폐암 예방 전략",
    keywords: "암검진,위암예방,대장암예방,폐암예방",
    meta_description: "50대에 가장 많이 발생하는 암 3가지의 예방과 조기 발견 전략. 어떤 검사를 언제 받아야 하는지 정리했습니다.",
  },
  {
    index: 125, slug: "health-047", level: "건강", category: "health",
    title: "뼈 건강 지키기, 50대 골다공증 예방 식단과 운동",
    keywords: "골다공증예방,뼈건강,칼슘섭취,50대골밀도",
    meta_description: "50대부터 골밀도가 급격히 낮아집니다. 골다공증을 예방하는 식단과 운동을 지금부터 시작하세요.",
  },
  {
    index: 126, slug: "health-048", level: "건강", category: "health",
    title: "50대 두뇌 건강, 치매 예방을 위해 지금 할 수 있는 것",
    keywords: "치매예방,두뇌건강,인지기능,치매예방식단",
    meta_description: "치매는 갑자기 오지 않습니다. 50대부터 시작하는 두뇌 건강 관리가 20년 후를 결정합니다.",
  },

  // ── 일상 편 4개 ──────────────────────────────────────
  {
    index: 127, slug: "life-001", level: "일상", category: "life",
    title: "50대 직장인의 하루 루틴, 몸과 돈을 지키는 습관",
    keywords: "50대루틴,직장인하루루틴,건강재테크습관,모닝루틴",
    meta_description: "재테크와 건강, 두 마리 토끼를 잡는 50대 직장인의 현실적인 하루 루틴을 공유합니다.",
  },
  {
    index: 128, slug: "life-002", level: "일상", category: "life",
    title: "50대에게 추천하는 책 5권, 돈과 건강의 인사이트",
    keywords: "50대추천책,재테크책,건강책,인생책",
    meta_description: "50대 직장인이 읽으면 좋을 재테크와 건강에 관한 책 5권을 소개합니다. 돈과 몸을 함께 단단하게 만드는 독서 목록.",
  },
  {
    index: 129, slug: "life-003", level: "일상", category: "life",
    title: "50대 직장인의 위기와 기회, 지금이 기회인 이유",
    keywords: "50대직장인,중년위기,50대기회,제2인생",
    meta_description: "50대를 위기라고만 보면 기회를 놓칩니다. 지금 이 시기를 어떻게 바라보고 활용할 수 있는지 이야기합니다.",
  },
  {
    index: 130, slug: "life-004", level: "일상", category: "life",
    title: "단단한 50, 올 한해를 돌아보며 — 독자와 함께",
    keywords: "연간회고,한해결산,50대회고,독자소통",
    meta_description: "단단한 50과 함께한 1년. 재테크와 건강에서 어떤 변화가 있었는지, 독자와 함께 돌아보는 연간 회고입니다.",
  },
];
