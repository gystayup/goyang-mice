// components/day-trips/CourseSidebar.tsx — 오더 #D09 [1]-B, [2].
//
// 상세 페이지 우측 sticky 사이드바:
//   · 코럴레드 1px 테두리 박스에 ✓ 3줄 (whyGood 재사용)
//   · "광고" 라벨 (우측 정렬, 11px 회색)
//   · nearby 3칸 (사진+상호+한줄+거리, 코럴 핀 아이콘)
//     · 없거나 빈 배열이면 "광고 문의" 안내 칸만 표시
//   · 광고 문의 아웃라인 버튼 → /contact

import { MapPin } from "lucide-react";

import { Link } from "@/lib/navigation";
import type { DayTripCourseNearby } from "@/data/day-trip-courses";

type Locale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const WHY_LABEL: Record<Locale, string> = {
  ko: "이 코스가 좋은 이유",
  en: "Why this course",
  ja: "このコースがおすすめの理由",
  "zh-CN": "为什么选这条路线",
  "zh-TW": "為什麼選這條路線",
};
const AD_LABEL: Record<Locale, string> = {
  ko: "광고",
  en: "Sponsored",
  ja: "広告",
  "zh-CN": "广告",
  "zh-TW": "廣告",
};
const AD_PLACEHOLDER: Record<Locale, string> = {
  ko: "이 자리에 가게를 올릴 수 있습니다",
  en: "Feature your store here",
  ja: "ここにお店を掲載できます",
  "zh-CN": "此位置可展示您的店铺",
  "zh-TW": "此位置可展示您的店鋪",
};
const AD_INQUIRY: Record<Locale, string> = {
  ko: "광고 문의",
  en: "Advertise with us",
  ja: "広告のお問い合わせ",
  "zh-CN": "广告咨询",
  "zh-TW": "廣告諮詢",
};

export default function CourseSidebar({
  locale,
  whyGood,
  nearby,
}: {
  locale: Locale;
  whyGood?: string[];
  nearby?: DayTripCourseNearby[];
}) {
  const list = (whyGood ?? []).slice(0, 3);
  const items = nearby ?? [];

  return (
    <aside className="lg:sticky lg:top-[132px]">
      {/* 코럴 1px 테두리 ✓ 박스 */}
      {list.length > 0 && (
        <div className="rounded-md border border-[var(--accent)] bg-white p-5">
          <h3 className="text-[13px] font-black tracking-[0.02em] text-[#232322]">
            {WHY_LABEL[locale]}
          </h3>
          <ul className="mt-3 space-y-2.5">
            {list.map((line, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-[1.6] text-[#232322]">
                <CheckLine />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 광고 라벨 */}
      <div className="mt-6 text-right text-[11px] text-slate-400">
        {AD_LABEL[locale]}
      </div>

      {/* 광고 블록 */}
      <div className="mt-1 space-y-2">
        {items.slice(0, 3).map((item, i) => (
          <AdCard key={`${item.name}-${i}`} item={item} />
        ))}

        {/* 광고 문의 · nearby 없을 때만 안내 문구, 있어도 항상 하단에 문의 버튼 */}
        <div className="rounded-md border border-dashed border-slate-300 bg-[#fafafa] p-4">
          {items.length === 0 && (
            <p className="mb-3 text-[12px] leading-[1.55] text-slate-600">
              {AD_PLACEHOLDER[locale]}
            </p>
          )}
          <Link
            href="/contact"
            locale={locale}
            className="inline-flex items-center gap-1 rounded-md border border-[#232322] px-3 py-1.5 text-[12px] font-bold text-[#232322] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {AD_INQUIRY[locale]}
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AdCard({ item }: { item: DayTripCourseNearby }) {
  return (
    <div className="flex gap-3 rounded-md border border-slate-200 bg-white p-3">
      <div className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded bg-slate-100">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-bold text-[#232322]">{item.name}</div>
        <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-[1.45] text-slate-600">
          {item.desc}
        </p>
        <div className="mt-1 flex items-center gap-1 text-[11.5px] font-semibold text-[var(--accent)]">
          <MapPin className="h-3 w-3" strokeWidth={1.2} />
          {item.distance}
        </div>
      </div>
    </div>
  );
}

function CheckLine() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[3px] h-[13px] w-[13px] shrink-0 text-[var(--accent)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
