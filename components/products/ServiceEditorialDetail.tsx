// components/products/ServiceEditorialDetail.tsx
// 오더 #P1 [1][2]: /products/[id]/detail 서비스 상세 — 소개형(Editorial) 전용.
//   판매 요소(가격·옵션·취소환불·couponGuide·예약/결제 버튼) 렌더 없음.
//   기존 ServiceCatalogItem 필드에서 소개 관련 값만 골라 렌더.
//   값 없는 필드는 아예 렌더하지 않는다 (빈 자리·깨짐 금지).

import Image from "next/image";
import { ChevronLeft, ExternalLink, MapPinned, Phone } from "lucide-react";

import type { ServiceCatalogItem } from "@/data/service-catalog";
import { Link } from "@/lib/navigation";

type Locale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

const BACK_LABEL: Record<Locale, string> = {
  ko: "서비스 안내로 돌아가기",
  en: "Back to services",
  ja: "サービス案内へ戻る",
  "zh-CN": "返回服务指南",
  "zh-TW": "返回服務指南",
};

const HOMEPAGE_LABEL: Record<Locale, string> = {
  ko: "공식 홈페이지",
  en: "Official website",
  ja: "公式ホームページ",
  "zh-CN": "官方网站",
  "zh-TW": "官方網站",
};

const PHONE_LABEL: Record<Locale, string> = {
  ko: "전화",
  en: "Phone",
  ja: "電話",
  "zh-CN": "电话",
  "zh-TW": "電話",
};

export default function ServiceEditorialDetail({
  item,
  categoryLabel,
  backUrl = "/products",
  locale = "ko",
}: {
  item: ServiceCatalogItem;
  categoryLabel: string;
  backUrl?: string;
  locale?: Locale;
}) {
  const hasImage = typeof item.imageUrl === "string" && item.imageUrl.length > 0;
  const hasHomepage = typeof item.homepageUrl === "string" && item.homepageUrl.length > 0;
  const hasPhone = typeof item.phone === "string" && item.phone.length > 0;
  const hasSubtitle = typeof item.subtitle === "string" && item.subtitle.length > 0;
  const hasSummary = typeof item.summary === "string" && item.summary.length > 0;
  const hasDescription = typeof item.description === "string" && item.description.length > 0;
  const hasLocation = typeof item.location === "string" && item.location.length > 0;
  const hasTags = Array.isArray(item.tags) && item.tags.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href={backUrl}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {BACK_LABEL[locale]}
      </Link>

      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-700">
          {categoryLabel}
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {item.title}
        </h1>
        {hasSubtitle && (
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            {item.subtitle}
          </p>
        )}
      </div>

      {/* 대표 사진 — imageUrl 있으면 사진, 없으면 imageTone gradient 폴백. */}
      <figure className="mt-6 overflow-hidden rounded-[24px] border border-slate-100">
        {hasImage ? (
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src={item.imageUrl!}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
          </div>
        ) : (
          <div
            className={`relative flex aspect-[16/9] w-full items-end bg-gradient-to-br ${item.imageTone} p-6`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-700">
                {item.posterLabel}
              </p>
              <p className="mt-1 text-xl font-black leading-tight text-slate-900">
                {item.title}
              </p>
            </div>
          </div>
        )}
      </figure>

      {(hasSummary || hasDescription) && (
        <div className="mt-6 space-y-4">
          {hasSummary && (
            <p className="text-base font-semibold leading-relaxed text-slate-900">
              {item.summary}
            </p>
          )}
          {hasDescription && (
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {item.description}
            </p>
          )}
        </div>
      )}

      {(hasLocation || hasTags) && (
        <div className="mt-6 space-y-3">
          {hasLocation && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPinned className="h-4 w-4 shrink-0 text-slate-400" />
              <span>{item.location}</span>
            </div>
          )}
          {hasTags && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {(hasHomepage || hasPhone) && (
        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          {hasHomepage && (
            <a
              href={item.homepageUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {HOMEPAGE_LABEL[locale]}
            </a>
          )}
          {hasPhone && (
            <a
              href={`tel:${item.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:bg-slate-50"
            >
              <Phone className="h-3.5 w-3.5" />
              {PHONE_LABEL[locale]}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
