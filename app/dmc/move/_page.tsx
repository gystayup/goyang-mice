// /[locale]/dmc/move — GOYANG MOVE 상세 (오더 #A4).
//
// 서버 컴포넌트에서 헤더·데이터를 렌더하고, 탭 스위처는 클라이언트 컴포넌트
// (MoveTabs) 로 분리. URL 쿼리 ?from={key} 로 홈 GETTING HERE 진입 지원.

import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { MovePrep } from "@/components/dmc/MovePrep";
import { MoveTabs } from "@/components/dmc/MoveTabs";
import Shell from "@/components/layout/Shell";
import { ZoomableSvg } from "@/components/common/ZoomableSvg";
import {
  dmcMoveData,
  MOVE_LOCALES,
  type MoveLocale,
} from "@/data/dmc-move";
// 오더 #C54-B: admin Supabase 소스에서 spots fetch 후 MoveTabs(client) 에 props 주입.
import { loadSpots } from "@/lib/spot-catalog-db";

export type PageLocale = MoveLocale;

function toPageLocale(v: string): PageLocale {
  return (MOVE_LOCALES as string[]).includes(v) ? (v as PageLocale) : "ko";
}

// 오더 #C21: 대곡역 교통 개념도 SVG 5로케일 (서오릉·서삼릉 유네스코 포함본).
//   public/images/transit/daegok-access-map-{locale}.svg
//   PNG 배선 안 함. 로케일 SVG 없으면 ko 폴백.
const TRANSIT_MAP_ALT: Record<PageLocale, string> = {
  ko: "대곡역 중심 고양 교통 개념도 (GTX-A · 3호선 · 경의중앙선 · 서오릉·서삼릉 유네스코 세계유산 포함)",
  en: "Goyang transit concept map centered on Daegok Station (GTX-A · Line 3 · Gyeongui-Jungang Line · UNESCO Royal Tombs Seoreung·Samreung)",
  ja: "大谷駅を中心とする高陽の交通概念図 (GTX-A・3号線・京義中央線・ユネスコ世界遺産 西五陵・西三陵)",
  "zh-CN": "以大谷站为中心的高阳交通概念图 (GTX-A · 3号线 · 京义中央线 · 联合国教科文组织世界遗产 西五陵·西三陵)",
  "zh-TW": "以大谷站為中心的高陽交通概念圖 (GTX-A · 3號線 · 京義中央線 · 聯合國教科文組織世界遺產 西五陵·西三陵)",
};

const TRANSIT_MAP_CAPTION: Record<PageLocale, string> = {
  ko: "대곡역 교통 개념도 — GTX-A · 3호선 · 경의중앙선 · 서오릉·서삼릉 유네스코 세계유산",
  en: "Daegok Station transit concept map — GTX-A · Line 3 · Gyeongui-Jungang Line · UNESCO Royal Tombs",
  ja: "大谷駅の交通概念図 — GTX-A・3号線・京義中央線・ユネスコ世界遺産 王陵",
  "zh-CN": "大谷站交通概念图 — GTX-A · 3号线 · 京义中央线 · 联合国教科文组织世界遗产 王陵",
  "zh-TW": "大谷站交通概念圖 — GTX-A · 3號線 · 京義中央線 · 聯合國教科文組織世界遺產 王陵",
};

// 오더 #D22 [1]: ZoomableSvg 컨트롤 라벨 5로케일.
const ZOOM_LABELS: Record<
  PageLocale,
  {
    zoomIn: string;
    zoomOut: string;
    reset: string;
    fullscreen: string;
    exitFullscreen: string;
    hint: string;
  }
