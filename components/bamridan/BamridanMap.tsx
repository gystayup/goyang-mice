// components/bamridan/BamridanMap.tsx — 오더 #C72 [1]-A.
//
// 원본: docs/bamridan/밤리단길_관광맵_v3수정본5.html (사장님 제공, 41KB).
// SVG(1400×960) 도로/블록/노선도(경의선·3호선·대곡환승) 정적 markup +
// SPOTS 27개 배열 그대로 이관 + 핀·툴팁·목록·하이라이트 인터랙션 React 로 재구현.
// 데이터·문안 변경 금지 (오더 [2]).
// CSS 는 BamridanMap.module.css 로 스코프 (전역 오염 방지).

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./BamridanMap.module.css";

type CategoryKey = "eat" | "coffee" | "sweet" | "shop";

type Spot = {
  c: CategoryKey;
  n: number;
  name: string;
  type: string;
  desc: string;
  addr: string;
  price: string;
  rate: number | null;
  rev: number | null;
  hours: string;
  x: number;
  y: number;
};

type Category = {
  en: string;
  ko: string;
  color: string;
  desc: string;
};

const CATS: Record<CategoryKey, Category> = {
  eat: { en: "EAT", ko: "오늘 뭐 먹지?", color: "#E23E2E", desc: "프렌치·이탈리안·라멘·버거·국수까지, 골목마다 다른 한 끼." },
  coffee: { en: "COFFEE", ko: "밤리단의 커피", color: "#7A5233", desc: "로스터리부터 라떼, 테라스까지 — 식사 뒤 머무는 카페호핑 거리." },
  sweet: { en: "SWEET", ko: "달콤한 밤리단", color: "#D9689B", desc: "휘낭시에·베이커리·샌드 — 선물하거나 바로 즐기는 디저트." },
  shop: { en: "SHOP", ko: "골목에서 발견하는 작은 것들", color: "#2F7D6D", desc: "선물가게·소품숍·공방이 골목에 섞인 밤리단만의 생활감성." },
};

