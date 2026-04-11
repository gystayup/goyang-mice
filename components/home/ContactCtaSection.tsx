import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarRange,
  Handshake,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Link } from "@/lib/navigation";

const copyMap = {
  ko: {
    eyebrow: "Next Step",
    title: "좋은 아이디어를 실제 프로그램과 운영 구조로 연결해 드립니다.",
    desc: "행사 운영, DMC 서비스, 연구 기반 프로젝트, 기관 협업까지 목표와 상황을 알려주시면 가장 현실적인 다음 단계로 정리해 드립니다.",
    primary: "상담 요청하기",
    secondary: "DMC 서비스 보기",
    tracks: [
      {
        icon: BriefcaseBusiness,
        title: "행사 운영 제안",
        desc: "방문 프로그램, 체류 동선, 현장 운영 시나리오를 함께 설계합니다.",
        color: "bg-[#fff4da] text-[#9b6400]",
      },
      {
        icon: Handshake,
        title: "제휴 파트너 연결",
        desc: "기관, 숙박, 미식, 로컬 거점과 연결되는 협력 구조를 제안합니다.",
        color: "bg-[#e8fbf3] text-[#0d7b58]",
      },
      {
        icon: CalendarRange,
        title: "중장기 프로젝트 상담",
        desc: "브랜딩과 콘텐츠 기획, 운영 구조까지 이어지는 프로젝트 상담을 지원합니다.",
        color: "bg-[#eef2ff] text-[#3655a6]",
      },
    ],
  },
  en: {
    eyebrow: "Next Step",
    title: "We connect strong ideas to real programs and operations.",
    desc: "Share your event, DMC service or research-based project goals and we will help shape the most practical next step.",
    primary: "Request consultation",
    secondary: "View DMC services",
    tracks: [
      {
        icon: BriefcaseBusiness,
        title: "Operations planning",
        desc: "We help structure visitor programs, stay flows and field operations scenarios.",
        color: "bg-[#fff4da] text-[#9b6400]",
      },
      {
        icon: Handshake,
        title: "Partner connection",
        desc: "We connect public agencies, stays, venues and local partners into one service structure.",
        color: "bg-[#e8fbf3] text-[#0d7b58]",
      },
      {
        icon: CalendarRange,
        title: "Project consultation",
        desc: "We support longer-term projects covering branding, content planning and operations design.",
        color: "bg-[#eef2ff] text-[#3655a6]",
      },
    ],
  },
} as const;

export default async function ContactCtaSection({ locale }: { locale: string }) {
  const copy = copyMap[locale === "en" ? "en" : "ko"];

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] bg-[linear-gradient(135deg,_#10203a_0%,_#304f9b_38%,_#ff8f7e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(16,32,58,0.16)] sm:rounded-[36px] sm:p-8 lg:p-10">
            <SectionTitle
              eyebrow={copy.eyebrow}
              title={copy.title}
              desc={copy.desc}
              className="[&_div]:text-[#fff0b0] [&_h2]:text-white [&_p]:text-white/84"
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                {copy.primary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dmc"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/18"
              >
                {copy.secondary}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {copy.tracks.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-white/70 bg-white/88 p-5 shadow-[0_12px_32px_rgba(16,32,58,0.06)] backdrop-blur"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[1.25rem] font-black tracking-[-0.03em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
