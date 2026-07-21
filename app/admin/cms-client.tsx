"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Mail,
  Users,
  Settings,
  FileText,
  BarChart3,
  Handshake,
  Plus,
  Pencil,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const cmsMenus = [
  { key: "대시보드", icon: LayoutDashboard },
  { key: "예약 관리", icon: FileText },
  { key: "상품 관리", icon: Package },
  { key: "콘텐츠 관리", icon: Pencil },
  { key: "문의 관리", icon: Mail },
  { key: "파트너 관리", icon: Handshake },
  { key: "통계/리포트", icon: BarChart3 },
  { key: "설정", icon: Settings },
];

const stats = [
  { icon: LayoutDashboard, label: "오늘 예약", value: "24건", change: "+3" },
  { icon: Package, label: "운영 상품", value: "4개", change: "정상" },
  { icon: Mail, label: "신규 문의", value: "13건", change: "+5" },
  { icon: Users, label: "파트너", value: "6개사", change: "정상" },
];

const bookings = [
  { id: "BK-260510-01", product: "문화예술 반일 체험", client: "ABC협회", date: "2026-05-12", status: "검토중" },
  { id: "BK-260510-02", product: "비즈니스 스테이", client: "Global Events", date: "2026-05-15", status: "예약확정" },
  { id: "BK-260510-03", product: "VIP 패키지", client: "해외방문단", date: "2026-05-18", status: "접수" },
  { id: "BK-260510-04", product: "시티투어 프로그램", client: "KINTEX 참가단", date: "2026-05-20", status: "예약확정" },
];

const statusBadge = (status: string) => {
  if (status === "예약확정") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "검토중") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const products = [
  { badge: "숙박", title: "전시·회의 연계 비즈니스 스테이", status: "노출중" },
  { badge: "체험", title: "고양 문화예술 반일 체험 코스", status: "노출중" },
  { badge: "관광상품", title: "KINTEX 연계 시티투어 프로그램", status: "노출중" },
  { badge: "패키지", title: "VIP 맞춤형 프리미엄 일정", status: "노출중" },
];

const inquiries = [
  { type: "MICE 안내 상담", client: "한국전자전 조직위", date: "2026-04-30", status: "처리중" },
  { type: "연구용역 문의", client: "고양시청 관광과", date: "2026-05-01", status: "회신완료" },
  { type: "협업 제안", client: "KTO 해외마케팅팀", date: "2026-05-02", status: "검토중" },
  { type: "행사운영 문의", client: "글로벌 의료기기전", date: "2026-05-03", status: "접수" },
];

const partners = [
  { category: "숙박", name: "킨텍스 라마다 호텔", status: "계약중" },
  { category: "숙박", name: "고양 그랜드 호텔", status: "계약중" },
  { category: "체험", name: "고양 문화재단", status: "MOU" },
  { category: "차량/의전", name: "VIP 의전 서비스(주)", status: "계약중" },
  { category: "관광", name: "고양 시티투어", status: "제휴" },
  { category: "케이터링", name: "프리미엄 케이터링(주)", status: "계약중" },
];

const roles = [
  { role: "최고관리자", desc: "전체 설정, 사용자 권한, 메뉴 구조 관리" },
  { role: "운영관리자", desc: "예약/문의/상품 상태 관리" },
  { role: "콘텐츠관리자", desc: "텍스트·이미지·게시물 수정" },
  { role: "파트너관리자", desc: "제휴 상품 및 파트너 정보 관리" },
];

