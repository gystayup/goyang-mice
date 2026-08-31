// components/dmc/MovePrep.tsx
// GOYANG MOVE 준비물 섹션 (오더 #A6).
//
// 배치: /dmc/move 최상단, 방향 토글(#A5) 위. 방향과 무관하게 항상 노출.
// 서버 컴포넌트 (내부에 client 인 KoCopyButton 만 삽입).
//
// 렌더 순서 (원문 렌더 규칙 2):
//   일러스트 → 제목 → 한 줄 → 단계 또는 정보표 → 주의 박스 → 한국어 원문 카드
//
// 일러스트:
//   원문 규칙 3에 따라 currentColor SVG 를 골드로 렌더. Next Image 로는
//   currentColor 제어가 불가하므로 fs.readFileSync 로 SVG 원문을 읽어
//   dangerouslySetInnerHTML 로 인라인. 파일 부재 시 렌더 생략 (오더 #A6 [0][2]).

import { existsSync, readFileSync } from "fs";
import path from "path";

import { KoCopyButton } from "@/components/dmc/KoCopyButton";
import { dmcMoveData, type MoveLocale, type PrepBlock } from "@/data/dmc-move";

const COPY_LABEL: Record<MoveLocale, string> = {
  ko: "복사",
  en: "Copy",
  ja: "コピー",
  "zh-CN": "复制",
  "zh-TW": "複製",
};
const COPIED_LABEL: Record<MoveLocale, string> = {
  ko: "복사됨",
  en: "Copied",
  ja: "コピーしました",
  "zh-CN": "已复制",
  "zh-TW": "已複製",
};

/** SVG 파일 (public 하위 상대경로) → 인라인 SVG 문자열. 부재 시 null. */
function loadIllustration(publicRelPath: string): string | null {
  try {
    const clean = publicRelPath.replace(/^\/+/, "");
    const abs = path.join(process.cwd(), "public", clean);
    if (!existsSync(abs)) return null;
    const svg = readFileSync(abs, "utf8");
    // 파일이 실제로 SVG 인지 최소 검증.
    if (!svg.trim().toLowerCase().startsWith("<svg")) return null;
    return svg;
  } catch {
    return null;
  }
}

export function MovePrep({ locale }: { locale: MoveLocale }) {
  const { prep } = dmcMoveData;

  return (
    <section className="mx-auto max-w-4xl px-6 pt-8">
      {/* 섹션 헤더 */}
      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
        {prep.eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-[#232322] sm:text-3xl">
        {prep.title[locale]}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#232322]/85">
        {prep.lead[locale]}
      </p>

      {/* 블록 2개 (데스크톱 2열 · 모바일 1열) */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {prep.blocks.map((block) => (
          <PrepBlockCard key={block.id} block={block} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function PrepBlockCard({
  block,
  locale,
}: {
  block: PrepBlock;
  locale: MoveLocale;
}) {
  const illustSvg = block.illustration
    ? loadIllustration(block.illustration)
    : null;
  const rows = (block.infoRows ?? []).filter((r) => r.value !== null);

  return (
    <article className="flex flex-col gap-6 border border-[#232322]/15 p-6 sm:p-8">
      {/* 일러스트 — 파일이 있고 SVG 일 때만 렌더 (오더 #A6 [2]).
          currentColor 사용을 위해 인라인 삽입, color: #D4AF37. */}
      {illustSvg && (
        <div
          aria-hidden="true"
          className="inline-block h-12 w-12 text-[#D4AF37] [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: illustSvg }}
        />
      )}

      {/* 제목 · 한 줄 */}
      <header>
        <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#232322] sm:text-2xl">
          {block.title[locale]}
        </h3>
        <p className="mt-2 text-sm text-[#232322]/70">
          {block.oneline[locale]}
        </p>
      </header>

      {/* 단계 (블록 1 T-money) */}
      {block.steps && block.steps.length > 0 && (
        <ol className="space-y-4">
          {block.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] text-xs font-black text-[#D4AF37]">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#232322]">
                  {s.label[locale]}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[#232322]/85">
                  {s.body[locale]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* 정보표 (블록 2 SIM) — value === null row 는 필터링됨 */}
      {rows.length > 0 && (
        <dl className="divide-y divide-[#232322]/15 border-y border-[#232322]/15">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4"
            >
              <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#232322]/60">
                {r.label[locale]}
              </dt>
              <dd className="text-sm text-[#232322]">{r.value?.[locale]}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* 주의 박스 — 좌측 3px 골드 보더 + 어두운 배경 (원문 규칙 4) */}
      <p className="border-l-[3px] border-[#D4AF37] bg-[#232322]/[0.04] px-4 py-3 text-sm leading-relaxed text-[#232322]/85">
        {block.notice[locale]}
      </p>

      {/* 한국어 원문 카드 — KoCopyButton 재사용 (원문 규칙 5) */}
      <div className="border border-[#232322]/20 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            {block.koCard.label[locale]}
          </div>
          <KoCopyButton
            text={block.koCard.sentenceKo}
            label={COPY_LABEL[locale]}
            copiedLabel={COPIED_LABEL[locale]}
          />
        </div>
        <p className="mt-3 text-lg font-black leading-tight text-[#232322] sm:text-xl">
          {block.koCard.sentenceKo}
        </p>
      </div>
    </article>
  );
}
