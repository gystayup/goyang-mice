// lib/client/resize-image.ts — 오더 #C70 [1]-A.
//
// 브라우저에서 업로드 전송 직전에 이미지를 canvas 로 리사이즈해 새 File 을
// 반환한다. Vercel 서버리스 본문 4.5MB 한도를 우회하는 목적. 라이브러리 추가
// 없이 브라우저 표준 (createImageBitmap · <canvas> · canvas.toBlob) 만 사용.
//
// 규칙:
//   · image/* 만 처리. 영상·PDF·비이미지는 원본 그대로 반환.
//   · image/gif 는 애니메이션 보존을 위해 원본 그대로 반환.
//   · 최대 변(가로/세로) 이 1600px 를 넘거나 파일 크기가 4MB 를 넘으면 축소.
//   · 원본이 PNG 이면 투명도 보존을 위해 PNG 유지, 그 외엔 JPEG(품질 0.82).
//   · JPEG 결과가 여전히 4MB 넘으면 품질 0.7 로 한 번 더 낮춰 재시도.
//   · 결과가 원본보다 크면 원본 반환 (안전).
//   · try/catch 실패 시 원본 반환 (리사이즈 실패해도 업로드는 시도).

const MAX_EDGE = 1600;
const TARGET_MAX_BYTES = 4 * 1024 * 1024; // 4MB
const JPEG_QUALITY_PRIMARY = 0.82;
const JPEG_QUALITY_FALLBACK = 0.7;

export async function resizeImageForUpload(file: File): Promise<File> {
  // 이미지가 아닌 파일 (영상·PDF) → 원본
  if (!file.type.startsWith("image/")) return file;
  // GIF 는 애니메이션 보존을 위해 원본 유지
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    const maxEdge = Math.max(width, height);
    // 이미 충분히 작으면 원본 그대로
    if (maxEdge <= MAX_EDGE && file.size <= TARGET_MAX_BYTES) {
      bitmap.close?.();
      return file;
    }

    const scale = maxEdge > MAX_EDGE ? MAX_EDGE / maxEdge : 1;
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close?.();

    // 원본이 PNG 이면 PNG 유지, 그 외엔 JPEG.
    const usePng = file.type === "image/png";
    const outMime = usePng ? "image/png" : "image/jpeg";

    let blob = await canvasToBlob(canvas, outMime, JPEG_QUALITY_PRIMARY);
    if (!blob) return file;

    // JPEG 만 재시도 (PNG 는 무손실이라 quality 무의미)
    if (!usePng && blob.size > TARGET_MAX_BYTES) {
      const retry = await canvasToBlob(canvas, outMime, JPEG_QUALITY_FALLBACK);
      if (retry && retry.size < blob.size) blob = retry;
    }

    // 결과가 원본보다 크면 원본 반환 (안전 · 예: 이미 최적화된 작은 이미지가
    // canvas 재인코딩으로 오히려 커지는 경우)
    if (blob.size >= file.size) return file;

    const baseName = stripExtension(file.name);
    const newExt = usePng ? "png" : "jpg";
    return new File([blob], `${baseName}.${newExt}`, {
      type: outMime,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), type, quality);
  });
}

function stripExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}
