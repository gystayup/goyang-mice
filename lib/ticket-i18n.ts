import { ticketProducts as staticTickets } from "@/data/ticket-booking";
import type { TicketLocale, TicketProduct } from "@/data/ticket-booking";

export function getLocalizedTicketProduct(ticket: TicketProduct, locale: string): TicketProduct {
  if (locale === "ko") return ticket;

  // 항상 static 데이터에서 번역을 직접 찾음 (DB 데이터 여부와 무관)
  const staticMatch = staticTickets.find((s) => s.id === ticket.id);
  const translations = staticMatch?.translations ?? ticket.translations;

  if (!translations) return ticket;
  const t = translations[locale as TicketLocale];
  if (!t) return ticket;

  const result = { ...ticket };
  if (t.badge) result.badge = t.badge;
  if (t.venue) result.venue = t.venue;
  if (t.tags) result.tags = t.tags;
  if (t.options && t.options.length > 0) {
    result.options = ticket.options.map((opt) => {
      const tOpt = t.options!.find((o) => o.id === opt.id);
      if (!tOpt) return opt;
      return { ...opt, label: tOpt.label ?? opt.label, benefits: tOpt.benefits ?? opt.benefits };
    });
  }
  return result;
}
