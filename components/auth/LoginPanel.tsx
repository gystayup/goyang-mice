"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type LoginCopy = {
  title: string;
  subtitle: string;
  kakao: string;
  google: string;
  naver: string;
  errorGeneric: string;
  terms: string;
};

const COPY: Record<string, LoginCopy> = {
  ko: {
    title: "간편 로그인",
    subtitle: "아래 버튼으로 3초 만에 로그인하세요",
    kakao: "카카오로 시작하기",
    google: "구글로 시작하기",
    naver: "네이버로 시작하기",
    errorGeneric: "로그인에 실패했습니다. 다시 시도해 주세요.",
    terms: "로그인하면 이용약관 및 개인정보 처리방침에 동의하게 됩니다.",
  },
  en: {
    title: "Quick Sign-in",
    subtitle: "Sign in with one click using the buttons below",
    kakao: "Continue with Kakao",
    google: "Continue with Google",
    naver: "Continue with Naver",
    errorGeneric: "Sign-in failed. Please try again.",
    terms: "By signing in, you agree to the Terms and Privacy Policy.",
  },
  ja: {
    title: "かんたんログイン",
    subtitle: "下のボタンで3秒ログイン",
    kakao: "Kakaoで続ける",
    google: "Googleで続ける",
    naver: "Naverで続ける",
    errorGeneric: "ログインに失敗しました。もう一度お試しください。",
    terms: "ログインすると利用規約とプライバシーポリシーに同意したものとみなされます。",
  },
  "zh-CN": {
    title: "便捷登录",
    subtitle: "使用以下按钮快速登录",
    kakao: "使用 Kakao 登录",
    google: "使用 Google 登录",
    naver: "使用 Naver 登录",
    errorGeneric: "登录失败,请重试。",
    terms: "登录即表示同意服务条款和隐私政策。",
  },
  "zh-TW": {
    title: "便捷登入",
    subtitle: "使用下方按鈕快速登入",
    kakao: "使用 Kakao 登入",
    google: "使用 Google 登入",
    naver: "使用 Naver 登入",
    errorGeneric: "登入失敗,請重試。",
    terms: "登入即表示同意服務條款和隱私權政策。",
  },
};

export default function LoginPanel({
  locale,
  callbackUrl,
  error,
}: {
  locale: string;
  callbackUrl?: string;
  error?: string;
}) {
  const copy = COPY[locale] ?? COPY.ko;
  const [busy, setBusy] = useState<string | null>(null);

  const go = async (provider: "kakao" | "google" | "naver") => {
    setBusy(provider);
    try {
      await signIn(provider, {
        callbackUrl: callbackUrl ?? `/${locale}/mypage`,
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{copy.subtitle}</p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {copy.errorGeneric}
          </div>
        ) : null}

        <div className="mt-8 space-y-3">
          <button
            onClick={() => go("kakao")}
            disabled={busy !== null}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-4 text-sm font-bold text-[#191919] transition hover:brightness-95 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.81 5.19 4.54 6.58L5.5 21l4.2-2.8c.75.12 1.52.18 2.3.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
            </svg>
            {busy === "kakao" ? "..." : copy.kakao}
          </button>

          <button
            onClick={() => go("google")}
            disabled={busy !== null}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
                fill="#EA4335"
              />
            </svg>
            {busy === "google" ? "..." : copy.google}
          </button>

          <button
            onClick={() => go("naver")}
            disabled={busy !== null}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#03C75A] px-4 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
            </svg>
            {busy === "naver" ? "..." : copy.naver}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">{copy.terms}</p>
      </div>
    </section>
  );
}
