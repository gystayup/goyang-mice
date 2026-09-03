"use client";

import { signOut, useSession } from "next-auth/react";
import { LogIn, User } from "lucide-react";
import { useState } from "react";

import { Link } from "@/lib/navigation";

type Copy = {
  login: string;
  mypage: string;
  logout: string;
  hello: string;
};

const COPY: Record<string, Copy> = {
  ko: { login: "로그인", mypage: "마이페이지", logout: "로그아웃", hello: "안녕하세요" },
  en: { login: "Sign in", mypage: "My page", logout: "Sign out", hello: "Hello" },
  ja: { login: "ログイン", mypage: "マイページ", logout: "ログアウト", hello: "こんにちは" },
  "zh-CN": { login: "登录", mypage: "我的", logout: "登出", hello: "您好" },
  "zh-TW": { login: "登入", mypage: "我的", logout: "登出", hello: "您好" },
};

export default function HeaderUserMenu({ locale }: { locale: string }) {
  const { data: session, status } = useSession();
  const t = COPY[locale] ?? COPY.ko;
  const [open, setOpen] = useState(false);

  const user = session?.user as
    | { name?: string | null; image?: string | null; kind?: "admin" | "visitor" }
    | undefined;

  const isVisitor = status === "authenticated" && user?.kind === "visitor";

  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 md:h-9 md:w-9" aria-hidden />;
  }

  if (!isVisitor) {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 w-8 items-center justify-center gap-1.5 rounded-full bg-[var(--accent)] text-xs font-bold text-white transition hover:brightness-110 md:h-9 md:w-auto md:px-3"
        aria-label={t.login}
      >
        <LogIn className="h-3.5 w-3.5" />
        <span className="hidden md:inline">{t.login}</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-1.5 text-xs font-semibold text-[var(--charcoal)] transition hover:bg-slate-50 md:h-9 md:gap-2 md:px-2"
      >
        <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <User className="h-3.5 w-3.5 text-slate-500" />
          )}
        </span>
        <span className="hidden max-w-[90px] truncate lg:inline">
          {user?.name ?? t.hello}
        </span>
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-11 z-50 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.15)]">
            <Link
              href="/mypage"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[var(--accent)]"
            >
              {t.mypage}
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                signOut({ redirect: true, callbackUrl: `/${locale}` });
              }}
              className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[var(--accent)]"
            >
              {t.logout}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
