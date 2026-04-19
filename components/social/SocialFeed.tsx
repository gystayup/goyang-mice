import Link from "next/link";
import { Video } from "lucide-react";

import {
  extractYoutubeId,
  fetchYoutubeChannelVideos,
  instagramEmbedUrl,
  readSocialLinks,
  tiktokEmbedUrl,
  type YoutubeVideo,
} from "@/lib/social-links-db";

type Props = {
  sections?: Array<"featured" | "youtube" | "instagram" | "tiktok">;
  className?: string;
};

const DEFAULT_SECTIONS: NonNullable<Props["sections"]> = [
  "featured",
  "youtube",
  "instagram",
  "tiktok",
];

function youtubeThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export default async function SocialFeed({ sections, className }: Props) {
  const wanted = sections ?? DEFAULT_SECTIONS;
  const data = await readSocialLinks();

  // 유튜브 영상 결정: 자동 동기화 시 API → 실패 시 수동 목록
  let ytVideos: YoutubeVideo[] = [];
  if (data.youtube.autoSync && data.youtube.channelId) {
    ytVideos = await fetchYoutubeChannelVideos(data.youtube.channelId, 6);
  }
  if (ytVideos.length === 0) ytVideos = data.youtube.videos.filter((v) => v.url);

  const featuredId = data.youtube.featuredVideoUrl
    ? extractYoutubeId(data.youtube.featuredVideoUrl)
    : null;

  const anyContent =
    featuredId ||
    ytVideos.length > 0 ||
    data.instagram.posts.length > 0 ||
    data.tiktok.videos.length > 0;

  if (!anyContent) return null;

  return (
    <div className={className}>
      {wanted.includes("featured") && featuredId ? (
        <section className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${featuredId}`}
              title="Featured video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </section>
      ) : null}

      {wanted.includes("youtube") && ytVideos.length > 0 ? (
        <section className="mb-10">
          <HeaderRow
            icon={<Video className="h-5 w-5 text-rose-600" />}
            title="유튜브"
            link={data.youtube.channelUrl}
            linkLabel="채널 바로가기"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ytVideos.slice(0, 6).map((v) => {
              const vid = v.id.length === 11 ? v.id : extractYoutubeId(v.url) ?? v.id;
              return (
                <Link
                  key={v.id + v.url}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.thumbnail ?? youtubeThumbnail(vid)}
                      alt={v.title ?? "YouTube video"}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {v.title ? (
                    <div className="p-3 text-sm font-medium text-slate-800 line-clamp-2">
                      {v.title}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {wanted.includes("instagram") && data.instagram.posts.length > 0 ? (
        <section className="mb-10">
          <HeaderRow
            icon={
              <span className="inline-block h-5 w-5 rounded-md bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600" />
            }
            title="인스타그램"
            link={data.instagram.profileUrl}
            linkLabel={data.instagram.handle ?? "인스타그램 바로가기"}
          />
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
            {data.instagram.posts
              .filter((p) => p.url)
              .slice(0, 9)
              .map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-square w-full bg-slate-100">
                    <iframe
                      src={instagramEmbedUrl(p.url)}
                      title={`Instagram post ${p.id}`}
                      className="h-full w-full"
                      loading="lazy"
                      allowTransparency
                    />
                  </div>
                </div>
              ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            인스타그램 임베드는 브라우저 설정에 따라 로딩 시간이 걸릴 수 있습니다.
          </p>
        </section>
      ) : null}

      {wanted.includes("tiktok") && data.tiktok.videos.length > 0 ? (
        <section className="mb-10">
          <HeaderRow
            icon={<span className="inline-block h-5 w-5 rounded-md bg-slate-900" />}
            title="틱톡"
            link={data.tiktok.profileUrl}
            linkLabel={data.tiktok.handle ?? "틱톡 바로가기"}
          />
          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.tiktok.videos
              .filter((v) => v.url)
              .slice(0, 6)
              .map((v) => {
                const src = tiktokEmbedUrl(v.url);
                if (!src) return null;
                return (
                  <div
                    key={v.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <div className="aspect-[9/16] w-full">
                      <iframe
                        src={src}
                        title={`TikTok video ${v.id}`}
                        className="h-full w-full"
                        loading="lazy"
                        allow="encrypted-media"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function HeaderRow({
  icon,
  title,
  link,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
        {icon}
        {title}
      </h3>
      {link ? (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {linkLabel ?? "바로가기"} →
        </Link>
      ) : null}
    </div>
  );
}