const SPOTS: Spot[] = [
  /* ---- EAT ---- */
  { c: "eat", n: 1, name: "르쁠라 일산 밤리단길", type: "프렌치", desc: "특별한 날에 어울리는 프랑스 가정식·다이닝", addr: "일산로358번길 34", price: "₩30,000~60,000", rate: 4.4, rev: 273, hours: "화~토 운영 / 브레이크타임", x: 540, y: 430 },
  { c: "eat", n: 2, name: "은수테이블", type: "이탈리안", desc: "파스타 중심의 편안한 이탈리안 식사", addr: "정발산동 1157-13", price: "₩10,000~50,000", rate: 4.2, rev: 393, hours: "11:30~21:00 / 화 휴무", x: 450, y: 560 },
  { c: "eat", n: 3, name: "키딩", type: "이탈리안", desc: "밤리단길 메인 골목에서 즐기는 파스타·양식", addr: "일산로380번길 15", price: "₩10,000~40,000", rate: 4.4, rev: 46, hours: "11:00~15:30 / 17:30~21:00", x: 800, y: 610 },
  { c: "eat", n: 4, name: "밤가시버거", type: "버거", desc: "밤리단길을 대표하는 캐주얼 버거 스폿", addr: "일산로372번길 46", price: "₩10,000~20,000", rate: 4.3, rev: 973, hours: "11:00~20:30", x: 632, y: 360 },
  { c: "eat", n: 5, name: "이경 양식당", type: "퓨전양식", desc: "스테이크·파스타를 편하게 즐기는 양식당", addr: "정발산동 1237-9", price: "₩10,000~20,000", rate: 4.3, rev: 161, hours: "11:00~21:00", x: 718, y: 500 },
  { c: "eat", n: 6, name: "소코아 일산밤리단길점", type: "일식/카레", desc: "카레·일식 계열의 가벼운 한 끼", addr: "마두1동 879-2", price: "₩10,000~20,000", rate: 4.6, rev: 114, hours: "11:00~20:00", x: 610, y: 770 },
  { c: "eat", n: 7, name: "계단라멘 일산본점", type: "라멘", desc: "리뷰가 많은 일본식 라멘 전문점", addr: "율천로7번길 10", price: "₩10,000~20,000", rate: 4.4, rev: 661, hours: "11:00~21:00", x: 880, y: 806 },
  { c: "eat", n: 8, name: "몽화가락", type: "숯불구이", desc: "저녁에 잘 어울리는 숯불구이·바비큐", addr: "정발산동 1289-5", price: "₩10,000~40,000", rate: 4.3, rev: 337, hours: "평일 16:00~23:00", x: 848, y: 470 },
  { c: "eat", n: 9, name: "즐거운국수", type: "한식/국수", desc: "부담 없는 가격의 국수 중심 로컬식당", addr: "일산로316번길 19-2", price: "₩1~10,000", rate: 4.4, rev: 146, hours: "평일 점심·저녁", x: 395, y: 590 },
  { c: "eat", n: 10, name: "밤마을", type: "로컬식당", desc: "밤가시마을 분위기와 어울리는 동네 식사 공간", addr: "대산로11번길 78", price: "₩20,000~30,000", rate: 4.8, rev: 13, hours: "11:00~21:00", x: 330, y: 270 },
  /* ---- COFFEE ---- */
  { c: "coffee", n: 1, name: "오릴리 일산밤리단길 본점", type: "카페", desc: "늦은 시간까지 이용하기 좋은 밤리단길 대표 카페", addr: "산두로 215", price: "₩10,000~20,000", rate: 4.5, rev: 82, hours: "10:30~22:00", x: 822, y: 200 },
  { c: "coffee", n: 2, name: "미루꾸커피 밤리단길본점", type: "커피전문", desc: "밤리단길에서 인지도가 높은 커피 전문점", addr: "일산로316번길 25-1", price: "₩1~10,000", rate: 4.4, rev: 265, hours: "10:00~22:00", x: 395, y: 490 },
  { c: "coffee", n: 3, name: "조바티커피", type: "커피전문", desc: "골목 산책 중 들르기 좋은 커피 스폿", addr: "일산로372번길 30-5", price: "₩1~10,000", rate: 4.5, rev: 39, hours: "11:00~22:00", x: 666, y: 510 },
  { c: "coffee", n: 4, name: "네임드커피 밤리단길점", type: "커피전문", desc: "저녁까지 이용 가능한 캐주얼 커피숍", addr: "정발산동 1234-5", price: "₩1~10,000", rate: 4.3, rev: 31, hours: "11:00~22:00", x: 742, y: 420 },
  { c: "coffee", n: 5, name: "올댓커피 보넷길점", type: "카페", desc: "보넷길 코어에서 쉬어가기 좋은 카페", addr: "일산로380번길 5-6", price: "₩1~10,000", rate: 4.5, rev: 92, hours: "12:00~19:00", x: 762, y: 660 },
  { c: "coffee", n: 6, name: "블러프커피", type: "카페", desc: "밤리단권역에서 꾸준히 찾는 커피·카페 공간", addr: "마두1동 835-11", price: "₩1~10,000", rate: 4.4, rev: 159, hours: "10:00~21:00", x: 524, y: 784 },
  { c: "coffee", n: 7, name: "5센소커피 밤리단길카페", type: "커피전문", desc: "작은 골목형 커피 전문점", addr: "일산로372번길 38-11", price: "₩1~10,000", rate: 5.0, rev: 3, hours: "10:00~19:00", x: 668, y: 428 },
  /* ---- SWEET ---- */
  { c: "sweet", n: 1, name: "밤리샌드", type: "샌드/디저트", desc: "밤리단 이름을 활용한 로컬형 디저트", addr: "정발산동 1352-3", price: "-", rate: 4.5, rev: 2, hours: "영업시간 재확인 필요", x: 958, y: 340 },
  { c: "sweet", n: 2, name: "몽킽키친 밤리단길점", type: "베이커리", desc: "구움과자·베이커리 중심의 인기 디저트숍", addr: "정발산동 1353-8", price: "₩1~20,000", rate: 4.9, rev: 55, hours: "10:00~19:00", x: 972, y: 420 },
  { c: "sweet", n: 3, name: "리니베이크 밤리단길점", type: "디저트", desc: "골목에서 즐기는 베이크·디저트 전문점", addr: "일산로394번길 19-13", price: "₩1~20,000", rate: 3.8, rev: 11, hours: "11:00~20:00 / 월·화 휴무", x: 928, y: 560 },
  { c: "sweet", n: 4, name: "휘낭시에르 일산밤리단길 본점", type: "휘낭시에", desc: "다양한 휘낭시에를 고르는 구움과자 전문 공간", addr: "산두로 141", price: "₩3,000대~", rate: 4.8, rev: 6, hours: "화~토 11:00~21:00", x: 576, y: 200 },
  { c: "sweet", n: 5, name: "미라이키", type: "베이커리", desc: "늦은 시간까지 들르기 좋은 베이커리", addr: "산두로213번길 14", price: "₩10,000~50,000", rate: 4.5, rev: 25, hours: "10:00~22:00 / 월 휴무", x: 876, y: 262 },
  /* ---- SHOP ---- */
  { c: "shop", n: 1, name: "밤가시 상점", type: "선물가게", desc: "밤가시·밤리단 분위기를 느끼며 작은 선물을 고르는 로컬 숍", addr: "정발산동 1273-12", price: "-", rate: 5.0, rev: 2, hours: "주말 11:30~20:00", x: 588, y: 320 },
  { c: "shop", n: 2, name: "꼬모다미", type: "선물가게", desc: "보넷길 골목에서 만나는 감성 선물·소품숍", addr: "일산로380번길 5-14", price: "-", rate: 4.5, rev: 2, hours: "수~금 12:00~19:00", x: 800, y: 665 },
  { c: "shop", n: 3, name: "시냇물 공방", type: "도자기/체험", desc: "체험형 콘텐츠로 연결 가능한 도자기 공방", addr: "정발산동 1164-12", price: "-", rate: 5.0, rev: 1, hours: "월~금 10:00~18:00", x: 462, y: 628 },
  { c: "shop", n: 4, name: "베르니케", type: "소품/라이프스타일", desc: "밤리단길의 감성 소품·라이프스타일 숍", addr: "정발산동 일대", price: "-", rate: null, rev: null, hours: "11:00~20:00 수준 / 재확인", x: 712, y: 340 },
  { c: "shop", n: 5, name: "제로웨이스트 차차", type: "친환경 소품", desc: "친환경 생활소품과 카페 성격을 결합한 공간", addr: "일산로394번길 15", price: "-", rate: null, rev: null, hours: "11:00~21:00 수준 / 재확인", x: 928, y: 630 },
];

