import { ArrowRight, MessageSquareText } from "lucide-react";

import { Link } from "@/lib/navigation";

const copyMap = {
  ko: {
    bookings: "예약 시작",
    contact: "문의하기",
  },
  en: {
    bookings: "Start Booking",
    contact: "Contact",
  },
} as const;

export default async function MobileQuickActions({ locale }: { locale: string }) {
  const copy = copyMap[locale === "en" ? "en" : "ko"];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 lg:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 rounded-[24px] border border-white/80 bg-white/92 p-3 shadow-[0_18px_45px_rgba(16,32,58,0.16)] backdrop-blur-xl">
        <Link
          href="/products"
          className="pointer-events-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white"
        >
          {copy.bookings}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/contact"
          className="pointer-events-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700"
        >
          {copy.contact}
          <MessageSquareText className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
