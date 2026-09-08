// components/day-trips/HeroGallery.tsx — 오더 #D19 [2] 당일코스 상세 히어로 갤러리.
//
// 데스크톱(md+): 좌 2/3 대형 1장 + 우 1/3 세로 N칸 (최대 3칸). gap 8px.
//   · 5장 이상 → 우측 마지막 칸에 "+N" 오버레이
//   · 3장 → 좌 대형 + 우 2칸
//   · 2장 → 좌 대형 + 우 1칸
//   · 1장 → 전체 폭
//   · 0장 → 축 색면 그라디언트 (안전 폴백)
//   · 전체 높이 440px(lg) / 260px(md)
//
// 모바일(md 미만): 대형 1장(260px) + 아래 가로 스크롤 썸네일.
//
// 임의 이미지 생성·수집 없음. 데이터가 없는 코스는 색면 폴백 유지.

import Image from "next/image";

type Props = {
  images: string[];
  axisColor: string;
  alt: string;
};

export default function HeroGallery({ images, axisColor, alt }: Props) {
  const list = images.filter(Boolean);

  // 0장 → 축 색면 폴백
  if (list.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="h-[260px] w-full overflow-hidden rounded-2xl lg:h-[440px]"
        style={{
          background: `linear-gradient(135deg, ${axisColor} 0%, ${axisColor}CC 100%)`,
        }}
      />
    );
  }

  const main = list[0];
  const rest = list.slice(1, 4);
  const overflow = Math.max(0, list.length - 4);
  const mobileThumbs = list.slice(1);

  return (
    <>
      {/* ─── 데스크톱 ─── */}
      <div className="hidden h-[260px] gap-2 md:grid md:grid-cols-3 lg:h-[440px]">
        {/* 좌 대형 */}
        <div
          className={
            "relative overflow-hidden rounded-2xl bg-slate-100 " +
            (rest.length > 0 ? "col-span-2" : "col-span-3")
          }
        >
          <Image
            src={main}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 66vw, 800px"
            className="object-cover object-center"
            priority
          />
        </div>
        {/* 우 세로 (rest.length 만큼) */}
        {rest.length > 0 ? (
          <div
            className={
              "grid gap-2 " +
              (rest.length === 3
                ? "grid-rows-3"
                : rest.length === 2
                  ? "grid-rows-2"
                  : "grid-rows-1")
            }
          >
            {rest.map((src, i) => {
              const isLast = i === rest.length - 1;
              const showOverflow = isLast && overflow > 0;
              return (
                <div
                  key={`${src}-${i}`}
                  className="relative overflow-hidden rounded-2xl bg-slate-100"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 33vw, 400px"
                    className="object-cover object-center"
                  />
                  {showOverflow ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-black text-white">
                      +{overflow}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* ─── 모바일 ─── */}
      <div className="md:hidden">
        <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={main}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
        {mobileThumbs.length > 0 ? (
          <div
            className="mt-2 -mx-[18px] flex gap-2 overflow-x-auto px-[18px] pb-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {mobileThumbs.map((src, i) => {
              const isLast = i === mobileThumbs.length - 1;
              const showOverflow = isLast && overflow > 0;
              return (
                <div
                  key={`${src}-${i}`}
                  className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover object-center"
                  />
                  {showOverflow ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-black text-white">
                      +{overflow}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
}
