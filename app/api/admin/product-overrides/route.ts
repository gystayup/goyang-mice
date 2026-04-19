import { NextResponse } from "next/server";

import {
  deleteProductOverride,
  readProductOverrides,
  writeProductOverride,
  type ProductOverrideData,
} from "@/lib/product-overrides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readProductOverrides();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("product-overrides GET error:", error);
    return NextResponse.json(
      { success: false, error: "상품 편집 내역을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      productKey?: string;
      overrides?: ProductOverrideData;
    };
    if (!body?.productKey || typeof body.productKey !== "string") {
      return NextResponse.json(
        { success: false, error: "productKey 가 필요합니다." },
        { status: 400 }
      );
    }
    const overrides = body.overrides ?? {};
    const saved = await writeProductOverride(body.productKey, overrides);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("product-overrides PUT error:", error);
    return NextResponse.json(
      { success: false, error: "상품 편집 내역 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productKey = searchParams.get("productKey");
    if (!productKey) {
      return NextResponse.json(
        { success: false, error: "productKey 쿼리 파라미터가 필요합니다." },
        { status: 400 }
      );
    }
    await deleteProductOverride(productKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("product-overrides DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "상품 편집 내역 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
