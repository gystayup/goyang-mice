// components/common/ZoomableSvg.tsx — 오더 #D22 [1] · #D22-2 개선.
//
// 대형 SVG(교통 개념도·밤리단길 지도 등)를 컨테이너 폭에 맞춰 축소 표시하고,
// 사용자가 확대·팬·전체화면으로 판독할 수 있게 하는 뷰어.
//
// 규범:
//   · 기본은 fit-to-container (aspectRatio 로 세로 자동 · 가로 스크롤 0)
//   · CSS transform (scale + translate) 만 사용 · 원본 SVG/이미지 좌표 무터치
//   · 신규 라이브러리 없음 (React + PointerEvents + Fullscreen API)
//   · 컨트롤 버튼 44×44px (터치 타깃 준수)
//   · 줌 범위 1x~4x · 초과 요청은 clamp
//   · 휠 줌(데스크톱, Ctrl/Cmd+wheel) · 핀치 줌(touch) · 드래그 팬(1점) ·
//     [+][−][fit][전체화면] 버튼
//   · 팬은 zoom>1 일 때만. 팬 오프셋은 컨테이너 경계 밖으로 나가지 않도록 clamp.
//   · 접근성: 컨트롤 버튼에 aria-label · 키보드 조작 가능 · reduce-motion 존중.
//
// 오더 #D22-2 개선:
//   · 컨트롤 툴바 z-index z-30 + 대비 강화 (다크 배경) — 채팅 위젯(우하단, z-40 이하)
//     과 겹치지 않도록 우상단 유지 + 스택 가시성 확보.
//   · 하단에 대형 "전체화면으로 지도 크게 보기" 프라이머리 CTA 를 항상 표시 →
//     사용자가 처음 열었을 때 여러 번 확대·이동 없이 전체 개념도를 한 화면으로
//     볼 수 있음.
//   · 전체화면 진입 시 scale/pan 을 초기화 (fit) — 전체 흐름을 한눈에.
//   · 전체화면 닫기 버튼을 크게 (텍스트 병기).

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const WHEEL_STEP = 0.15;
const BTN_STEP = 0.5;

export type ZoomableSvgLabels = {
  zoomIn: string;
  zoomOut: string;
  reset: string;
  fullscreen: string;
  exitFullscreen: string;
  hint: string;
  /** 하단 프라이머리 CTA — "전체화면으로 지도 크게 보기". */
  openFullscreenCta: string;
};

const DEFAULT_LABELS: ZoomableSvgLabels = {
  zoomIn: "확대",
  zoomOut: "축소",
  reset: "원래 크기",
  fullscreen: "전체화면",
  exitFullscreen: "닫기",
  hint: "두 손가락으로 확대·드래그로 이동 · 휠/버튼으로도 조작",
  openFullscreenCta: "전체화면으로 지도 크게 보기",
};

