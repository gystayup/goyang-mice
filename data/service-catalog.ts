import type { DmcCategoryKey } from "@/data/products";

export type ServiceCatalogCategory = Extract<
  DmcCategoryKey,
  "tour" | "stay" | "restaurant" | "cafe"
>;

export interface ServiceCatalogOption {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

export interface ServiceCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  dateText: string;
  imageTone: string;
  posterLabel: string;
  summary: string;
  description: string;
  tags: string[];
  originalPrice?: number;
  price: number;
  discountLabel?: string;
  options: ServiceCatalogOption[];
}

export const serviceCatalog: Record<ServiceCatalogCategory, ServiceCatalogItem[]> = {
  tour: [
    {
      id: "lake-park-sunset-tour",
      title: "일산호수공원 선셋 로컬투어",
      subtitle: "감성 루트 1일",
      location: "일산호수공원 · 라페스타 · 웨스턴돔",
      dateText: "매일 운영 · 반일 코스",
      imageTone: "from-amber-100 via-cyan-100 to-sky-200",
      posterLabel: "LOCAL TOUR",
      summary: "공연과 전시 방문 전후에 연결하기 좋은 고양 대표 로컬투어입니다.",
      description:
        "일산호수공원, 라페스타, 로컬 베이커리와 포토 스폿을 묶은 반일형 여행상품입니다. 공연 관람객, 가족 방문객, 해외 바이어 모두를 위한 유연한 일정으로 운영할 수 있습니다.",
      tags: ["버스투어", "로컬 명소", "반일 코스"],
      originalPrice: 78000,
      price: 59000,
      discountLabel: "24%",
      options: [
        {
          id: "weekday",
          label: "평일 일반권",
          price: 59000,
          benefits: ["가이드 포함", "로컬 쿠폰 제공"],
        },
        {
          id: "vip",
          label: "프리미엄 동행권",
          price: 89000,
          benefits: ["소규모 운영", "사진 기록 포함"],
        },
      ],
    },
    {
      id: "k-culture-city-walk",
      title: "K-컬처 시티워크 투어",
      subtitle: "오전 또는 오후 선택",
      location: "고양 스타필드 · 공연장 연계 동선",
      dateText: "오전/오후 선택 가능",
      imageTone: "from-fuchsia-100 via-pink-100 to-orange-200",
      posterLabel: "CITY WALK",
      summary: "K-컬처와 라이프스타일을 묶은 도심형 체험 상품입니다.",
      description:
        "쇼핑, 공연, 라이프스타일 스폿을 연결하는 워킹형 상품입니다. 공연 관람 이후 짧은 체류 시간을 확장하고 싶은 방문객에게 특히 잘 맞습니다.",
      tags: ["도심투어", "K-컬처", "라이프스타일"],
      originalPrice: 52000,
      price: 41000,
      discountLabel: "21%",
      options: [
        {
          id: "am",
          label: "오전 시티워크",
          price: 41000,
          benefits: ["가이드 포함"],
        },
        {
          id: "pm",
          label: "오후 시티워크",
          price: 43000,
          benefits: ["야간 동선 추천"],
        },
      ],
    },
    {
      id: "family-healing-course",
      title: "가족 힐링 체험 패키지",
      subtitle: "가족 추천 1일",
      location: "고양 생태공원 · 체험농장",
      dateText: "주말 집중 운영",
      imageTone: "from-lime-100 via-emerald-100 to-cyan-200",
      posterLabel: "FAMILY",
      summary: "아이와 부모가 함께 즐길 수 있는 자연형 로컬 체험 상품입니다.",
      description:
        "생태공원 산책, 농장 체험, 로컬 푸드 체험을 묶은 가족형 상품입니다. 숙박이나 라이프스타일 예약과 연결하면 체류형 프로그램으로 확장하기 좋습니다.",
      tags: ["가족", "체험", "주말"],
      originalPrice: 98000,
      price: 76000,
      discountLabel: "22%",
      options: [
        {
          id: "four",
          label: "가족 4인권",
          price: 76000,
          benefits: ["체험 재료 포함"],
        },
        {
          id: "six",
          label: "가족 6인권",
          price: 109000,
          benefits: ["전용 공간 제공"],
        },
      ],
    },
    {
      id: "night-photo-bus",
      title: "고양 나이트 포토 버스투어",
      subtitle: "야간 감성 코스",
      location: "호수공원 · 야경 포토 스폿",
      dateText: "금/토 야간 운영",
      imageTone: "from-slate-700 via-indigo-500 to-sky-400",
      posterLabel: "NIGHT",
      summary: "야경 명소와 사진 포인트를 연결한 야간형 투어 상품입니다.",
      description:
        "고양의 야경 스폿과 공연장 주변의 감도 높은 공간을 연결한 로컬 체험 코스입니다. 커플, 해외 방문객, 야간 콘텐츠 수요에 적합합니다.",
      tags: ["야간투어", "포토", "버스투어"],
      originalPrice: 64000,
      price: 49000,
      discountLabel: "23%",
      options: [
        {
          id: "photo",
          label: "포토 투어권",
          price: 49000,
          benefits: ["촬영 포인트 안내"],
        },
        {
          id: "photo-vip",
          label: "프리미엄 포토권",
          price: 74000,
          benefits: ["전용 차량", "야경 스냅 포함"],
        },
      ],
    },
  ],
  stay: [
    {
      id: "kintex-business-stay",
      title: "KINTEX 비즈니스 스테이",
      subtitle: "전시 참가자 전용",
      location: "KINTEX 인근 비즈니스 호텔",
      dateText: "1박~5박 예약 가능",
      imageTone: "from-slate-100 via-zinc-100 to-stone-200",
      posterLabel: "STAY",
      summary: "전시 참가자와 바이어를 위한 연속형 숙박 패키지입니다.",
      description:
        "KINTEX 접근성이 좋은 비즈니스 호텔 상품으로, 조식, 셔틀, 빠른 체크인 옵션까지 선택할 수 있습니다. 행사 일정과 연동해 객실 블록 운영도 가능합니다.",
      tags: ["비즈니스호텔", "전시 참가", "조식 선택"],
      originalPrice: 178000,
      price: 139000,
      discountLabel: "21%",
      options: [
        {
          id: "standard",
          label: "스탠더드 더블",
          price: 139000,
          benefits: ["조식 선택", "빠른 체크인"],
        },
        {
          id: "executive",
          label: "이그제큐티브 트윈",
          price: 189000,
          benefits: ["라운지 이용", "셔틀 포함"],
        },
      ],
    },
    {
      id: "vip-suite-stay",
      title: "VIP 스위트 스테이",
      subtitle: "아티스트 · 바이어 운영",
      location: "고양 프리미엄 호텔",
      dateText: "1박 단위 예약",
      imageTone: "from-amber-100 via-orange-100 to-rose-200",
      posterLabel: "VIP",
      summary: "아티스트, VIP, 고급 초청 고객을 위한 스위트 객실 상품입니다.",
      description:
        "프라이빗 체크인, 전용 차량 연결, 컨시어지 요청까지 함께 운영할 수 있는 숙박 상품입니다. 공항픽업과 함께 구성하면 VIP 패키지로 확장 가능합니다.",
      tags: ["VIP", "스위트", "컨시어지"],
      originalPrice: 420000,
      price: 345000,
      discountLabel: "18%",
      options: [
        {
          id: "suite",
          label: "스위트 1박",
          price: 345000,
          benefits: ["웰컴 어메니티", "컨시어지"],
        },
        {
          id: "suite-car",
          label: "스위트 + 차량",
          price: 468000,
          benefits: ["공항 연계", "전용 체크인"],
        },
      ],
    },
    {
      id: "family-weekend-stay",
      title: "가족 주말 스테이 패키지",
      subtitle: "로컬 체험 연계",
      location: "일산호수공원 인근 호텔",
      dateText: "금·토·일 운영",
      imageTone: "from-sky-100 via-cyan-100 to-lime-100",
      posterLabel: "WEEKEND",
      summary: "가족 체험 프로그램과 연결되는 주말형 숙박 패키지입니다.",
      description:
        "객실 숙박과 로컬 카페, 체험 프로그램, 티켓 상품을 함께 묶을 수 있는 체류형 패키지입니다. 가족 방문객의 평균 체류 시간을 늘리는 구조에 적합합니다.",
      tags: ["가족", "주말", "체험 연계"],
      originalPrice: 238000,
      price: 185000,
      discountLabel: "22%",
      options: [
        {
          id: "family-room",
          label: "패밀리룸 1박",
          price: 185000,
          benefits: ["아동 어메니티 세트"],
        },
        {
          id: "family-plus",
          label: "패밀리룸 + 체험",
          price: 229000,
          benefits: ["카페 쿠폰", "체험권 포함"],
        },
      ],
    },
    {
      id: "group-room-block",
      title: "단체 객실 블록 예약",
      subtitle: "이벤트 · 기업 그룹",
      location: "고양 주요 호텔 다중 연계",
      dateText: "20객실 이상 문의 가능",
      imageTone: "from-indigo-100 via-slate-100 to-zinc-200",
      posterLabel: "GROUP",
      summary: "행사 단체를 위한 객실 블록 예약 상품입니다.",
      description:
        "20객실 이상 그룹 숙박을 전제로 만든 단체 객실 블록 상품입니다. 룸타입 배분, 체크인 명단, 셔틀 연계, 후불 정산까지 함께 운영하기 좋습니다.",
      tags: ["단체", "룸블록", "후불 정산"],
      originalPrice: 210000,
      price: 168000,
      discountLabel: "20%",
      options: [
        {
          id: "block-standard",
          label: "기본 룸블록",
          price: 168000,
          benefits: ["그룹 명단관리"],
        },
        {
          id: "block-premium",
          label: "프리미엄 룸블록",
          price: 214000,
          benefits: ["셔틀", "후불 정산"],
        },
      ],
    },
  ],
  restaurant: [
    {
      id: "kintex-dining-course",
      title: "KINTEX 비즈니스 코스 다이닝",
      subtitle: "바이어 미팅 전용",
      location: "KINTEX 인근 프리미엄 레스토랑",
      dateText: "점심/저녁 선택 가능",
      imageTone: "from-amber-100 via-stone-100 to-orange-200",
      posterLabel: "DINING",
      summary: "바이어 미팅과 소규모 비즈니스 만찬에 적합한 코스 다이닝 예약입니다.",
      description:
        "전시 참가자와 바이어 미팅에 맞춘 코스 다이닝 상품입니다. 룸 좌석, 통역 동선, 식단 조정, 세금계산서 발행까지 연결할 수 있습니다.",
      tags: ["비즈니스", "코스 다이닝", "룸 좌석"],
      originalPrice: 98000,
      price: 76000,
      discountLabel: "22%",
      options: [
        {
          id: "lunch",
          label: "런치 코스",
          price: 76000,
          benefits: ["룸 좌석 가능"],
        },
        {
          id: "dinner",
          label: "디너 코스",
          price: 109000,
          benefits: ["웰컴 드링크 포함"],
        },
      ],
    },
    {
      id: "local-food-table",
      title: "고양 로컬 미식 테이블",
      subtitle: "관광특구 상권 연계",
      location: "원마운트 · 라페스타 상권",
      dateText: "매일 운영",
      imageTone: "from-rose-100 via-orange-100 to-amber-200",
      posterLabel: "LOCAL FOOD",
      summary: "고양 로컬 상권을 경험할 수 있는 미식형 예약 상품입니다.",
      description:
        "상권 체류를 늘릴 수 있도록 로컬 인기 메뉴와 골목 공간 경험을 묶은 식사 상품입니다. 소규모 그룹과 개별 방문객 모두에게 적합합니다.",
      tags: ["로컬 미식", "상권 연계", "체류형"],
      originalPrice: 42000,
      price: 32000,
      discountLabel: "24%",
      options: [
        {
          id: "set",
          label: "로컬 세트",
          price: 32000,
          benefits: ["대표 메뉴 포함"],
        },
        {
          id: "special",
          label: "스페셜 코스",
          price: 47000,
          benefits: ["디저트 포함"],
        },
      ],
    },
    {
      id: "vip-banquet-night",
      title: "VIP 만찬 나이트",
      subtitle: "프라이빗 다이닝",
      location: "고양 프라이빗 다이닝룸",
      dateText: "사전 예약제",
      imageTone: "from-slate-800 via-amber-700 to-stone-500",
      posterLabel: "VIP",
      summary: "고급 초청객을 위한 프라이빗 만찬 상품입니다.",
      description:
        "VIP 응대와 의전 흐름에 맞춰 설계된 만찬형 상품입니다. 공항픽업, 숙박, 티켓 초청과 연계하기 쉬운 구조입니다.",
      tags: ["VIP", "만찬", "프라이빗"],
      originalPrice: 180000,
      price: 149000,
      discountLabel: "17%",
      options: [
        {
          id: "private",
          label: "프라이빗 다이닝",
          price: 149000,
          benefits: ["전용 룸", "맞춤 메뉴"],
        },
        {
          id: "private-plus",
          label: "프라이빗 다이닝 플러스",
          price: 198000,
          benefits: ["와인 페어링", "전담 응대"],
        },
      ],
    },
    {
      id: "family-korean-table",
      title: "가족 한식 테이블 예약",
      subtitle: "세대형 식사 상품",
      location: "고양 한식당 · 가족모임 공간",
      dateText: "주중/주말 운영",
      imageTone: "from-yellow-100 via-stone-100 to-lime-100",
      posterLabel: "FAMILY TABLE",
      summary: "가족 방문객과 단체 모임에 적합한 한식 중심 식사 예약입니다.",
      description:
        "고양 로컬 식문화를 경험할 수 있는 한식형 테이블 상품입니다. 가족 행사와 소규모 단체 예약에 유용합니다.",
      tags: ["가족", "한식", "단체식"],
      originalPrice: 36000,
      price: 28000,
      discountLabel: "22%",
      options: [
        {
          id: "basic",
          label: "기본 상차림",
          price: 28000,
          benefits: ["4인 기준 추천"],
        },
        {
          id: "premium",
          label: "프리미엄 상차림",
          price: 42000,
          benefits: ["계절 메뉴 포함"],
        },
      ],
    },
  ],
  cafe: [
    {
      id: "brunch-social-club",
      title: "브런치 소셜 클럽 예약",
      subtitle: "라이프스타일 오전 프로그램",
      location: "고양 브런치 카페 라운지",
      dateText: "오전 타임 운영",
      imageTone: "from-rose-100 via-amber-100 to-yellow-100",
      posterLabel: "BRUNCH",
      summary: "브런치와 로컬 라이프스타일 공간 경험을 함께 묶은 예약 상품입니다.",
      description:
        "모닝 브런치, 감도 있는 공간, 가벼운 네트워킹을 함께 운영할 수 있는 라이프스타일 상품입니다. 여성 그룹과 소규모 방문객에게 적합합니다.",
      tags: ["브런치", "라운지", "라이프스타일"],
      originalPrice: 32000,
      price: 24000,
      discountLabel: "25%",
      options: [
        {
          id: "single",
          label: "브런치 1인권",
          price: 24000,
          benefits: ["대표 메뉴 포함"],
        },
        {
          id: "couple",
          label: "브런치 2인권",
          price: 46000,
          benefits: ["디저트 포함"],
        },
      ],
    },
    {
      id: "local-cafe-hop",
      title: "고양 로컬 카페 호핑 투어",
      subtitle: "취향 기반 반일 코스",
      location: "행주산성 · 일산 로컬 카페",
      dateText: "오후 집중 운영",
      imageTone: "from-sky-100 via-cyan-100 to-indigo-100",
      posterLabel: "CAFE HOP",
      summary: "카페 예약과 이동 동선을 묶은 라이프스타일 투어형 상품입니다.",
      description:
        "고양 로컬의 개성 있는 카페들을 연결해 취향 중심 동선을 제안하는 상품입니다. 여행상품과 결합해 반일 코스로 운영하기 좋습니다.",
      tags: ["카페투어", "로컬 공간", "반일 코스"],
      originalPrice: 38000,
      price: 29000,
      discountLabel: "24%",
      options: [
        {
          id: "hop-basic",
          label: "카페 2곳 코스",
          price: 29000,
          benefits: ["음료 2잔 포함"],
        },
        {
          id: "hop-plus",
          label: "카페 3곳 코스",
          price: 41000,
          benefits: ["디저트 포함"],
        },
      ],
    },
    {
      id: "creative-work-lounge",
      title: "크리에이티브 워크 라운지",
      subtitle: "소규모 미팅 · 창작 모임",
      location: "고양 라이프스타일 스튜디오",
      dateText: "평일/주말 시간대 선택",
      imageTone: "from-violet-100 via-fuchsia-100 to-pink-100",
      posterLabel: "WORK LOUNGE",
      summary: "작업, 대화, 미팅이 가능한 감도 높은 공간 예약 서비스입니다.",
      description:
        "브랜드 미팅, 소규모 워크숍, 창작 모임에 적합한 공간 예약 상품입니다. 음료 패키지와 간단한 케이터링 옵션을 함께 선택할 수 있습니다.",
      tags: ["공간대여", "미팅", "창작"],
      originalPrice: 54000,
      price: 42000,
      discountLabel: "22%",
      options: [
        {
          id: "space-only",
          label: "공간 이용권",
          price: 42000,
          benefits: ["2시간 대관"],
        },
        {
          id: "space-drink",
          label: "공간 + 음료 패키지",
          price: 58000,
          benefits: ["웰컴 드링크 포함"],
        },
      ],
    },
    {
      id: "sunset-rooftop-cafe",
      title: "선셋 루프탑 카페 예약",
      subtitle: "야간 감성 체류형",
      location: "고양 루프탑 카페",
      dateText: "금·토 야간 운영",
      imageTone: "from-indigo-100 via-sky-100 to-cyan-200",
      posterLabel: "ROOFTOP",
      summary: "야경과 음료, 음악을 함께 즐기는 루프탑 카페 예약 상품입니다.",
      description:
        "공연 이후나 가벼운 2차 동선으로 추천하는 야간형 카페 상품입니다. 티켓 상품과 연결하기에도 좋은 구조입니다.",
      tags: ["루프탑", "야간", "감성 체류"],
      originalPrice: 36000,
      price: 28000,
      discountLabel: "22%",
      options: [
        {
          id: "sunset",
          label: "선셋 패키지",
          price: 28000,
          benefits: ["음료 2잔 포함"],
        },
        {
          id: "sunset-plus",
          label: "선셋 플래터",
          price: 42000,
          benefits: ["브런치 플래터 포함"],
        },
      ],
    },
  ],
};

export function getServiceCatalogByCategory(category: ServiceCatalogCategory) {
  return serviceCatalog[category];
}

export function getServiceCatalogItem(
  category: ServiceCatalogCategory,
  itemId?: string
) {
  const items = getServiceCatalogByCategory(category);
  if (!itemId) return items[0];
  return items.find((item) => item.id === itemId) ?? items[0];
}
