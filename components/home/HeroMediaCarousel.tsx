"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
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

// 기본 슬라이드 (실제 업로드된 이미지 사용 — DB 미응답/느린 네트워크 대응)
const fallbackSlides: HeroSlide[] = [
  {
    id: "ilsan-lake-park",
    type: "image",
    koLabel: "Ilsan Lake Park",
    koTitle: "일산호수공원의 아름다움",
    koDesc: "고양의 대표 휴식 공간에서 펼쳐지는 여유로운 일상.",
    enLabel: "Ilsan Lake Park",
    enTitle: "The beauty of Ilsan Lake Park",
    enDesc: "Leisurely daily life in Goyang's signature park.",
    imageUrl: "/uploads/admin/hero-slides/1776336108132-xpdsox5vpgs.jpg",
    background: "linear-gradient(135deg, #213b83 0%, #5679e8 48%, #9edff6 100%)",
  },
  {
    id: "lafesta",
    type: "image",
    koLabel: "라페스타",
    koTitle: "공연과 쇼핑, 먹거리, 젊은이의 거리",
    koDesc: "라페스타 일산의 활기찬 거리를 경험해보세요.",
    enLabel: "La Festa",
    enTitle: "Streets of performances, shopping and youth",
    enDesc: "Experience the vibrant streets of La Festa Ilsan.",
    imageUrl: "/uploads/admin/hero-slides/1776335198795-rquic0ytccd.jpg",
    background: "linear-gradient(135deg, #ffe38f 0%, #ffb39b 40%, #c39af9 100%)",
  },
  {
    id: "korean-bbq",
    type: "image",
    koLabel: "Korean BBQ Tour",
    koTitle: "정통 한국 바비큐 체험",
    koDesc: "맛있는 삼겹살과 다채로운 반찬을 맛보며 한국식 식사의 매력을 직접 경험해보세요.",
    enLabel: "Experience Korean BBQ",
    enTitle: "Authentic Korean BBQ Experience",
    enDesc: "Grill premium samgyeopsal, enjoy classic Korean side dishes, and experience Korean dining like a local.",
    imageUrl: "/uploads/admin/hero-slides/1776334623967-gvj79gmlf7.jpg",
    background: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  },
  {
    id: "night-program",
    type: "image",
    koLabel: "야간 프로그램",
    koTitle: "호수공원 분수대와 나이트라이프",
    koDesc: "야간경관이 아름다운 도시",
    enLabel: "Night program",
    enTitle: "Lake Park Fountain and Nightlife",
    enDesc: "A beautiful night cityscape.",
    imageUrl: "/uploads/admin/hero-slides/1776336200211-q626oifearq.jpg",
    background: "linear-gradient(135deg, #122548 0%, #3557b0 42%, #ff8d8b 84%, #ffd280 100%)",
  },
  {
    id: "seooreung",
    type: "image",
    koLabel: "세계문화유산의 도시 고양",
    koTitle: "전통의 역사와 신도시의 조화로움",
    koDesc: "서오릉은 조선왕조 왕실의 품격과 역사, 자연경관이 함께 어우러진 서쪽의 다섯 왕릉군입니다.",
    enLabel: "UNESCO World Heritage",
    enTitle: "Seooreung Royal Tombs",
    enDesc: "Seooreung is a group of five royal tombs in the western area, where the dignity of the Joseon royal family, history, and natural scenery come together in harmony.",
    imageUrl: "/uploads/admin/hero-slides/1776337581935-ot6e5uqseik.jpg",
    background: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
  },
];

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function SlideFrame({ slide }: { slide: HeroSlide }) {
  // 업로드된 영상 파일 (mp4/webm/mov)
  if (slide.videoUrl && isVideoUrl(slide.videoUrl)) {
    return (
      <video
        src={slide.videoUrl}
        className="h-full w-full object-cover"
        autoPlay
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

  const imageOnlyFallback = fallbackSlides.filter(
    (s) => s.type !== "youtube" && !s.videoUrl
  );
  const [slides, setSlides] = useState<HeroSlide[]>(imageOnlyFallback);
  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const youtubeRef = useRef<HTMLIFrameElement>(null);

  // DB에서 슬라이드 데이터 로드
  useEffect(() => {
    fetch("/api/admin/hero-slides")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const filtered = (json.data as HeroSlide[]).filter(
            (s) => Boolean(s.imageUrl) || Boolean(s.videoUrl) || (s.type === "youtube" && Boolean(s.youtubeId))
          );
          if (filtered.length > 0) {
            setSlides(filtered);
            setIndex(0);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 슬라이드 인덱스가 바뀌면 다음 슬라이드도 기본 음소거로 시작 (사용자 UX)
  // key prop 리마운트 대신 명시적 상태 리셋 유지.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMuted(true);
  }, [index]);

  // 자동 슬라이드 — 유튜브/영상이면 20초, 이미지는 5.6초
  useEffect(() => {
    const current = slides[index];
    const isMedia =
      (current?.type === "youtube" && current?.youtubeId) ||
      (current?.videoUrl && /\.(mp4|webm|mov)(\?|$)/i.test(current.videoUrl));
    const delay = isMedia ? 20000 : 5600;
    const timer = window.setTimeout(() => {
      setIndex((c) => (c + 1) % slides.length);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [index, slides]);

  // 유튜브 음소거 토글 (postMessage API)
  function toggleMute() {
    if (!youtubeRef.current?.contentWindow) return;
    const cmd = isMuted ? "unMute" : "mute";
    youtubeRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: cmd, args: "" }),
      "*"
    );
    setIsMuted((prev) => !prev);
  }

  const prev = () => setIndex((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setIndex((c) => (c + 1) % slides.length);

  const current = slides[index];
  const isKo = locale === "ko";
  const label = isKo ? current.koLabel : current.enLabel;
  const title = isKo ? current.koTitle : current.enTitle;
  const desc = isKo ? current.koDesc : current.enDesc;
  const isYoutube = current.type === "youtube" && Boolean(current.youtubeId);

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
            {/* 유튜브는 ref 접근을 위해 직접 렌더링 */}
            {slide.type === "youtube" && slide.youtubeId ? (
              <iframe
                ref={i === index ? youtubeRef : undefined}
                src={`https://www.youtube.com/embed/${slide.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${slide.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                className="h-full w-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={slide.koTitle}
                style={{ border: "none", pointerEvents: "none" }}
              />
            ) : (
              <SlideFrame slide={slide} />
            )}
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

        {/* 하단 컨트롤: 도트 + 버튼 */}
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

          {/* 우측 버튼 그룹 */}
          <div className="flex gap-2">
            {/* 음소거 토글 버튼 — 유튜브 슬라이드에서만 표시 */}
            {isYoutube && (
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "소리 켜기" : "소리 끄기"}
                title={isMuted ? "소리 켜기" : "소리 끄기"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            )}

            {/* 이전/다음 화살표 */}
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
