import SocialFeed from "@/components/social/SocialFeed";
import {
  extractYoutubeId,
  fetchYoutubeChannelVideos,
  readSocialLinks,
} from "@/lib/social-links-db";

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

/**
 * 관리자에서 SNS 콘텐츠가 하나도 등록되지 않았다면 섹션 전체를 숨깁니다.
 * (제목만 덩그러니 남는 빈 상태 방지)
 * — 관리자가 유튜브 채널 ID / 게시물 URL 하나라도 등록하면 자동으로 다시 노출됩니다.
 */
async function hasAnyContent(): Promise<boolean> {
  try {
    const data = await readSocialLinks();

    const featuredId = data.youtube.featuredVideoUrl
      ? extractYoutubeId(data.youtube.featuredVideoUrl)
      : null;
    if (featuredId) return true;

    if (data.youtube.videos.some((v) => v.url)) return true;
    if (data.instagram.posts.some((p) => p.url)) return true;
    if (data.tiktok.videos.some((v) => v.url)) return true;

    if (data.youtube.autoSync && data.youtube.channelId) {
      const videos = await fetchYoutubeChannelVideos(data.youtube.channelId, 1);
      if (videos.length > 0) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export default async function SocialSection({ locale }: { locale: string }) {
  const copy = TITLES[locale] ?? TITLES.ko;
  const hasContent = await hasAnyContent();
  if (!hasContent) return null;

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{copy.title}</h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{copy.subtitle}</p>
        </div>
        <SocialFeed />
      </div>
    </section>
  );
}
