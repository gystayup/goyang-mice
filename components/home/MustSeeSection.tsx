// components/home/MustSeeSection.tsx — 오더 #C14b Must-see 4카드 · #C19 사진 폴백.
//
// 사장님 확정 4곳:
//   1) seooreung           — history · UNESCO 스탬프 · gallery 6장
//   2) ilsan-lake-park     — walk · (스탬프 없음, 앵커성 강) · 사장님 수동 사진 3장
//   3) kintex              — culture · GTX 스탬프 · 사진 없음 → hero-culture.jpg 폴백
//   4) starfield-goyang    — shopping · (스탬프 없음) · 사진 없음 → hero-shopping.jpg 폴백
//
// 오더 #C74 추가: 5번째 카드 = 밤리단길 (커스텀 · /bamridan 링크).
//   5개가 되어 자동회전 캐러셀로 전환. 카드 데이터는 서버에서 조립하고
//   client 캐러셀 (MustSeeCarousel) 에 props 전달.
//
// 데이터 · 폴백 순서 (오더 #C19):
//   1. spot.gallery 중 Type3 제외한 첫 장 (있으면 사용 · seooreung/ilsan-lake-park)
//   2. `hero-{spot.category}.jpg` (9카테고리 전량 존재 · 항상 fall back 가능)
//   3. (파일 미존재는 신규 이미지 생성·다운로드 0 규범 준수 · Next Image 가
//       404 로그 남기지만 배경 회색으로 노출 · 사장님 승인)
//
// 스탬프: StampBadge · slug 기반 자동 매핑 (카드당 최대 1개, 밤리단길은 없음)
//
// 규범:
//   · 판매·예약·"예약" 표현 0. 스팟 Link 는 /dmc/{slug}, 밤리단길은 /bamridan.
//   · 5로케일 ko 폴백.
//   · 유사 이미지 연결 금지 (같은 스팟의 gallery + 같은 category 의 hero 만 사용).

import fs from "node:fs";
import path from "node:path";

import { MUST_SEE, pickHomeLocale } from "@/data/home-copy";
import { loadSpot } from "@/lib/spot-catalog-db";
import type { Spot } from "@/data/spots";

import MustSeeCarousel, { type MustSeeCard } from "./MustSeeCarousel";

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

// 오더 #C54-B: 서버 컴포넌트 async 전환. loadSpot() 은 published !== false 필터 포함.
export default async function MustSeeSection({ locale }: { locale: string }) {
  const active = pickHomeLocale(locale);
  const spots = await Promise.all(MUST_SEE_SLUGS.map((slug) => loadSpot(slug)));

  const spotCards: MustSeeCard[] = MUST_SEE_SLUGS.flatMap((slug, i) => {
    const spot = spots[i];
    if (!spot) return [];
    const name = spot.title[active] ?? spot.title.ko;
    const sub = spot.subtitle?.[active] ?? spot.subtitle?.ko ?? "";
    return [
      {
        key: slug,
        href: `/dmc/${slug}`,
        imageSrc: resolveMustSeeImage(spot),
        category: spot.category,
        name,
        subtitle: sub,
        ariaLabel: `${name} — ${sub}`,
      },
    ];
  });

  // 오더 #C74 [1]-A: 밤리단길 커스텀 카드 (스팟 아닌 전용 페이지 /bamridan).
  //   이미지: public/images/cards/card-bamridan.jpg 없음 · bamgasi-thatched-house
  //   spot.gallery 없음 → hero-food.jpg 폴백 (밤리단길 = 미식·카페 골목).
  //   스탬프 없음 (stampForSlug("bamridan") → undefined).
  const bamridanCard: MustSeeCard = {
    key: "bamridan",
    href: "/bamridan",
    imageSrc: "/images/hero/hero-food.jpg",
    category: "HOT PLACE",
    name: "밤리단길",
    subtitle: "일산 정발산 골목의 로컬 핫플레이스",
    ariaLabel: "밤리단길 — 일산 정발산 골목의 로컬 핫플레이스",
  };

  const cards: MustSeeCard[] = [...spotCards, bamridanCard];

  return (
    <MustSeeCarousel
      cards={cards}
      eyebrow={MUST_SEE.eyebrow}
      headline={MUST_SEE.headline[active]}
      locale={active}
    />
  );
}
