// components/institute/ResearchArchive.tsx — 오더 #C53-R [1]-A.
//
// app/research/_page.tsx 의 아카이브 섹션을 그대로 이관한 클라이언트 컴포넌트.
// 데이터 소스(/api/admin/research-archives GET, /api/research-archives/download)
// 와 로그인 게이트·다운로드 동작은 원본 그대로 유지.
//
// 서버 컴포넌트인 app/institute/_page.tsx 안에서 렌더된다.
// (서버가 클라이언트 컴포넌트를 자식으로 렌더하는 것은 정상.)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Download, Lock } from "lucide-react";

import SectionTitle from "@/components/common/SectionTitle";

export type PageLocale = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type ArchiveCopy = {
  eyebrow: string;
  title: string;
  items: {
    issue: string;
    season: string;
    title: string;
    desc: string;
  }[];
};

function getArchiveCopy(locale: PageLocale): ArchiveCopy {
  if (locale === "en") {
    return {
      eyebrow: "Research Archive",
      title: "Research materials in one view",
      items: [
        { issue: "VOL.01", season: "2026 SPRING", title: "Goyang K-Culture Visitor Journey Study", desc: "A study organizing arrival, stay, and spending structures around performances and exhibitions." },
        { issue: "VOL.02", season: "2026 SUMMER", title: "Connected Stay Program Brief",           desc: "A brief outlining stay-based tourism programs linked to event districts and local places." },
        { issue: "VOL.03", season: "2026 FALL",   title: "Lifestyle City Strategy Memo",           desc: "A strategy note linking family experiences, cafes, dining, and shopping to city stay value." },
        { issue: "VOL.04", season: "2026 WINTER", title: "Operations Brief Archive",               desc: "A collection of operational materials connecting booking, schedules, partners, and field response." },
      ],
    };
  }
  if (locale === "ja") {
    return {
      eyebrow: "Research Archive",
      title: "研究資料とブリーフを一目で確認できます",
      items: [],
    };
  }
  if (locale === "zh-CN") {
    return {
      eyebrow: "Research Archive",
      title: "一站式浏览研究资料与简报",
      items: [],
    };
  }
  if (locale === "zh-TW") {
    return {
      eyebrow: "Research Archive",
      title: "一站式瀏覽研究資料與簡報",
      items: [],
    };
  }
  return {
    eyebrow: "Research Archive",
    title: "연구 자료와 브리프를 한눈에 볼 수 있습니다",
    items: [
      { issue: "VOL.01", season: "2026 SPRING", title: "고양 K-컬쳐 방문자 여정 연구",              desc: "공연과 전시를 중심으로 도착, 체류, 소비 흐름을 정리한 연구 자료입니다." },
      { issue: "VOL.02", season: "2026 SUMMER", title: "관광특구 연계 체류형 프로그램 브리프",     desc: "행사장과 관광특구, 로컬 공간을 연결하는 체류형 프로그램 구조를 정리했습니다." },
      { issue: "VOL.03", season: "2026 FALL",   title: "라이프스타일 도시 전략 메모",              desc: "가족 체험, 카페, 미식, 쇼핑을 포함한 고양형 라이프스타일 전략 메모입니다." },
      { issue: "VOL.04", season: "2026 WINTER", title: "현장 운영 실행 브리프 아카이브",           desc: "예약, 일정, 파트너 운영, 현장 대응까지 연결되는 실행 자료 모음입니다." },
    ],
  };
}

type DbArchiveItem = {
  id: string;
  title: string;
  summary: string | null;
  content: string;
};

type ArchiveCard = {
  id?: string;
  issue: string;
  season: string;
  title: string;
  desc: string;
  gradient?: string;
  posterUrl?: string;
  fileUrl?: string;
  fileName?: string;
  categoryTag?: string;
  authors?: string;
  publishDate?: string;
};

function parseDbItems(items: DbArchiveItem[]): ArchiveCard[] {
  return items.map((item) => {
    let meta: {
      issue?: string;
      season?: string;
      gradient?: string;
      posterUrl?: string;
      fileUrl?: string;
      fileName?: string;
      categoryTag?: string;
      authors?: string;
      publishDate?: string;
    } = {};
    try {
      meta = JSON.parse(item.content);
    } catch {
      /* ignore */
    }
    return {
      id: item.id,
      issue: meta.issue ?? "",
      season: meta.season ?? "",
      title: item.title,
      desc: item.summary ?? "",
      gradient: meta.gradient ?? "",
      posterUrl: meta.posterUrl ?? "",
      fileUrl: meta.fileUrl ?? "",
      fileName: meta.fileName ?? "",
      categoryTag: meta.categoryTag ?? "",
      authors: meta.authors ?? "",
      publishDate: meta.publishDate ?? "",
    };
  });
}

