import SocialFeed from "@/components/social/SocialFeed";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  ko: {
    title: "SNS 에서 만나는 고양",
    subtitle: "유튜브 · 인스타그램 · 틱톡에서 최신 소식을 확인하세요",
  },
  en: {
    title: "Goyang on Social Media",
    subtitle: "Latest updates on YouTube, Instagram, and TikTok",
  },
  ja: {
    title: "SNSで会う高陽",
    subtitle: "YouTube・Instagram・TikTokで最新情報をチェック",
  },
  "zh-CN": {
    title: "社交媒体上的高阳",
    subtitle: "在 YouTube、Instagram、TikTok 查看最新动态",
  },
  "zh-TW": {
    title: "社群媒體上的高陽",
    subtitle: "在 YouTube、Instagram、TikTok 查看最新動態",
  },
};

export default function SocialSection({ locale }: { locale: string }) {
  const copy = TITLES[locale] ?? TITLES.ko;
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{copy.title}</h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{copy.subtitle}</p>
        </div>
        {/* Server component — auto-hides entire block if no content configured */}
        <SocialFeed />
      </div>
    </section>
  );
}
