// app/api/story/route.ts — 오더 #D06 [1].
//
// GOYANG STORY: 사진 1장 + 매장명 → 텍스트 스토리 + 화풍 변환 이미지 병렬 생성.
// Promise.allSettled 로 부분 실패 허용 (한 쪽 실패해도 다른 쪽은 반환).
//
// 진단 (D06 [0]):
//   · gemini-2.5-flash-image 모델은 responseModalities: ["Image"] 를
//     명시하지 않으면 이미지 반환 실패 → 500 (C83 500 원인 확정).
//   · gemini-2.5-flash 는 텍스트 전용, responseMimeType: "application/json" 강제.
//   · 모델 gemini-2.5-flash-image 는 2026-10-02 종료 예정 (아직 유효). 이후
//     교체 필요: gemini-3.1-flash-image-preview.
//
// 환경변수: GEMINI_API_KEY. 서버에서만 사용, 클라이언트 노출 금지.

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";
const IMAGE_PROMPT =
  "Transform this photo into a delicate pencil sketch / line drawing, hand-drawn travel-journal style, keeping the scene recognizable.";

type GeminiInline = { mime_type?: string; mimeType?: string; data: string };
type GeminiPart = { text?: string; inline_data?: GeminiInline; inlineData?: GeminiInline };
type GeminiResp = {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

type StoryPayload = { title: string; body: string; tags: string[] };

function buildTextPrompt(store: string): string {
  return `당신은 고양시 매장을 소개하는 여행 에디터입니다. 아래 규칙을 반드시 지켜 사진 속 장면과 매장을 짧은 스토리로 소개하세요.

[규칙]
- 매장명 "${store}"을(를) 본문에 반드시 1회 이상 자연스럽게 포함합니다.
- 본문(body)은 한국어 100~180자.
- 사진에서 확실치 않은 사실은 창작하지 않습니다 (음식 이름·인물·수치 추측 금지).
- "최고", "유일", "반드시" 같은 과장·최상급 표현 금지.
- 매장이 고양시 소재임을 문장 흐름 안에서 자연스럽게 드러냅니다 (예: "고양의 한 골목", "고양 정발산 인근" 등).
- 제목(title)은 12자 이내 한국어. 매장명이나 사진 핵심만.
- tags 는 사진과 매장에서 확실한 키워드 3~5개 (한국어 짧은 단어).

[출력]
아래 JSON 스키마로만 응답. 마크다운·코드펜스·설명 텍스트 금지.
{"title":"...","body":"...","tags":["...","..."]}`;
}

function parseTextJson(text: string): StoryPayload | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const obj = JSON.parse(text.slice(start, end + 1)) as Partial<StoryPayload>;
    if (typeof obj.title !== "string" || typeof obj.body !== "string") return null;
    const tags = Array.isArray(obj.tags)
      ? obj.tags.filter((t): t is string => typeof t === "string").slice(0, 5)
      : [];
    return { title: obj.title.trim(), body: obj.body.trim(), tags };
  } catch {
    return null;
  }
}

async function fetchGemini(model: string, body: unknown, apiKey: string, timeoutMs: number): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify(body),
      }
    );
  } finally {
    clearTimeout(t);
  }
}

async function callTextStory(
  apiKey: string,
  fileType: string,
  base64: string,
  store: string
): Promise<{ ok: true; data: StoryPayload } | { ok: false; error: string }> {
  try {
    const res = await fetchGemini(
      TEXT_MODEL,
      {
        contents: [
          {
            parts: [
              { inline_data: { mime_type: fileType, data: base64 } },
              { text: buildTextPrompt(store) },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
          responseMimeType: "application/json",
        },
      },
      apiKey,
      25_000
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Story:text HTTP", res.status, errText.slice(0, 500));
      return { ok: false, error: `AI 텍스트 생성 실패 (${res.status})` };
    }
    const json = (await res.json()) as GeminiResp;
    if (json.promptFeedback?.blockReason) {
      return { ok: false, error: "이 사진으로 스토리를 만들 수 없습니다." };
    }
    const raw = (json.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    const parsed = parseTextJson(raw);
    if (!parsed) {
      console.error("Story:text parse fail", raw.slice(0, 300));
      return { ok: false, error: "AI 응답 형식 오류" };
    }
    // 매장명 미포함 방어
    let body = parsed.body;
    if (!body.includes(store)) body = `${store}. ${body}`;
    if (body.length < 40) return { ok: false, error: "AI 응답이 너무 짧습니다." };
    return { ok: true, data: { title: parsed.title.slice(0, 40), body: body.slice(0, 300), tags: parsed.tags } };
  } catch (e) {
    const name = (e as { name?: string }).name;
    console.error("Story:text exception", e);
    if (name === "AbortError") return { ok: false, error: "AI 텍스트 응답 지연" };
    return { ok: false, error: "AI 텍스트 생성 오류" };
  }
}

async function callImageStyle(
  apiKey: string,
  fileType: string,
  base64: string
): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string }> {
  try {
    const res = await fetchGemini(
      IMAGE_MODEL,
      {
        contents: [
          {
            parts: [
              { inline_data: { mime_type: fileType, data: base64 } },
              { text: IMAGE_PROMPT },
            ],
          },
        ],
        // 오더 #D06 [0]-2/4 진단으로 확정: gemini-2.5-flash-image 는
        // responseModalities: ["Image"] 를 명시해야 이미지 반환.
        generationConfig: {
          responseModalities: ["Image"],
        },
      },
      apiKey,
      35_000
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Story:image HTTP", res.status, errText.slice(0, 500));
      return { ok: false, error: `이미지 변환 실패 (${res.status})` };
    }
    const json = (await res.json()) as GeminiResp;
    if (json.promptFeedback?.blockReason) {
      return { ok: false, error: "이 사진은 화풍 변환이 차단됐습니다." };
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
      console.error("Story:image no inline data", JSON.stringify(json).slice(0, 500));
      return { ok: false, error: "이미지 변환 결과 없음" };
    }
    return { ok: true, dataUrl: `data:${outMime};base64,${outData}` };
  } catch (e) {
    const name = (e as { name?: string }).name;
    console.error("Story:image exception", e);
    if (name === "AbortError") return { ok: false, error: "이미지 변환 응답 지연" };
    return { ok: false, error: "이미지 변환 오류" };
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "AI 스토리 서비스가 준비되지 않았습니다. 관리자에게 문의해 주세요." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const storeRaw = (formData.get("store") as string) || "";
    const store = storeRaw.trim() || "고양";

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "사진을 선택해 주세요." }, { status: 400 });
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "JPG · PNG · WEBP 이미지만 지원합니다." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "사진 크기는 10MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    // 텍스트·이미지 병렬 (부분 실패 허용, 오더 [3])
    const [textResult, imageResult] = await Promise.all([
      callTextStory(apiKey, file.type, base64, store),
      callImageStyle(apiKey, file.type, base64),
    ]);

    const body: {
      success: boolean;
      store: string;
      story: StoryPayload | null;
      image: string | null;
      storyError: string | null;
      imageError: string | null;
    } = {
      success: textResult.ok || imageResult.ok,
      store,
      story: textResult.ok ? textResult.data : null,
      image: imageResult.ok ? imageResult.dataUrl : null,
      storyError: textResult.ok ? null : textResult.error,
      imageError: imageResult.ok ? null : imageResult.error,
    };

    return NextResponse.json(body, {
      status: body.success ? 200 : 500,
    });
  } catch (err) {
    console.error("Story:unexpected", err);
    return NextResponse.json(
      { success: false, error: "스토리 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
