"use client";

import React, { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BedDouble,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  MonitorPlay,
  Newspaper,
  Package,
  Plane,
  Settings,
  Share2,
  Ticket,
  User,
  Users,
} from "lucide-react";

import type {
  ApiResponse,
  Booking,
  Inquiry,
  User as AdminUser,
} from "@/lib/database";

import AdminUsersPanel from "./AdminUsersPanel";
import AirportTransferAdminPanel from "./AirportTransferAdminPanel";
import DmcCategoryMediaPanel from "./DmcCategoryMediaPanel";
import DmcHeroMediaPanel from "./DmcHeroMediaPanel";
import MediaUploadButton from "./MediaUploadButton";
import ProductManagementPanel from "./ProductManagementPanel";
import HeroSlidesPanel from "./HeroSlidesPanel";
import NewsPanel from "./NewsPanel";
import ResearchArchivePanel from "./ResearchArchivePanel";
import ServiceCatalogPanel from "./ServiceCatalogPanel";
import SocialLinksPanel from "./SocialLinksPanel";
import TicketingAdminPanel from "./TicketingAdminPanel";
import {
  airportTransferStatusOrder,
  bookingStatusOrder,
  catalogProducts,
  createDemoBookings,
  createInitialAirportTransfers,
  createInitialNews,
  createInitialPayments,
  createInitialSchedules,
  createInitialStayOperations,
  createInitialTicketingRecords,
  dmcCategories,
  navItems,
  newsStatusOrder,
  paymentStatusOrder,
  productMap,
  scheduleStatusOrder,
  stayStatusOrder,
  ticketingStatusOrder,
  type AdminTab,
  type AirportTransferRecord,
  type NewsRecord,
  type NewsStatus,
  type PaymentRecord,
  type PaymentStatus,
  type ScheduleRecord,
  type ScheduleStatus,
  type StayOperationRecord,
  type StayOperationStatus,
  type TicketingRecord,
} from "./admin-data";

function formatDate(value?: string | Date) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

function formatDateTime(value?: string | Date) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR");
}

function formatCurrency(value?: number) {
  if (value == null) return "-";
  return `₩ ${value.toLocaleString("ko-KR")}`;
}

function cycleStatus<T extends string>(items: readonly T[], current: T) {
  const index = items.indexOf(current);
  return items[(index + 1) % items.length];
}

