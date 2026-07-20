import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarRange,
  Handshake,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Link } from "@/lib/navigation";

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type Track = {
  icon: typeof BriefcaseBusiness;
  title: string;
  desc: string;
  gradFrom: string;
  gradTo: string;
  iconBg: string;
  iconColor: string;
  glow: string;
};

type Copy = {
  eyebrow: string;
  title: string;
  desc: string;
  primary: string;
  secondary: string;
  tracks: Track[];
};

const copyMap: Record<LocaleKey, Copy> = {
  ko: {
    eyebrow: "Next Step",
    title: "좋은 아이디어를 실제 프로그램과 운영 구조로 연결해 드립니다.",
    desc: "행사 운영, MICE 안내, 연구 기반 프로젝트, 기관 협업까지 목표와 상황을 알려주시면 가장 현실적인 다음 단계로 정리해 드립니다.",
    primary: "상담 요청하기",
    secondary: "MICE 안내 보기",
    tracks: [
      { icon: BriefcaseBusiness, title: "행사 운영 제안", desc: "방문 프로그램, 체류 동선, 현장 운영 시나리오를 함께 설계합니다.", gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.4)" },
      { icon: Handshake, title: "제휴 파트너 연결", desc: "기관, 숙박, 미식, 로컬 거점과 연결되는 협력 구조를 제안합니다.", gradFrom: "#f0fdf8", gradTo: "#e8fbf3", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.4)" },
      { icon: CalendarRange, title: "중장기 프로젝트 상담", desc: "브랜딩과 콘텐츠 기획, 운영 구조까지 이어지는 프로젝트 상담을 지원합니다.", gradFrom: "#f0f4ff", gradTo: "#eef2ff", iconBg: "bg-[#d4ddff]", iconColor: "text-[#3655a6]", glow: "rgba(100,130,255,0.35)" },
    ],
  },
  en: {
    eyebrow: "Next Step",
    title: "We connect strong ideas to real programs and operations.",
    desc: "Share your event, MICE guide or research-based project goals and we will help shape the most practical next step.",
    primary: "Request consultation",
    secondary: "View MICE guide",
    tracks: [
      { icon: BriefcaseBusiness, title: "Operations planning", desc: "We help structure visitor programs, stay flows and field operations scenarios.", gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.4)" },
      { icon: Handshake, title: "Partner connection", desc: "We connect public agencies, stays, venues and local partners into one service structure.", gradFrom: "#f0fdf8", gradTo: "#e8fbf3", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.4)" },
      { icon: CalendarRange, title: "Project consultation", desc: "We support longer-term projects covering branding, content planning and operations design.", gradFrom: "#f0f4ff", gradTo: "#eef2ff", iconBg: "bg-[#d4ddff]", iconColor: "text-[#3655a6]", glow: "rgba(100,130,255,0.35)" },
    ],
  },
  ja: {
    eyebrow: "Next Step",
    title: "良いアイデアを実際のプログラムと運営構造へとつなげます。",
    desc: "イベント運営・MICEガイド・研究プロジェクト・機関連携など、目標とご状況をお知らせいただければ、最も現実的な次のステップをご提案します。",
    primary: "相談を申し込む",
    secondary: "MICEガイドを見る",
    tracks: [
      { icon: BriefcaseBusiness, title: "イベント運営提案", desc: "訪問プログラム、滞在動線、現場運営シナリオを一緒に設計します。", gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.4)" },
      { icon: Handshake, title: "提携パートナー連結", desc: "機関・宿泊・グルメ・ローカル拠点と連携する協力体制をご提案します。", gradFrom: "#f0fdf8", gradTo: "#e8fbf3", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.4)" },
      { icon: CalendarRange, title: "中長期プロジェクト相談", desc: "ブランディングとコンテンツ企画から運営構造まで、プロジェクト全体をサポートします。", gradFrom: "#f0f4ff", gradTo: "#eef2ff", iconBg: "bg-[#d4ddff]", iconColor: "text-[#3655a6]", glow: "rgba(100,130,255,0.35)" },
    ],
  },
  "zh-CN": {
    eyebrow: "Next Step",
    title: "将好的创意转化为实际项目与运营结构。",
    desc: "无论是活动运营、MICE指南、研究项目还是机构合作，请告知您的目标与需求，我们将为您规划最切实可行的下一步。",
    primary: "申请咨询",
    secondary: "查看MICE指南",
    tracks: [
      { icon: BriefcaseBusiness, title: "活动运营方案", desc: "共同设计访客项目、滞留路线及现场运营方案。", gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.4)" },
      { icon: Handshake, title: "合作伙伴连接", desc: "提供与机构、住宿、餐饮及本地据点的合作结构方案。", gradFrom: "#f0fdf8", gradTo: "#e8fbf3", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.4)" },
      { icon: CalendarRange, title: "中长期项目咨询", desc: "支持涵盖品牌策划、内容规划及运营结构的全程项目咨询。", gradFrom: "#f0f4ff", gradTo: "#eef2ff", iconBg: "bg-[#d4ddff]", iconColor: "text-[#3655a6]", glow: "rgba(100,130,255,0.35)" },
    ],
  },
  "zh-TW": {
    eyebrow: "Next Step",
    title: "將好的創意轉化為實際項目與運營結構。",
    desc: "無論是活動運營、MICE指南、研究計畫還是機構合作，請告知您的目標與需求，我們將為您規劃最切實可行的下一步。",
    primary: "申請諮詢",
    secondary: "查看MICE指南",
    tracks: [
      { icon: BriefcaseBusiness, title: "活動運營方案", desc: "共同設計訪客計畫、滯留路線及現場運營方案。", gradFrom: "#fffbee", gradTo: "#fff4da", iconBg: "bg-[#ffe8a0]", iconColor: "text-[#9b7a00]", glow: "rgba(255,233,139,0.4)" },
      { icon: Handshake, title: "合作夥伴連結", desc: "提供與機構、住宿、餐飲及在地據點的合作結構方案。", gradFrom: "#f0fdf8", gradTo: "#e8fbf3", iconBg: "bg-[#b7f0d8]", iconColor: "text-[#0a6b48]", glow: "rgba(141,240,207,0.4)" },
      { icon: CalendarRange, title: "中長期計畫諮詢", desc: "支援涵蓋品牌策劃、內容規劃及運營結構的全程計畫諮詢。", gradFrom: "#f0f4ff", gradTo: "#eef2ff", iconBg: "bg-[#d4ddff]", iconColor: "text-[#3655a6]", glow: "rgba(100,130,255,0.35)" },
    ],
  },
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default async function ContactCtaSection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">

          {/* 왼쪽: 어두운 CTA 패널 */}
          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0e1c35_40%,_#1a2e58_80%,_#1e3a6e_100%)] p-7 text-white shadow-[0_28px_70px_rgba(8,14,26,0.22)] sm:rounded-[40px] sm:p-9 lg:p-11">
            {/* 격자 배경 */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.045]"
              style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
            />
            {/* 글로우 오브 */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[#8df0cf]/15 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-12 left-10 h-48 w-48 rounded-full bg-[#ffb58f]/12 blur-[60px]" />
            {/* 상단 네온 라인 */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8df0cf] via-[#ffe98b] to-[#ffb58f]" />

            <div className="relative">
              <SectionTitle
                eyebrow={copy.eyebrow}
                title={copy.title}
                desc={copy.desc}
                className="[&>div]:border-[#8df0cf]/25 [&>div]:bg-[#8df0cf]/10 [&>div>p]:text-[#8df0cf]/90 [&>div>span]:bg-[#8df0cf] [&_h2]:text-white [&_p]:text-slate-400"
              />

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8f7e] to-[#ffcc8f] px-6 text-sm font-bold text-slate-950 shadow-[0_8px_24px_rgba(255,143,126,0.35)] transition hover:-translate-y-0.5 hover:brightness-105"
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
          </div>

          {/* 오른쪽: 트랙 카드들 */}
          <div className="grid gap-4">
            {copy.tracks.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  style={{ background: `linear-gradient(145deg, ${item.gradFrom}, ${item.gradTo})` }}
                  className="group relative overflow-hidden rounded-[24px] border border-white/90 p-5 shadow-[0_8px_28px_rgba(16,32,58,0.07)] transition duration-300 hover:-translate-y-1 sm:p-6"
                >
                  {/* 왼쪽 액센트 */}
                  <div
                    className="absolute left-0 top-0 h-full w-[3px] rounded-l-[24px] opacity-60"
                    style={{ background: `linear-gradient(180deg, ${item.gradTo}, ${item.gradFrom})` }}
                  />
                  {/* 호버 글로우 */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `0 0 28px ${item.glow}` }}
                  />
                  <div className={`relative flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${item.iconBg} ${item.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-4 text-[1.2rem] font-black tracking-[-0.03em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="relative mt-2.5 text-sm leading-7 text-slate-500">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
