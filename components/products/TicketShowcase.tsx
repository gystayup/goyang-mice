"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, MapPinned } from "lucide-react";

import type { Product } from "@/data/products";
import {
  getTicketProduct,
  ticketCategories,
  ticketProducts as staticTicketProducts,
  type TicketCategory,
  type TicketProduct,
} from "@/data/ticket-booking";
import { Link } from "@/lib/navigation";

const utilityMenus = ["랭킹", "오픈예정", "지역별", "공연장"];

export default function TicketShowcase({
  product,
  items: itemsProp,
}: {
  product: Product;
  items?: TicketProduct[];
}) {
  const allTickets = itemsProp ?? staticTicketProducts;
  const [activeCategory, setActiveCategory] = useState<TicketCategory | "all">("all");
  const [featuredTicketId, setFeaturedTicketId] = useState(allTickets[0]?.id ?? "");

  const filteredTickets = useMemo(() => {
    if (activeCategory === "all") return allTickets;
    return allTickets.filter((ticket) => ticket.category === activeCategory);
  }, [activeCategory, allTickets]);

  const featuredTicket =
    allTickets.find((t) => t.id === featuredTicketId) ?? getTicketProduct(featuredTicketId);

  return (
    <div className="mt-10 space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black tracking-tight text-sky-600">GOYANG</span>
              <span className="text-3xl font-black tracking-tight text-slate-950">ticket</span>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-500">
              공연, 전시, 체험 티켓을 빠르게 탐색해 보세요.
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 px-6 py-4 md:px-8">
          <div className="flex flex-wrap items-center gap-5 text-lg font-semibold text-slate-700">
            {ticketCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`transition ${
                  activeCategory === category.id
                    ? "text-slate-950 underline decoration-2 underline-offset-[14px]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 md:px-8">
          <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-500">
            {utilityMenus.map((menu) => (
              <span key={menu} className="cursor-default text-slate-500">
                {menu}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[linear-gradient(135deg,_#07122e_0%,_#0f172a_32%,_#4f46e5_72%,_#38bdf8_100%)] p-8 text-white md:p-10">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Ticket Platform
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              고양 티켓예약 플랫폼에서 공연, 전시, 체험을 한 번에 탐색합니다
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-100 md:text-base">
              NOL 인터파크처럼 카드형 상품을 4개씩 배치하고, 아래로 확장되는 구조로
              구성했습니다. 원하는 상품을 누르면 상세설명과 결제 예약 화면으로 바로
              이동합니다.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <MetricCard label="카드 구성" value="4열 상품 그리드" />
              <MetricCard label="예약 흐름" value="상품 - 상세 - 결제" />
              <MetricCard label="운영 방식" value="발권·결제 관리자 연동" />
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_100%)] p-8 md:p-10">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Featured Ticket
            </div>
            <div className="mt-4 rounded-[32px] border border-slate-200 bg-white p-6">
              {featuredTicket.imageUrl ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                  <Image src={featuredTicket.imageUrl} alt={featuredTicket.title} fill className="object-cover" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/70">{featuredTicket.badge}</div>
                    <div className="mt-1 text-2xl font-black leading-tight text-white">{featuredTicket.title}</div>
                  </div>
                </div>
              ) : (
                <div className={`aspect-[4/5] rounded-[28px] bg-gradient-to-br ${featuredTicket.imageTone} p-6 text-slate-950`}>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{featuredTicket.badge}</div>
                  <div className="mt-4 text-4xl font-black tracking-tight">{featuredTicket.posterLabel}</div>
                  <div className="mt-6 max-w-[12rem] text-2xl font-black leading-tight">{featuredTicket.title}</div>
                </div>
              )}
              <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                {featuredTicket.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {featuredTicket.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredTicket.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredTickets.map((ticketItem) => {
          const query = new URLSearchParams({ ticket: ticketItem.id });
          const minimumPrice = Math.min(...ticketItem.options.map((item) => item.price));

          return (
            <article
              key={ticketItem.id}
              className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl"
            >
              <button
                type="button"
                onClick={() => setFeaturedTicketId(ticketItem.id)}
                className="block w-full text-left"
              >
                {ticketItem.imageUrl ? (
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={ticketItem.imageUrl} alt={ticketItem.title} fill className="object-cover object-top" sizes="(max-width:768px) 50vw, 300px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/70">{ticketItem.badge}</div>
                      <div className="mt-1 text-xl font-black leading-tight text-white line-clamp-2">{ticketItem.title}</div>
                    </div>
                  </div>
                ) : (
                  <div className={`aspect-[4/5] bg-gradient-to-br ${ticketItem.imageTone} p-6 text-slate-950`}>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{ticketItem.badge}</div>
                    <div className="mt-6 text-4xl font-black tracking-tight">{ticketItem.posterLabel}</div>
                    <div className="mt-6 max-w-[12rem] text-2xl font-black leading-tight">{ticketItem.title}</div>
                  </div>
                )}
              </button>

              <div className="p-6">
                <div className="text-sm font-semibold text-slate-500">{ticketItem.subtitle}</div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {ticketItem.title}
                </h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-slate-400" />
                    <span>{ticketItem.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span>{ticketItem.dateText}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    최저가
                  </div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    {minimumPrice.toLocaleString("ko-KR")}원
                  </div>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    좌석 등급과 패키지에 따라 가격이 달라집니다.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {ticketItem.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/products/${product.id}/reservation?${query.toString()}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    상세 보기
                  </Link>
                  <Link
                    href={`/products/${product.id}/reservation?${query.toString()}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    예약
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] bg-white/12 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
        {label}
      </div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
    </div>
  );
}