function getArchiveLabels(locale: PageLocale) {
  if (locale === "en") return { download: "Download", loginRequired: "Login to download", nonSale: "Not for sale" };
  if (locale === "ja") return { download: "ダウンロード", loginRequired: "ログイン後ダウンロード", nonSale: "非売品" };
  if (locale === "zh-CN") return { download: "下载", loginRequired: "登录后下载", nonSale: "非卖品" };
  if (locale === "zh-TW") return { download: "下載", loginRequired: "登入後下載", nonSale: "非賣品" };
  return { download: "다운로드", loginRequired: "로그인 후 다운로드", nonSale: "비매품" };
}

export default function ResearchArchive({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getArchiveCopy(locale);
  const labels = getArchiveLabels(locale);
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session?.user;
  const [dbArchiveItems, setDbArchiveItems] = useState<ArchiveCard[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/research-archives")
      .then((r) => r.json())
      .then((data: { success: boolean; data: DbArchiveItem[] }) => {
        if (data.success && data.data.length > 0) {
          setDbArchiveItems(parseDbItems(data.data));
        }
      })
      .catch(() => {
        /* fallback to hardcoded */
      });
  }, []);

  const archiveItems: ArchiveCard[] = dbArchiveItems ?? copy.items;

  function handleDownload(item: ArchiveCard) {
    if (!item.id) return;
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(
        typeof window !== "undefined" ? window.location.href : "/institute"
      );
      router.push(`/admin/login?callbackUrl=${callbackUrl}`);
      return;
    }
    window.open(`/api/research-archives/download?id=${item.id}`, "_blank");
  }

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[#232322]/15 bg-white px-6 py-8 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#D4AF37]" />
      <SectionTitle eyebrow={copy.eyebrow} title={copy.title} />

      <div className="relative mt-6 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {archiveItems.map((item, idx) => {
          const hasPoster = !!item.posterUrl;
          const hasFile = !!item.fileUrl && !!item.id;
          return (
            <article
              key={item.id ?? `${item.issue}-${idx}`}
              className="group flex flex-col"
            >
              <button
                type="button"
                onClick={() => hasFile && handleDownload(item)}
                disabled={!hasFile}
                className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#232322]/15 ${
                  hasFile ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label={hasFile ? labels.download : item.title}
              >
                {hasPoster ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.posterUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col justify-end bg-white p-4 text-[#232322]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#232322]/60">{item.season}</div>
                    <div className="mt-1 text-2xl font-black tracking-[-0.03em]">{item.issue}</div>
                    <div className="mt-2 text-[10px] font-black leading-tight tracking-[-0.02em] text-[#232322]/70">
                      RESEARCH
                      <br />
                      ARCHIVE
                    </div>
                  </div>
                )}
              </button>

              <div className="mt-3 flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.categoryTag && (
                    <span className="rounded-md bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#232322]">
                      {item.categoryTag}
                    </span>
                  )}
                  {!item.categoryTag && item.issue && (
                    <span className="rounded-md bg-[#232322]/5 px-2 py-0.5 text-[10px] font-bold text-[#232322]/80">
                      {item.issue}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-black tracking-[-0.02em] text-[#232322] sm:text-[15px]">
                  {item.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px] text-[#232322]/60">
                  <span className="font-semibold text-[#232322]/80">{labels.nonSale}</span>
                  {item.publishDate && <span className="text-[#232322]/50">|</span>}
                  {item.publishDate && <span>{item.publishDate}</span>}
                </div>
                {item.authors && (
                  <p className="mt-1 line-clamp-1 text-[11px] text-[#232322]/70">{item.authors}</p>
                )}

                {hasFile && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#232322]/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#232322]/85 transition-colors hover:border-[#232322] hover:bg-[#232322] hover:text-white"
                    >
                      {isLoggedIn ? (
                        <>
                          <Download className="h-3 w-3" />
                          {labels.download}
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          {labels.loginRequired}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
