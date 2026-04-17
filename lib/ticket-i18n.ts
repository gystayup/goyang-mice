import type { TicketLocale, TicketProduct } from "@/data/ticket-booking";

export function getLocalizedTicketProduct(ticket: TicketProduct, locale: string): TicketProduct {
  if (locale === "ko" || !ticket.translations) return ticket;
  const t = ticket.translations[locale as TicketLocale];
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
