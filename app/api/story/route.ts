// app/api/story/route.ts — 오더 #D05 [1]-A.
//
// 텍스트 스토리 생성 (9/9 포럼 시연용). 사진 1장 + 매장명 → AI 텍스트 스토리
// {title, body, tags[]} JSON 반환. 매장명은 본문에 반드시 1회 이상 포함.
//
// 모델: gemini-2.5-flash (텍스트). 이미지 생성 모델 사용 금지 (과금·속도).
// C83 화풍 변환 로직은 시연 후 재검토 (오더 지시 "화풍/이미지 변환 전부 제외").
//
// 환경변수: GEMINI_API_KEY (Production 체크 필수). 서버에서만 사용, 클라이언트 노출 금지.

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB (오더 지시)

type GeminiPart = { text?: string };
type GeminiCandidate = { content?: { parts?: GeminiPart[] } };
type GeminiResponse = {
  candidates?: GeminiCandidate[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

type StoryPayload = { title: string; body: string; tags: string[] };

/** 프롬프트 규칙 (PRD 4.3 준수). */
function buildPrompt(store: string): string {
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

function parseModelJson(text: string): StoryPayload | null {
  // 코드 펜스 · 주변 텍스트 방어. 첫 { 부터 마지막 } 까지 추출.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  const jsonStr = text.slice(start, end + 1);
  try {
    const obj = JSON.parse(jsonStr) as Partial<StoryPayload>;
    if (typeof obj.title !== "string" || typeof obj.body !== "string") return null;
    const tags = Array.isArray(obj.tags)
      ? obj.tags.filter((t): t is string => typeof t === "string").slice(0, 8)
      : [];
    return { title: obj.title.trim(), body: obj.body.trim(), tags };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Story: GEMINI_API_KEY not configured");
    return NextResponse.json(
      {
        success: false,
        error: "AI 스토리 서비스가 준비되지 않았습니다. 관리자에게 문의해 주세요.",
      },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const storeRaw = (formData.get("store") as string) || "";
    const store = storeRaw.trim() || "고양";

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
        { success: false, error: "사진 크기는 10MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const prompt = buildPrompt(store);

    // 25초 타임아웃 방어 (사용자 30초 이내 목표, 오더 [2] "무한 로딩 금지")
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    let geminiRes: Response;
    try {
      geminiRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { inline_data: { mime_type: file.type, data: base64 } },
                  { text: prompt },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
              responseMimeType: "application/json",
            },
          }),
        }
      );
    } catch (fetchErr) {
      clearTimeout(timeout);
      if ((fetchErr as { name?: string }).name === "AbortError") {
        return NextResponse.json(
          { success: false, error: "AI 응답이 오래 걸립니다. 다시 시도해 주세요." },
          { status: 504 }
        );
      }
      throw fetchErr;
    }
    clearTimeout(timeout);

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Story: Gemini HTTP", geminiRes.status, errText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "AI 스토리 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    const json = (await geminiRes.json()) as GeminiResponse;

    if (json.promptFeedback?.blockReason) {
      console.error("Story: Gemini blocked", json.promptFeedback);
      return NextResponse.json(
        { success: false, error: "이 사진으로는 스토리를 만들 수 없습니다. 다른 사진을 시도해 주세요." },
        { status: 400 }
      );
    }

    const rawText = (json.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    const parsed = parseModelJson(rawText);
    if (!parsed) {
      console.error("Story: could not parse model JSON", rawText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "AI 응답 형식을 이해하지 못했습니다. 다시 시도해 주세요." },
        { status: 502 }
      );
    }

    // 매장명 미포함 방어 — 프롬프트 지시했지만 미준수 시 후처리로 삽입.
    let body = parsed.body;
    if (!body.includes(store)) {
      body = `${store}. ${body}`;
    }
    // 본문 길이 하한 방어
    if (body.length < 40) {
      return NextResponse.json(
        { success: false, error: "AI 응답이 너무 짧습니다. 다시 시도해 주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      store,
      title: parsed.title.slice(0, 40),
      body: body.slice(0, 300),
      tags: parsed.tags.slice(0, 5),
    });
  } catch (err) {
    console.error("Story: unexpected error", err);
    return NextResponse.json(
      { success: false, error: "스토리 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
