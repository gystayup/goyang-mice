"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Image as ImageIcon,
} from "lucide-react";
import { useLocale } from "next-intl";

import { Link } from "@/lib/navigation";

type Slide = {
  id: string;
  type: "youtube" | "image";
  label: string;
  title: string;
  desc: string;
  youtubeId?: string;
  background?: string;
};

type LocaleSlides = Record<"ko" | "en", Slide[]>;

const slides: LocaleSlides = {
  ko: [
    {
      id: "intro-video",
      type: "youtube",
      label: "고양 소개 영상",
      title: "도시의 분위기와 K-컬처 장면을 담은 대표 영상",
      desc: "공연, 전시, 체류, 라이프스타일 장면이 자연스럽게 이어지는 대표 미디어입니다.",
      youtubeId: "Hsg5JTPITFw",
    },
    {
      id: "kintex",
      type: "image",
      label: "KINTEX 거점",
      title: "공연과 전시, 비즈니스 방문이 이어지는 주요 장면",
      desc: "행사 관람, 현장 운영, 지역 체류가 하나의 흐름으로 이어지는 메인 비주얼입니다.",
      background: "linear-gradient(135deg, #213b83 0%, #5679e8 48%, #9edff6 100%)",
    },
    {
      id: "local-stay",
      type: "image",
      label: "로컬 체류",
      title: "가족 체험과 로컬 체류가 자연스럽게 이어지는 분위기",
      desc: "관광, 미식, 쇼핑, 숙박을 함께 보여주는 라이프스타일 장면입니다.",
      background: "linear-gradient(135deg, #ffe38f 0%, #ffb39b 40%, #c39af9 100%)",
    },
    {
      id: "night-program",
      type: "image",
      label: "야간 프로그램",
      title: "야간 공연과 현장 운영의 에너지를 담은 비주얼",
      desc: "캠페인 배너와 시즌형 대표 장면으로 교체해 사용할 수 있는 이미지 영역입니다.",
      background: "linear-gradient(135deg, #122548 0%, #3557b0 42%, #ff8d8b 84%, #ffd280 100%)",
    },
  ],
  en: [
    {
      id: "intro-video",
      type: "youtube",
      label: "Goyang city film",
      title: "A featured video that introduces the city and its K-culture atmosphere",
      desc: "A lead visual that connects performance, exhibition, stay and lifestyle scenes.",
      youtubeId: "Hsg5JTPITFw",
    },
    {
      id: "kintex",
      type: "image",
      label: "KINTEX hub",
      title: "A key visual for performances, exhibitions and business visits",
      desc: "A main scene where events, operations and local stays connect in one flow.",
      background: "linear-gradient(135deg, #213b83 0%, #5679e8 48%, #9edff6 100%)",
    },
    {
      id: "local-stay",
      type: "image",
      label: "Local stay",
      title: "A softer scene where family experiences and longer stays naturally connect",
      desc: "A lifestyle-oriented visual combining tourism, dining, shopping and local visits.",
      background: "linear-gradient(135deg, #ffe38f 0%, #ffb39b 40%, #c39af9 100%)",
    },
    {
      id: "night-program",
      type: "image",
      label: "Night program",
      title: "A visual that captures night events and on-site energy",
      desc: "A campaign-ready scene that can be replaced with seasonal brand media.",
      background: "linear-gradient(135deg, #122548 0%, #3557b0 42%, #ff8d8b 84%, #ffd280 100%)",
    },
  ],
};

const copyMap = {
  ko: {
    badge: "메인 비주얼",
    view: "서비스 보기",
    contact: "문의하기",
    previous: "이전 슬라이드",
    next: "다음 슬라이드",
    mediaLabel: "대표 영상 및 메인 비주얼",
    mediaDesc: "대표 영상, 시즌 캠페인 배너, 메인 이미지가 교체 가능한 상단 미디어 영역입니다.",
  },
  en: {
    badge: "Main visual",
    view: "View services",
    contact: "Contact",
    previous: "Previous slide",
    next: "Next slide",
    mediaLabel: "Featured media area",
    mediaDesc: "This top media area can switch between a flagship video, campaign banner and hero image.",
  },
} as const;

function SlideFrame({ slide, active }: { slide: Slide; active: boolean }) {
  if (slide.type === "youtube" && slide.youtubeId) {
    const src = `https://www.youtube.com/embed/${slide.youtubeId}?autoplay=${
      active ? "1" : "0"
    }&mute=1&controls=0&loop=1&playlist=${slide.youtubeId}&playsinline=1&rel=0&modestbranding=1`;

    return (
      <iframe
        src={src}
        title={slide.title}
        className="h-full w-full scale-[1.08]"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div className="relative h-full w-full" style={{ background: slide.background }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,_rgba(255,255,255,0.18),_transparent_18%),radial-gradient(circle_at_80%_16%,_rgba(255,255,255,0.2),_transparent_20%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(16,32,58,0.24))]" />
      <div className="absolute left-[8%] top-[16%] h-24 w-24 rounded-full bg-white/15 blur-sm sm:h-28 sm:w-28" />
      <div className="absolute right-[12%] top-[16%] h-28 w-28 rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-md sm:h-36 sm:w-36" />
      <div className="absolute bottom-[12%] left-[18%] h-20 w-36 rounded-[1.8rem] border border-white/20 bg-white/10 backdrop-blur-md sm:h-24 sm:w-44" />
    </div>
  );
}

export default function HeroMediaCarousel() {
  const locale = useLocale();
  const activeLocale = locale === "en" ? "en" : "ko";
  const slideItems = slides[activeLocale];
  const copy = copyMap[activeLocale];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideItems.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [slideItems.length]);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[#10203a] text-white shadow-[0_22px_60px_rgba(16,32,58,0.16)] sm:rounded-[34px]">
      <div className="absolute inset-0">
        {slideItems.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <SlideFrame slide={slide} active={slideIndex === index} />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(16,32,58,0.12)_0%,_rgba(16,32,58,0.22)_36%,_rgba(16,32,58,0.52)_100%)]" />
      </div>

      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
        <div className="flex min-h-[24rem] flex-col justify-between sm:min-h-[28rem] lg:min-h-[34rem]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
              <CirclePlay className="h-4 w-4" />
              {copy.badge}
            </div>
            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              {slideItems[index].label}
            </div>
            <h2 className="mt-3 max-w-3xl text-[1.6rem] font-black leading-[1.15] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-[2rem] lg:text-[2.7rem] lg:leading-[1.1]">
              {slideItems[index].title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
              {slideItems[index].desc}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {copy.view}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/16"
            >
              {copy.contact}
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={copy.previous}
                onClick={() =>
                  setIndex((current) => (current - 1 + slideItems.length) % slideItems.length)
                }
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/16"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label={copy.next}
                onClick={() => setIndex((current) => (current + 1) % slideItems.length)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/16"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-[18rem] flex-col justify-end rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl sm:min-h-[20rem] sm:rounded-[28px] sm:p-6 lg:min-h-[34rem]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
            <ImageIcon className="h-4 w-4" />
            {copy.mediaLabel}
          </div>
          <p className="mt-3 text-sm leading-7 text-white/80 sm:text-[15px] sm:leading-8">
            {copy.mediaDesc}
          </p>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {slideItems.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  slideIndex === index
                    ? "border-white bg-white text-slate-950"
                    : "border-white/15 bg-white/8 text-white/82 hover:bg-white/14"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
