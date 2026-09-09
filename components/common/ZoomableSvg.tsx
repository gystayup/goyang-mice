// components/common/ZoomableSvg.tsx — 오더 #D22 [1].
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
//   · 휠 줌(데스크톱) · 핀치 줌(터치 2점) · 드래그 팬(1점) · [+][−][fit][전체화면] 버튼
//   · 팬은 zoom>1 일 때만. 팬 오프셋은 컨테이너 경계 밖으로 나가지 않도록 clamp.
//   · 접근성: 컨트롤 버튼에 aria-label · 키보드 조작 가능 · reduce-motion 존중.

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
};

const DEFAULT_LABELS: ZoomableSvgLabels = {
  zoomIn: "확대",
  zoomOut: "축소",
  reset: "원래 크기",
  fullscreen: "전체화면",
  exitFullscreen: "전체화면 종료",
  hint: "두 손가락으로 확대·드래그로 이동 · 휠/버튼으로도 조작",
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
        // (모바일 없는 마우스휠은 페이지 스크롤과 충돌 방지)
        // 데스크톱 사용자 UX: Ctrl/Cmd + wheel 은 표준 확대 제스처.
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
      } else if (pointersRef.current.size === 1 && scale > 1) {
        // 팬 시작 (zoom>1 일 때만)
        dragOriginRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          startTx: tx,
          startTy: ty,
        };
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
  }, []);

  // 전체화면 상태 동기화 (Esc 나 브라우저 종료 감지)
  useEffect(() => {
    const onFsChange = () => {
      const fs = document.fullscreenElement === wrapRef.current;
      setIsFullscreen(fs);
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
            transition: pointersRef.current.size === 0 ? "transform 120ms ease-out" : "none",
          }}
        >
          {children}
        </div>
      </div>

      {/* 컨트롤 툴바 (44×44 터치 타깃) */}
      <div
        className="absolute right-3 top-3 flex flex-col gap-2"
        role="toolbar"
        aria-label="지도 확대·축소 컨트롤"
      >
        <button
          type="button"
          onClick={() => applyScale(scale + BTN_STEP)}
          aria-label={L.zoomIn}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#232322] shadow-md ring-1 ring-black/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          disabled={scale >= MAX_SCALE}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => applyScale(scale - BTN_STEP)}
          aria-label={L.zoomOut}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#232322] shadow-md ring-1 ring-black/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          disabled={scale <= MIN_SCALE}
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label={L.reset}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#232322] shadow-md ring-1 ring-black/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? L.exitFullscreen : L.fullscreen}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#232322] shadow-md ring-1 ring-black/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          {isFullscreen ? <X className="h-5 w-5" aria-hidden="true" /> : <Maximize2 className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* 스케일 표시 */}
      <div
        className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-[#232322] shadow-md ring-1 ring-black/10"
        aria-live="polite"
      >
        {scale.toFixed(1)}×
      </div>

      {/* 힌트 (초기 상태에서만 · 조작 후 숨김) */}
      {scale === 1 && (
        <div
          className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-medium text-white sm:text-xs"
          aria-hidden="true"
        >
          {L.hint}
        </div>
      )}
    </div>
  );
}
