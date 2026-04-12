import { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

interface ShellProps {
  children: ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="relative min-h-screen bg-transparent text-slate-900">
      {/* 전체 배경 고정 장식 글로우 (스크롤과 무관하게 위치) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* 좌상단 민트 글로우 */}
        <div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #8df0cf 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        {/* 우상단 스카이 글로우 */}
        <div
          className="absolute -right-24 top-0 h-[420px] w-[420px] rounded-full opacity-28"
          style={{ background: "radial-gradient(circle, #a4d8ff 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        {/* 중앙 퍼플 포인트 */}
        <div
          className="absolute left-1/2 top-[40vh] h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-14"
          style={{ background: "radial-gradient(circle, #c4aaff 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        {/* 하단 피치 글로우 */}
        <div
          className="absolute -bottom-24 right-1/4 h-[380px] w-[380px] rounded-full opacity-22"
          style={{ background: "radial-gradient(circle, #ffb58f 0%, transparent 70%)", filter: "blur(70px)" }}
        />
      </div>

      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
