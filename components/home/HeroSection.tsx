
import HeroMediaCarousel from "@/components/home/HeroMediaCarousel";
import ExpandableStats from "@/components/home/ExpandableStats";

type LocaleCopy = {
  introBadge: string;
  title: string;
  desc: string;
  cards: Array<{ eyebrow: string; title: string; desc: string; tone: string }>;
  stats: Array<{ value: string; label: string; tone: string }>;
};

const heroCopy: Record<"ko" | "en", LocaleCopy> = {
  ko: {
    introBadge: "고양 방문경험 연구·연계 플랫폼",
    title: "",
    desc: "",
    cards: [
      {
        eyebrow: "Research",
        title: "고양특례시 문화·관광·마이스 전략 연구",
        desc: "도시 자산 분석과 방문객 여정 설계를 기반으로 실행 가능한 기획 구조를 만듭니다.",
        tone: "bg-[#fff4da]",
      },
      {
        eyebrow: "DMC",
        title: "현장을 움직이는 로컬 운영 서비스",
        desc: "공연, 전시, VIP, 단체 방문객을 위한 일정 설계와 현장 대응을 통합 지원합니다.",
        tone: "bg-[#e8fbf3]",
      },
      {
        eyebrow: "Experience",
        title: "머무르고 이어지는 체류 경험",
        desc: "카페, 미식, 로컬 체험, 쇼핑 동선을 연결해 고양만의 라이프스타일 경험을 확장합니다.",
        tone: "bg-[#ffe7df]",
      },
    ],
    stats: [
      {
        value: "K-POP · KINTEX",
        label: "공연, 전시, 비즈니스 방문이 이어지는 핵심 거점",
        tone: "bg-[#fff7df]",
      },
      {
        value: "5축 연결",
        label: "공연, 전시, 관광, 숙박, 쇼핑·미식을 하나의 흐름으로 연결",
        tone: "bg-[#eff9f4]",
      },
      {
        value: "운영형 DMC",
        label: "기획부터 예약, 현장 운영까지 이어지는 실행 구조",
        tone: "bg-[#eef3ff]",
      },
      {
        value: "라이프스타일 확장",
        label: "가족 체험과 상시 운영 콘텐츠로 체류 프로그램을 확대",
        tone: "bg-[#fff0ea]",
      },
    ],
  },
  en: {
    introBadge: "Goyang Visit Experience Research & Connection Platform",
    title: "",
    desc: "",
    cards: [
      {
        eyebrow: "Research",
        title: "Strategic research for culture, tourism and MICE",
        desc: "We build practical strategies based on city assets and visitor journey design.",
        tone: "bg-[#fff4da]",
      },
      {
        eyebrow: "DMC",
        title: "Local operations that keep experiences moving",
        desc: "We support schedules, logistics and on-site coordination for events, buyers, VIPs and groups.",
        tone: "bg-[#e8fbf3]",
      },
      {
        eyebrow: "Experience",
        title: "Lifestyle journeys that extend the stay",
        desc: "We expand visits through dining, cafés, shopping and local lifestyle experiences.",
        tone: "bg-[#ffe7df]",
      },
    ],
    stats: [
      {
        value: "K-POP · KINTEX",
        label: "A key hub for performances, exhibitions and business visits",
        tone: "bg-[#fff7df]",
      },
      {
        value: "5 connected layers",
        label: "Performance, exhibition, tourism, stay and dining in one flow",
        tone: "bg-[#eff9f4]",
      },
      {
        value: "Operations-first DMC",
        label: "A practical structure from planning and booking to field delivery",
        tone: "bg-[#eef3ff]",
      },
      {
        value: "Lifestyle expansion",
        label: "Family-friendly programs and repeatable content that lengthen stays",
        tone: "bg-[#fff0ea]",
      },
    ],
  },
};

export default async function HeroSection({ locale }: { locale: string }) {
  const copy = heroCopy[locale === "en" ? "en" : "ko"];

  return (
    <section className="relative overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-20">
      <div className="absolute left-[-7rem] top-10 h-48 w-48 rounded-full bg-[#ffe0d6] blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-56 w-56 rounded-full bg-[#dff9ef] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <HeroMediaCarousel />
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:mt-10 sm:px-6 lg:mt-12">
        <div className="rounded-[30px] border border-white/70 bg-white/86 p-5 shadow-[0_18px_50px_rgba(16,32,58,0.08)] backdrop-blur sm:rounded-[34px] sm:p-6 lg:p-8">
          {/* 뱃지 영역 */}
          <div className="rounded-[26px] bg-[linear-gradient(135deg,_#fff1de_0%,_#ffe9e2_36%,_#fffefa_100%)] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <div className="inline-flex rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#ffe98b)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-950">
              {copy.introBadge}
            </div>
          </div>

          {/* 카드 3개 */}
          <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-3">
            {copy.cards.map((card) => (
              <article
                key={card.title}
                className={`rounded-[22px] border border-white/70 p-5 shadow-[0_8px_24px_rgba(16,32,58,0.05)] sm:p-6 ${card.tone}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {card.eyebrow}
                </p>
                <h3 className="mt-2.5 text-lg font-black leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-600 sm:text-[15px]">{card.desc}</p>
              </article>
            ))}
          </div>

          {/* 통계 4개 - 접기/펼치기 */}
          <ExpandableStats stats={copy.stats} locale={locale} />
        </div>
      </div>
    </section>
  );
}
