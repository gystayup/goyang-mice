"use client";

import { useMemo, useState } from "react";
import {
  BadgePercent,
  CalendarRange,
  CreditCard,
  LayoutGrid,
} from "lucide-react";

import { dmcCategories, products } from "@/data/products";

import ProductCard from "./ProductCard";

type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const categoryCopy = {
  ko: {
    all: "전체 서비스",
    hero: {
      badge: "DMC Service Program",
      title:
        "여행상품부터 공항픽업까지 6개 예약 서비스를 하나의 흐름으로 운영합니다",
      paymentsLabel: "결제방법",
      payments: ["💳 크레딧카드", "💬 카카오페이", "🏦 계좌송금"],
      signals: [
        {
          title: "6개 카테고리",
          desc: "여행상품, 숙박, 음식점, 라이프스타일, 티켓, 공항픽업을 하나의 구조로 연결합니다.",
        },
        {
          title: "예약과 운영",
          desc: "일정, 인원, 옵션, 요청사항까지 같은 구조 안에서 운영할 수 있습니다.",
        },
        {
          title: "결제와 정산",
          desc: "선결제, 법인 청구, 단체 정산까지 확장 가능한 흐름으로 설계했습니다.",
        },
      ],
      mapTitle: "서비스 흐름",
      mapDesc:
        "6개 카테고리가 예약, 운영, 관리, 결제 흐름 안에서 자연스럽게 이어지도록 정리했습니다.",
    },
    categories: {
      tour: {
        label: "여행상품",
        promoTitle: "고양의 관광과 로컬 체험을 연결하는 여행상품 예약",
        promoDesc:
          "시티투어, 로컬 체험, 가족 코스, K-컬처 코스를 하나의 예약 흐름으로 운영합니다.",
      },
      stay: {
        label: "숙박예약",
        promoTitle: "행사와 체류를 연결하는 숙박 예약 서비스",
        promoDesc:
          "KINTEX와 공연장, 관광 거점을 잇는 호텔과 레지던스를 예약 구조로 운영합니다.",
      },
      restaurant: {
        label: "음식점예약",
        promoTitle: "단체 식사와 미식 경험을 연결하는 음식점 예약",
        promoDesc:
          "단체식, 코스 다이닝, VIP 만찬, 로컬 미식을 시간대별로 연결합니다.",
      },
      cafe: {
        label: "라이프스타일 예약",
        promoTitle: "카페와 감성 공간을 연결하는 라이프스타일 예약",
        promoDesc:
          "브런치, 디저트, 미팅 공간, 감성 카페를 예약형 서비스로 운영합니다.",
      },
      ticket: {
        label: "티켓예약",
        promoTitle: "공연과 전시를 연결하는 티켓 예약 서비스",
        promoDesc:
          "공연, 전시, 체험 프로그램을 검색하고 상세 설명과 결제로 바로 이어집니다.",
      },
      airport: {
        label: "공항픽업예약",
        promoTitle: "공항에서 고양까지 연결하는 픽업·샌딩 예약",
        promoDesc:
          "인천공항, 김포공항, VIP 이동, 단체 차량 예약을 하나의 구조로 운영합니다.",
      },
    },
  },
  en: {
    all: "All Services",
    hero: {
      badge: "DMC Service Program",
      title:
        "Operate 6 booking services in one connected flow, from travel products to airport pickup",
      paymentsLabel: "Payment Methods",
      payments: ["💳 Credit Card", "💬 KakaoPay", "🏦 Bank Transfer"],
      signals: [
        {
          title: "6 Categories",
          desc: "Travel, stay, dining, lifestyle, ticketing, and airport pickup are connected in one structure.",
        },
        {
          title: "Booking & Operations",
          desc: "Schedules, guest counts, options, and requests are managed in one connected flow.",
        },
        {
          title: "Payment & Settlement",
          desc: "Built to support prepayment, corporate billing, and future settlement expansion.",
        },
      ],
      mapTitle: "Service Flow",
      mapDesc:
        "The six service categories are organized so booking, operations, management, and payment work together.",
    },
    categories: {
      tour: {
        label: "Travel Products",
        promoTitle: "Travel booking that connects sightseeing and local experiences in Goyang",
        promoDesc:
          "City tours, local experiences, family courses, and K-culture routes are managed in one booking flow.",
      },
      stay: {
        label: "Accommodation",
        promoTitle: "Accommodation booking that connects events and city stays",
        promoDesc:
          "Hotels and residences linked to KINTEX, venues, and tourism hubs in one stay structure.",
      },
      restaurant: {
        label: "Restaurant Booking",
        promoTitle: "Dining reservations connecting group meals and culinary experiences",
        promoDesc:
          "Group dining, course dining, VIP dinner, and local food experiences are linked in one flow.",
      },
      cafe: {
        label: "Lifestyle Booking",
        promoTitle: "Lifestyle reservations connecting cafes and curated spaces",
        promoDesc:
          "Brunch, dessert, meeting spaces, and trendy cafes are offered as one bookable service.",
      },
      ticket: {
        label: "Ticket Booking",
        promoTitle: "Ticket service for performances, exhibitions, and activities",
        promoDesc:
          "Search, compare, and move to detailed booking and payment in one connected ticket flow.",
      },
      airport: {
        label: "Airport Pickup",
        promoTitle: "Airport pickup and sending service linked to Goyang stays and venues",
        promoDesc:
          "Incheon, Gimpo, VIP transfer, and group vehicle bookings are managed in one structure.",
      },
    },
  },
} as const;