export default function CmsClient() {
  const [active, setActive] = useState("대시보드");

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      {/* 사이드바 */}
      <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm h-fit xl:sticky xl:top-24">
        <div className="px-3 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          CMS Menu
        </div>
        <nav className="space-y-1">
          {cmsMenus.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition ${
                active === key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {key}
              </span>
              <span className={`text-xs ${active === key ? "text-slate-400" : "text-slate-300"}`}>
                관리
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="space-y-6 min-w-0">
        {/* 상단 통계 카드 (항상 표시) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Icon className="h-4 w-4" /> {s.label}
                  </div>
                  <span className="text-xs font-medium text-emerald-600">{s.change}</span>
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* 패널 콘텐츠 */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* 왼쪽 메인 패널 */}
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  CMS Structure
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  {active} 관리
                </h2>
              </div>
              <button className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition">
                <Plus className="h-4 w-4" /> 새 항목 등록
              </button>
            </div>

            {/* 대시보드 */}
            {active === "대시보드" && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  통합 운영 현황, 예약 상태 요약, 문의 현황, 주요 상품 성과,
                  최근 수정된 콘텐츠를 한 화면에서 확인합니다.
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {["예약 현황 위젯", "문의 현황 위젯", "상품 노출 현황", "최근 수정 콘텐츠"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-700">
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 예약 관리 */}
            {active === "예약 관리" && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 md:grid-cols-4">
                  {["예약번호 검색", "날짜 필터", "상품유형 필터", "상태값 필터"].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {["예약번호", "상품명", "예약자", "이용일", "상태"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3.5 text-xs font-mono text-slate-500">{row.id}</td>
                          <td className="px-4 py-3.5 font-medium text-slate-800">{row.product}</td>
                          <td className="px-4 py-3.5 text-slate-600">{row.client}</td>
                          <td className="px-4 py-3.5 text-slate-600">{row.date}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadge(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 상품 관리 */}
            {active === "상품 관리" && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {["상품 유형 선택", "노출 여부 필터", "파트너사 필터"].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {products.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                          {item.badge}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle className="h-3 w-3" /> {item.status}
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="mt-3 flex gap-2">
                        <button className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition">
                          <Pencil className="h-3 w-3" /> 수정
                        </button>
                        <button className="flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                          <Copy className="h-3 w-3" /> 복제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 콘텐츠 관리 */}
            {active === "콘텐츠 관리" && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {["메인 비주얼", "연구소 소개", "연구 분야", "MICE 안내", "숙박·체험 상품", "문의 페이지", "뉴스·자료실", "공지사항"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                    <button className="flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">
                      <Pencil className="h-3 w-3" /> 편집
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 문의 관리 */}
            {active === "문의 관리" && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {["문의유형 필터", "처리상태 필터", "담당자 배정"].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {["문의유형", "기관명", "접수일", "상태"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inquiries.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3.5 font-medium text-slate-800">{row.type}</td>
                          <td className="px-4 py-3.5 text-slate-600">{row.client}</td>
                          <td className="px-4 py-3.5 text-slate-500 text-xs">{row.date}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadge(row.status === "회신완료" ? "예약확정" : row.status)}`}>
                              {row.status === "회신완료" && <CheckCircle className="h-3 w-3" />}
                              {row.status === "처리중" && <Clock className="h-3 w-3" />}
                              {row.status === "검토중" && <AlertCircle className="h-3 w-3" />}
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 파트너 관리 */}
            {active === "파트너 관리" && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {partners.map((p) => (
                  <div key={p.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {p.category}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{p.status}</span>
                    </div>
                    <div className="mt-3 text-sm font-bold text-slate-900">{p.name}</div>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 통계/리포트 */}
            {active === "통계/리포트" && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { title: "예약 전환율", value: "—", desc: "문의 → 예약 전환 현황" },
                  { title: "상품별 신청 현황", value: "—", desc: "상품별 신청 건수 비교" },
                  { title: "문의 전환 분석", value: "—", desc: "문의 유형별 응답률" },
                  { title: "방문자 성과", value: "—", desc: "페이지별 유입·이탈 분석" },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="mt-2 text-2xl font-bold text-slate-400">{item.value}</div>
                    <div className="mt-1 text-xs text-slate-400">{item.desc}</div>
                    <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white py-4 text-center text-xs text-slate-400">
                      차트 연동 예정
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 설정 */}
            {active === "설정" && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { title: "기본 사이트 설정", desc: "사이트명, 연락처, 운영시간 등" },
                  { title: "예약 상태값 설정", desc: "접수·검토·확정·취소 상태 관리" },
                  { title: "이메일 알림 설정", desc: "예약·문의 수신 알림 이메일 설정" },
                  { title: "사용자 권한 관리", desc: "관리자 계정 및 권한 등급 관리" },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.desc}</div>
                    <button className="mt-3 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
                      설정 변경
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽: 권한 구조 */}
          <div className="rounded-[30px] bg-slate-950 p-8 text-white">
            <div className="flex items-center gap-3 text-slate-400">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-semibold">Operator View</span>
            </div>
            <h3 className="mt-4 text-xl font-bold tracking-tight">
              운영자 권한 구조
            </h3>
            <div className="mt-6 space-y-3">
              {roles.map((item) => (
                <div
                  key={item.role}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <div className="text-sm font-semibold text-white">{item.role}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                확장 로드맵
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                CMS는 초기에 소개형 사이트 운영과 예약 접수를 중심으로 구성하고,
                이후 결제·정산·회원기능·파트너 재고 연동까지 단계적으로 확장할 수
                있도록 설계합니다.
              </p>
            </div>
            <div className="mt-6 space-y-2">
              {["1단계: 소개 + 예약 접수 운영", "2단계: 결제 모듈 연동", "3단계: 파트너 재고 연동", "4단계: 회원·마이페이지"].map((step, idx) => (
                <div key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? "bg-white text-slate-900" : "border border-white/20 text-slate-500"}`}>
                    {idx + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
