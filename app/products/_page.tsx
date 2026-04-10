import type { Metadata } from "next";

import SectionTitle from "@/components/common/SectionTitle";
import Shell from "@/components/layout/Shell";
import ProductCatalog from "@/components/products/ProductCatalog";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

function getProductsCopy(locale: PageLocale) {
  const map: Record<PageLocale, { metadata: { title: string; description: string }; section: { eyebrow: string; title: string; desc: string } }> = {
    ko: {
      metadata: { title: "서비스 예약", description: "고양의 여행상품, 숙박, 음식점, 라이프스타일, 티켓, 공항픽업 예약 서비스를 한 곳에서 확인해보세요." },
      section: { eyebrow: "DMC Services", title: "DMC 서비스 프로그램 예약 플랫폼", desc: "인바운드 고객, 아웃바운드 고객 모두 공항에서부터 고양특례시의 거주와 생활까지 연결되는 서비스 구조로 구성했습니다." },
    },
    en: {
      metadata: { title: "Booking Services", description: "Explore DMC booking services in Goyang, from travel products and accommodation to dining, lifestyle, tickets, and airport pickup." },
      section: { eyebrow: "DMC Services", title: "DMC reservation platform for connected visitor services", desc: "A connected booking platform that supports inbound and outbound visitors from airport arrival through stay, lifestyle, and local experiences in Goyang." },
    },
    ja: {
      metadata: { title: "サービス予約", description: "高陽の旅行商品、宿泊、飲食店、ライフスタイル、チケット、空港送迎の予約サービスを一カ所でご確認いただけます。" },
      section: { eyebrow: "DMC Services", title: "DMCサービスプログラム予約プラットフォーム", desc: "インバウンド・アウトバウンドのお客様どちらも、空港から高陽特例市での居住・生活まで繋がるサービス構造をご用意しています。" },
    },
    "zh-CN": {
      metadata: { title: "服务预约", description: "在一处查看高阳的旅游产品、住宿、餐厅、生活方式、票务及机场接送预约服务。" },
      section: { eyebrow: "DMC Services", title: "DMC服务项目预约平台", desc: "无论是入境还是出境客户，均可享受从机场到高阳特例市居住与生活的全方位连接服务结构。" },
    },
    "zh-TW": {
      metadata: { title: "服務預約", description: "在一處查看高陽的旅遊產品、住宿、餐廳、生活風格、票務及機場接送預約服務。" },
      section: { eyebrow: "DMC Services", title: "DMC服務方案預約平台", desc: "無論是入境還是出境客戶，均可享受從機場到高陽特例市居住與生活的全方位連結服務結構。" },
    },
  };
  return map[locale] ?? map.ko;
}

export const metadata: Metadata = {
  title: "서비스 예약",
  description:
    "고양의 여행상품, 숙박, 음식점, 라이프스타일, 티켓, 공항픽업 예약 서비스를 한 곳에서 확인해보세요.",
  alternates: {
    canonical: "/ko/products",
  },
};

export default function ProductsPage({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getProductsCopy(locale);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <SectionTitle
          eyebrow={copy.section.eyebrow}
          title={copy.section.title}
          desc={copy.section.desc}
        />

        <div className="mt-10">
          <ProductCatalog locale={locale} />
        </div>
      </div>
    </Shell>
  );
}
