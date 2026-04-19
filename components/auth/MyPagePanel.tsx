"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, Save, User } from "lucide-react";

type Visitor = {
  id: string;
  provider: string;
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

const COPY: Record<string, {
  greeting: (n: string) => string;
  profile: string;
  name: string;
  phone: string;
  email: string;
  marketing: string;
  save: string;
  saved: string;
  saving: string;
  logout: string;
  bookings: string;
  bookingsEmpty: string;
  inquiries: string;
  inquiriesEmpty: string;
  providerLabel: Record<string, string>;
  joined: string;
}> = {
  ko: {
    greeting: (n) => `${n} 님, 반갑습니다`,
    profile: "내 프로필",
    name: "이름",
    phone: "연락처",
    email: "이메일",
    marketing: "마케팅 정보 수신에 동의합니다",
    save: "저장",
    saved: "저장되었습니다",
    saving: "저장 중…",
    logout: "로그아웃",
    bookings: "내 예약",
    bookingsEmpty: "아직 예약 내역이 없습니다. (로그인 후 예약하면 이곳에서 확인하실 수 있습니다)",
    inquiries: "내 문의",
    inquiriesEmpty: "등록된 문의가 없습니다.",
    providerLabel: { kakao: "카카오 로그인", google: "구글 로그인", naver: "네이버 로그인" },
    joined: "가입일",
  },
  en: {
    greeting: (n) => `Welcome, ${n}`,
    profile: "My Profile",
    name: "Name",
    phone: "Phone",
    email: "Email",
    marketing: "I agree to receive marketing updates",
    save: "Save",
    saved: "Saved",
    saving: "Saving…",
    logout: "Sign out",
    bookings: "My Bookings",
    bookingsEmpty: "No bookings yet. Your bookings will appear here.",
    inquiries: "My Inquiries",
    inquiriesEmpty: "No inquiries yet.",
    providerLabel: { kakao: "Kakao login", google: "Google login", naver: "Naver login" },
    joined: "Joined",
  },
  ja: {
    greeting: (n) => `${n}さん、ようこそ`,
    profile: "マイプロフィール",
    name: "名前",
    phone: "電話番号",
    email: "メール",
    marketing: "マーケティング情報の受信に同意する",
    save: "保存",
    saved: "保存しました",
    saving: "保存中…",
    logout: "ログアウト",
    bookings: "予約履歴",
    bookingsEmpty: "予約履歴はありません。",
    inquiries: "お問い合わせ履歴",
    inquiriesEmpty: "お問い合わせはありません。",
    providerLabel: { kakao: "Kakaoログイン", google: "Googleログイン", naver: "Naverログイン" },
    joined: "登録日",
  },
  "zh-CN": {
    greeting: (n) => `欢迎,${n}`,
    profile: "我的资料",
    name: "姓名",
    phone: "电话",
    email: "邮箱",
    marketing: "同意接收营销信息",
    save: "保存",
    saved: "已保存",
    saving: "保存中…",
    logout: "登出",
    bookings: "我的预约",
    bookingsEmpty: "暂无预约记录。",
    inquiries: "我的咨询",
    inquiriesEmpty: "暂无咨询记录。",
    providerLabel: { kakao: "Kakao 登录", google: "Google 登录", naver: "Naver 登录" },
    joined: "注册日期",
  },
  "zh-TW": {
    greeting: (n) => `歡迎,${n}`,
    profile: "我的資料",
    name: "姓名",
    phone: "電話",
    email: "電郵",
    marketing: "同意接收行銷訊息",
    save: "儲存",
    saved: "已儲存",
    saving: "儲存中…",
    logout: "登出",
    bookings: "我的預約",
    bookingsEmpty: "尚無預約紀錄。",
    inquiries: "我的諮詢",
    inquiriesEmpty: "尚無諮詢紀錄。",
    providerLabel: { kakao: "Kakao 登入", google: "Google 登入", naver: "Naver 登入" },
    joined: "註冊日期",
  },
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("ko-KR");
  } catch {
    return "-";
  }
}

export default function MyPagePanel({ locale, visitor }: { locale: string; visitor: Visitor }) {
  const t = COPY[locale] ?? COPY.ko;
  const [name, setName] = useState(visitor.name);
  const [phone, setPhone] = useState(visitor.phone ?? "");
  const [marketing, setMarketing] = useState(!!visitor.marketingAgree);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/visitor/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, marketingAgree: marketing }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "save failed");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-14">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-200">
          {visitor.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={visitor.profileImage}
              alt={visitor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-slate-500" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{t.greeting(visitor.name)}</h1>
          <p className="text-xs text-slate-500">
            {t.providerLabel[visitor.provider] ?? visitor.provider} · {t.joined}{" "}
            {formatDate(visitor.createdAt)}
          </p>
        </div>
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: `/${locale}` })}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t.profile}</h2>
          <div className="mt-4 space-y-3">
            <Field label={t.name}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </Field>
            <Field label={t.email}>
              <input
                value={visitor.email ?? ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              />
            </Field>
            <Field label={t.phone}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </Field>
            <label className="flex items-center gap-2 pt-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="h-4 w-4"
              />
              {t.marketing}
            </label>
            <div className="flex items-center justify-end gap-3 pt-2">
              {status === "saved" ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {t.saved}
                </span>
              ) : null}
              <button
                onClick={save}
                disabled={status === "saving" || !name}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {status === "saving" ? t.saving : t.save}
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">{t.bookings}</h2>
            <p className="mt-3 text-sm text-slate-500">{t.bookingsEmpty}</p>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">{t.inquiries}</h2>
            <p className="mt-3 text-sm text-slate-500">{t.inquiriesEmpty}</p>
          </section>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}
