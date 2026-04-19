/**
 * 뉴스 CMS 공유 타입/상수 — 클라이언트·서버 모두에서 안전하게 사용할 수 있도록
 * Supabase 같은 Node-전용 의존성이 없는 순수 모듈로 분리합니다.
 */

export type NewsCategory = "notice" | "press" | "event" | "research";
export type NewsStatus = "DRAFT" | "PUBLISHED";

export interface NewsArticle {
  id: string;
  slug: string;
  category: NewsCategory;
  status: NewsStatus;
  title: string;
  subtitle?: string;
  body: string;
  coverImageUrl?: string;
  coverImageFileName?: string;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  emailSentAt?: string;
  emailRecipientCount?: number;
}

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  notice: "공지",
  press: "보도자료",
  event: "행사소식",
  research: "연구결과",
};
