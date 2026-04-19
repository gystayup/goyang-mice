import { createClient } from "@supabase/supabase-js";

/**
 * SNS 콘텐츠 관리 — Supabase pages(pageKey="social-links") row 에
 * { youtube, instagram, tiktok } 형태로 저장.
 *
 * 유튜브: 채널 ID 저장 + 자동 동기화 옵션. 최신 영상은 SocialFeed 서버 컴포넌트에서
 *         YouTube Data API 로 fetch (API 키 없을 땐 수동 영상 목록 사용).
 * 인스타/틱톡: 임베드 URL 수동 관리.
 */

export type YoutubeVideo = {
  id: string; // 비디오 ID 또는 안정적인 키
  title?: string;
  url: string;
  thumbnail?: string;
};

export type YoutubeSettings = {
  channelId?: string;
  channelUrl?: string;
  autoSync?: boolean;
  featuredVideoUrl?: string; // 홈 히어로 하이라이트용
  videos: YoutubeVideo[]; // 자동 동기화 실패/비활성 시 사용
};

export type InstagramPost = {
  id: string;
  url: string; // https://www.instagram.com/p/XXXX/
  caption?: string;
};

export type InstagramSettings = {
  handle?: string; // @goyangmice
  profileUrl?: string;
  posts: InstagramPost[];
};

export type TiktokVideo = {
  id: string;
  url: string; // https://www.tiktok.com/@user/video/xxx
  caption?: string;
};

export type TiktokSettings = {
  handle?: string;
  profileUrl?: string;
  videos: TiktokVideo[];
};

export type SocialLinksData = {
  youtube: YoutubeSettings;
  instagram: InstagramSettings;
  tiktok: TiktokSettings;
};

export const EMPTY_SOCIAL: SocialLinksData = {
  youtube: { videos: [], autoSync: true },
  instagram: { posts: [] },
  tiktok: { videos: [] },
};

const PAGE_KEY = "social-links";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `sns_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export async function readSocialLinks(): Promise<SocialLinksData> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("pageKey", PAGE_KEY)
      .single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = data as any;
    const contentJson = raw?.contentJson ?? raw?.contentjson ?? null;
    if (!contentJson || typeof contentJson !== "object") return EMPTY_SOCIAL;
    const d = contentJson as Partial<SocialLinksData>;
    return {
      youtube: {
        ...EMPTY_SOCIAL.youtube,
        ...(d.youtube ?? {}),
        videos: Array.isArray(d.youtube?.videos) ? d.youtube!.videos : [],
      },
      instagram: {
        ...EMPTY_SOCIAL.instagram,
        ...(d.instagram ?? {}),
        posts: Array.isArray(d.instagram?.posts) ? d.instagram!.posts : [],
      },
      tiktok: {
        ...EMPTY_SOCIAL.tiktok,
        ...(d.tiktok ?? {}),
        videos: Array.isArray(d.tiktok?.videos) ? d.tiktok!.videos : [],
      },
    };
  } catch {
    return EMPTY_SOCIAL;
  }
}

export async function writeSocialLinks(data: SocialLinksData): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();
  const now = new Date().toISOString();
  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: data, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: randomId(),
      pageKey: PAGE_KEY,
      title: "Social Links",
      slug: PAGE_KEY,
      contentJson: data,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}

/**
 * YouTube Data API v3 로 채널 최신 영상 N개 가져오기.
 * API 키(YOUTUBE_API_KEY) 없으면 빈 배열 반환.
 */
export async function fetchYoutubeChannelVideos(
  channelId: string,
  maxResults = 6
): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || !channelId) return [];
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", String(maxResults));

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } }); // 30분 캐시
    if (!res.ok) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    if (!Array.isArray(data?.items)) return [];
    return data.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item?.id?.videoId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet?.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url,
      }));
  } catch {
    return [];
  }
}

/** URL 에서 유튜브 비디오 ID 추출 */
export function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    // /embed/, /shorts/
    const m = u.pathname.match(/(?:embed|shorts)\/([^/?#]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** 인스타 oEmbed URL 만들기 (블록쿼트 → 스크립트로 변환되는 공식 임베드) */
export function instagramEmbedUrl(postUrl: string): string {
  // https://www.instagram.com/p/XXXX/embed
  try {
    const u = new URL(postUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    // 지원 경로: p/:id, reel/:id, tv/:id
    if (parts.length >= 2 && ["p", "reel", "tv"].includes(parts[0])) {
      return `https://www.instagram.com/${parts[0]}/${parts[1]}/embed`;
    }
  } catch {
    /* fallthrough */
  }
  return postUrl;
}

/** 틱톡 임베드 URL */
export function tiktokEmbedUrl(videoUrl: string): string | null {
  try {
    const u = new URL(videoUrl);
    const m = u.pathname.match(/\/video\/(\d+)/);
    if (m) return `https://www.tiktok.com/embed/v2/${m[1]}`;
  } catch {
    /* noop */
  }
  return null;
}

export function makeRandomId() {
  return randomId();
}
