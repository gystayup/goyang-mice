import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TABS = ["payments", "schedules", "stay", "airport", "ticketing", "news"];

function getFilePath(tab: string) {
  const dir = path.join(process.cwd(), "data", "admin");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${tab}.json`);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tab: string }> }
) {
  const { tab } = await params;
  if (!ALLOWED_TABS.includes(tab)) {
    return NextResponse.json({ success: false, error: "Invalid tab" }, { status: 400 });
  }
  try {
    const filePath = getFilePath(tab);
    if (!fs.existsSync(filePath)) return NextResponse.json({ success: true, data: [] });
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Read error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tab: string }> }
) {
  const { tab } = await params;
  if (!ALLOWED_TABS.includes(tab)) {
    return NextResponse.json({ success: false, error: "Invalid tab" }, { status: 400 });
  }
  try {
    const body = await req.json();
    fs.writeFileSync(getFilePath(tab), JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Write error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tab: string }> }
) {
  const { tab } = await params;
  if (!ALLOWED_TABS.includes(tab)) {
    return NextResponse.json({ success: false, error: "Invalid tab" }, { status: 400 });
  }
  try {
    const item = await req.json();
    const filePath = getFilePath(tab);
    const existing: Record<string, unknown>[] = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];
    const updated = existing.map((r) => (r.id === item.id ? { ...r, ...item } : r));
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf8");
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: "Update error" }, { status: 500 });
  }
}
