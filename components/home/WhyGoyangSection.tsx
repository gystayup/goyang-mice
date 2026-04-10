import { getLocale } from "next-intl/server";

const copyMap = {
  ko: {
    eyebrow: "Why Goyang",
    title:
      "고양은 공연, 전시, 관광, 라이프스타일 콘텐츠가 가까운 거리에서 연결되어 방문을 체류 경험으로 확장하기 좋은 도시입니다.",
    items: [
      {
        title: "공연과 전시가 체류 경험으로 이어집니다",
        desc: "KINTEX, 공연장, 관광특구와 로컬 거점이 가까워 방문 경험을 하나의 여정으로 설계할 수 있습니다.",
        tone: "bg-[#fff4da]",
      },
      {
        title: "로컬 라이프스타일이 프로그램이 됩니다",
        desc: "카페, 미식, 쇼핑, 가족형 체험을 묶어 고양만의 체류형 콘텐츠로 확장할 수 있습니다.",
        tone: "bg-[#e7fbf3]",
      },
      {
        title: "연구가 운영 구조로 이어집니다",
        desc: "보고서에 머무르지 않고 예약 서비스, 현장 운영, 체류 프로그램으로 연결되는 실행 구조를 만듭니다.",
        tone: "bg-[#eef2ff]",
      },
      {
        title: "K-컬처 감도가 있는 도시 경험을 제안합니다",
        desc: "공연과 전시, 로컬 장면을 연결해 오래 기억되는 방문 경험을 구성할 수 있습니다.",
        tone: "bg-[#ffe7df]",
      },
    ],
  },
  en: {
    eyebrow: "Why Goyang",
    title:
      "Goyang is a city where performances, exhibitions, tourism and lifestyle content connect closely enough to turn visits into longer stay experiences.",
    items: [
      {
        title: "Performances and exhibitions extend into stay experiences",
        desc: "KINTEX, venues, tourism districts and local neighborhoods are close enough to form one visitor journey.",
        tone: "bg-[#fff4da]",
      },
      {
        title: "Local lifestyle becomes part of the program",
        desc: "Cafés, dining, shopping and family-friendly experiences can be shaped into stay-oriented content.",
        tone: "bg-[#e7fbf3]",
      },
      {
        title: "Research becomes an operational structure",
        desc: "The goal is not just reports, but bookings, field operations and practical visitor programs.",
        tone: "bg-[#eef2ff]",
      },
      {
        title: "K-culture energy becomes a branded city experience",
        desc: "Performances, exhibitions and local scenes are translated into richer, better remembered visitor journeys.",
        tone: "bg-[#ffe7df]",
      },
    ],
  },
} as const;

export default async function WhyGoyangSection() {
  const locale = await getLocale();
  const copy = copyMap[locale === "en" ? "en" : "ko"];

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[30px] bg-[linear-gradient(135deg,_#10203a_0%,_#304f9b_38%,_#ff8f7e_100%)] px-5 py-8 text-white shadow-[0_24px_60px_rgba(16,32,58,0.12)] sm:rounded-[36px] sm:px-7 sm:py-10">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {copy.eyebrow}
          </div>
          <h2 className="mt-3 text-[1.8rem] font-black leading-[1.2] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-[2.3rem] sm:leading-[1.15] lg:text-[2.8rem] lg:leading-[1.1]">
            {copy.title}
          </h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {copy.items.map((item) => (
              <article
                key={item.title}
                className={`rounded-[22px] border border-white/20 p-5 text-slate-900 shadow-[0_8px_24px_rgba(16,32,58,0.06)] sm:p-6 ${item.tone}`}
              >
                <h3 className="text-base font-black leading-[1.3] tracking-[-0.02em] sm:text-lg sm:leading-[1.25] lg:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-slate-600 sm:text-[15px]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
