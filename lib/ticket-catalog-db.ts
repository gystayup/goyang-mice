import { createClient } from "@supabase/supabase-js";

import { ticketProducts as defaultTickets } from "@/data/ticket-booking";
import type { TicketProduct } from "@/data/ticket-booking";

const PAGE_KEY = "ticket-catalog";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

/** DB에서 티켓 목록 읽기. 없으면 기본 하드코딩 데이터 반환 */
export async function readTicketCatalog(): Promise<TicketProduct[]> {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("pages")
      .select("contentJson")
      .eq("pageKey", PAGE_KEY)
      .single();
    if (!data?.contentJson) return defaultTickets;
    // DB 데이터에 정적 translations 병합 (번역은 항상 코드 기준 적용)
    const dbTickets = data.contentJson as TicketProduct[];
    return dbTickets.map((dbTicket) => {
      const defaultTicket = defaultTickets.find((t) => t.id === dbTicket.id);
      if (!defaultTicket?.translations) return dbTicket;
      return { ...dbTicket, translations: defaultTicket.translations };
    });
  } catch {
    return defaultTickets;
  }
}

/** 티켓 목록 전체 저장 (upsert) */
export async function writeTicketCatalog(tickets: TicketProduct[]): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("pageKey", PAGE_KEY)
    .single();

  if (existing) {
    await supabase
      .from("pages")
      .update({ contentJson: tickets, updatedAt: new Date().toISOString() })
      .eq("pageKey", PAGE_KEY);
  } else {
    await supabase.from("pages").insert({
      id: crypto.randomUUID(),
      pageKey: PAGE_KEY,
      title: "Ticket Catalog",
      slug: PAGE_KEY,
      contentJson: tickets,
      status: "PUBLISHED",
      lang: "ko",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

/** 티켓 추가 */
export async function addTicketItem(item: TicketProduct): Promise<TicketProduct[]> {
  const tickets = await readTicketCatalog();
  const updated = [...tickets, item];
  await writeTicketCatalog(updated);
  return updated;
}

/** 티켓 수정 */
export async function updateTicketItem(item: TicketProduct): Promise<TicketProduct[]> {
  const tickets = await readTicketCatalog();
  const idx = tickets.findIndex((t) => t.id === item.id);
  if (idx === -1) throw new Error("티켓을 찾을 수 없습니다.");
  const updated = [...tickets];
  updated[idx] = item;
  await writeTicketCatalog(updated);
  return updated;
}

/** 티켓 삭제 */
export async function deleteTicketItem(id: string): Promise<TicketProduct[]> {
  const tickets = await readTicketCatalog();
  const updated = tickets.filter((t) => t.id !== id);
  await writeTicketCatalog(updated);
  return updated;
}
