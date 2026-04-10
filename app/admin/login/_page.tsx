"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (result?.error) {
        setError(result.error || "로그인에 실패했습니다.");
        setIsLoading(false);
        return;
      }

      window.location.href = result?.url || "/admin";
    } catch (submitError) {
      console.error(submitError);
      setError("로그인 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">Goyang DMC</h1>
          <p className="text-slate-400">관리자 로그인</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                <Mail className="mr-2 inline h-4 w-4" />
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@goyangmice.kr"
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                <Lock className="mr-2 inline h-4 w-4" />
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              <p className="mb-1 font-medium">테스트 계정</p>
              <p>이메일: admin@goyangmice.kr</p>
              <p>비밀번호: admin123</p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          © 2026 Goyang DMC. All rights reserved.
        </p>
      </div>
    </div>
  );
}
