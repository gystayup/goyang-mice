export type TicketCategory =
  | "concert"
  | "festival"
  | "exhibition"
  | "family"
  | "k-pop";

export interface TicketOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

export interface TicketProduct {
  id: string;
  category: TicketCategory;
  badge: string;
  title: string;
  subtitle: string;
  venue: string;
  dateText: string;
  imageTone: string;
  summary: string;
  description: string;
  posterLabel: string;
  tags: string[];
  options: TicketOption[];
  // 상세 소개 콘텐츠
  imageUrl?: string;     // 포스터 사진
  duration?: string;     // 공연 시간 (예: "165분 (인터미션 20분 포함)")
  ageLimit?: string;     // 관람 연령 (예: "14세 이상")
}

export const ticketCategories: Array<{ id: TicketCategory | "all"; label: string }> = [
  { id: "all", label: "전체" },
  { id: "concert", label: "콘서트" },
  { id: "festival", label: "페스티벌" },
  { id: "exhibition", label: "전시/행사" },
  { id: "family", label: "아동/가족" },
  { id: "k-pop", label: "K-POP" },
];

export const ticketProducts: TicketProduct[] = [
  {
    id: "goyang-kpop-arena-open",
    category: "k-pop",
    badge: "오픈 예정",
    title: "GOYANG K-POP ARENA OPEN STAGE",
    subtitle: "고양형 K-POP 연계 공연",
    venue: "고양 K-POP 아레나",
    dateText: "2026.05.14 - 2026.05.16",
    imageTone: "from-cyan-200 via-fuchsia-200 to-sky-300",
    posterLabel: "ARENA",
    summary: "고양 공연 인프라의 시작을 알리는 대표 K-POP 라이브 시리즈입니다.",
    description:
      "고양 K-POP 아레나 개장과 함께 진행되는 시그니처 공연 시리즈입니다. 프리미엄존, 일반존, 가족 관람존으로 구성되며 공연 이후 DMC 체류 프로그램과도 연결됩니다.",
    tags: ["K-POP", "공연", "프리미엄 좌석"],
    options: [
      { id: "vip", label: "VIP 패키지", price: 198000, benefits: ["우선 입장", "웰컴 굿즈"] },
      { id: "r", label: "R석", price: 143000, benefits: ["지정 좌석", "모바일 티켓"] },
      { id: "s", label: "S석", price: 99000, benefits: ["지정 좌석", "현장 발권 가능"] },
    ],
  },
  {
    id: "goyang-con-city-festival",
    category: "festival",
    badge: "2차 티켓 오픈",
    title: "GOYANG CON CITY FESTIVAL",
    subtitle: "도시 라이프스타일 뮤직 페스티벌",
    venue: "일산 문화광장",
    dateText: "2026.06.20 - 2026.06.21",
    imageTone: "from-yellow-100 via-cyan-200 to-lime-200",
    posterLabel: "FEST",
    summary: "음악, 푸드, 야간체험을 함께 즐기는 여름 시즌 야외 페스티벌입니다.",
    description:
      "도심 속 야외 공간에서 열리는 라이프스타일 뮤직 페스티벌입니다. 공연 관람과 함께 푸드존, 로컬 굿즈, 야간 콘텐츠를 묶어 체류형 일정 구성이 가능합니다.",
    tags: ["페스티벌", "야외 공연", "푸드존"],
    options: [
      { id: "two-day", label: "양일권", price: 129000, benefits: ["양일 입장", "MD 구매권"] },
      { id: "day-pass", label: "1일권", price: 78000, benefits: ["지정 날짜 입장"] },
    ],
  },
  {
    id: "goyang-art-night",
    category: "exhibition",
    badge: "좌석 추가 오픈",
    title: "GOYANG ART NIGHT EXHIBITION",
    subtitle: "미디어아트 + 야간 전시",
    venue: "고양아람누리 전시관",
    dateText: "2026.05.01 - 2026.05.30",
    imageTone: "from-stone-200 via-indigo-200 to-pink-200",
    posterLabel: "ART",
    summary: "야간 관람과 전시 체험 프로그램을 결합한 몰입형 전시 티켓입니다.",
    description:
      "미디어아트형 전시와 야간 아트워크 프로그램, 로컬 카페 쿠폰을 결합한 전시형 티켓입니다. 단체 관람과 기업형 방문객 예약도 지원할 수 있습니다.",
    tags: ["전시", "야간", "미디어아트"],
    options: [
      { id: "docent", label: "도슨트 패키지", price: 42000, benefits: ["도슨트 포함", "카페 쿠폰"] },
      { id: "general", label: "일반 입장권", price: 18000, benefits: ["전시 입장", "모바일 티켓"] },
    ],
  },
  {
    id: "goyang-family-play",
    category: "family",
    badge: "가족 추천",
    title: "GOYANG FAMILY PLAY WEEK",
    subtitle: "아동/가족 체험 공연",
    venue: "고양어울림누리",
    dateText: "2026.07.03 - 2026.07.12",
    imageTone: "from-pink-100 via-amber-100 to-sky-200",
    posterLabel: "FAMILY",
    summary: "아이와 가족이 함께 즐기는 체험형 공연과 워크숍 프로그램입니다.",
    description:
      "가족 단위 방문객을 위해 공연 관람과 만들기 체험, 로컬 카페 쿠폰을 결합한 시즌형 티켓입니다. 숙박과 카페 예약과도 연동하기 좋습니다.",
    tags: ["가족", "체험 공연", "주말 프로그램"],
    options: [
      { id: "family-pack", label: "가족 패키지 4인", price: 136000, benefits: ["4인 입장", "체험 재료 포함"] },
      { id: "adult", label: "성인 1인권", price: 38000, benefits: ["공연 입장"] },
      { id: "child", label: "아동 1인권", price: 24000, benefits: ["공연 입장", "체험 참여"] },
    ],
  },
  {
    id: "goyang-kmusic-series",
    category: "concert",
    badge: "한정 특가",
    title: "GOYANG K-MUSIC SERIES",
    subtitle: "보컬/밴드 큐레이션 공연",
    venue: "고양아람누리 아람극장",
    dateText: "2026.04.24 - 2026.04.25",
    imageTone: "from-slate-800 via-slate-700 to-neutral-700",
    posterLabel: "LIVE",
    summary: "보컬과 밴드 중심으로 구성된 고양형 라이브 시리즈입니다.",
    description:
      "실내 공연장 중심의 프리미엄 라이브 콘텐츠로, 공연장 접근성과 체류 동선을 고려한 티켓 구조입니다. VIP 응대와 기업 초청 운영도 지원할 수 있습니다.",
    tags: ["콘서트", "밴드", "실내 공연"],
    options: [
      { id: "premium", label: "프리미엄석", price: 156000, benefits: ["전용 게이트", "MD 쿠폰"] },
      { id: "standard", label: "일반석", price: 88000, benefits: ["지정 좌석"] },
    ],
  },
  {
    id: "goyang-mice-opening-show",
    category: "concert",
    badge: "오픈 예정",
    title: "GOYANG MICE OPENING SHOW",
    subtitle: "비즈니스 연계 스페셜 퍼포먼스",
    venue: "KINTEX 야외무대",
    dateText: "2026.09.12",
    imageTone: "from-sky-200 via-blue-200 to-indigo-300",
    posterLabel: "MICE",
    summary: "전시 참가자와 VIP를 위한 스페셜 퍼포먼스 티켓입니다.",
    description:
      "MICE 행사와 연동되는 특별 스테이지로, 바이어와 VIP 고객을 대상으로 하는 프리미엄 좌석과 네트워킹 입장권을 함께 운영할 수 있습니다.",
    tags: ["MICE", "VIP", "스페셜 무대"],
    options: [
      { id: "networking", label: "네트워킹 패키지", price: 210000, benefits: ["리셉션 포함", "우선 입장"] },
      { id: "general", label: "일반석", price: 69000, benefits: ["모바일 티켓"] },
    ],
  },
  {
    id: "goyang-local-stage",
    category: "concert",
    badge: "오늘 오픈",
    title: "GOYANG LOCAL STAGE",
    subtitle: "로컬 크리에이터 야외 라이브",
    venue: "일산호수공원 야외무대",
    dateText: "2026.08.08 - 2026.08.09",
    imageTone: "from-emerald-100 via-cyan-100 to-blue-200",
    posterLabel: "LOCAL",
    summary: "고양 로컬 브랜드와 크리에이터가 함께 만드는 야외 공연 프로그램입니다.",
    description:
      "공연과 플리마켓, 푸드트럭, 체험 부스를 함께 즐길 수 있는 고양형 로컬 스테이지입니다. 커플, 가족, 소규모 그룹 관람객에게 잘 맞습니다.",
    tags: ["로컬", "야외무대", "플리마켓"],
    options: [
      { id: "weekend", label: "주말 패스", price: 54000, benefits: ["양일 입장"] },
      { id: "single", label: "1일권", price: 32000, benefits: ["하루 입장"] },
    ],
  },
  {
    id: "goyang-night-run-ticket",
    category: "festival",
    badge: "티켓 오픈",
    title: "GOYANG NIGHT RUN & SHOW",
    subtitle: "야간 러닝 + 공연 결합 티켓",
    venue: "고양종합운동장",
    dateText: "2026.10.02",
    imageTone: "from-violet-200 via-fuchsia-200 to-indigo-300",
    posterLabel: "RUN",
    summary: "야간 러닝 이벤트와 메인 공연을 함께 즐기는 복합형 티켓입니다.",
    description:
      "러닝 이벤트 참여 후 메인 공연과 푸드 콘텐츠를 즐길 수 있는 시즌형 티켓입니다. 단체 참가자용 패키지와 기본형 티켓을 함께 운영할 수 있습니다.",
    tags: ["스포츠", "야간 이벤트", "패키지 티켓"],
    options: [
      { id: "race-pack", label: "러닝 패키지", price: 72000, benefits: ["러닝 키트", "공연 입장"] },
      { id: "show-only", label: "공연 관람권", price: 39000, benefits: ["공연 입장"] },
    ],
  },
];

export function getTicketProduct(ticketId?: string) {
  if (!ticketId) {
    return ticketProducts[0];
  }

  return ticketProducts.find((ticket) => ticket.id === ticketId) ?? ticketProducts[0];
}
