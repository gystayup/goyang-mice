import type { Metadata } from "next";
import { Mail, MapPinned, Phone } from "lucide-react";

import Shell from "@/components/layout/Shell";

import ContactForm from "./contact-form";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

function getContactCopy(locale: PageLocale) {
  if (locale === "en") {
    return {
      metadata: {
        title: "Contact",
        description:
          "Send us inquiries about DMC services, reservation structures, research collaboration, and operational setup in Goyang.",
      },
      hero: {
        eyebrow: "Contact",
        title: "Tell us what you need.",
        desc:
          "Whether you need research collaboration, DMC service planning, booking setup, or operational support, we will connect you with the right structure.",
      },
      info: {
        eyebrow: "Contact Info",
        title: "Need a quick response?",
        desc:
          "You can leave a simple inquiry with your contact details. If you include goals, expected schedule, required categories, and payment or operation needs, we can respond more clearly.",
        items: [
          { icon: Phone, label: "Phone", value: "031-000-0000" },
          { icon: Mail, label: "Email", value: "contact@goyangmice.kr" },
          {
            icon: MapPinned,
            label: "Coverage",
            value: "Goyang citywide, KINTEX area, performance venues, tourism districts",
          },
        ],
      },
    };
  }

  if (locale === "ja") {
    return {
      metadata: {
        title: "お問い合わせ",
        description:
          "DMCサービス、予約システム、研究協力、運営構築に関するお問い合わせを受け付けております。",
      },
      hero: {
        eyebrow: "Contact",
        title: "お問い合わせ内容をお聞かせください。",
        desc:
          "研究協力、DMCサービス設計、予約システム構築、運営サポートなど、必要な内容をお知らせいただければ、最適な形でご連絡いたします。",
      },
      info: {
        eyebrow: "Contact Info",
        title: "お急ぎのご相談はこちら",
        desc:
          "簡単なお問い合わせと連絡先をお送りいただいても構いません。目的、予定日程、必要なサービスカテゴリ、運営・決済要件などを記載いただくと、より正確にご案内できます。",
        items: [
          { icon: Phone, label: "電話", value: "031-000-0000" },
          { icon: Mail, label: "メール", value: "contact@goyangmice.kr" },
          {
            icon: MapPinned,
            label: "対応エリア",
            value: "高陽市全域、KINTEXエリア、公演場、観光特区、ローカル拠点",
          },
        ],
      },
    };
  }

  if (locale === "zh-CN") {
    return {
      metadata: {
        title: "联系我们",
        description:
          "欢迎就DMC服务、预约系统、研究合作及运营建设等事宜进行咨询。",
      },
      hero: {
        eyebrow: "Contact",
        title: "欢迎留下您的咨询内容。",
        desc:
          "无论是研究合作、DMC服务规划、预约系统搭建还是运营支持，请留下您的需求，我们将以最合适的方式为您对接。",
      },
      info: {
        eyebrow: "Contact Info",
        title: "需要快速咨询？",
        desc:
          "您可以直接留下简单的问题和联系方式。如能提供目标、预期日程、所需服务类别及运营·支付需求，我们将为您提供更精准的解答。",
        items: [
          { icon: Phone, label: "电话", value: "031-000-0000" },
          { icon: Mail, label: "邮箱", value: "contact@goyangmice.kr" },
          {
            icon: MapPinned,
            label: "服务范围",
            value: "高阳市全域、KINTEX区域、演出场馆、旅游特区、本地据点",
          },
        ],
      },
    };
  }

  if (locale === "zh-TW") {
    return {
      metadata: {
        title: "聯絡我們",
        description:
          "歡迎就DMC服務、預約系統、研究合作及營運建設等事宜進行諮詢。",
      },
      hero: {
        eyebrow: "Contact",
        title: "歡迎留下您的諮詢內容。",
        desc:
          "無論是研究合作、DMC服務規劃、預約系統建置還是營運支援，請留下您的需求，我們將以最合適的方式為您對接。",
      },
      info: {
        eyebrow: "Contact Info",
        title: "需要快速諮詢？",
        desc:
          "您可以直接留下簡單的問題和聯絡方式。如能提供目標、預期行程、所需服務類別及營運·支付需求，我們將為您提供更精準的解答。",
        items: [
          { icon: Phone, label: "電話", value: "031-000-0000" },
          { icon: Mail, label: "電子郵件", value: "contact@goyangmice.kr" },
          {
            icon: MapPinned,
            label: "服務範圍",
            value: "高陽市全域、KINTEX區域、演出場館、觀光特區、在地據點",
          },
        ],
      },
    };
  }

  return {
    metadata: {
      title: "문의하기",
      description:
        "연구 협력, DMC 서비스, 예약 구조, 운영 구축 등에 대한 문의를 접수합니다.",
    },
    hero: {
      eyebrow: "Contact",
      title: "문의 내용을 남겨주세요.",
      desc:
        "연구 협력, DMC 서비스 설계, 예약 구조, 운영 구축 등 필요한 내용을 남겨주시면 목적에 맞는 방식으로 연결해 드립니다.",
    },
    info: {
      eyebrow: "Contact Info",
      title: "빠른 상담이 필요하신가요?",
      desc:
        "간단한 문의와 연락처를 남겨 주셔도 좋고, 목표와 일정, 필요한 서비스 카테고리, 운영·결제 요구사항까지 함께 적어 주시면 더 정확하게 안내해 드릴 수 있습니다.",
      items: [
        { icon: Phone, label: "전화", value: "031-000-0000" },
        { icon: Mail, label: "이메일", value: "contact@goyangmice.kr" },
        {
          icon: MapPinned,
          label: "운영 권역",
          value: "고양시 전역, KINTEX 권역, 공연장, 관광특구, 로컬 거점",
        },
      ],
    },
  };
}

export const metadata: Metadata = {
  title: "문의하기",
  description: "연구 협력, DMC 서비스, 예약 구조, 운영 구축 등에 대한 문의를 접수합니다.",
  alternates: {
    canonical: "/ko/contact",
  },
};

export default function ContactPage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getContactCopy(locale);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="border-b border-slate-200 pb-10">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            {copy.hero.eyebrow}
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">
            {copy.hero.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {copy.hero.desc}
          </p>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] bg-slate-950 p-8 text-white shadow-soft">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              {copy.info.eyebrow}
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight">
              {copy.info.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{copy.info.desc}</p>

            <div className="mt-8 space-y-4">
              {copy.info.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {item.label}
                        </div>
                        <div className="mt-2 text-sm leading-7 text-slate-200">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <ContactForm locale={locale} />
        </section>
      </div>
    </Shell>
  );
}
