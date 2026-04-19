import { createClient } from "@supabase/supabase-js";

/**
 * 방문자(회원) 계정 저장소 — Supabase pages(pageKey="visitors") row 의
 * { visitors: Visitor[] } 에 저장.
 *
 * 카카오/구글/네이버 OAuth 로그인 시 (provider + providerAccountId) 로 upsert.
 * 이메일은 동일 provider 안에서만 unique.
 */

export type VisitorProvider = "kakao" | "google" | "naver";

export type Visitor = {
  id: string;
  provider: VisitorProvider;
  providerAccountId: string;
  email?: string | null;
  name: string;
  phone?: string | null;
  profileImage?: string | null;
  marketingAgree?: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicVisitor = Visitor;

const PAGE_KEY = "visitors";

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
    return `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function readAll(): Promise<Visitor[]> {
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
    if (!contentJson || typeof contentJson !== "object") return [];
    const list = (contentJson as { visitors?: Visitor[] }).visitors;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function writeAll(visitors: Visitor[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();
  const now = new Date().toISOString();
  const payload = { visitors };
  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: payload, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: randomId(),
      pageKey: PAGE_KEY,
      title: "Visitors",
      slug: PAGE_KEY,
      contentJson: payload,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}

export type UpsertVisitorInput = {
  provider: VisitorProvider;
  providerAccountId: string;
  email?: string | null;
  name: string;
  profileImage?: string | null;
};

/**
 * OAuth 로그인 콜백에서 호출. 이미 존재하면 프로필 갱신 + lastLoginAt, 없으면 생성.
 */
export async function upsertVisitor(input: UpsertVisitorInput): Promise<Visitor> {
  const visitors = await readAll();
  const now = new Date().toISOString();
  const existing = visitors.find(
    (v) => v.provider === input.provider && v.providerAccountId === input.providerAccountId
  );

  if (existing) {
    const next: Visitor = {
      ...existing,
      email: input.email ?? existing.email,
      name: input.name || existing.name,
      profileImage: input.profileImage ?? existing.profileImage,
      lastLoginAt: now,
      updatedAt: now,
    };
    const updatedList = visitors.map((v) => (v.id === existing.id ? next : v));
    await writeAll(updatedList);
    return next;
  }

  const created: Visitor = {
    id: randomId(),
    provider: input.provider,
    providerAccountId: input.providerAccountId,
    email: input.email ?? null,
    name: input.name,
    profileImage: input.profileImage ?? null,
    marketingAgree: false,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await writeAll([...visitors, created]);
  return created;
}

export async function findVisitorById(id: string): Promise<Visitor | null> {
  const visitors = await readAll();
  return visitors.find((v) => v.id === id) ?? null;
}

export async function updateVisitorProfile(
  id: string,
  patch: Partial<Pick<Visitor, "name" | "phone" | "marketingAgree">>
): Promise<Visitor | null> {
  const visitors = await readAll();
  const target = visitors.find((v) => v.id === id);
  if (!target) return null;
  const now = new Date().toISOString();
  const next: Visitor = { ...target, ...patch, updatedAt: now };
  const updatedList = visitors.map((v) => (v.id === id ? next : v));
  await writeAll(updatedList);
  return next;
}

export async function listVisitors(): Promise<Visitor[]> {
  return readAll();
}