> = {
  ko: {
    zoomIn: "확대",
    zoomOut: "축소",
    reset: "원래 크기",
    fullscreen: "전체화면",
    exitFullscreen: "전체화면 종료",
    hint: "두 손가락으로 확대 · 드래그로 이동 · 휠·버튼으로도 조작",
  },
  en: {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    reset: "Reset",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    hint: "Pinch to zoom · drag to pan · scroll or use buttons",
  },
  ja: {
    zoomIn: "拡大",
    zoomOut: "縮小",
    reset: "リセット",
    fullscreen: "全画面",
    exitFullscreen: "全画面終了",
    hint: "二本指で拡大 · ドラッグで移動 · ホイール・ボタンでも操作",
  },
  "zh-CN": {
    zoomIn: "放大",
    zoomOut: "缩小",
    reset: "重置",
    fullscreen: "全屏",
    exitFullscreen: "退出全屏",
    hint: "双指缩放 · 拖动平移 · 也可用滚轮或按钮",
  },
  "zh-TW": {
    zoomIn: "放大",
    zoomOut: "縮小",
    reset: "重設",
    fullscreen: "全螢幕",
    exitFullscreen: "退出全螢幕",
    hint: "雙指縮放 · 拖動平移 · 也可用滾輪或按鈕",
  },
};

function transitMapSrc(locale: PageLocale): string {
  // 5로케일 SVG 파일이 모두 존재하지만, 코드는 로케일 스위치만 담당.
  return `/images/transit/daegok-access-map-${locale}.svg`;
}

export function getMoveMetadata(locale: PageLocale): Metadata {
  const { title, lead } = dmcMoveData.header;
  return {
    title: title[locale],
    description: lead[locale],
    alternates: {
      canonical: `/${locale}/dmc/move`,
    },
  };
}

export default async function DmcMovePage({
  locale = "ko",
}: {
  locale?: PageLocale;
}) {
  const active = toPageLocale(locale);
  const { header } = dmcMoveData;
  // 오더 #C54-B: spots 를 서버에서 admin Supabase 소스로 fetch (published !== false).
  const spots = await loadSpots();

  return (
    <Shell>
      <article className="bg-white text-[#232322]">
        {/* 페이지 헤더 */}
        <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {header.eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
            {header.title[active]}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#232322]/85 sm:text-lg">
            {header.lead[active]}
          </p>
        </section>

        {/* 오더 #C21: 대곡역 교통 개념도 — 로케일 연동 SVG. 반응형 · 저작권
            자체 제작 · 서오릉·서삼릉 유네스코 세계유산 포함본.
            오더 #D22 [1]: 모바일 가로 스크롤(min-w 900px)을 ZoomableSvg 로 대체.
              · 기본: 컨테이너 폭에 맞춰 축소 (가로 스크롤 0)
              · 확대: 핀치/휠/버튼, 팬, 전체화면 · 1x~4x · 원본 SVG 좌표 무터치
            SVG 자체 무수정 · 비율 유지 (aspectRatio 1700/1300). */}
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <figure>
            <ZoomableSvg
              aspectRatio="1700 / 1300"
              labels={ZOOM_LABELS[active]}
              ariaLabel={TRANSIT_MAP_ALT[active]}
            >
              <Image
                src={transitMapSrc(active)}
                alt={TRANSIT_MAP_ALT[active]}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                priority
                unoptimized
              />
            </ZoomableSvg>
            <figcaption className="mt-3 rounded-xl border border-[#232322]/10 bg-[#faf7f2] px-4 py-3 text-[11px] leading-relaxed text-[#232322]/70 sm:text-xs">
              {TRANSIT_MAP_CAPTION[active]}
            </figcaption>
          </figure>
        </section>

        {/* 준비물 섹션 (오더 #A6) — 방향 토글 위, 방향과 무관하게 항상 노출. */}
        <MovePrep locale={active} />

        {/* 방향 토글 + 탭/OUT 스위처 (클라이언트).
            useSearchParams 는 Suspense 안이어야 SSG 통과. */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <Suspense fallback={null}>
            <MoveTabs data={dmcMoveData} locale={active} spots={spots} />
          </Suspense>
        </section>
      </article>
    </Shell>
  );
}