export function ZoomableSvg({
  children,
  aspectRatio,
  labels,
  className = "",
  contentClassName = "",
  ariaLabel,
}: {
  /** SVG 또는 <Image /> 등 렌더 가능한 요소. 내부에서 CSS transform 이 걸린다. */
  children: ReactNode;
  /** 컨테이너 aspect-ratio (예: "1700 / 1300"). 세로 자동 계산 · fit-to-width. */
  aspectRatio: string;
  labels?: Partial<ZoomableSvgLabels>;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
}) {
  const L = { ...DEFAULT_LABELS, ...(labels ?? {}) };
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // isInteracting: 드래그·핀치 중이면 true. 렌더 중 ref.current 접근 회피용.
  const [isInteracting, setIsInteracting] = useState(false);

  // 활성 포인터 추적 (핀치 지원)
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragOriginRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
  } | null>(null);
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);

  const clampPan = useCallback(
    (nextTx: number, nextTy: number, s: number) => {
      const wrap = wrapRef.current;
      if (!wrap) return { tx: nextTx, ty: nextTy };
      const rect = wrap.getBoundingClientRect();
      // scale>1 일 때만 팬 허용. 오프셋 절대값 상한 = ((s-1)/2) * 크기
      const maxX = Math.max(0, ((s - 1) * rect.width) / 2);
      const maxY = Math.max(0, ((s - 1) * rect.height) / 2);
      return {
        tx: Math.min(maxX, Math.max(-maxX, nextTx)),
        ty: Math.min(maxY, Math.max(-maxY, nextTy)),
      };
    },
    [],
  );

  const applyScale = useCallback(
    (nextScale: number) => {
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
      setScale(s);
      // 축소 시 clamp 위해 재계산
      const clamped = clampPan(tx, ty, s);
      setTx(clamped.tx);
      setTy(clamped.ty);
      if (s === 1) {
        setTx(0);
        setTy(0);
      }
    },
    [tx, ty, clampPan],
  );

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  const onWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        // 기본 페이지 스크롤 허용. Ctrl/Cmd/Alt + 휠일 때만 줌.
        return;
      }
      e.preventDefault();
      const delta = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP;
      applyScale(scale + delta);
    },
    [scale, applyScale],
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2) {
        // 핀치 시작
        const [p1, p2] = Array.from(pointersRef.current.values());
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        pinchStartRef.current = { dist, scale };
        dragOriginRef.current = null;
        setIsInteracting(true);
      } else if (pointersRef.current.size === 1 && scale > 1) {
        // 팬 시작 (zoom>1 일 때만)
        dragOriginRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          startTx: tx,
          startTy: ty,
        };
        setIsInteracting(true);
      }
    },
    [scale, tx, ty],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const [p1, p2] = Array.from(pointersRef.current.values());
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const ratio = dist / pinchStartRef.current.dist;
        applyScale(pinchStartRef.current.scale * ratio);
        return;
      }
      if (dragOriginRef.current && e.pointerId === dragOriginRef.current.pointerId) {
        const dx = e.clientX - dragOriginRef.current.startX;
        const dy = e.clientY - dragOriginRef.current.startY;
        const nextTx = dragOriginRef.current.startTx + dx;
        const nextTy = dragOriginRef.current.startTy + dy;
        const clamped = clampPan(nextTx, nextTy, scale);
        setTx(clamped.tx);
        setTy(clamped.ty);
      }
    },
    [applyScale, clampPan, scale],
  );

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (
      dragOriginRef.current &&
      dragOriginRef.current.pointerId === e.pointerId
    ) {
      dragOriginRef.current = null;
    }
    if (pointersRef.current.size === 0) {
      setIsInteracting(false);
    }
  }, []);

  // 전체화면 상태 동기화 (Esc 나 브라우저 종료 감지)
  useEffect(() => {
    const onFsChange = () => {
      const fs = document.fullscreenElement === wrapRef.current;
      setIsFullscreen(fs);
      if (fs) {
        // 오더 #D22-2 [2]: 전체화면 진입 시 fit 초기화 → 전체 흐름을 한눈에.
        setScale(1);
        setTx(0);
        setTy(0);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el.requestFullscreen) {
        // 오더 #D22-2 [2]: 진입 전에도 fit 상태로 (fullscreenchange 콜백 안 오는
        // iOS Safari 대비 이중 안전).
        setScale(1);
        setTx(0);
        setTy(0);
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen API 실패 시 조용히 무시 (iOS Safari 등)
    }
  }, []);

  const transform = useMemo(
    () => `translate(${tx}px, ${ty}px) scale(${scale})`,
    [tx, ty, scale],
  );

  // 오더 #D22-2 [1]: 채팅 위젯(우하단, 통상 z-40~50) 과 겹치지 않도록 우상단 배치.
  //   z-30 + 다크 배경으로 지도 위에서 항상 시인성 확보 (흰 지도 위 흰 버튼 회귀 방지).
  const ctrlBtnBase =
    "flex h-11 w-11 items-center justify-center rounded-full bg-[#232322] text-white shadow-lg ring-1 ring-white/20 transition hover:bg-[#0f0f0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      ref={wrapRef}
      className={
        "relative overflow-hidden bg-white select-none " +
        (isFullscreen ? "fixed inset-0 z-[100] rounded-none " : "rounded-2xl border border-[#232322]/10 ") +
        className
      }
      aria-label={ariaLabel}
      role="group"
    >
      <div
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          width: "100%",
          aspectRatio: isFullscreen ? undefined : aspectRatio,
          height: isFullscreen ? "100%" : undefined,
          touchAction: "none",
          cursor: scale > 1 ? "grab" : "default",
        }}
        className="relative overflow-hidden"
      >
        <div
          ref={contentRef}
          className={"absolute inset-0 origin-center will-change-transform " + contentClassName}
          style={{
            transform,
            transition: isInteracting ? "none" : "transform 120ms ease-out",
          }}
        >
          {children}
        </div>
      </div>

      {/* 컨트롤 툴바 (44×44 터치 타깃) — 우상단, z-30, 다크 대비 */}
      <div
        className="absolute right-3 top-3 z-30 flex flex-col gap-2"
        role="toolbar"
        aria-label="지도 확대·축소 컨트롤"
      >
        <button
          type="button"
          onClick={() => applyScale(scale + BTN_STEP)}
          aria-label={L.zoomIn}
          className={ctrlBtnBase}
          disabled={scale >= MAX_SCALE}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyScale(scale - BTN_STEP)}
          aria-label={L.zoomOut}
          className={ctrlBtnBase}
          disabled={scale <= MIN_SCALE}
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label={L.reset}
          className={ctrlBtnBase}
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? L.exitFullscreen : L.fullscreen}
          className={ctrlBtnBase}
        >
          {isFullscreen ? <X className="h-5 w-5" aria-hidden="true" /> : <Maximize2 className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* 스케일 표시 — 좌상단, z-30 */}
      <div
        className="pointer-events-none absolute left-3 top-3 z-30 rounded-full bg-[#232322] px-3 py-1 text-[11px] font-bold tracking-wider text-white shadow-lg ring-1 ring-white/20"
        aria-live="polite"
      >
        {scale.toFixed(1)}×
      </div>

      {/* 오더 #D22-2 [1][3]: 하단 프라이머리 CTA — "전체화면으로 지도 크게 보기".
          전체화면이 아닐 때만 노출. 채팅 위젯(우하단) 과 겹치지 않도록 좌측 정렬. */}
      {!isFullscreen && (
        <div className="absolute inset-x-0 bottom-3 z-30 flex justify-start px-3 sm:justify-center">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#D4AF37] px-5 text-sm font-black text-[#232322] shadow-lg ring-1 ring-black/10 transition hover:bg-[#c69f2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            <span>{L.openFullscreenCta}</span>
          </button>
        </div>
      )}

      {/* 전체화면 닫기 대형 버튼 — 우상단 툴바 옆에 텍스트 병기 */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={L.exitFullscreen}
          className="absolute left-3 top-3 z-30 inline-flex h-11 items-center gap-2 rounded-full bg-[#232322] px-4 text-sm font-black text-white shadow-lg ring-1 ring-white/20 hover:bg-[#0f0f0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
          <span>{L.exitFullscreen}</span>
        </button>
      )}

      {/* 힌트 (초기 상태에서만 · 조작 후 숨김) — 전체화면 중이면 상단, 아니면 감춤 */}
      {isFullscreen && scale === 1 && (
        <div
          className="pointer-events-none absolute inset-x-0 top-16 z-20 mx-auto flex justify-center"
          aria-hidden="true"
        >
          <span className="rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-medium text-white sm:text-xs">
            {L.hint}
          </span>
        </div>
      )}
    </div>
  );
}