const extraLocaleCopy: Record<"ja" | "zh-CN" | "zh-TW", Record<string, unknown>> = {
  ja: {
    all: "全サービス",
    hero: {
      badge: "DMC Service Program",
      title: "旅行商品から空港送迎まで6つの予約サービスをひとつの流れで運営します",
      paymentsLabel: "お支払い方法",
      payments: ["💳 クレジットカード", "💬 KakaoPay", "🏦 銀行振込"],
      signals: [
        { title: "6カテゴリ", desc: "旅行商品、宿泊、飲食店、ライフスタイル、チケット、空港送迎をひとつの構造でつなぎます。" },
        { title: "予約と運営", desc: "日程、人数、オプション、リクエストを同じ構造の中で管理できます。" },
        { title: "決済と精算", desc: "前払い、法人請求、団体精算まで拡張可能なフローで設計しています。" },
      ],
      mapTitle: "サービスフロー",
      mapDesc: "6つのカテゴリが予約・運営・管理・決済のフローの中で自然につながるよう整理しています。",
    },
    categories: {
      tour: { label: "旅行商品", promoTitle: "高陽の観光とローカル体験をつなぐ旅行商品予約", promoDesc: "シティツアー、ローカル体験、ファミリーコース、K-カルチャーコースをひとつの予約フローで運営します。" },
      stay: { label: "宿泊予約", promoTitle: "イベントと滞在をつなぐ宿泊予約サービス", promoDesc: "KINTEXや公演場、観光拠点に近いホテルとレジデンスを予約構造で運営します。" },
      restaurant: { label: "飲食店予約", promoTitle: "団体食事とグルメ体験をつなぐ飲食店予約", promoDesc: "団体食、コースダイニング、VIPディナー、ローカルグルメを時間帯別につなぎます。" },
      cafe: { label: "ライフスタイル予約", promoTitle: "カフェと感性空間をつなぐライフスタイル予約", promoDesc: "ブランチ、デザート、ミーティングスペース、感性カフェを予約型サービスで提供します。" },
      ticket: { label: "チケット予約", promoTitle: "公演と展示をつなぐチケット予約サービス", promoDesc: "公演、展示、体験プログラムを検索して詳細説明と決済へスムーズに進めます。" },
      airport: { label: "空港送迎予約", promoTitle: "空港から高陽へつなぐ送迎予約", promoDesc: "仁川空港、金浦空港、VIP移動、団体車両予約をひとつの構造で運営します。" },
    },
  },
  "zh-CN": {
    all: "全部服务",
    hero: {
      badge: "DMC Service Program",
      title: "从旅游产品到机场接送，在一体化流程中运营6大预约服务",
      paymentsLabel: "支付方式",
      payments: ["💳 信用卡", "💬 KakaoPay", "🏦 银行转账"],
      signals: [
        { title: "6大类别", desc: "旅游产品、住宿、餐厅、生活方式、票务与机场接送整合为一套结构。" },
        { title: "预约与运营", desc: "日程、人数、选项与需求，均可在同一结构内统一管理。" },
        { title: "支付与结算", desc: "设计为支持预付款、企业账单及团体结算的可扩展流程。" },
      ],
      mapTitle: "服务流程",
      mapDesc: "6大服务类别在预约、运营、管理与支付流程中自然衔接。",
    },
    categories: {
      tour: { label: "旅游产品", promoTitle: "连接高阳观光与本地体验的旅游产品预约", promoDesc: "城市游览、本地体验、家庭路线及K-文化路线，在统一预约流程中运营。" },
      stay: { label: "住宿预约", promoTitle: "连接活动与城市驻留的住宿预约服务", promoDesc: "毗邻KINTEX、演出场馆及旅游据点的酒店与公寓，统一在预约结构中运营。" },
      restaurant: { label: "餐厅预约", promoTitle: "连接团体用餐与美食体验的餐厅预约", promoDesc: "团体用餐、套餐餐厅、VIP晚宴及本地美食，按时段相互衔接。" },
      cafe: { label: "生活方式预约", promoTitle: "连接咖啡馆与精选空间的生活方式预约", promoDesc: "早午餐、甜品、会议空间及网红咖啡馆，以可预约服务形式提供。" },
      ticket: { label: "票务预约", promoTitle: "连接演出与展览的票务预约服务", promoDesc: "搜索演出、展览及体验项目，直接跳转至详情说明与支付流程。" },
      airport: { label: "机场接送预约", promoTitle: "连接机场与高阳的接送预约", promoDesc: "仁川机场、金浦机场、VIP接送及团体用车预约，统一在一套结构中运营。" },
    },
  },
  "zh-TW": {
    all: "全部服務",
    hero: {
      badge: "DMC Service Program",
      title: "從旅遊產品到機場接送，在一體化流程中營運6大預約服務",
      paymentsLabel: "付款方式",
      payments: ["💳 信用卡", "💬 KakaoPay", "🏦 銀行轉帳"],
      signals: [
        { title: "6大類別", desc: "旅遊產品、住宿、餐廳、生活風格、票務與機場接送整合為一套結構。" },
        { title: "預約與營運", desc: "日程、人數、選項與需求，均可在同一結構內統一管理。" },
        { title: "支付與結算", desc: "設計為支援預付款、企業帳單及團體結算的可擴展流程。" },
      ],
      mapTitle: "服務流程",
      mapDesc: "6大服務類別在預約、營運、管理與支付流程中自然銜接。",
    },
    categories: {
      tour: { label: "旅遊產品", promoTitle: "連結高陽觀光與在地體驗的旅遊產品預約", promoDesc: "城市遊覽、在地體驗、家庭路線及K-文化路線，在統一預約流程中營運。" },
      stay: { label: "住宿預約", promoTitle: "連結活動與城市駐留的住宿預約服務", promoDesc: "毗鄰KINTEX、演出場館及旅遊據點的飯店與公寓，統一在預約結構中營運。" },
      restaurant: { label: "餐廳預約", promoTitle: "連結團體用餐與美食體驗的餐廳預約", promoDesc: "團體用餐、套餐餐廳、VIP晚宴及在地美食，按時段相互銜接。" },
      cafe: { label: "生活風格預約", promoTitle: "連結咖啡廳與精選空間的生活風格預約", promoDesc: "早午餐、甜品、會議空間及網紅咖啡廳，以可預約服務形式提供。" },
      ticket: { label: "票務預約", promoTitle: "連結演出與展覽的票務預約服務", promoDesc: "搜尋演出、展覽及體驗方案，直接跳轉至詳情說明與支付流程。" },
      airport: { label: "機場接送預約", promoTitle: "連結機場與高陽的接送預約", promoDesc: "仁川機場、金浦機場、VIP接送及團體用車預約，統一在一套結構中營運。" },
    },
  },
};