const spotKey = (s: Spot) => `${s.c}${s.n}`;
const mapUrl = (s: Spot) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${s.name} 고양시 일산동구 ${s.addr}`
  )}`;

/** 티어드롭 마커 path */
const DROP = "M0 0 C -3.5 -7 -13 -10.5 -13 -19 A 13 13 0 1 1 13 -19 C 13 -10.5 3.5 -7 0 0 Z";

export default function BamridanMap() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<
    { spot: Spot; x: number; y: number } | null
  >(null);
  const mapInnerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stickyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stickyTimerRef.current) clearTimeout(stickyTimerRef.current);
    };
  }, []);

  const highlight = useCallback((key: string, sticky: boolean) => {
    setActiveKey(key);
    if (sticky) {
      if (stickyTimerRef.current) clearTimeout(stickyTimerRef.current);
      stickyTimerRef.current = setTimeout(() => setActiveKey(null), 2600);
    }
  }, []);

  const clearHighlight = useCallback(() => {
    setActiveKey(null);
  }, []);

  const computeTipPos = useCallback((e: React.MouseEvent) => {
    const inner = mapInnerRef.current;
    if (!inner) return { x: 0, y: 0 };
    const r = inner.getBoundingClientRect();
    let x = e.clientX - r.left + 16;
    const y = e.clientY - r.top + 14;
    if (x + 280 > r.width) x = e.clientX - r.left - 290;
    if (x < 4) x = 4;
    return { x, y };
  }, []);

  const showTip = useCallback(
    (spot: Spot, e: React.MouseEvent) => {
      const { x, y } = computeTipPos(e);
      setTooltip({ spot, x, y });
    },
    [computeTipPos]
  );

  const moveTip = useCallback(
    (e: React.MouseEvent) => {
      setTooltip((prev) => {
        if (!prev) return prev;
        const { x, y } = computeTipPos(e);
        return { ...prev, x, y };
      });
    },
    [computeTipPos]
  );

  const hideTip = useCallback(() => setTooltip(null), []);

  return (
    <div className={styles.pageRoot}>
      {/* ============ HERO ============ */}
      <header className={styles.hero}>
        <div className={styles["hero-eyebrow"]}>
          BAMRIDAN LOCAL DISTRICT · JEONGBALSAN-DONG, GOYANG
        </div>
        <h1 className={styles["hero-title"]}>
          고양·일산 핫플레이스 <em>밤리단길</em>
        </h1>
        <div className={styles["hero-rule"]} />
        <p className={styles["hero-sub"]}>
          정발산동 주택가 골목에 맛집·카페·디저트·소품숍·공방이 모인 고양의 로컬 라이프스타일 거리 — 골목 구조를 기준으로 27개 핫플레이스를 한 장에 담았습니다.
        </p>
        <div className={styles["hero-lines"]}>
          <span className={styles["line-chip"]}>
            <i className={styles["line-dot"]} style={{ background: "var(--line3)" }} />
            지하철 3호선 <small>정발산역 · 도보 약 10~12분</small>
          </span>
          <span className={styles["line-chip"]}>
            <i className={styles["line-dot"]} style={{ background: "var(--gyeongui)" }} />
            경의중앙선 <small>풍산역 · 도보 약 7분</small>
          </span>
          <span className={styles["line-chip"]}>
            <i className={styles["line-dot"]} style={{ background: "#9A6292" }} />
            GTX-A <small>킨텍스역 연계 · 서울역 방면</small>
          </span>
        </div>
      </header>

      {/* ============ MAP ============ */}
      <section className={styles["map-section"]}>
        <div className={styles["map-head"]}>
          <h2>골목 배치도 — 일산로 번길 축 기준</h2>
          <p>핀에 마우스를 올리거나 아래 목록을 클릭하면 위치가 표시됩니다</p>
        </div>

        <div className={styles["map-frame"]}>
          <div className={styles["map-inner"]} ref={mapInnerRef}>
            {tooltip && (
              <div
                className={styles.tooltip}
                style={{
                  display: "block",
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y}px`,
                  borderLeftColor: CATS[tooltip.spot.c].color,
                }}
              >
                <div className={styles["t-cat"]} style={{ color: CATS[tooltip.spot.c].color }}>
                  {CATS[tooltip.spot.c].en} · {tooltip.spot.type}
                </div>
                <div className={styles["t-name"]}>{tooltip.spot.name}</div>
                <div className={styles["t-desc"]}>{tooltip.spot.desc}</div>
                <div className={styles["t-meta"]}>
                  {tooltip.spot.rate != null && (
                    <>
                      ★ <b>{tooltip.spot.rate.toFixed(1)}</b>
                      {tooltip.spot.rev != null && ` (${tooltip.spot.rev})`}
                    </>
                  )}
                  {tooltip.spot.price && tooltip.spot.price !== "-" && (
                    <>
                      {tooltip.spot.rate != null ? " · " : ""}
                      {tooltip.spot.price}
                    </>
                  )}
                  <br />
                  {tooltip.spot.addr} · {tooltip.spot.hours}
                </div>
              </div>
            )}

            <svg
              ref={svgRef}
              viewBox="0 0 1400 960"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="밤리단길 골목 배치도"
            >
              <defs>
                <linearGradient id="paperG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FAF4E7" />
                  <stop offset="1" stopColor="#F3E9D3" />
                </linearGradient>
                <radialGradient id="hillG" cx="40%" cy="35%" r="80%">
                  <stop offset="0" stopColor="#D3E2C6" />
                  <stop offset="1" stopColor="#B9CFA8" />
                </radialGradient>
                <filter id="blockShadow" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#5A431F" floodOpacity="0.16" />
                </filter>
                <filter id="pinShadow" x="-60%" y="-40%" width="220%" height="200%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2.6" floodColor="#3A2A10" floodOpacity="0.38" />
                </filter>
                <filter id="softLift" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#5A431F" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* 종이 배경 */}
              <rect x="0" y="0" width="1400" height="960" fill="url(#paperG)" />

              {/* ===== 정발산 단독주택 권역 (서측) ===== */}
              <g fill="#F2E7CF" stroke="#E4D3B0" strokeWidth="1" filter="url(#blockShadow)">
                <rect x="66" y="266" width="110" height="182" rx="10" />
                <rect x="192" y="266" width="108" height="182" rx="10" />
                <rect x="66" y="470" width="110" height="180" rx="10" />
                <rect x="192" y="470" width="108" height="180" rx="10" />
              </g>
              <line x1="184" y1="276" x2="184" y2="640" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity=".9" />
              <line x1="74" y1="458" x2="292" y2="458" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" opacity=".9" />
              <g fill="#E8D8B6" opacity=".9">
                <rect x="86" y="292" width="15" height="12" rx="2" />
                <rect x="130" y="340" width="14" height="11" rx="2" />
                <rect x="216" y="300" width="15" height="12" rx="2" />
                <rect x="252" y="380" width="14" height="11" rx="2" />
                <rect x="92" y="520" width="14" height="11" rx="2" />
                <rect x="230" y="560" width="15" height="12" rx="2" />
                <rect x="140" y="600" width="14" height="11" rx="2" />
              </g>
              <text x="86" y="248" fontSize="13.5" fontWeight="900" fill="#8A7452">정발산 단독주택</text>

              {/* ===== 정발산 산지 음영 ===== */}
              <g opacity=".55">
                <path d="M 636 846 Q 672 808 700 830 Q 724 800 750 828 Q 780 806 812 846 Z" fill="url(#hillG)" />
                <path d="M 662 842 Q 690 818 712 836 Q 740 814 766 840" fill="none" stroke="#8FAE7C" strokeWidth="1.4" strokeDasharray="3 4" opacity=".8" />
                <path d="M 678 846 Q 700 828 722 842 Q 744 826 762 844" fill="none" stroke="#7E9A6B" strokeWidth="1.2" strokeDasharray="3 4" opacity=".7" />
              </g>
              <text x="724" y="828" fontSize="12" fontWeight="900" fill="#3D5A33" textAnchor="middle" style={{ paintOrder: "stroke", stroke: "#F8F1E3", strokeWidth: "3px" }}>정발산</text>

              {/* ===== 주택 블록 (밤가시마을) ===== */}
              <g fill="#F0E3C9" stroke="#E2D0AC" strokeWidth="1" filter="url(#blockShadow)">
                <rect x="330" y="230" width="120" height="200" rx="10" />
                <rect x="330" y="470" width="120" height="180" rx="10" />
                <rect x="410" y="230" width="200" height="200" rx="10" />
                <rect x="410" y="470" width="200" height="180" rx="10" />
                <rect x="672" y="230" width="168" height="200" rx="10" />
                <rect x="672" y="470" width="168" height="180" rx="10" />
                <rect x="800" y="230" width="172" height="200" rx="10" />
                <rect x="800" y="470" width="172" height="180" rx="10" />
                <rect x="930" y="230" width="122" height="200" rx="10" />
                <rect x="930" y="470" width="122" height="180" rx="10" />
                <rect x="330" y="742" width="600" height="88" rx="10" />
                <rect x="960" y="742" width="200" height="88" rx="10" />
              </g>
              {/* 집 지붕 힌트 */}
              <g fill="#E6D6B4" opacity=".85">
                <rect x="425" y="245" width="16" height="12" rx="2" />
                <rect x="452" y="250" width="14" height="11" rx="2" />
                <rect x="690" y="248" width="15" height="12" rx="2" />
                <rect x="948" y="246" width="14" height="11" rx="2" />
                <rect x="430" y="600" width="15" height="12" rx="2" />
                <rect x="820" y="608" width="15" height="12" rx="2" />
                <rect x="700" y="602" width="14" height="11" rx="2" />
                <rect x="990" y="500" width="14" height="11" rx="2" />
                <rect x="345" y="500" width="14" height="11" rx="2" />
                <rect x="900" y="255" width="14" height="11" rx="2" />
              </g>
              <text x="425" y="264" fontSize="14" fontWeight="900" fill="#8A7452">밤가시마을</text>
              <text x="425" y="283" fontSize="11.5" fill="#A08B67" fontWeight="600">단독주택 골목권</text>

              {/* ===== 도로 ===== */}
              {/* 산두로 */}
              <line x1="330" y1="200" x2="1150" y2="200" stroke="#E0CFA9" strokeWidth="30" strokeLinecap="round" />
              <line x1="330" y1="200" x2="1150" y2="200" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" />
              <line x1="350" y1="200" x2="1130" y2="200" stroke="#EDE2C8" strokeWidth="1.6" strokeDasharray="10 14" />
              <text x="346" y="190" fontSize="14" fontWeight="900" fill="#8A7452">산두로</text>

              {/* 마을 안길 (블록 사이) */}
              <line x1="340" y1="450" x2="1042" y2="450" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" opacity=".9" />

              {/* 일산로 */}
              <line x1="310" y1="700" x2="1180" y2="700" stroke="#E0CFA9" strokeWidth="42" strokeLinecap="round" />
              <line x1="310" y1="700" x2="1180" y2="700" stroke="#FFFFFF" strokeWidth="34" strokeLinecap="round" />
              <line x1="335" y1="700" x2="1160" y2="700" stroke="#EDE2C8" strokeWidth="2" strokeDasharray="12 16" />
              <text x="416" y="693" fontSize="15" fontWeight="900" fill="#8A7452">일산로</text>

              {/* 세로 골목 */}
              <g stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round">
                <line x1="380" y1="700" x2="380" y2="200" />
                <line x1="520" y1="700" x2="520" y2="200" />
                <line x1="650" y1="700" x2="650" y2="200" />
                <line x1="910" y1="700" x2="910" y2="200" />
              </g>
              {/* 380번길 보넷길 코어 */}
              <line x1="780" y1="700" x2="780" y2="200" stroke="#F0B24A" strokeWidth="22" strokeLinecap="round" opacity=".55" />
              <line x1="780" y1="700" x2="780" y2="200" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
              <line x1="780" y1="220" x2="780" y2="682" stroke="#F3D9A8" strokeWidth="1.6" strokeDasharray="7 10" />

              {/* 짧은 골목 */}
              <line x1="330" y1="200" x2="330" y2="300" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
              <line x1="860" y1="200" x2="860" y2="300" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />

              {/* 골목 이름 */}
              <g fontSize="12" fill="#A08B67" fontWeight="700">
                <text x="366" y="672" transform="rotate(-90 366 672)" textAnchor="start">일산로316번길</text>
                <text x="526" y="640" transform="rotate(-90 526 640)" textAnchor="start">일산로358번길</text>
                <text x="656" y="640" transform="rotate(-90 656 640)" textAnchor="start">일산로372번길</text>
                <text x="916" y="640" transform="rotate(-90 916 640)" textAnchor="start">일산로394번길</text>
                <text x="352" y="296" transform="rotate(-90 352 296)" textAnchor="start" fontSize="11">대산로11번길</text>
                <text x="843" y="296" transform="rotate(-90 843 296)" textAnchor="start" fontSize="11">산두로213번길</text>
              </g>
              <g transform="rotate(-90 786 610)">
                <text x="786" y="610" fontSize="12.5" fill="#C07A18" fontWeight="900" textAnchor="start">일산로380번길 · 보넷길 코어</text>
              </g>

              {/* 율천로 */}
              <line x1="700" y1="830" x2="1180" y2="830" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
              <text x="712" y="820" fontSize="12" fontWeight="700" fill="#A08B67">율천로 (마두동 방면)</text>

              {/* ===== 국립암센터 ===== */}
              <g filter="url(#softLift)">
                <rect x="1010" y="740" width="168" height="80" rx="9" fill="#FFFFFF" stroke="#BFD2BC" strokeWidth="1.5" />
                <rect x="1024" y="752" width="24" height="24" rx="5" fill="#2F7D5C" />
                <path d="M 1036 756 v 16 M 1028 764 h 16" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
                <text x="1058" y="765" fontSize="13.5" fontWeight="900" fill="#2F7D5C">국립암센터</text>
                <text x="1058" y="781" fontSize="10.5" fill="#6E8A6B" fontWeight="600">National Cancer Center</text>
                <text x="1024" y="806" fontSize="10.5" fill="#9AA88F" fontWeight="600">일산로 323 · 일산로 남측</text>
              </g>

              {/* ===== 지하철 3호선 (하단) ===== */}
              <line x1="185" y1="900" x2="1300" y2="900" stroke="#C6620E" strokeWidth="15" strokeLinecap="round" opacity=".35" />
              <line x1="185" y1="900" x2="1300" y2="900" stroke="#EF7C1C" strokeWidth="11" strokeLinecap="round" />
              {/* 대화 (좌 · 종점) */}
              <g filter="url(#softLift)"><circle cx="245" cy="900" r="10" fill="#FFF" stroke="#EF7C1C" strokeWidth="5" /></g>
              <text x="245" y="936" fontSize="12" fill="#B75C0F" fontWeight="800" textAnchor="middle">대화</text>
              {/* 주엽 */}
              <g filter="url(#softLift)"><circle cx="475" cy="900" r="10" fill="#FFF" stroke="#EF7C1C" strokeWidth="5" /></g>
              <text x="475" y="936" fontSize="12" fill="#B75C0F" fontWeight="800" textAnchor="middle">주엽</text>
              {/* 정발산역 (강조) */}
              <g filter="url(#softLift)"><circle cx="725" cy="900" r="15" fill="#FFF" stroke="#EF7C1C" strokeWidth="6" /><circle cx="725" cy="900" r="4.5" fill="#EF7C1C" /></g>
              <g filter="url(#softLift)"><rect x="668" y="852" width="114" height="28" rx="14" fill="#FFF" stroke="#EF7C1C" strokeWidth="2" /><text x="725" y="872" fontSize="15.5" fontWeight="900" fill="#B75C0F" textAnchor="middle">정발산역</text></g>
              {/* 마두 */}
              <g filter="url(#softLift)"><circle cx="945" cy="900" r="10" fill="#FFF" stroke="#EF7C1C" strokeWidth="5" /></g>
              <text x="945" y="936" fontSize="12" fill="#B75C0F" fontWeight="800" textAnchor="middle">마두</text>
              {/* 백석 */}
              <g filter="url(#softLift)"><circle cx="1125" cy="900" r="10" fill="#FFF" stroke="#EF7C1C" strokeWidth="5" /></g>
              <text x="1125" y="936" fontSize="12" fill="#B75C0F" fontWeight="800" textAnchor="middle">백석</text>
              {/* 대곡 (우 · 환승) */}
              <g filter="url(#softLift)"><circle cx="1300" cy="900" r="15" fill="#FFF" stroke="#EF7C1C" strokeWidth="6" /><circle cx="1300" cy="900" r="4.5" fill="#EF7C1C" /></g>
              <text x="1300" y="936" fontSize="13" fontWeight="900" fill="#B75C0F" textAnchor="middle">대곡</text>
              <text x="245" y="874" fontSize="11" fill="#B75C0F" fontWeight="800" textAnchor="middle">종점</text>
              <text x="245" y="962" fontSize="10.5" fill="#9A7B58" fontWeight="700" textAnchor="middle">고양종합운동장 · 킨텍스</text>
              <g filter="url(#softLift)"><rect x="440" y="855" width="120" height="26" rx="13" fill="#EF7C1C" /><text x="500" y="873" fontSize="13" fontWeight="900" fill="#FFF" textAnchor="middle">지하철 3호선</text></g>

              {/* ===== 대곡역 환승 ===== */}
              <line x1="1300" y1="75" x2="1300" y2="885" stroke="#9AA88F" strokeWidth="3" strokeDasharray="8 8" fill="none" />
              <g filter="url(#softLift)"><rect x="1235" y="452" width="130" height="46" rx="12" fill="#FFF" stroke="#9AA88F" strokeWidth="2" /></g>
              <text x="1300" y="474" fontSize="12.5" fontWeight="900" fill="#5F6B52" textAnchor="middle">대곡역 환승</text>
              <text x="1300" y="490" fontSize="10.5" fontWeight="800" fill="#8A967C" textAnchor="middle">3호선 ↔ 경의중앙선</text>

              {/* 정발산역 → 밤리단길 도보 동선 */}
              <path d="M 725 884 C 725 800, 690 740, 620 708" stroke="#B75C0F" strokeWidth="3.2" strokeDasharray="7 6" fill="none" strokeLinecap="round" />
              <circle cx="620" cy="708" r="4" fill="#B75C0F" />
              <text x="560" y="770" fontSize="12.5" fontWeight="900" fill="#B75C0F">정발산역 도보 약 10~12분</text>

              {/* ===== 경의중앙선 (상단) ===== */}
              <line x1="185" y1="60" x2="1300" y2="60" stroke="#2F7D5C" strokeWidth="15" strokeLinecap="round" opacity=".3" />
              <line x1="185" y1="60" x2="1300" y2="60" stroke="#5BB08D" strokeWidth="11" strokeLinecap="round" />
              <g filter="url(#softLift)">
                <rect x="530" y="20" width="240" height="26" rx="13" fill="#5BB08D" />
                <text x="650" y="38" fontSize="13" fontWeight="900" fill="#FFF" textAnchor="middle">경의중앙선 · 탄현–일산–풍산–백마–대곡</text>
              </g>
              {/* 탄현 */}
              <g filter="url(#softLift)"><circle cx="245" cy="60" r="10" fill="#FFF" stroke="#5BB08D" strokeWidth="5" /></g>
              <text x="245" y="40" fontSize="12.5" fontWeight="800" fill="#3E8E6E" textAnchor="middle">탄현</text>
              {/* 일산 */}
              <g filter="url(#softLift)"><circle cx="505" cy="60" r="10" fill="#FFF" stroke="#5BB08D" strokeWidth="5" /></g>
              <text x="505" y="40" fontSize="12.5" fontWeight="800" fill="#3E8E6E" textAnchor="middle">일산</text>
              {/* 풍산역 (강조) */}
              <g filter="url(#softLift)"><circle cx="795" cy="60" r="15" fill="#FFF" stroke="#5BB08D" strokeWidth="6" /><circle cx="795" cy="60" r="4.5" fill="#5BB08D" /></g>
              <g filter="url(#softLift)"><rect x="747" y="76" width="96" height="28" rx="14" fill="#FFF" stroke="#5BB08D" strokeWidth="2" /><text x="795" y="96" fontSize="15.5" fontWeight="900" fill="#2F7D5C" textAnchor="middle">풍산역</text></g>
              {/* 백마 */}
              <g filter="url(#softLift)"><circle cx="1065" cy="60" r="10" fill="#FFF" stroke="#5BB08D" strokeWidth="5" /></g>
              <text x="1065" y="40" fontSize="12.5" fontWeight="800" fill="#3E8E6E" textAnchor="middle">백마</text>
              {/* 대곡 (우 · 환승) */}
              <g filter="url(#softLift)"><circle cx="1300" cy="60" r="15" fill="#FFF" stroke="#5BB08D" strokeWidth="6" /><circle cx="1300" cy="60" r="4.5" fill="#5BB08D" /></g>
              <text x="1300" y="40" fontSize="13" fontWeight="900" fill="#2F7D5C" textAnchor="middle">대곡</text>
              <text x="1300" y="90" fontSize="12" fill="#3E8E6E" fontWeight="700" textAnchor="end">서울·용산 방면 →</text>

              {/* 풍산역 → 밤리단길 도보 동선 */}
              <path d="M 795 78 C 795 160, 850 260, 940 330" stroke="#2F7D5C" strokeWidth="3.2" strokeDasharray="7 6" fill="none" strokeLinecap="round" />
              <circle cx="940" cy="330" r="4" fill="#2F7D5C" />
              <text x="817" y="150" fontSize="12.5" fontWeight="900" fill="#2F7D5C">풍산역 도보 약 7분</text>

              {/* 밤가시초가 */}
              <g filter="url(#softLift)">
                <circle cx="305" cy="655" r="8.5" fill="#8A6B3D" stroke="#FFF" strokeWidth="2.5" />
              </g>
              <text x="305" y="638" fontSize="12" fontWeight="800" fill="#6E522C" textAnchor="middle">밤가시초가 인근</text>

              {/* 방위 */}
              <g transform="translate(78,84)" filter="url(#softLift)">
                <circle r="27" fill="#FFFDF6" stroke="#D5C296" strokeWidth="1.5" />
                <path d="M 0 -17 L 6.5 9 L 0 3.5 L -6.5 9 Z" fill="#241E16" />
                <text y="-33" fontSize="13" fontWeight="900" fill="#6E5E42" textAnchor="middle">N</text>
              </g>

              {/* 핀 레이어 (React 렌더 · 원본 JS 주입 대체) */}
              <g>
                {SPOTS.map((s, i) => {
                  const key = spotKey(s);
                  const isActive = activeKey === key;
                  const isDimmed = activeKey !== null && !isActive;
                  const pinClass = [
                    styles.pin,
                    isDimmed ? styles.dim : "",
                    isActive ? styles.active : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <g
                      key={key}
                      className={pinClass}
                      transform={`translate(${s.x},${s.y})`}
                      style={{ animationDelay: `${i * 24}ms` }}
                      onMouseEnter={(e) => showTip(s, e)}
                      onMouseMove={(e) => moveTip(e)}
                      onMouseLeave={hideTip}
                      onClick={(e) => {
                        showTip(s, e);
                        highlight(key, true);
                      }}
                    >
                      <ellipse cx="0" cy="1.5" rx="7" ry="2.6" fill="#3A2A10" opacity="0.22" />
                      <circle
                        className={styles.ring}
                        cx="0"
                        cy="-19"
                        r="20"
                        fill="none"
                        stroke={CATS[s.c].color}
                        strokeWidth="2.5"
                        strokeDasharray="4 5"
                      />
                      <g className={styles.drop}>
                        <path d={DROP} fill={CATS[s.c].color} stroke="#FFFFFF" strokeWidth="2.2" />
                        <text x="0" y="-14.6">{s.n}</text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <div className={styles.legend}>
            <span className={styles.lg}><i style={{ background: "var(--eat)" }} />EAT 음식점 10</span>
            <span className={styles.lg}><i style={{ background: "var(--coffee)" }} />COFFEE 커피 7</span>
            <span className={styles.lg}><i style={{ background: "var(--sweet)" }} />SWEET 디저트 5</span>
            <span className={styles.lg}><i style={{ background: "var(--shop)" }} />SHOP 소품·공방 5</span>
            <span className={styles.lg}><i style={{ background: "var(--line3)" }} />3호선</span>
            <span className={styles.lg}><i style={{ background: "var(--gyeongui)" }} />경의중앙선</span>
            <span className={styles.note}>※ 골목 구조 기반 개념 배치도입니다. 정확한 위치·영업시간은 목록의 지도 링크에서 확인하세요.</span>
          </div>
        </div>
      </section>

      {/* ============ ACCESS ============ */}
      <section className={styles.access}>
        <div className={styles["acc-card"]} style={{ borderLeftColor: "var(--line3)" }}>
          <h3>지하철 3호선 · 정발산역</h3>
          <p>정발산 남쪽 기슭의 정발산역에서 하차 후, 북동측 밤가시마을 방향으로 도보 약 10~12분. 서울 도심(종로3가·경복궁) 직결 노선으로 서울발 방문객의 기본 접근축입니다.</p>
        </div>
        <div className={styles["acc-card"]} style={{ borderLeftColor: "var(--gyeongui)" }}>
          <h3>경의중앙선 · 풍산역</h3>
          <p>풍산역에서 서측으로 도보 약 7분 — 밤리단길과 가장 가까운 역입니다. 홍대입구·공덕·용산 방면에서 환승 없이 접근할 수 있습니다.</p>
        </div>
        <div className={styles["acc-card"]} style={{ borderLeftColor: "#9A6292" }}>
          <h3>GTX-A · 광역 연계</h3>
          <p>GTX-A 킨텍스역에서 서울역 방면 급행 이용이 가능해, 킨텍스 MICE 방문객의 행사 전후 미식 코스로 연결하기 좋은 입지입니다.</p>
        </div>
        <div className={styles["acc-card"]} style={{ borderLeftColor: "#4F6B45" }}>
          <h3>연계 산책 코스</h3>
          <p>정발산역 → 정발산 평심루 → 밤가시초가 → 밤리단길 골목 → 풍산역으로 이어지는 도보 코스로 문화유산과 미식을 한 동선에 담을 수 있습니다.</p>
        </div>
      </section>

      {/* ============ LISTS ============ */}
      <section className={styles.lists}>
        <h2>고양의 유니크 맛집 · 카페 · 디저트 27선</h2>
        <p className={styles.lead}>골목에서 세계음식을 골라 먹고, 카페를 옮겨 다니고, 구움과자를 선물로 담아 가는 거리 — 번호는 지도 핀과 동일합니다.</p>
        <div className={styles["cat-grid"]}>
          {(Object.keys(CATS) as CategoryKey[]).map((key) => {
            const cat = CATS[key];
            const items = SPOTS.filter((s) => s.c === key);
            return (
              <div key={key} className={styles["cat-col"]}>
                <div
                  className={styles["cat-head"]}
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}, color-mix(in srgb, ${cat.color} 72%, #241E16))`,
                  }}
                >
                  <div className={styles.en}>{cat.en} · {items.length}곳</div>
                  <h3>{cat.ko}</h3>
                  <p>{cat.desc}</p>
                </div>
                <ul>
                  {items.map((s) => {
                    const k = spotKey(s);
                    const highlighted = activeKey === k;
                    return (
                      <li
                        key={k}
                        className={highlighted ? styles.hl : ""}
                        onMouseEnter={() => highlight(k, false)}
                        onMouseLeave={clearHighlight}
                        onClick={(ev) => {
                          if ((ev.target as HTMLElement).tagName === "A") return;
                          highlight(k, true);
                          svgRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                      >
                        <span className={styles.num} style={{ background: cat.color }}>{s.n}</span>
                        <span className={styles["li-body"]}>
                          <span className={styles["li-name"]}>
                            {s.name}
                            <span className={styles.type}>{s.type}</span>
                          </span>
                          <span className={styles["li-desc"]}>{s.desc}</span>
                          <span className={styles["li-meta"]}>
                            {s.rate != null && (
                              <>
                                <b>★ {s.rate.toFixed(1)}</b>
                                {s.rev != null && ` (${s.rev})`}
                                {" · "}
                              </>
                            )}
                            {s.price && s.price !== "-" && (
                              <>
                                {s.price}
                                {" · "}
                              </>
                            )}
                            <a href={mapUrl(s)} target="_blank" rel="noopener noreferrer">지도</a>
                            {" · "}
                            {s.hours}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ CREDIT FOOTER (원본 footer) ============ */}
      <div className={styles["credit-footer"]}>
        <b>밤리단길(밤리단보넷길)</b> · 경기도 고양시 일산동구 정발산동 일대 &nbsp;|&nbsp; 자료 기준: 밤리단길 카테고리 DB(2026.09.06) · 고양시 문화관광 안내 참조<br />
        본 지도는 골목 축(일산로 번길·산두로) 기반의 개념 배치도로, 실제 축척·좌표와 다를 수 있습니다. 영업시간·가격은 방문 전 각 매장 정보를 재확인하세요.
      </div>
    </div>
  );
}