function getStatusClasses(status: string) {
  switch (status) {
    case "confirmed":
    case "paid":
    case "operating":
    case "completed":
    case "active":
    case "driver_assigned":
      return "bg-emerald-100 text-emerald-700";
    case "reviewing":
    case "deposit_paid":
    case "open":
    case "ready":
    case "quoted":
      return "bg-amber-100 text-amber-700";
    case "balance_due":
    case "pending_deposit":
    case "planned":
    case "rooming":
    case "check_in":
    case "check_out":
    case "boarding":
      return "bg-sky-100 text-sky-700";
    case "on_hold":
    case "refund_review":
    case "closed":
      return "bg-violet-100 text-violet-700";
    case "cancelled":
    case "inactive":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const bookingStatusLabel: Record<Booking["status"], string> = {
  received: "접수",
  reviewing: "검토 중",
  confirmed: "확정",
  on_hold: "보류",
  cancelled: "취소",
};

const newsStatusLabel: Record<NewsStatus, string> = {
  draft: "초안",
  scheduled: "발행 예정",
  published: "발행됨",
  archived: "보관됨",
};

const newsCategoryLabel: Record<string, string> = {
  announcement: "공지사항",
  event: "이벤트",
  research: "연구",
  press: "보도자료",
  operation: "운영",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending_deposit: "예약금 대기",
  deposit_paid: "예약금 완료",
  balance_due: "잔금 대기",
  paid: "완납",
  refund_review: "환불 검토",
};

const scheduleStatusLabel: Record<ScheduleStatus, string> = {
  planned: "계획",
  open: "오픈",
  operating: "운영 중",
  closed: "마감",
};

const stayStatusLabel: Record<StayOperationStatus, string> = {
  rooming: "룸 배정",
  ready: "운영 준비",
  check_in: "체크인",
  in_house: "투숙 중",
  check_out: "체크아웃",
  completed: "종료",
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(
    () => createInitialPayments()
  );
  const [scheduleRecords, setScheduleRecords] = useState<ScheduleRecord[]>(
    () => createInitialSchedules()
  );
  const [stayOperations, setStayOperations] = useState<StayOperationRecord[]>(
    () => createInitialStayOperations()
  );
  const [airportTransfers, setAirportTransfers] = useState<AirportTransferRecord[]>(
    () => createInitialAirportTransfers()
  );
  const [ticketingRecords, setTicketingRecords] = useState<TicketingRecord[]>(
    () => createInitialTicketingRecords()
  );
  const [newsRecords, setNewsRecords] = useState<NewsRecord[]>(
    () => createInitialNews()
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingsResponse, inquiriesResponse, usersResponse] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/inquiries"),
        fetch("/api/users"),
      ]);

      if (!bookingsResponse.ok || !inquiriesResponse.ok || !usersResponse.ok) {
        throw new Error("서버 응답 오류");
      }

      const bookingsResult = (await bookingsResponse.json()) as ApiResponse<Booking[]>;
      const inquiriesResult = (await inquiriesResponse.json()) as ApiResponse<Inquiry[]>;
      const usersResult = (await usersResponse.json()) as ApiResponse<AdminUser[]>;

      setBookings(bookingsResult.data ?? []);
      setInquiries(inquiriesResult.data ?? []);
      setUsers(usersResult.data ?? []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("서버 연결에 실패해 데모 운영 데이터로 표시합니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const bookingsForView = bookings.length > 0 ? bookings : createDemoBookings();

  const enrichedBookings = useMemo(
    () =>
      bookingsForView.map((booking) => {
        const product = productMap.get(booking.product_id);
        return {
          ...booking,
          productTitle: product?.title ?? "미등록 상품",
          categoryKey: product?.categoryKey ?? "tour",
          categoryLabel: product?.category ?? "기타",
        };
      }),
    [bookingsForView]
  );

  const filteredProducts = useMemo(
    () =>
      catalogProducts.filter((product) => {
        if (selectedCategory !== "all" && product.categoryKey !== selectedCategory) return false;
        if (selectedProductId !== "all" && product.id !== selectedProductId) return false;
        return true;
      }),
    [selectedCategory, selectedProductId]
  );

  const filteredPayments = useMemo(
    () =>
      paymentRecords.filter((payment) => {
        const product = productMap.get(payment.product_id);
        if (!product) return false;
        if (selectedCategory !== "all" && product.categoryKey !== selectedCategory) return false;
        if (selectedProductId !== "all" && payment.product_id !== selectedProductId) return false;
        return true;
      }),
    [paymentRecords, selectedCategory, selectedProductId]
  );

  const filteredSchedules = useMemo(
    () =>
      scheduleRecords.filter((schedule) => {
        const product = productMap.get(schedule.product_id);
        if (!product) return false;
        if (selectedCategory !== "all" && product.categoryKey !== selectedCategory) return false;
        if (selectedProductId !== "all" && schedule.product_id !== selectedProductId) return false;
        return true;
      }),
    [scheduleRecords, selectedCategory, selectedProductId]
  );

  const filteredStayOps = useMemo(
    () =>
      stayOperations.filter((item) => {
        const product = productMap.get(item.product_id);
        if (!product) return false;
        if (selectedCategory !== "all" && product.categoryKey !== selectedCategory) return false;
        if (selectedProductId !== "all" && item.product_id !== selectedProductId) return false;
        return true;
      }),
    [selectedCategory, selectedProductId, stayOperations]
  );

  const filteredAirportTransfers = useMemo(
    () =>
      airportTransfers.filter((item) => {
        const product = productMap.get(item.product_id);
        if (!product) return false;
        if (selectedCategory !== "all" && product.categoryKey !== selectedCategory) return false;
        if (selectedProductId !== "all" && item.product_id !== selectedProductId) return false;
        return true;
      }),
    [airportTransfers, selectedCategory, selectedProductId]
  );

  const filteredTicketingRecords = useMemo(
    () =>
      ticketingRecords.filter((item) => {
        const product = productMap.get(item.product_id);
        if (!product) return false;
        if (selectedCategory !== "all" && product.categoryKey !== selectedCategory) return false;
        if (selectedProductId !== "all" && item.product_id !== selectedProductId) return false;
        return true;
      }),
    [selectedCategory, selectedProductId, ticketingRecords]
  );

  const stats = useMemo(
    () => ({
      todayBookings: enrichedBookings.filter(
        (booking) =>
          new Date(booking.created_at) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      pendingPayments: paymentRecords.filter((payment) => payment.status !== "paid").length,
      schedules: scheduleRecords.length,
      airport: airportTransfers.filter((item) => item.status !== "completed").length,
    }),
    [airportTransfers, enrichedBookings, paymentRecords, scheduleRecords]
  );

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/admin/login" });
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="flex w-72 flex-col overflow-y-auto bg-slate-900 p-6 text-white xl:w-64">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">고양 DMC</h2>
          <p className="mt-1 text-xs text-slate-400">운영 관리 시스템</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const iconMap: Record<string, React.ElementType> = {
              dashboard: LayoutDashboard,
              bookings: FileText,
              airport: Plane,
              ticketing: Ticket,
              payments: CreditCard,
              schedules: CalendarDays,
              stay: BedDouble,
              products: Package,
              news: Newspaper,
              "research-archive": Newspaper,
              "hero-slides": MonitorPlay,
              "social-links": Share2,
              inquiries: Mail,
              users: Users,
              settings: Settings,
            };
            const Icon = iconMap[item.id] ?? LayoutDashboard;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                  activeTab === item.id
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-slate-700 pt-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {session?.user?.name || "관리자"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {session?.user?.email || "admin@goyangmice.kr"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {navItems.find((item) => item.id === activeTab)?.label}
              </h1>
              <p className="mt-2 text-slate-600">
                상품별 예약, 결제, 스케줄, 공항픽업, 숙박 운영 상태를 관리자 화면에서
                바로 확인하고 운영합니다.
              </p>
            </div>
            <button
              onClick={refreshAdminData}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300"
            >
              새로고침
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={selectedCategory === "all" && selectedProductId === "all"}
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedProductId("all");
                }}
              >
                전체 상품
              </FilterButton>
              {dmcCategories.map((category) => (
                <FilterButton
                  key={category.key}
                  active={selectedCategory === category.key}
                  onClick={() => {
                    setSelectedCategory(category.key);
                    setSelectedProductId("all");
                  }}
                >
                  {category.label}
                </FilterButton>
              ))}
            </div>

            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="all">전체 상품 보기</option>
              {catalogProducts
                .filter(
                  (product) =>
                    selectedCategory === "all" || product.categoryKey === selectedCategory
                )
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
            </select>
          </div>

          {error ? (
            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              관리자 데이터를 불러오는 중입니다...
            </div>
          ) : null}

          {!loading && activeTab === "dashboard" ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-6 xl:grid-cols-4">
                <DashboardCard label="오늘 예약" value={stats.todayBookings} icon={FileText} />
                <DashboardCard
                  label="미결제 건수"
                  value={stats.pendingPayments}
                  icon={CreditCard}
                />
                <DashboardCard
                  label="운영 스케줄"
                  value={stats.schedules}
                  icon={CalendarDays}
                />
                <DashboardCard
                  label="공항 운영"
                  value={stats.airport}
                  icon={Plane}
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-semibold text-slate-900">상품별 운영 현황</h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                              {product.badge}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">
                              {product.title}
                            </div>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                            {product.category}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          <MetricBox
                            label="예약"
                            value={
                              enrichedBookings.filter((item) => item.product_id === product.id)
                                .length
                            }
                          />
                          <MetricBox
                            label="결제"
                            value={
                              paymentRecords.filter((item) => item.product_id === product.id)
                                .length
                            }
                          />
                          <MetricBox
                            label="스케줄"
                            value={
                              scheduleRecords.filter((item) => item.product_id === product.id)
                                .length
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-semibold text-slate-900">공항 이동 운영 센터</h2>
                  <div className="mt-6 space-y-4">
                    {filteredAirportTransfers.slice(0, 3).map((transfer) => (
                      <div
                        key={transfer.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold text-slate-900">
                              {transfer.route_label}
                            </div>
                            <div className="mt-1 text-sm text-slate-600">
                              {transfer.origin} → {transfer.destination}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(transfer.status)}`}
                          >
                            {transfer.status.replaceAll("_", " ")}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                          <div>운행 일시: {formatDateTime(transfer.service_date)}</div>
                          <div>탑승객: {transfer.passengers}명</div>
                          <div>차량: {transfer.vehicle_name}</div>
                          <div>기사: {transfer.driver_name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : null}

          {!loading && activeTab === "bookings" ? (
            <AdminTable
              title="상품별 예약 관리"
              columns={[
                "예약번호",
                "상품명",
                "예약자",
                "이용일",
                "인원",
                "상태",
                "메모",
                "운영",
              ]}
            >
              {enrichedBookings
                .filter(
                  (booking) =>
                    (selectedCategory === "all" || booking.categoryKey === selectedCategory) &&
                    (selectedProductId === "all" || booking.product_id === selectedProductId)
                )
                .map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4 font-mono text-xs">{booking.booking_no}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{booking.productTitle}</div>
                      <div className="text-xs text-slate-500">{booking.categoryLabel}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{booking.customer_name}</div>
                      <div className="text-xs text-slate-500">
                        {booking.organization_name || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatDate(booking.booking_date)}</td>
                    <td className="px-4 py-4">{booking.guest_count}명</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(booking.status)}`}
                      >
                        {bookingStatusLabel[booking.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{booking.request_note || "-"}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() =>
                          setBookings((current) =>
                            (current.length > 0 ? current : createDemoBookings()).map((item) =>
                              item.id === booking.id
                                ? {
                                    ...item,
                                    status: cycleStatus(bookingStatusOrder, item.status),
                                  }
                                : item
                            )
                          )
                        }
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        상태 변경
                      </button>
                    </td>
                  </tr>
                ))}
            </AdminTable>
          ) : null}

          {!loading && activeTab === "airport" ? (
            <AirportTransferAdminPanel
              records={filteredAirportTransfers}
              onCycleStatus={(id) =>
                setAirportTransfers((current) =>
                  current.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          status: cycleStatus(airportTransferStatusOrder, item.status),
                        }
                      : item
                  )
                )
              }
            />
          ) : null}

          {!loading && activeTab === "ticketing" ? (
            <TicketingAdminPanel
              records={filteredTicketingRecords}
              onCycleStatus={(id) =>
                setTicketingRecords((current) =>
                  current.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          status: cycleStatus(ticketingStatusOrder, item.status),
                        }
                      : item
                  )
                )
              }
            />
          ) : null}

          {!loading && activeTab === "payments" ? (
            <AdminTable
              title="결제 관리"
              columns={[
                "상품명",
                "결제자",
                "총액",
                "예약금",
                "잔금",
                "결제 방식",
                "마감일",
                "상태",
                "운영",
              ]}
            >
              {filteredPayments.map((payment) => {
                const product = productMap.get(payment.product_id);

                return (
                  <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {product?.title ?? "미등록 상품"}
                      </div>
                      <div className="text-xs text-slate-500">{product?.category ?? "-"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{payment.payer_name}</div>
                      <div className="text-xs text-slate-500">
                        {payment.organization_name}
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatCurrency(payment.total_amount)}</td>
                    <td className="px-4 py-4">{formatCurrency(payment.deposit_amount)}</td>
                    <td className="px-4 py-4">{formatCurrency(payment.balance_amount)}</td>
                    <td className="px-4 py-4">{payment.payment_method}</td>
                    <td className="px-4 py-4">{formatDate(payment.due_date)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(payment.status)}`}
                      >
                        {paymentStatusLabel[payment.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() =>
                          setPaymentRecords((current) =>
                            current.map((item) =>
                              item.id === payment.id
                                ? {
                                    ...item,
                                    status: cycleStatus(paymentStatusOrder, item.status),
                                  }
                                : item
                            )
                          )
                        }
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        상태 변경
                      </button>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          ) : null}

          {!loading && activeTab === "schedules" ? (
            <AdminTable
              title="스케줄 관리"
              columns={[
                "상품명",
                "서브카테고리",
                "일정",
                "정원",
                "예약자",
                "담당자",
                "상태",
                "운영",
              ]}
            >
              {filteredSchedules.map((schedule) => {
                const product = productMap.get(schedule.product_id);

                return (
                  <tr key={schedule.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {product?.title ?? "미등록 상품"}
                      </div>
                      <div className="text-xs text-slate-500">{product?.category ?? "-"}</div>
                    </td>
                    <td className="px-4 py-4">{schedule.subcategory}</td>
                    <td className="px-4 py-4">
                      <div>{formatDate(schedule.date)}</div>
                      <div className="text-xs text-slate-500">
                        {schedule.start_time} - {schedule.end_time}
                      </div>
                    </td>
                    <td className="px-4 py-4">{schedule.capacity}명</td>
                    <td className="px-4 py-4">{schedule.booked_count}명</td>
                    <td className="px-4 py-4">{schedule.operator}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(schedule.status)}`}
                      >
                        {scheduleStatusLabel[schedule.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() =>
                          setScheduleRecords((current) =>
                            current.map((item) =>
                              item.id === schedule.id
                                ? {
                                    ...item,
                                    status: cycleStatus(scheduleStatusOrder, item.status),
                                  }
                                : item
                            )
                          )
                        }
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        상태 변경
                      </button>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          ) : null}

          {!loading && activeTab === "stay" ? (
            <AdminTable
              title="숙박 운영 관리"
              columns={[
                "숙소명",
                "객실 유형",
                "체크인/아웃",
                "객실/인원",
                "셔틀",
                "하우스키핑",
                "상태",
                "메모",
                "운영",
              ]}
            >
              {filteredStayOps.map((operation) => (
                <tr key={operation.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {operation.property_name}
                  </td>
                  <td className="px-4 py-4">{operation.room_type}</td>
                  <td className="px-4 py-4">
                    <div>{formatDate(operation.check_in_date)}</div>
                    <div className="text-xs text-slate-500">
                      ~ {formatDate(operation.check_out_date)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {operation.rooms_blocked}실 / {operation.guests}명
                  </td>
                  <td className="px-4 py-4">
                    {operation.shuttle_required ? "필요" : "없음"}
                  </td>
                  <td className="px-4 py-4">
                    {operation.housekeeping_status === "completed"
                      ? "완료"
                      : operation.housekeeping_status === "ready"
                        ? "준비"
                        : "대기"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(operation.status)}`}
                    >
                      {stayStatusLabel[operation.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{operation.note}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() =>
                        setStayOperations((current) =>
                          current.map((item) =>
                            item.id === operation.id
                              ? {
                                  ...item,
                                  status: cycleStatus(stayStatusOrder, item.status),
                                }
                              : item
                          )
                        )
                      }
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      상태 변경
                    </button>
                  </td>
                </tr>
              ))}
            </AdminTable>
          ) : null}

          {!loading && activeTab === "products" ? (
            <div className="mt-6 space-y-6">
              <ServiceCatalogPanel />
              <ProductManagementPanel products={filteredProducts} />
            </div>
          ) : null}

          {!loading && activeTab === "news" ? (
            <div className="mt-6">
              <NewsPanel />
            </div>
          ) : null}


          {!loading && activeTab === "research-archive" ? (
            <ResearchArchivePanel />
          ) : null}

          {!loading && activeTab === "hero-slides" ? (
            <HeroSlidesPanel />
          ) : null}

          {!loading && activeTab === "social-links" ? (
            <SocialLinksPanel />
          ) : null}

          {!loading && activeTab === "inquiries" ? (
            <AdminTable
              title="문의 관리"
              columns={["문의번호", "유형", "기관명", "담당자", "상태", "접수일"]}
            >
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4 font-mono text-xs">{inquiry.id}</td>
                  <td className="px-4 py-4">{inquiry.inquiry_type}</td>
                  <td className="px-4 py-4">{inquiry.organization_name || "-"}</td>
                  <td className="px-4 py-4">{inquiry.contact_name}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(inquiry.status)}`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{formatDateTime(inquiry.created_at)}</td>
                </tr>
              ))}
            </AdminTable>
          ) : null}

          {!loading && activeTab === "users" ? (
            <AdminUsersPanel />
          ) : null}

          {!loading && activeTab === "settings" ? (
            <div className="mt-6 space-y-6">
              <DmcHeroMediaPanel />
              <DmcCategoryMediaPanel />

              {/* 미디어 보관함 */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-900">미디어 보관함</h2>
                <p className="mt-1 text-sm text-slate-500">이미지와 영상을 업로드하고 관리합니다. 업로드한 파일은 관리자 페이지 전반에서 사용할 수 있습니다.</p>
                <div className="mt-5">
                  <MediaUploadButton category="media" label="파일 업로드" showLibrary={true} />
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {[
                  {
                    title: "예약 운영 정책",
                    desc: "예약 접수, 확정, 보류, 취소 상태 전환 규칙을 관리합니다.",
                  },
                  {
                    title: "결제 정산 정책",
                    desc: "예약금, 잔금, 후불 정산, 세금계산서 처리 정책을 관리합니다.",
                  },
                  {
                    title: "공항픽업 운영 정책",
                    desc: "공항별 대기 시간, 기사 배정, 야간 추가요금, VIP 응대 기준을 관리합니다.",
                  },
                  {
                    title: "운영자 권한 정책",
                    desc: "관리자, 운영자, 파트너 관리자 권한을 구분하고 접근 범위를 관리합니다.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white p-6"
                  >
                    <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function DashboardCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3 text-slate-600">
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function AdminTable({
  title,
  columns,
  children,
}: {
  title: string;
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-4 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