export default function ProductCatalog({ locale = "ko" }: { locale?: PageLocale }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }
    return products.filter((item) => item.categoryKey === activeCategory);
  }, [activeCategory]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copy: typeof categoryCopy.en = (locale === "en" ? categoryCopy.en : locale in extraLocaleCopy ? (extraLocaleCopy as any)[locale] : categoryCopy.ko) as typeof categoryCopy.en;

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-[linear-gradient(135deg,_#0f172a_0%,_#172554_38%,_#0f766e_100%)] text-white shadow-soft">
        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <BadgePercent className="h-4 w-4" />
              {copy.hero.badge}
            </div>
            <h3 className="mt-5 text-xl font-black leading-tight tracking-tight sm:text-3xl lg:text-5xl">
              {copy.hero.title}
            </h3>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white sm:px-5 sm:py-2.5 sm:text-base">
                {copy.hero.paymentsLabel}
              </span>
              {copy.hero.payments.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 sm:px-5 sm:py-2.5 sm:text-base"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {copy.hero.signals.map((item, index) => {
              const icons = [LayoutGrid, CalendarRange, CreditCard] as const;
              const Icon = icons[index];
              return (
                <div
                  key={item.title}
                  className="rounded-[26px] border border-white/10 bg-white/10 p-5 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/15 p-3">
                      <Icon className="h-5 w-5 text-cyan-100" />
                    </div>
                    <div className="text-base font-bold">{item.title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-100">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            activeCategory === "all"
              ? "bg-slate-950 text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {copy.all}
        </button>
        {dmcCategories.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveCategory(item.key)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              activeCategory === item.key
                ? "bg-slate-950 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {copy.categories[item.key].label}
          </button>
        ))}
      </div>

      {activeCategory !== "all" ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            {copy.categories[activeCategory as keyof typeof copy.categories].label}
          </div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {copy.categories[activeCategory as keyof typeof copy.categories].promoTitle}
          </h3>
          <p className="mt-4 text-base leading-8 text-slate-600">
            {copy.categories[activeCategory as keyof typeof copy.categories].promoDesc}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {copy.hero.mapDesc}
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
