// app/api/story/route.ts — 오더 #C83 [1]-A.
//
// Gemini 2.5 Flash Image (Nano Banana) image-to-image 변환. 최소 버전:
// 사진 1장 + style 문자열 입력 → 화풍 변환된 base64 데이터 URL 반환.
//
// 환경변수: GEMINI_API_KEY (Vercel 등록됨, 서버에서만 사용, 클라이언트 노출 금지).
// 라이브러리 없음 — fetch·formData 표준 API 만 사용.

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB — Gemini 인라인 데이터 상한 여유

// 오더 #C83 [1]-A: style 별 프롬프트. 지금은 sketch 만. 확장 시 추가.
const STYLE_PROMPTS: Record<string, string> = {
  sketch:
    "Transform this photo into a delicate pencil sketch / line drawing, hand-drawn travel-journal style, keeping the scene recognizable.",
};

type GeminiInlineData = { mime_type?: string; mimeType?: string; data: string };
type GeminiPart = { text?: string; inline_data?: GeminiInlineData; inlineData?: GeminiInlineData };
type GeminiCandidate = { content?: { parts?: GeminiPart[] } };
type GeminiResponse = {
  candidates?: GeminiCandidate[];
  promptFeedback?: { blockReason?: string; safetyRatings?: unknown };
  error?: { message?: string };
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Story: GEMINI_API_KEY not configured");
    return NextResponse.json(
      { success: false, error: "이미지 변환 서비스가 준비되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const style = ((formData.get("style") as string) || "sketch").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "사진을 선택해 주세요." },
        { status: 400 }
      );
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "JPG · PNG · WEBP 이미지만 지원합니다." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "이미지 크기는 20MB 이하여야 합니다." },
        { status: 400 }
      );
    }
    const prompt = STYLE_PROMPTS[style];
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: `지원하지 않는 화풍입니다: ${style}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inline_data: { mime_type: file.type, data: base64 } },
                { text: prompt },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Story: Gemini HTTP", geminiRes.status, errText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "이미지 변환에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    const json = (await geminiRes.json()) as GeminiResponse;

    if (json.promptFeedback?.blockReason) {
      console.error("Story: Gemini blocked", json.promptFeedback);
      return NextResponse.json(
        { success: false, error: "이 사진은 변환할 수 없습니다. 다른 사진을 시도해 주세요." },
        { status: 400 }
      );
    }

    const parts = json.candidates?.[0]?.content?.parts ?? [];
    let outMime = "image/png";
    let outData: string | null = null;
    for (const p of parts) {
      const inline = p.inline_data ?? p.inlineData;
      if (inline?.data) {
        outMime = inline.mime_type ?? inline.mimeType ?? outMime;
        outData = inline.data;
        break;
      }
    }
    if (!outData) {
      console.error("Story: Gemini response has no inline image", JSON.stringify(json).slice(0, 500));
      return NextResponse.json(
        { success: false, error: "이미지 변환 결과를 받지 못했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:${outMime};base64,${outData}`,
    });
  } catch (err) {
    console.error("Story: unexpected error", err);
    return NextResponse.json(
      { success: false, error: "이미지 변환 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
