import { pick, type LocalizedText, type PageLocale } from "./types";

type ServiceOptionCopy = {
  label: LocalizedText;
  benefits: LocalizedText[];
};

type ServiceItemCopy = {
  title: LocalizedText;
  subtitle: LocalizedText;
  location: LocalizedText;
  dateText: LocalizedText;
  posterLabel: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  tags: LocalizedText[];
  options: Record<string, ServiceOptionCopy>;
};

const serviceItemCopy: Record<string, ServiceItemCopy> = {
  "lake-park-sunset-tour": {
    title: { ko: "호수공원 선셋 로컬투어", en: "Lake Park Sunset Local Tour" },
    subtitle: { ko: "감성 루트 1일", en: "Scenic One-Day Route" },
    location: { ko: "일산호수공원 · 카페거리 · 로컬 스팟", en: "Ilsan Lake Park · Cafe Street · Local Spots" },
    dateText: { ko: "매일 운영 · 반일 코스", en: "Daily · Half-Day Course" },
    posterLabel: { ko: "LOCAL TOUR", en: "LOCAL TOUR" },
    summary: {
      ko: "공연 전후 관광과 로컬 체험을 함께 설계할 수 있는 대표 로컬투어 상품입니다.",
      en: "A signature local tour combining sightseeing and local experiences before or after events.",
    },
    description: {
      ko: "호수공원 산책, 감성 카페, 로컬 브랜드 스팟을 묶은 반일형 투어입니다.",
      en: "A half-day tour connecting lake-park walks, stylish cafes, and local brand spots.",
    },
    tags: [{ ko: "시티투어", en: "City Tour" }, { ko: "로컬 체험", en: "Local Experience" }, { ko: "반일 코스", en: "Half-Day Course" }],
    options: {
      weekday: { label: { ko: "평일 일반권", en: "Weekday Standard" }, benefits: [{ ko: "가이드 포함", en: "Guide Included" }, { ko: "로컬 쿠폰 제공", en: "Local Coupon" }] },
      vip: { label: { ko: "프리미엄 동행권", en: "Premium Companion Pass" }, benefits: [{ ko: "소규모 운영", en: "Small Group Operation" }, { ko: "사진 기록 포함", en: "Photo Record Included" }] },
    },
  },
  "k-culture-city-walk": {
    title: { ko: "K-컬처 시티워크 투어", en: "K-Culture City Walk Tour" },
    subtitle: { ko: "공연 전후 선택", en: "Before or After Event" },
    location: { ko: "방송 스튜디오 · 공연장 연계 동선", en: "Broadcast Studio · Venue Route" },
    dateText: { ko: "오전/오후 선택 가능", en: "Morning / Afternoon Options" },
    posterLabel: { ko: "CITY WALK", en: "CITY WALK" },
    summary: { ko: "고양의 K-컬처 공간과 로컬 라이프스타일을 함께 경험하는 도보형 투어입니다.", en: "A walk-based tour combining K-culture spaces and local lifestyle in Goyang." },
    description: { ko: "공연 관람 전후로 부담 없이 넣기 좋은 도심형 체험 코스입니다.", en: "An easy urban experience course to add before or after a performance." },
    tags: [{ ko: "도보 투어", en: "Walking Tour" }, { ko: "K-컬처", en: "K-Culture" }, { ko: "도심 체험", en: "Urban Experience" }],
    options: {
      am: { label: { ko: "오전 시티워크", en: "Morning City Walk" }, benefits: [{ ko: "가이드 포함", en: "Guide Included" }, { ko: "동선 추천", en: "Route Curation" }] },
      pm: { label: { ko: "오후 시티워크", en: "Afternoon City Walk" }, benefits: [{ ko: "야간 동선 추천", en: "Evening Route Recommendation" }, { ko: "휴식 스팟 안내", en: "Rest Spot Guide" }] },
    },
  },
  "family-healing-course": {
    title: { ko: "가족 힐링 체험 패키지", en: "Family Healing Experience Package" },
    subtitle: { ko: "가족 추천 1일", en: "Family One-Day Package" },
    location: { ko: "생태공원 · 체험농장", en: "Eco Park · Experience Farm" },
    dateText: { ko: "주말 집중 운영", en: "Weekend Focused" },
    posterLabel: { ko: "FAMILY", en: "FAMILY" },
    summary: { ko: "아이와 함께 즐기기 좋은 자연형 로컬 체험 상품입니다.", en: "A nature-centered local experience package for families with children." },
    description: { ko: "생태공원 산책과 체험활동을 묶어 체류형 일정으로 확장하기 좋은 상품입니다.", en: "A package combining ecological walks and activities, ideal for longer-stay itineraries." },
    tags: [{ ko: "가족형", en: "Family" }, { ko: "체험", en: "Experience" }, { ko: "주말", en: "Weekend" }],
    options: {
      four: { label: { ko: "가족 4인권", en: "Family of 4" }, benefits: [{ ko: "체험 재료 포함", en: "Materials Included" }, { ko: "현장 안내 포함", en: "On-Site Guide" }] },
      six: { label: { ko: "가족 6인권", en: "Family of 6" }, benefits: [{ ko: "전용 공간 제공", en: "Private Space" }, { ko: "단체 운영 가능", en: "Group Friendly" }] },
    },
  },
  "night-photo-bus": {
    title: { ko: "고양 나이트 포토 버스투어", en: "Goyang Night Photo Bus Tour" },
    subtitle: { ko: "야간 감성 코스", en: "Night Mood Route" },
    location: { ko: "호수공원 · 야경 포토 스팟", en: "Lake Park · Night Photo Spots" },
    dateText: { ko: "금·토 야간 운영", en: "Fri · Sat Night" },
    posterLabel: { ko: "NIGHT", en: "NIGHT" },
    summary: { ko: "고양의 야경 명소를 중심으로 구성한 감성형 버스투어입니다.", en: "A mood-driven bus tour built around Goyang's night-view spots." },
    description: { ko: "사진 촬영과 야간 체험을 함께 즐기는 저녁 특화 상품입니다.", en: "An evening-special package for photo stops and nighttime experiences." },
    tags: [{ ko: "야경투어", en: "Night View" }, { ko: "포토스팟", en: "Photo Spots" }, { ko: "버스투어", en: "Bus Tour" }],
    options: {
      photo: { label: { ko: "포토 투어권", en: "Photo Tour Pass" }, benefits: [{ ko: "촬영 안내 포함", en: "Photo Guide" }, { ko: "이동 포함", en: "Transport Included" }] },
      "photo-vip": { label: { ko: "프리미엄 포토권", en: "Premium Photo Pass" }, benefits: [{ ko: "전용 차량", en: "Private Vehicle" }, { ko: "야간 드링크 포함", en: "Night Drink Included" }] },
    },
  },
  "kintex-business-stay": {
    title: { ko: "KINTEX 비즈니스 스테이", en: "KINTEX Business Stay" },
    subtitle: { ko: "전시 참가자 전용", en: "For Exhibition Guests" },
    location: { ko: "KINTEX 인근 비즈니스 호텔", en: "Business Hotels near KINTEX" },
    dateText: { ko: "1박~5박 예약 가능", en: "1 to 5 Nights" },
    posterLabel: { ko: "STAY", en: "STAY" },
    summary: { ko: "전시 참가자와 바이어를 위한 연속형 숙박 패키지입니다.", en: "A stay package for exhibitors and buyers needing consecutive nights." },
    description: { ko: "전시 일정과 연계하기 좋은 기본 숙박형 상품입니다.", en: "A core stay product optimized for exhibition schedules." },
    tags: [{ ko: "비즈니스호텔", en: "Business Hotel" }, { ko: "전시 참가", en: "Exhibition Stay" }, { ko: "조식 선택", en: "Breakfast Option" }],
    options: {
      standard: { label: { ko: "스탠다드 룸", en: "Standard Room" }, benefits: [{ ko: "조식 선택", en: "Breakfast Option" }, { ko: "빠른 체크인", en: "Fast Check-in" }] },
      executive: { label: { ko: "이그제큐티브 룸", en: "Executive Room" }, benefits: [{ ko: "라운지 이용", en: "Lounge Access" }, { ko: "셔틀 포함", en: "Shuttle Included" }] },
    },
  },
  "vip-suite-stay": {
    title: { ko: "VIP 스위트 스테이", en: "VIP Suite Stay" },
    subtitle: { ko: "아티스트 · VIP 운영", en: "Artist · VIP Operation" },
    location: { ko: "고양 프리미엄 호텔", en: "Premium Hotels in Goyang" },
    dateText: { ko: "1박 단위 예약", en: "Per-Night Booking" },
    posterLabel: { ko: "VIP", en: "VIP" },
    summary: { ko: "아티스트와 VIP 고객을 위한 프리미엄 숙박 상품입니다.", en: "A premium stay product for artists and VIP guests." },
    description: { ko: "전용 체크인과 이동 서비스까지 연결되는 고급형 숙박 구조입니다.", en: "A high-end stay structure with private check-in and transfer support." },
    tags: [{ ko: "VIP", en: "VIP" }, { ko: "스위트", en: "Suite" }, { ko: "컨시어지", en: "Concierge" }],
    options: {
      suite: { label: { ko: "스위트 1박", en: "Suite / 1 Night" }, benefits: [{ ko: "전용 어메니티", en: "Premium Amenity" }, { ko: "컨시어지 포함", en: "Concierge Included" }] },
      "suite-car": { label: { ko: "스위트 + 차량", en: "Suite + Vehicle" }, benefits: [{ ko: "공항 연계", en: "Airport Connection" }, { ko: "전용 체크인", en: "Private Check-in" }] },
    },
  },
  "family-weekend-stay": {
    title: { ko: "가족 주말 스테이 패키지", en: "Family Weekend Stay Package" },
    subtitle: { ko: "로컬 체험 연계", en: "Local Experience Bundle" },
    location: { ko: "일산호수공원 인근 호텔", en: "Hotels near Ilsan Lake Park" },
    dateText: { ko: "금 · 토 · 일 운영", en: "Fri · Sat · Sun" },
    posterLabel: { ko: "WEEKEND", en: "WEEKEND" },
    summary: { ko: "주말 체류와 체험 프로그램을 함께 묶은 가족형 패키지입니다.", en: "A family package combining weekend stays and experience programs." },
    description: { ko: "숙박과 로컬 체험, 카페 이용을 함께 연결할 수 있는 주말형 상품입니다.", en: "A weekend package connecting stay, local experiences, and cafe visits." },
    tags: [{ ko: "가족", en: "Family" }, { ko: "주말", en: "Weekend" }, { ko: "체험 연계", en: "Experience Bundle" }],
    options: {
      "family-room": { label: { ko: "패밀리룸 1박", en: "Family Room / 1 Night" }, benefits: [{ ko: "어린이 어메니티", en: "Kids Amenity" }, { ko: "체류 특화", en: "Stay Focused" }] },
      "family-plus": { label: { ko: "패밀리룸 + 체험", en: "Family Room + Experience" }, benefits: [{ ko: "카페 쿠폰", en: "Cafe Coupon" }, { ko: "체험권 포함", en: "Experience Ticket" }] },
    },
  },
  "group-room-block": {
    title: { ko: "단체 객실 블록 예약", en: "Group Room Block Booking" },
    subtitle: { ko: "행사 · 기업 그룹", en: "Event · Corporate Group" },
    location: { ko: "고양 주요 호텔 다중 연계", en: "Multiple Major Hotels in Goyang" },
    dateText: { ko: "20객실 이상 문의 가능", en: "20+ Rooms Available" },
    posterLabel: { ko: "GROUP", en: "GROUP" },
    summary: { ko: "행사와 단체 방문을 위한 객실 블록 운영 상품입니다.", en: "A room-block product for events and group visitors." },
    description: { ko: "룸블록, 체크인 리스트, 정산까지 그룹 운영에 맞춘 상품입니다.", en: "A group-focused product handling room blocks, check-in lists, and settlement." },
    tags: [{ ko: "단체", en: "Group" }, { ko: "룸블록", en: "Room Block" }, { ko: "후불 정산", en: "Post Settlement" }],
    options: {
      "block-standard": { label: { ko: "스탠다드 룸블록", en: "Standard Room Block" }, benefits: [{ ko: "명단 관리", en: "Roster Management" }, { ko: "후불 정산", en: "Post Payment" }] },
      "block-premium": { label: { ko: "프리미엄 룸블록", en: "Premium Room Block" }, benefits: [{ ko: "VIP 포함", en: "Includes VIP Rooms" }, { ko: "현장 지원", en: "On-site Support" }] },
    },
  },
  "kintex-dining-course": {
    title: { ko: "KINTEX 다이닝 코스", en: "KINTEX Dining Course" },
    subtitle: { ko: "행사 연계 다이닝", en: "Event Dining" },
    location: { ko: "KINTEX 인근 레스토랑", en: "Restaurants near KINTEX" },
    dateText: { ko: "점심 · 저녁 선택", en: "Lunch · Dinner" },
    posterLabel: { ko: "DINING", en: "DINING" },
    summary: { ko: "전시와 비즈니스 일정에 맞춘 식사 예약 서비스입니다.", en: "Dining reservations aligned to exhibition and business schedules." },
    description: { ko: "단체 식사와 비즈니스 미팅 식사를 함께 운영하기 좋은 구성입니다.", en: "Well-suited for group meals and business meeting dining." },
    tags: [{ ko: "단체 식사", en: "Group Dining" }, { ko: "점심", en: "Lunch" }, { ko: "저녁", en: "Dinner" }],
    options: {
      lunch: { label: { ko: "런치 코스", en: "Lunch Course" }, benefits: [{ ko: "단체 대응", en: "Group Ready" }, { ko: "빠른 운영", en: "Fast Service" }] },
      dinner: { label: { ko: "디너 코스", en: "Dinner Course" }, benefits: [{ ko: "코스 메뉴", en: "Course Menu" }, { ko: "저녁 일정 연계", en: "Evening Program Link" }] },
    },
  },
  "local-food-table": {
    title: { ko: "고양 로컬푸드 테이블", en: "Goyang Local Food Table" },
    subtitle: { ko: "지역 미식 체험", en: "Local Culinary Experience" },
    location: { ko: "관광특구 상권", en: "Tourism District" },
    dateText: { ko: "상시 운영", en: "Always Available" },
    posterLabel: { ko: "LOCAL FOOD", en: "LOCAL FOOD" },
    summary: { ko: "지역 대표 메뉴와 상권 체험을 함께 연결하는 로컬 미식 상품입니다.", en: "A local dining product connecting signature dishes with district experiences." },
    description: { ko: "방문객의 체류와 소비를 함께 늘리기 좋은 지역 미식형 예약 상품입니다.", en: "A dining product designed to extend both stay time and local spending." },
    tags: [{ ko: "로컬 미식", en: "Local Food" }, { ko: "상권 연계", en: "District Link" }, { ko: "추천 메뉴", en: "Signature Menu" }],
    options: {
      set: { label: { ko: "기본 세트", en: "Standard Set" }, benefits: [{ ko: "메인 메뉴 포함", en: "Main Dish Included" }, { ko: "단체 가능", en: "Group Friendly" }] },
      special: { label: { ko: "스페셜 세트", en: "Special Set" }, benefits: [{ ko: "로컬 특선", en: "Local Signature Dish" }, { ko: "추가 코스", en: "Extra Course" }] },
    },
  },
  "vip-banquet-night": {
    title: { ko: "VIP 연회 다이닝", en: "VIP Banquet Dining" },
    subtitle: { ko: "프라이빗 운영", en: "Private Operation" },
    location: { ko: "프라이빗 다이닝 공간", en: "Private Dining Space" },
    dateText: { ko: "저녁 시간 운영", en: "Evening Service" },
    posterLabel: { ko: "VIP NIGHT", en: "VIP NIGHT" },
    summary: { ko: "VIP 고객과 기업 초청객을 위한 프라이빗 다이닝 상품입니다.", en: "A private dining product for VIP guests and corporate invitees." },
    description: { ko: "프라이빗 공간, 코스 메뉴, 현장 응대를 함께 묶은 고급형 다이닝 서비스입니다.", en: "A premium dining service with private space, course menu, and on-site support." },
    tags: [{ ko: "VIP", en: "VIP" }, { ko: "연회", en: "Banquet" }, { ko: "프라이빗", en: "Private" }],
    options: {
      private: { label: { ko: "프라이빗 코스", en: "Private Course" }, benefits: [{ ko: "개별 공간", en: "Private Room" }, { ko: "코스 메뉴", en: "Course Menu" }] },
      "private-plus": { label: { ko: "프라이빗 플러스", en: "Private Plus" }, benefits: [{ ko: "VIP 응대", en: "VIP Host Service" }, { ko: "현장 지원", en: "On-site Support" }] },
    },
  },
  "family-korean-table": {
    title: { ko: "가족 한식 테이블", en: "Family Korean Table" },
    subtitle: { ko: "가족형 식사", en: "Family Dining" },
    location: { ko: "고양 한식당 연계", en: "Linked Korean Restaurants" },
    dateText: { ko: "점심 · 저녁 운영", en: "Lunch · Dinner" },
    posterLabel: { ko: "KOREAN TABLE", en: "KOREAN TABLE" },
    summary: { ko: "가족 방문객을 위한 편안한 한식 중심 예약 상품입니다.", en: "A comfortable Korean dining product for family visitors." },
    description: { ko: "관광 일정 중 부담 없이 즐기기 좋은 한식 중심 식사 구조입니다.", en: "A Korean dining structure well-suited for relaxed tourism schedules." },
    tags: [{ ko: "가족", en: "Family" }, { ko: "한식", en: "Korean Food" }, { ko: "편안한 식사", en: "Comfort Dining" }],
    options: {
      basic: { label: { ko: "기본 상차림", en: "Basic Table" }, benefits: [{ ko: "대표 한식 메뉴", en: "Signature Korean Menu" }, { ko: "가족형 좌석", en: "Family Seating" }] },
      premium: { label: { ko: "프리미엄 상차림", en: "Premium Table" }, benefits: [{ ko: "특선 메뉴", en: "Premium Dishes" }, { ko: "예약 우선", en: "Priority Reservation" }] },
    },
  },
  "brunch-social-club": {
    title: { ko: "브런치 소셜 클럽", en: "Brunch Social Club" },
    subtitle: { ko: "브런치 · 모임", en: "Brunch · Gathering" },
    location: { ko: "브런치 카페 거리", en: "Brunch Cafe District" },
    dateText: { ko: "오전~오후 운영", en: "Morning to Afternoon" },
    posterLabel: { ko: "BRUNCH", en: "BRUNCH" },
    summary: { ko: "브런치와 소셜 모임을 함께 즐기는 라이프스타일 예약 상품입니다.", en: "A lifestyle booking product combining brunch with social gatherings." },
    description: { ko: "캐주얼 미팅과 휴식 시간을 함께 구성하기 좋은 브런치 중심 상품입니다.", en: "A brunch-centered product ideal for casual meetings and relaxed breaks." },
    tags: [{ ko: "브런치", en: "Brunch" }, { ko: "소셜", en: "Social" }, { ko: "모임", en: "Gathering" }],
    options: {
      single: { label: { ko: "1인 브런치", en: "Single Brunch" }, benefits: [{ ko: "대표 메뉴 포함", en: "Signature Menu Included" }, { ko: "좌석 예약", en: "Seat Reservation" }] },
      couple: { label: { ko: "2인 브런치", en: "Couple Brunch" }, benefits: [{ ko: "2인 메뉴", en: "Menu for Two" }, { ko: "디저트 포함", en: "Dessert Included" }] },
    },
  },
  "local-cafe-hop": {
    title: { ko: "로컬 카페 홉", en: "Local Cafe Hop" },
    subtitle: { ko: "카페 투어", en: "Cafe Tour" },
    location: { ko: "로컬 카페 거리", en: "Local Cafe Street" },
    dateText: { ko: "상시 운영", en: "Always Available" },
    posterLabel: { ko: "CAFE HOP", en: "CAFE HOP" },
    summary: { ko: "카페와 디저트를 취향별로 즐기는 로컬 라이프스타일 상품입니다.", en: "A local lifestyle product for enjoying cafes and desserts by taste." },
    description: { ko: "휴식과 동선 체류를 함께 늘리기 좋은 카페 중심 예약 구조입니다.", en: "A cafe-focused booking flow ideal for extending rest time and local movement." },
    tags: [{ ko: "디저트", en: "Dessert" }, { ko: "카페투어", en: "Cafe Tour" }, { ko: "로컬", en: "Local" }],
    options: {
      "hop-basic": { label: { ko: "기본 카페 코스", en: "Basic Cafe Course" }, benefits: [{ ko: "2개 카페 연계", en: "2 Cafes Included" }, { ko: "추천 음료", en: "Recommended Drink" }] },
      "hop-plus": { label: { ko: "확장 카페 코스", en: "Extended Cafe Course" }, benefits: [{ ko: "3개 카페 연계", en: "3 Cafes Included" }, { ko: "디저트 포함", en: "Dessert Included" }] },
    },
  },
  "creative-work-lounge": {
    title: { ko: "크리에이티브 워크 라운지", en: "Creative Work Lounge" },
    subtitle: { ko: "미팅 · 작업 공간", en: "Meeting · Work Space" },
    location: { ko: "감성 라운지형 카페", en: "Mood Lounge Cafe" },
    dateText: { ko: "평일 중심 운영", en: "Weekday Focused" },
    posterLabel: { ko: "WORK", en: "WORK" },
    summary: { ko: "미팅, 작업, 휴식을 함께 지원하는 라운지형 예약 상품입니다.", en: "A lounge-style reservation product for meetings, work, and relaxation." },
    description: { ko: "소규모 팀 미팅과 크리에이티브 작업에 적합한 공간 예약입니다.", en: "A space booking option suited for small team meetings and creative work." },
    tags: [{ ko: "미팅", en: "Meeting" }, { ko: "워크라운지", en: "Work Lounge" }, { ko: "감성공간", en: "Mood Space" }],
    options: {
      "space-only": { label: { ko: "공간 대여", en: "Space Rental" }, benefits: [{ ko: "좌석 확보", en: "Reserved Seating" }, { ko: "기본 이용권", en: "Base Access" }] },
      "space-drink": { label: { ko: "공간 + 음료", en: "Space + Drinks" }, benefits: [{ ko: "음료 포함", en: "Drinks Included" }, { ko: "장시간 이용", en: "Extended Use" }] },
    },
  },
  "sunset-rooftop-cafe": {
    title: { ko: "선셋 루프탑 카페", en: "Sunset Rooftop Cafe" },
    subtitle: { ko: "야경 · 감성 공간", en: "Night View · Mood Space" },
    location: { ko: "루프탑 카페 스팟", en: "Rooftop Cafe Spot" },
    dateText: { ko: "해질녘 중심 운영", en: "Sunset Hours" },
    posterLabel: { ko: "ROOFTOP", en: "ROOFTOP" },
    summary: { ko: "야경과 감성을 함께 즐기는 루프탑 카페 예약 상품입니다.", en: "A rooftop cafe booking product for skyline views and atmosphere." },
    description: { ko: "야간 동선과 연결하기 좋은 감성형 카페 예약 상품입니다.", en: "A mood-focused cafe reservation option perfect for evening itineraries." },
    tags: [{ ko: "루프탑", en: "Rooftop" }, { ko: "야경", en: "Night View" }, { ko: "감성카페", en: "Mood Cafe" }],
    options: {
      sunset: { label: { ko: "선셋 예약", en: "Sunset Reservation" }, benefits: [{ ko: "창가 좌석", en: "Window Seat" }, { ko: "대표 음료", en: "Signature Drink" }] },
      "sunset-plus": { label: { ko: "선셋 플러스", en: "Sunset Plus" }, benefits: [{ ko: "디저트 포함", en: "Dessert Included" }, { ko: "사진 스팟 안내", en: "Photo Spot Guide" }] },
    },
  },
};

export function getServiceItemCopy(locale: PageLocale, itemId: string) {
  const copy = serviceItemCopy[itemId];
  if (!copy) return null;
  return {
    title: pick(locale, copy.title),
    subtitle: pick(locale, copy.subtitle),
    location: pick(locale, copy.location),
    dateText: pick(locale, copy.dateText),
    posterLabel: pick(locale, copy.posterLabel),
    summary: pick(locale, copy.summary),
    description: pick(locale, copy.description),
    tags: copy.tags.map((tag) => pick(locale, tag)),
    options: Object.fromEntries(
      Object.entries(copy.options).map(([id, option]) => [
        id,
        { label: pick(locale, option.label), benefits: option.benefits.map((benefit) => pick(locale, benefit)) },
      ])
    ),
  };
}
