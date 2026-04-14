import { NextResponse } from "next/server";

import type { ServiceCatalogCategory, ServiceCatalogItem } from "@/data/service-catalog";
import {
  addServiceCatalogItem,
  deleteServiceCatalogItem,
  readServiceCatalog,
  updateServiceCatalogItem,
} from "@/lib/service-catalog-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATEGORIES: ServiceCatalogCategory[] = ["tour", "stay", "restaurant", "cafe"];

function isValidCategory(v: unknown): v is ServiceCatalogCategory {
  return VALID_CATEGORIES.includes(v as ServiceCatalogCategory);
}

// GET — 전체 카탈로그 조회
export async function GET() {
  try {
    const catalog = await readServiceCatalog();
    return NextResponse.json({ success: true, data: catalog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST — 상품 추가
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      category: ServiceCatalogCategory;
      item: ServiceCatalogItem;
    };
    if (!isValidCategory(body.category)) {
      return NextResponse.json(
        { success: false, error: "올바른 카테고리를 입력해주세요." },
        { status: 400 }
      );
    }
    if (!body.item?.id || !body.item?.title) {
      return NextResponse.json(
        { success: false, error: "id와 title은 필수입니다." },
        { status: 400 }
      );
    }
    const catalog = await addServiceCatalogItem(body.category, body.item);
    return NextResponse.json({ success: true, data: catalog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// PUT — 상품 수정
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      category: ServiceCatalogCategory;
      item: ServiceCatalogItem;
    };
    if (!isValidCategory(body.category)) {
      return NextResponse.json(
        { success: false, error: "올바른 카테고리를 입력해주세요." },
        { status: 400 }
      );
    }
    const catalog = await updateServiceCatalogItem(body.category, body.item);
    return NextResponse.json({ success: true, data: catalog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE — 상품 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");
    if (!isValidCategory(category) || !id) {
      return NextResponse.json(
        { success: false, error: "category와 id가 필요합니다." },
        { status: 400 }
      );
    }
    const catalog = await deleteServiceCatalogItem(category, id);
    return NextResponse.json({ success: true, data: catalog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
