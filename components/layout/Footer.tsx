"use client";

import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useLocale } from "next-intl";

import { type LocaleKey, navigation, navigationLabels } from "@/data/navigation";
import { Link } from "@/lib/navigation";

const policyLinks: Record<"ko" | "en", Array<{ label: string; href: string }>> = {
  ko: [
    { label: "개인정보 처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
  en: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

const focusItems = {
  ko: [
    "공연과 전시를 체류형 방문 프로그램으로 연결하는 기획",
    "로컬 체험, 쇼핑, 미식이 이어지는 방문 동선 설계",
    "VIP, 단체, 바이어 방문객을 위한 운영 시나리오 구성",
    "연구 기반 브랜드와 현장 실행을 잇는 프로젝트 기획",
  ],
  en: [
    "Programs that connect performances and exhibitions to longer stays",
    "Visitor journeys that combine local experiences, shopping and dining",
    "Operational scenarios for VIP, group and buyer visits",
    "Projects that connect research, branding and field execution",
  ],
} as const;

const copyMap = {
  ko: {
    badge: "고양 MICE 플랫폼",
    title: "고양의 문화, 관광, MICE, 로컬 라이프스타일을 연결하는 도시 플랫폼",
    desc: "연구, 기획, 예약, 운영, 체류 경험을 하나의 DMC 구조로 연결해 고양 방문 경험을 설계합니다.",
    navigate: "바로가기",
    focus: "주요 영역",
    collaborate: "협력 제안",
    collaborateDesc:
      "행사 운영, 연구 프로젝트, 로컬 프로그램, 제휴 제안까지 필요한 내용을 보내주시면 상황에 맞는 구조로 정리해 드립니다.",
    cta: "제안 보내기",
    location: "경기도 고양시 · 일산 권역 · KINTEX 연계 거점",
  },
  en: {
    badge: "Goyang MICE Platform",
    title: "A city platform connecting culture, tourism, MICE and local lifestyle in Goyang",
    desc: "We connect research, planning, bookings, operations and stay experiences in one DMC structure built for Goyang.",
    navigate: "Navigate",
    focus: "Focus",
    collaborate: "Collaborate",
    collaborateDesc:
      "Share your event, research, local program or partnership goals and we will help shape the right structure.",
    cta: "Send Proposal",
    location: "Goyang, Gyeonggi-do · Ilsan district · KINTEX linked zone",
  },
} as const;

export default function Footer() {
  const locale = useLocale();
  const activeLocale: LocaleKey = locale === "en" ? "en" : "ko";
  const copy = copyMap[activeLocale];
  const policies = policyLinks[activeLocale];
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-24 pt-10 sm:px-5 lg:px-6 lg:pb-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#10203a] text-slate-300 shadow-[0_22px_60px_rgba(16,32,58,0.18)]">
        <div className="grid gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full bg-[linear-gradient(135deg,_#8df0cf,_#ffe98b)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-950">
              {copy.badge}
            </div>
            <h2 className="mt-4 text-[1.45rem] font-black leading-[1.18] tracking-[-0.04em] text-white sm:text-[1.7rem]">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{copy.desc}</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{copy.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                <span>031-000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <span>contact@goyangmice.kr</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fff0b0]">
              {copy.navigate}
            </div>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                    {navigationLabels[activeLocale][item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fff0b0]">
              {copy.focus}
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-400">
              {focusItems[activeLocale].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#fff0b0]">
              {copy.collaborate}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">{copy.collaborateDesc}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {copy.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>© {year} Goyang MICE Platform. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            {policies.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
