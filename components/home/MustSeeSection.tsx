// components/home/MustSeeSection.tsx — 오더 #C14b Must-see 4카드 · #C19 사진 폴백.
//
// 사장님 확정 4곳:
//   1) seooreung           — history · UNESCO 스탬프 · gallery 6장
//   2) ilsan-lake-park     — walk · (스탬프 없음, 앵커성 강) · 사장님 수동 사진 3장
//   3) kintex              — culture · GTX 스탬프 · 사진 없음 → hero-culture.jpg 폴백
//   4) starfield-goyang    — shopping · (스탬프 없음) · 사진 없음 → hero-shopping.jpg 폴백
//
// 데이터 · 폴백 순서 (오더 #C19):
//   1. spot.gallery 중 Type3 제외한 첫 장 (있으면 사용 · seooreung/ilsan-lake-park)
//   2. `hero-{spot.category}.jpg` (9카테고리 전량 존재 · 항상 fall back 가능)
//   3. (파일 미존재는 신규 이미지 생성·다운로드 0 규범 준수 · Next Image 가
//       404 로그 남기지만 배경 회색으로 노출 · 사장님 승인)
//
// 스탬프: StampBadge · slug 기반 자동 매핑 (카드당 최대 1개)
//
// 규범:
//   · 판매·예약·"예약" 표현 0. Link 는 /dmc/{slug}.
//   · 5로케일 ko 폴백.
//   · 유사 이미지 연결 금지 (같은 스팟의 gallery + 같은 category 의 hero 만 사용).

import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import { StampBadge, stampForSlug } from "@/components/badges/StampBadge";
import { MUST_SEE, pickHomeLocale } from "@/data/home-copy";
import { getSpot, type Spot } from "@/data/spots";
import { Link } from "@/lib/navigation";

const MUST_SEE_SLUGS = [
  "seooreung",
  "ilsan-lake-park",
  "kintex",
  "starfield-goyang",
] as const;

/**
 * 오더 #C19 · #C22 폴백 로직:
 *   1) public/images/cards/card-{slug}.jpg — 파일 존재 시 (서버 fs.existsSync 확인)
 *   2) spot.gallery 중 Type3 제외 첫 장
 *   3) hero-{spot.category}.jpg
 * 신규 이미지 생성·다운로드 없음. 같은 스팟·같은 카테고리 자원만 사용.
 * server component 전용 (홈은 SSR).
 */
function cardFileExists(slug: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", "cards", `card-${slug}.jpg`));
  } catch {
    return false;
  }
}

function resolveMustSeeImage(spot: Spot): string {
  if (cardFileExists(spot.slug)) return `/images/cards/card-${spot.slug}.jpg`;
  const gal = spot.gallery?.find((g) => g.cpyrht !== "Type3");
  if (gal?.url) return gal.url;
  return `/images/hero/hero-${spot.category}.jpg`;
}

export default function MustSeeSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--gold,#D4AF37)]">
          {MUST_SEE.eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#232322] sm:text-3xl lg:text-4xl">
          {MUST_SEE.headline[active]}
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MUST_SEE_SLUGS.map((slug) => {
            const spot = getSpot(slug);
            if (!spot) return null;
            const name = spot.title[active] ?? spot.title.ko;
            const sub = spot.subtitle?.[active] ?? spot.subtitle?.ko ?? "";
            const stamp = stampForSlug(slug);
            const category = spot.category;
            const imageSrc = resolveMustSeeImage(spot);
            return (
              <li key={slug}>
                <Link
                  href={`/dmc/${slug}`}
                  aria-label={`${name} — ${sub}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold,#D4AF37)]"
                >
                  <article className="grid aspect-[4/5] grid-rows-[13fr_7fr] overflow-hidden rounded-[20px] bg-white ring-1 ring-slate-200/70 transition-shadow group-hover:shadow-md">
                    <div className="relative overflow-hidden bg-slate-100">
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      {/* 스탬프: 우상단 · 카드당 최대 1개 */}
                      {stamp && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-3"
                        >
                          <StampBadge kind={stamp} locale={active} size={64} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between gap-2 p-5">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold,#D4AF37)]">
                          {category}
                        </div>
                        <h3 className="mt-1.5 text-base font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-lg">
                          {name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-600">
                          {sub}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
