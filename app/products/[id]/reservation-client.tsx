"use client";

import { useState, useMemo } from "react";
import { Link } from "@/lib/navigation";
import {
  CalendarDays,
  Users,
  MapPinned,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";

const bookingDates = [
  "05.10 토", "05.11 일", "05.12 월", "05.13 화",
  "05.14 수", "05.15 목", "05.16 금", "05.17 토",
];

const bookingOptions = [
  { label: "기본 패키지", price: 85000 },
  { label: "프리미엄 패키지", price: 145000 },
  { label: "VIP 의전 포함", price: 280000 },
];

const includedItems = [
  "프로그램 전담 운영 인력",
  "기본 이동 동선 설계",
  "체험 프로그램 운영비",
  "기본 안내 자료 일체",
];

const cautionItems = [
  "일정 확정 후 세부 조정 가능",
  "단체 인원에 따라 금액 변동 가능",
  "우천 시 대체 일정 협의 가능",
  "VIP 일정은 별도 견적 적용",
];

const relatedProducts = [
  { title: "전시 연계 1박 숙박 패키지", href: "/products/business-stay" },
  { title: "VIP 의전 포함 프리미엄 프로그램", href: "/products/vip-package" },
  { title: "KINTEX 연계 시티투어 프로그램", href: "/products/city-tour" },
];

export default function ReservationClient() {
  const [selectedDate, setSelectedDate] = useState(bookingDates[2]);
  const [selectedOption, setSelectedOption] = useState(bookingOptions[1].label);
  const [guestCount, setGuestCount] = useState(12);

  const [form, setForm] = useState({
    org: "", name: "", phone: "", email: "", memo: "", agree: false,
  });

  const selectedPrice = useMemo(() => {
    return bookingOptions.find((o) => o.label === selectedOption)?.price ?? 0;
  }, [selectedOption]);

  const totalPrice = selectedPrice * guestCount;

  return (
    <div className="space-y-10">
      {/* 상세 + 예약 신청 */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* 왼쪽: 상품 상세 */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
          {/* 배지 + 제목 */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                체험 + 관광상품
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                예약 가능
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              고양 문화예술 반일 체험 코스
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              공연, 전시, 로컬 체험, 이동 동선을 결합한 반일형 프로그램입니다.
              기업 방문단, 국제회의 참가자, 팸투어 대상자에게 맞는 일정으로
              구성되며, 기본형과 프리미엄형으로 예약할 수 있습니다.
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: CalendarDays, label: "소요시간", value: "약 4시간" },
              { icon: Users, label: "예약인원", value: "10명 ~ 40명" },
              { icon: MapPinned, label: "출발장소", value: "KINTEX 또는 고양 주요 거점" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <div className="mt-3 text-base font-bold text-slate-950">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 날짜 선택 + 패키지 선택 */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Available Dates
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {bookingDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`rounded-2xl px-2 py-3 text-xs font-semibold transition ${
                      selectedDate === date
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Package Options
              </div>
              <div className="mt-4 space-y-3">
                {bookingOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedOption(option.label)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
                      selectedOption === option.label
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-sm font-bold">
                      ₩ {option.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 예약 신청 박스 */}
        <div className="rounded-[30px] bg-slate-950 p-8 text-white">
          <div className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Booking Summary
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight">예약 신청</h3>

          {/* 요약 */}
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
              <span className="text-slate-400">선택 날짜</span>
              <span className="ml-3 font-semibold">{selectedDate}</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
              <span className="text-slate-400">선택 패키지</span>
              <span className="ml-3 font-semibold">{selectedOption}</span>
            </div>
            {/* 인원 조절 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="text-sm text-slate-400">인원 수</div>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
                  className="rounded-xl border border-white/20 p-2 hover:bg-white/10 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[40px] text-center text-xl font-bold">
                  {guestCount}
                </span>
                <button
                  onClick={() => setGuestCount((n) => n + 1)}
                  className="rounded-xl border border-white/20 p-2 hover:bg-white/10 transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-400">명</span>
              </div>
            </div>
            {/* 예상 금액 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="text-sm text-slate-400">예상 금액</div>
              <div className="mt-2 text-2xl font-bold">
                ₩ {totalPrice.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                * 결제 연동 전 단계 — 예약 신청 후 담당자 확인 방식
              </div>
            </div>
          </div>

          {/* 신청 폼 */}
          <div className="mt-6 space-y-3">
            {(["기관명 / 단체명", "담당자명", "연락처", "이메일"] as const).map((field) => {
              const key = field === "기관명 / 단체명" ? "org"
                : field === "담당자명" ? "name"
                : field === "연락처" ? "phone"
                : "email";
              return (
                <input
                  key={field}
                  type={field === "이메일" ? "email" : field === "연락처" ? "tel" : "text"}
                  placeholder={field}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-white/30 focus:bg-white/10 transition"
                />
              );
            })}
            <textarea
              placeholder="추가 요청사항"
              rows={3}
              value={form.memo}
              onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-white/30 focus:bg-white/10 transition resize-none"
            />
          </div>

          {/* 동의 */}
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
              className="mt-0.5 h-4 w-4 shrink-0 accent-white"
            />
            <span className="text-sm leading-6 text-slate-300">
              개인정보 수집 및 이용, 예약 약관에 동의합니다.
            </span>
          </label>

          {/* 버튼 */}
          <button
            disabled={!form.agree}
            className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            예약 신청하기
          </button>
          <Link
            href="/contact"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            상담 후 예약하기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 포함 사항 + 연계 상품 */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Included
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            포함 사항 / 유의사항
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-700">포함 사항</div>
              <ul className="mt-3 space-y-2">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-700">유의사항</div>
              <ul className="mt-3 space-y-2">
                {cautionItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Recommended
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            연계 추천 상품
          </h3>
          <div className="mt-6 space-y-4">
            {relatedProducts.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <span className="text-sm font-medium text-slate-700">
                  {item.title}
                </span>
                <Link
                  href={item.href}
                  className="shrink-0 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  보기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
