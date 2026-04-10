import { pick, type LocalizedText, type PageLocale } from "./types";

type TicketOptionCopy = {
  label: LocalizedText;
  benefits: LocalizedText[];
};

type TicketItemCopy = {
  badge: LocalizedText;
  title: LocalizedText;
  subtitle: LocalizedText;
  venue: LocalizedText;
  dateText: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  posterLabel: LocalizedText;
  tags: LocalizedText[];
  options: Record<string, TicketOptionCopy>;
};

const ticketItemCopy: Record<string, TicketItemCopy> = {
  "goyang-kpop-arena-open": {
    badge: { ko: "오픈 예정", en: "Opening Soon" },
    title: { ko: "고양 K-POP 아레나 오픈 스테이지", en: "Goyang K-POP Arena Open Stage" },
    subtitle: { ko: "고양형 K-POP 연계 공연", en: "K-POP Showcase in Goyang" },
    venue: { ko: "고양 K-POP 아레나", en: "Goyang K-POP Arena" },
    dateText: { ko: "2026.05.14 - 2026.05.16", en: "2026.05.14 - 2026.05.16" },
    summary: { ko: "고양 공연 허브의 시작을 알리는 대표 K-POP 라이브 시리즈입니다.", en: "A flagship K-POP live series launching Goyang's performance hub." },
    description: { ko: "프리미엄 좌석과 일반 좌석, 체류 연계형 관람 흐름을 함께 운영하는 대표 공연입니다.", en: "A major performance offering premium and general seating with stay-linked visitor flow." },
    posterLabel: { ko: "ARENA", en: "ARENA" },
    tags: [{ ko: "K-POP", en: "K-POP" }, { ko: "공연", en: "Performance" }, { ko: "프리미엄 좌석", en: "Premium Seat" }],
    options: {
      vip: { label: { ko: "VIP 패키지", en: "VIP Package" }, benefits: [{ ko: "우선 입장", en: "Priority Entry" }, { ko: "전용 굿즈", en: "Exclusive Goods" }] },
      r: { label: { ko: "R석", en: "R Seat" }, benefits: [{ ko: "지정 좌석", en: "Reserved Seat" }, { ko: "모바일 티켓", en: "Mobile Ticket" }] },
      s: { label: { ko: "S석", en: "S Seat" }, benefits: [{ ko: "지정 좌석", en: "Reserved Seat" }, { ko: "현장 발권 가능", en: "On-site Ticketing" }] },
    },
  },
  "goyang-con-city-festival": {
    badge: { ko: "2차 티켓 오픈", en: "2nd Ticket Open" },
    title: { ko: "고양 콘 시티 페스티벌", en: "Goyang Con City Festival" },
    subtitle: { ko: "도심 라이프스타일 뮤직 페스티벌", en: "Urban Lifestyle Music Festival" },
    venue: { ko: "일산 문화광장", en: "Ilsan Culture Plaza" },
    dateText: { ko: "2026.06.20 - 2026.06.21", en: "2026.06.20 - 2026.06.21" },
    summary: { ko: "음악과 야외 체험을 함께 즐기는 도심형 여름 축제입니다.", en: "A summer city festival combining music and outdoor experiences." },
    description: { ko: "공연과 로컬 브랜드, 야간 콘텐츠를 함께 경험할 수 있는 축제형 상품입니다.", en: "A festival-style product linking live performances, local brands, and night content." },
    posterLabel: { ko: "FEST", en: "FEST" },
    tags: [{ ko: "페스티벌", en: "Festival" }, { ko: "야외 공연", en: "Outdoor Show" }, { ko: "브랜드존", en: "Brand Zone" }],
    options: {
      "two-day": { label: { ko: "양일권", en: "2-Day Pass" }, benefits: [{ ko: "양일 입장", en: "Both Days Entry" }, { ko: "MD 구매권", en: "MD Purchase Benefit" }] },
      "day-pass": { label: { ko: "1일권", en: "1-Day Pass" }, benefits: [{ ko: "지정 날짜 입장", en: "Selected Date Entry" }, { ko: "기본 관람", en: "Standard Access" }] },
    },
  },
  "goyang-art-night": {
    badge: { ko: "좌석 추가 오픈", en: "Additional Tickets Open" },
    title: { ko: "고양 아트 나이트 전시", en: "Goyang Art Night Exhibition" },
    subtitle: { ko: "미디어아트 + 야간 전시", en: "Media Art + Night Exhibition" },
    venue: { ko: "고양 아트 갤러리", en: "Goyang Art Gallery" },
    dateText: { ko: "2026.05.01 - 2026.05.30", en: "2026.05.01 - 2026.05.30" },
    summary: { ko: "몰입형 야간 전시와 체험을 함께 즐기는 티켓 상품입니다.", en: "A ticket product for immersive night exhibitions and media art experiences." },
    description: { ko: "전시 관람과 도슨트, 카페 쿠폰을 함께 묶은 문화형 티켓 구조입니다.", en: "A culture-focused ticket bundle combining exhibition, docent session, and cafe coupon." },
    posterLabel: { ko: "ART", en: "ART" },
    tags: [{ ko: "전시", en: "Exhibition" }, { ko: "야간", en: "Night" }, { ko: "미디어아트", en: "Media Art" }],
    options: {
      docent: { label: { ko: "도슨트 패키지", en: "Docent Package" }, benefits: [{ ko: "도슨트 포함", en: "Docent Included" }, { ko: "카페 쿠폰", en: "Cafe Coupon" }] },
      general: { label: { ko: "일반 입장권", en: "General Admission" }, benefits: [{ ko: "전시 입장", en: "Exhibition Entry" }, { ko: "모바일 티켓", en: "Mobile Ticket" }] },
    },
  },
  "goyang-family-play": {
    badge: { ko: "가족 추천", en: "Family Pick" },
    title: { ko: "고양 패밀리 플레이 위크", en: "Goyang Family Play Week" },
    subtitle: { ko: "아동/가족 체험 공연", en: "Family Experience Show" },
    venue: { ko: "고양 어린이누리", en: "Goyang Kids Nuri" },
    dateText: { ko: "2026.07.03 - 2026.07.12", en: "2026.07.03 - 2026.07.12" },
    summary: { ko: "아이와 가족이 함께 즐기는 공연과 체험 프로그램입니다.", en: "A family program combining performances and activities for children and parents." },
    description: { ko: "가족 단위 방문객을 위한 주말형 체험 공연 티켓입니다.", en: "A weekend-style experience ticket tailored to family visitors." },
    posterLabel: { ko: "FAMILY", en: "FAMILY" },
    tags: [{ ko: "가족", en: "Family" }, { ko: "체험 공연", en: "Experience Show" }, { ko: "주말 프로그램", en: "Weekend Program" }],
    options: {
      "family-pack": { label: { ko: "가족 패키지 4인", en: "Family Package for 4" }, benefits: [{ ko: "4인 입장", en: "4 Admissions" }, { ko: "체험 재료 포함", en: "Materials Included" }] },
      adult: { label: { ko: "성인 1인", en: "Adult / 1 Ticket" }, benefits: [{ ko: "공연 입장", en: "Show Entry" }, { ko: "기본 관람", en: "Standard Access" }] },
      child: { label: { ko: "아동 1인", en: "Child / 1 Ticket" }, benefits: [{ ko: "공연 입장", en: "Show Entry" }, { ko: "체험 참여", en: "Activity Included" }] },
    },
  },
  "goyang-kmusic-series": {
    badge: { ko: "지정 기간", en: "Limited Dates" },
    title: { ko: "고양 K-MUSIC 시리즈", en: "Goyang K-MUSIC Series" },
    subtitle: { ko: "보컬/밴드 라이브 공연", en: "Vocal / Band Live" },
    venue: { ko: "고양 아트플렉스 극장", en: "Goyang Artplex Theater" },
    dateText: { ko: "2026.04.24 - 2026.04.25", en: "2026.04.24 - 2026.04.25" },
    summary: { ko: "보컬과 밴드 중심으로 구성된 실내 라이브 공연 시리즈입니다.", en: "An indoor live series centered on vocals and band performances." },
    description: { ko: "프리미엄 초청과 일반 관람이 함께 가능한 공연 상품입니다.", en: "A performance product combining premium invitations and general admissions." },
    posterLabel: { ko: "LIVE", en: "LIVE" },
    tags: [{ ko: "콘서트", en: "Concert" }, { ko: "밴드", en: "Band" }, { ko: "실내 공연", en: "Indoor Show" }],
    options: {
      premium: { label: { ko: "프리미엄석", en: "Premium Seat" }, benefits: [{ ko: "우선 입장", en: "Priority Entry" }, { ko: "MD 쿠폰", en: "MD Coupon" }] },
      standard: { label: { ko: "일반석", en: "Standard Seat" }, benefits: [{ ko: "지정 좌석", en: "Reserved Seat" }, { ko: "기본 관람", en: "Standard Access" }] },
    },
  },
  "goyang-mice-opening-show": {
    badge: { ko: "오픈 예정", en: "Opening Soon" },
    title: { ko: "고양 MICE 오프닝 쇼", en: "Goyang MICE Opening Show" },
    subtitle: { ko: "비즈니스 연계 스페셜 퍼포먼스", en: "Business-linked Special Performance" },
    venue: { ko: "KINTEX 야외무대", en: "KINTEX Outdoor Stage" },
    dateText: { ko: "2026.09.12", en: "2026.09.12" },
    summary: { ko: "MICE 방문객과 VIP를 위한 스페셜 오프닝 퍼포먼스입니다.", en: "A special opening performance for MICE visitors and VIP guests." },
    description: { ko: "행사 초청객과 일반 관람객 모두를 위한 믹스형 티켓 구조입니다.", en: "A mixed ticket structure for invited guests and general audiences." },
    posterLabel: { ko: "MICE", en: "MICE" },
    tags: [{ ko: "MICE", en: "MICE" }, { ko: "VIP", en: "VIP" }, { ko: "스페셜 공연", en: "Special Show" }],
    options: {
      networking: { label: { ko: "네트워킹 패키지", en: "Networking Package" }, benefits: [{ ko: "리셉션 포함", en: "Reception Included" }, { ko: "우선 입장", en: "Priority Entry" }] },
      general: { label: { ko: "일반석", en: "General Seat" }, benefits: [{ ko: "모바일 티켓", en: "Mobile Ticket" }, { ko: "현장 입장", en: "On-site Entry" }] },
    },
  },
  "goyang-local-stage": {
    badge: { ko: "오늘 오픈", en: "Open Today" },
    title: { ko: "고양 로컬 스테이지", en: "Goyang Local Stage" },
    subtitle: { ko: "로컬 크리에이터 야외 라이브", en: "Outdoor Live by Local Creators" },
    venue: { ko: "일산호수공원 야외무대", en: "Ilsan Lake Park Outdoor Stage" },
    dateText: { ko: "2026.08.08 - 2026.08.09", en: "2026.08.08 - 2026.08.09" },
    summary: { ko: "고양 로컬 브랜드와 크리에이터가 함께 만드는 야외 공연 프로그램입니다.", en: "An outdoor performance program shaped by local brands and creators in Goyang." },
    description: { ko: "공연, 플리마켓, 야외 체험을 함께 묶은 로컬형 티켓 상품입니다.", en: "A local-oriented ticket product combining live shows, flea market zones, and outdoor experiences." },
    posterLabel: { ko: "LOCAL", en: "LOCAL" },
    tags: [{ ko: "로컬", en: "Local" }, { ko: "야외무대", en: "Outdoor Stage" }, { ko: "플리마켓", en: "Flea Market" }],
    options: {
      weekend: { label: { ko: "주말 패스", en: "Weekend Pass" }, benefits: [{ ko: "양일 입장", en: "2-Day Access" }, { ko: "행사권 포함", en: "Event Access" }] },
      single: { label: { ko: "1일권", en: "1-Day Pass" }, benefits: [{ ko: "당일 입장", en: "Single Day Entry" }, { ko: "기본 관람", en: "Standard Access" }] },
    },
  },
  "goyang-night-run-ticket": {
    badge: { ko: "티켓 오픈", en: "Ticket Open" },
    title: { ko: "고양 나이트 런 & 쇼", en: "Goyang Night Run & Show" },
    subtitle: { ko: "야간 러닝 + 공연 결합", en: "Night Run + Performance" },
    venue: { ko: "고양종합운동장", en: "Goyang Sports Complex" },
    dateText: { ko: "2026.10.02", en: "2026.10.02" },
    summary: { ko: "나이트 런 이벤트와 메인 공연을 함께 즐기는 복합 티켓입니다.", en: "A combined ticket for both the night-run event and the main performance." },
    description: { ko: "체험형 스포츠 이벤트와 공연 콘텐츠를 함께 운영하는 시즌형 티켓입니다.", en: "A seasonal ticket combining participatory sports events and live entertainment content." },
    posterLabel: { ko: "RUN", en: "RUN" },
    tags: [{ ko: "스포츠", en: "Sports" }, { ko: "야간 이벤트", en: "Night Event" }, { ko: "패키지 티켓", en: "Package Ticket" }],
    options: {
      "race-pack": { label: { ko: "러닝 패키지", en: "Run Package" }, benefits: [{ ko: "러닝 키트", en: "Running Kit" }, { ko: "공연 입장", en: "Show Entry" }] },
      "show-only": { label: { ko: "공연 관람권", en: "Show Ticket" }, benefits: [{ ko: "공연 입장", en: "Performance Entry" }, { ko: "기본 관람", en: "Standard Access" }] },
    },
  },
};

export function getTicketItemCopy(locale: PageLocale, ticketId: string) {
  const copy = ticketItemCopy[ticketId];
  if (!copy) return null;
  return {
    badge: pick(locale, copy.badge),
    title: pick(locale, copy.title),
    subtitle: pick(locale, copy.subtitle),
    venue: pick(locale, copy.venue),
    dateText: pick(locale, copy.dateText),
    summary: pick(locale, copy.summary),
    description: pick(locale, copy.description),
    posterLabel: pick(locale, copy.posterLabel),
    tags: copy.tags.map((tag) => pick(locale, tag)),
    options: Object.fromEntries(
      Object.entries(copy.options).map(([id, option]) => [
        id,
        { label: pick(locale, option.label), benefits: option.benefits.map((benefit) => pick(locale, benefit)) },
      ])
    ),
  };
}
