import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

/**
 * 관리자 계정 저장소 (Supabase pages 테이블의 pageKey="admin-users" row 에
 * { users: AdminUser[] } 형태로 저장 — 다른 CMS 데이터와 동일한 패턴).
 *
 * 최초 접근 시 users 배열이 비어 있으면 기본 SUPER_ADMIN 계정을 자동 시드합니다.
 * 환경변수 ADMIN_DEFAULT_EMAIL / ADMIN_DEFAULT_PASSWORD 로 초기값 변경 가능.
 */

export type AdminRole = "SUPER_ADMIN" | "OPERATOR" | "EDITOR" | "PARTNER_MANAGER";
export type AdminStatus = "ACTIVE" | "INACTIVE";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  passwordHash: string;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicAdminUser = Omit<AdminUser, "passwordHash">;

const PAGE_KEY = "admin-users";
const BCRYPT_ROUNDS = 10;

const DEFAULT_EMAIL = process.env.ADMIN_DEFAULT_EMAIL ?? "admin@goyangmice.kr";
const DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD ?? "admin123";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

function randomId(): string {
  try {
    // Node 18+ / edge / browser
    return crypto.randomUUID();
  } catch {
    return `admin_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function toPublicUser(user: AdminUser): PublicAdminUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}

async function readRaw(): Promise<AdminUser[] | null> {
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
    if (!contentJson || typeof contentJson !== "object") return null;
    const users = (contentJson as { users?: AdminUser[] }).users;
    if (!Array.isArray(users)) return null;
    return users;
  } catch {
    return null;
  }
}

async function writeRaw(users: AdminUser[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();
  const now = new Date().toISOString();
  const payload = { users };
  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: payload, updatedAt: now })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: randomId(),
      pageKey: PAGE_KEY,
      title: "Admin Users",
      slug: PAGE_KEY,
      contentJson: payload,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: now,
      updatedAt: now,
    });
  }
}

/** 기본 관리자 자동 시드 */
async function ensureSeed(): Promise<AdminUser[]> {
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  const seed: AdminUser = {
    id: randomId(),
    email: DEFAULT_EMAIL,
    name: "Super Admin",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    passwordHash,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  };
  await writeRaw([seed]);
  return [seed];
}

/** 전체 사용자 반환. 비어있으면 기본 관리자 시드 */
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const users = await readRaw();
  if (users && users.length > 0) return users;
  return ensureSeed();
}

export async function findAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const users = await getAllAdminUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const users = await getAllAdminUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function verifyAdminPassword(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const user = await findAdminUserByEmail(email);
  if (!user) return null;
  if (user.status !== "ACTIVE") return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function touchLastLogin(userId: string): Promise<void> {
  const users = await getAllAdminUsers();
  const now = new Date().toISOString();
  const next = users.map((u) =>
    u.id === userId ? { ...u, lastLoginAt: now, updatedAt: now } : u
  );
  await writeRaw(next);
}

export type CreateAdminInput = {
  email: string;
  name: string;
  role: AdminRole;
  password: string;
  status?: AdminStatus;
};

export async function createAdminUser(input: CreateAdminInput): Promise<PublicAdminUser> {
  const users = await getAllAdminUsers();
  const normalized = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new Error("이미 등록된 이메일입니다.");
  }
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const created: AdminUser = {
    id: randomId(),
    email: input.email.trim(),
    name: input.name.trim(),
    role: input.role,
    status: input.status ?? "ACTIVE",
    passwordHash,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  };
  await writeRaw([...users, created]);
  return toPublicUser(created);
}

export type UpdateAdminInput = Partial<{
  name: string;
  role: AdminRole;
  status: AdminStatus;
  password: string; // 평문 — 전달 시 해시 재계산
}>;

export async function updateAdminUser(
  id: string,
  patch: UpdateAdminInput
): Promise<PublicAdminUser | null> {
  const users = await getAllAdminUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return null;

  const now = new Date().toISOString();
  const next: AdminUser = { ...target, updatedAt: now };
  if (patch.name !== undefined) next.name = patch.name.trim();
  if (patch.role !== undefined) next.role = patch.role;
  if (patch.status !== undefined) next.status = patch.status;
  if (patch.password !== undefined && patch.password.length > 0) {
    next.passwordHash = await bcrypt.hash(patch.password, BCRYPT_ROUNDS);
  }

  const updatedList = users.map((u) => (u.id === id ? next : u));
  await writeRaw(updatedList);
  return toPublicUser(next);
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const users = await getAllAdminUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return false;
  // 마지막 SUPER_ADMIN 이면 삭제 금지
  const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN" && u.status === "ACTIVE");
  if (target.role === "SUPER_ADMIN" && superAdmins.length <= 1) {
    throw new Error("최소 1명의 활성 SUPER_ADMIN 이 필요합니다.");
  }
  const next = users.filter((u) => u.id !== id);
  await writeRaw(next);
  return true;
}

export async function listPublicAdminUsers(): Promise<PublicAdminUser[]> {
  const users = await getAllAdminUsers();
  return users.map(toPublicUser);
}
