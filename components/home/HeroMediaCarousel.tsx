"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

type HeroSlide = {
  id: string;
  type: "youtube" | "image";
  koLabel: string;
  koTitle: string;
  koDesc: string;
  enLabel: string;
  enTitle: string;
  enDesc: string;
  youtubeId?: string;
  background?: string;
  imageUrl?: string;
  videoUrl?: string;
};

// 기본 슬라이드 (DB 미응답 시 fallback)
const fallbackSlides: HeroSlide[] = [
  {
    id: "intro-video",
    type: "youtube",
    koLabel: "고양 소개 영상",
    koTitle: "도시의 분위기와 K-컬처 장면을 담은 대표 영상",
    koDesc: "공연, 전시, 체류, 라이프스타일 장면이 자연스럽게 이어지는 대표 미디어입니다.",
    enLabel: "Goyang city film",
    enTitle: "A featured video that introduces the city and its K-culture atmosphere",
    enDesc: "A lead visual that connects performance, exhibition, stay and lifestyle scenes.",
    youtubeId: "Hsg5JTPITFw",
  },
  {
    id: "kintex",
    type: "image",
    koLabel: "KINTEX 거점",
    koTitle: "공연과 전시, 비즈니스 방문이 이어지는 주요 장면",
    koDesc: "행사 관람, 현장 운영, 지역 체류가 하나의 흐름으로 이어지는 메인 비주얼입니다.",
    enLabel: "KINTEX hub",
    enTitle: "A key visual for performances, exhibitions and business visits",
    enDesc: "A main scene where events, operations and local stays connect in one flow.",
    background: "linear-gradient(135deg, #213b83 0%, #5679e8 48%, #9edff6 100%)",
  },
  {
    id: "local-stay",
    type: "image",
    koLabel: "로컬 체류",
    koTitle: "가족 체험과 로컬 체류가 자연스럽게 이어지는 분위기",
    koDesc: "관광, 미식, 쇼핑, 숙박을 함께 보여주는 라이프스타일 장면입니다.",
    enLabel: "Local stay",
    enTitle: "A softer scene where family experiences and longer stays naturally connect",
    enDesc: "A lifestyle-oriented visual combining tourism, dining, shopping and local visits.",
    background: "linear-gradient(135deg, #ffe38f 0%, #ffb39b 40%, #c39af9 100%)",
  },
  {
    id: "night-program",
    type: "image",
    koLabel: "야간 프로그램",
    koTitle: "야간 공연과 현장 운영의 에너지를 담은 비주얼",
    koDesc: "캠페인 배너와 시즌형 대표 장면으로 교체해 사용할 수 있는 이미지 영역입니다.",
    enLabel: "Night program",
    enTitle: "A visual that captures night events and on-site energy",
    enDesc: "A campaign-ready scene that can be replaced with seasonal brand media.",
    background: "linear-gradient(135deg, #122548 0%, #3557b0 42%, #ff8d8b 84%, #ffd280 100%)",
  },
  {
    id: "dmc-service",
    type: "image",
    koLabel: "DMC 서비스",
    koTitle: "고양의 문화·관광·MICE를 하나로 잇는 운영 플랫폼",
    koDesc: "연구, 기획, 예약, 현장 운영까지 고양의 모든 방문 경험을 연결합니다.",
    enLabel: "DMC Services",
    enTitle: "An operations platform connecting culture, tourism and MICE in Goyang",
    enDesc: "Connecting every visitor experience in Goyang — from research and booking to on-site operations.",
    background: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  },
];

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function SlideFrame({ slide, active }: { slide: HeroSlide; active: boolean }) {
  if (slide.type === "youtube" && slide.youtubeId) {
    const src = `https://www.youtube.com/embed/${slide.youtubeId}?autoplay=${
      active ? "1" : "0"
    }&mute=1&controls=0&loop=1&playlist=${slide.youtubeId}&playsinline=1&rel=0&modestbranding=1`;
    return (
      <iframe
        src={src}
        title={slide.koTitle}
        className="h-full w-full scale-[1.08]"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // 업로드된 영상 파일
  if (slide.videoUrl && isVideoUrl(slide.videoUrl)) {
    return (
      <video
        src={slide.videoUrl}
        className="h-full w-full object-cover"
        autoPlay={active}
        muted
        loop
        playsInline
      />
    );
  }

  // 업로드된 이미지 파일
  if (slide.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={slide.imageUrl}
        alt={slide.koTitle}
        className="h-full w-full object-cover"
      />
    );
  }

  // 그라디언트 배경 (기본 fallback)
  return (
    <div className="h-full w-full" style={{ background: slide.background }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,_rgba(255,255,255,0.18),_transparent_18%),radial-gradient(circle_at_80%_16%,_rgba(255,255,255,0.2),_transparent_20%)]" />
    </div>
  );
}

export default function HeroMediaCarousel() {
  const locale = useLocale();
  const isEn = locale === "en";

  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [index, setIndex] = useState(0);

  // DB에서 슬라이드 데이터 로드
  useEffect(() => {
    fetch("/api/admin/hero-slides")
      .then((r) => r.json())
      .then((json: { success: boolean; data: HeroSlide[] }) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSlides(json.data);
        }
      })
      .catch(() => {
        // fallback 유지
      });
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((c) => (c + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const prev = () => setIndex((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setIndex((c) => (c + 1) % slides.length);

  const current = slides[index];
  // ko → 한국어, 그 외(en/ja/zh-CN/zh-TW) → 영어
  const isKo = locale === "ko";
  const label = isKo ? current.koLabel : current.enLabel;
  const title = isKo ? current.koTitle : current.enTitle;
  const desc = isKo ? current.koDesc : current.enDesc;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[#10203a] text-white shadow-[0_22px_60px_rgba(16,32,58,0.16)] sm:rounded-[34px]">
      {/* 배경 미디어 */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <SlideFrame slide={slide} active={i === index} />
          </div>
        ))}
        {/* 하단 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(16,32,58,0.08)_0%,_rgba(16,32,58,0.18)_40%,_rgba(16,32,58,0.72)_100%)]" />
      </div>

      {/* 콘텐츠 오버레이 */}
      <div className="relative flex min-h-[22rem] flex-col justify-end p-5 sm:min-h-[30rem] sm:p-7 lg:min-h-[38rem] lg:p-10">
        {/* 슬라이드 텍스트 */}
        <div className="max-w-2xl">
          <div className="mb-3 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
            {label}
          </div>
          <h2 className="text-xl font-black leading-tight tracking-tight text-white [text-wrap:balance] sm:text-2xl lg:text-4xl lg:leading-[1.1]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/80 sm:text-base">{desc}</p>
        </div>

        {/* 하단 컨트롤: 도트 + 화살표 */}
        <div className="mt-6 flex items-center justify-between">
          {/* 도트 인디케이터 */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`슬라이드 ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === index
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* 화살표 버튼 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="이전 슬라이드"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="다음 슬라이드"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
