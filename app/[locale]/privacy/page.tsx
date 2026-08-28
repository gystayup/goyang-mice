import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionTitle from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "고양 MICE 플랫폼의 개인정보 처리방침 안내 페이지입니다.",
  alternates: {
    canonical: "/ko/privacy",
  },
};

type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";
const SUPPORTED_LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

// 통신판매업 필수 게재 정보
const BUSINESS_INFO = [
  { label: "상호", value: "원새봄 주식회사" },
  { label: "대표", value: "심송학" },
  { label: "사업자등록번호", value: "287-87-01247" },
  {
    label: "통신판매업 신고번호",
    value: "제 2021-서울서초-3110 호",
    note: "소재지 이전에 따른 변경신고 예정",
  },
  { label: "소재지", value: "경기도 고양시 일산동구 호수로 358-25, 동문타워2차 618호" },
  { label: "대표전화", value: "010-8851-1274" },
  { label: "이메일", value: "onesaebom1@gmail.com" },
];

// 정본 고지 배너 — 비한국어 로케일에서 본문 위에 표시
// terms 페이지와 동일한 문안 재사용 (한국어본 정본, 번역본 상충 시 한국어 우선)
const authoritativeNotice: Partial<Record<LocaleKey, string>> = {
  en: "This is a reference translation. The Korean-language Terms prevail in case of any conflict.",
  ja: "本ページは参考訳です。相違がある場合は韓国語版が優先します。",
  "zh-CN": "本页面为参考译文。如有出入，以韩语版本为准。",
  "zh-TW": "本頁面為參考譯文。如有出入，以韓語版本為準。",
};

// ─── 개인정보 처리방침 본문 (한국어 정본, 제1조~제13조) ─────────────────────
// 개보법 30조 필수 고지: 처리목적·항목·기간·제공·위탁·파기·권리·안전조치
const preamble =
  "원새봄 주식회사(이하 “회사”)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속히 처리하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.";

type Article = { no: string; title: string; paragraphs: string[] };

// TODO(legal): 아래 자리표시자는 배포 전 확정 필요
//   - 제6조 ②: 수탁자 / 위탁업무 / 국외이전 여부 및 이전 국가 — 운영사 확정 후 기재
//   - 제13조: 시행일 "2026년 ○○월 ○○일" — 서비스 시행 일자로 대체
const articles: Article[] = [
  {
    no: "제1조",
    title: "총칙",
    paragraphs: [
      "본 방침은 회사가 운영하는 고양문화관광·MICE 연구소 플랫폼(이하 “플랫폼”)의 서비스 이용과 관련하여 적용됩니다.",
    ],
  },
  {
    no: "제2조",
    title: "개인정보의 처리 목적",
    paragraphs: [
      "회사는 다음의 목적을 위하여 개인정보를 처리하며, 목적 외의 용도로는 이용하지 않습니다.",
      "1. 회원 가입 및 관리: 본인 확인, 회원제 서비스 제공, 부정 이용 방지",
      "2. 티켓 상품의 예약·구매 접수 및 관련 문의 응대",
      "3. 문의·상담의 접수 및 처리",
      "4. 뉴스레터 등 정보성 소식의 발송(수신 동의자에 한함)",
      "5. 서비스 개선 및 이용 통계 분석",
    ],
  },
  {
    no: "제3조",
    title: "처리하는 개인정보의 항목",
    paragraphs: [
      "① 회사는 다음의 개인정보 항목을 처리합니다.",
      "1. 회원 가입 시: 이메일 주소, 이름(또는 닉네임), 비밀번호(자체 가입 시)",
      "2. 소셜 로그인 시: 소셜 계정 식별자, 이메일, 프로필 정보 중 이용자가 제공에 동의한 항목",
      "3. 티켓 예약·문의 시: 이름, 연락처, 예약 관련 정보",
      "4. 문의·상담 시: 이름, 연락처, 문의 내용",
      "5. 자동 수집 항목: 접속 IP, 쿠키, 접속 일시, 서비스 이용 기록, 기기·브라우저 정보",
      "② 향후 티켓 결제 기능 도입 시 결제 관련 정보의 처리 항목은 본 방침을 개정하여 사전 고지합니다.",
    ],
  },
  {
    no: "제4조",
    title: "개인정보의 보유 및 이용기간",
    paragraphs: [
      "① 회사는 법령에 따른 보유기간 또는 정보주체로부터 동의받은 기간 내에서 개인정보를 처리·보유합니다.",
      "② 회원 정보는 회원 탈퇴 시 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.",
      "1. 전자상거래 등에서의 소비자보호에 관한 법률에 따른 계약·청약철회·대금결제·소비자 불만 처리 기록: 관계 법령이 정한 기간",
      "2. 통신비밀보호법에 따른 접속 기록: 관계 법령이 정한 기간",
    ],
  },
  {
    no: "제5조",
    title: "개인정보의 제3자 제공",
    paragraphs: [
      "① 회사는 정보주체의 개인정보를 제2조의 목적 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 제3자에게 제공합니다.",
      "② 소개형 정보와 관련하여 이용자가 제휴 사업자와 직접 거래를 진행하기 위해 이용자가 스스로 자신의 정보를 제휴 사업자에게 제공하는 경우는 본 조의 제3자 제공에 해당하지 않습니다.",
    ],
  },
  {
    no: "제6조",
    title: "개인정보 처리의 위탁",
    paragraphs: [
      "① 회사는 원활한 서비스 제공을 위하여 개인정보 처리업무를 외부에 위탁할 수 있으며, 위탁 시 관련 사항을 본 방침에 공개합니다.",
      "② 수탁자 및 위탁업무의 내용은 다음과 같습니다.",
      "[수탁자 / 위탁업무 / 국외이전 여부 및 이전 국가 — 운영사 확인 후 기재]",
      "③ 회사는 위탁계약 시 개인정보가 안전하게 관리되도록 필요한 사항을 규정하고 관리·감독합니다.",
    ],
  },
  {
    no: "제7조",
    title: "개인정보의 파기 절차 및 방법",
    paragraphs: [
      "① 회사는 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 파기합니다.",
      "② 전자적 파일은 복구·재생되지 않도록 안전하게 삭제하며, 종이 문서는 분쇄하거나 소각합니다.",
    ],
  },
  {
    no: "제8조",
    title: "정보주체와 법정대리인의 권리·의무 및 행사 방법",
    paragraphs: [
      "① 정보주체는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요구할 수 있습니다.",
      "② 권리 행사는 이메일 등을 통하여 할 수 있으며, 회사는 지체 없이 조치합니다.",
      "③ 정보주체는 자신의 개인정보를 정확하게 유지할 의무가 있습니다.",
    ],
  },
  {
    no: "제9조",
    title: "개인정보의 안전성 확보조치",
    paragraphs: [
      "회사는 개인정보의 안전성 확보를 위하여 다음의 조치를 취합니다.",
      "1. 관리적 조치: 내부관리계획 수립·시행, 접근 권한의 최소화",
      "2. 기술적 조치: 개인정보 처리시스템 접근 통제, 비밀번호 암호화, 접속기록 보관",
      "3. 물리적 조치: 처리 설비에 대한 접근 통제",
    ],
  },
  {
    no: "제10조",
    title: "개인정보 자동 수집 장치의 설치·운영 및 거부",
    paragraphs: [
      "① 회사는 이용자에게 맞춤형 서비스를 제공하기 위하여 쿠키(cookie)를 사용할 수 있습니다.",
      "② 이용자는 웹브라우저 설정을 통하여 쿠키 저장을 거부할 수 있으며, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.",
    ],
  },
  {
    no: "제11조",
    title: "개인정보 보호책임자",
    paragraphs: [
      "① 회사는 개인정보 처리에 관한 업무를 총괄하는 개인정보 보호책임자를 다음과 같이 지정합니다.",
      "- 개인정보 보호책임자: 심송학",
      "- 연락처: onesaebom1@gmail.com, 010-8851-1274",
      "② 정보주체는 개인정보 보호 관련 문의를 위 연락처로 할 수 있습니다.",
    ],
  },
  {
    no: "제12조",
    title: "권익침해 구제방법",
    paragraphs: [
      "정보주체는 개인정보 침해에 대한 상담·구제를 위하여 다음 기관에 문의할 수 있습니다.",
      "1. 개인정보분쟁조정위원회 (1833-6972)",
      "2. 개인정보침해신고센터 (118)",
      "3. 대검찰청 사이버수사과 (1301)",
      "4. 경찰청 사이버수사국 (182)",
    ],
  },
  {
    no: "제13조",
    title: "개인정보 처리방침의 변경",
    paragraphs: [
      "본 방침은 2026년 ○○월 ○○일부터 시행합니다. 방침의 변경이 있는 경우 변경 사항을 플랫폼에 공지합니다.",
    ],
  },
];

// 항 번호("1. ", "2. " …) 로 시작하는 문단은 좌측 살짝 들여쓰기하여 호(號) 구조를 시각화
// terms/page.tsx 와 동일한 헬퍼
function isNumberedItem(text: string): boolean {
  return /^\d+\.\s/.test(text);
}

export default async function PrivacyPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await props.params;
  const locale: LocaleKey = (SUPPORTED_LOCALES.includes(rawLocale as LocaleKey)
    ? (rawLocale as LocaleKey)
    : "ko");
  const notice = authoritativeNotice[locale];

  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <SectionTitle
          eyebrow="Privacy"
          title="개인정보 처리방침"
          desc="회사가 처리하는 개인정보의 목적·항목·보유기간과 정보주체의 권리를 안내합니다."
        />

        {/* 정본 고지 배너 — 비한국어 로케일에서만 표시 (제15조 언어 조항 · terms와 동일 문안) */}
        {notice && (
          <div className="mt-8 rounded-[16px] border border-amber-300 bg-amber-50 px-5 py-3 text-sm leading-6 text-amber-900">
            {notice}
          </div>
        )}

        {/* 개인정보관리책임자 — 강조 표시 (기존 블록 유지) */}
        <section className="mt-10 rounded-[24px] border border-slate-900 bg-slate-950 p-6 text-white sm:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Privacy Officer
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-sm font-semibold text-slate-300">
              개인정보관리책임자
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              심송학
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            개인정보 처리 관련 문의는 아래 사업자 연락처로 접수해 주시면 담당자가 확인 후 회신드립니다.
          </p>
        </section>

        {/* 처리방침 본문 — 한국어 정본 */}
        <div className="mt-10 space-y-10 text-slate-800">
          {/* 전문 */}
          <p className="text-sm leading-7 text-slate-800">{preamble}</p>

          {articles.map((article) => (
            <section key={article.no}>
              <h2 className="text-lg font-black tracking-tight text-slate-950">
                {article.no} ({article.title})
              </h2>
              <div className="mt-3 space-y-2 text-sm leading-7">
                {article.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={
                      isNumberedItem(p)
                        ? "pl-4 text-slate-700"
                        : "text-slate-800"
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 사업자 정보 — 통신판매업 필수 게재 (기존 블록 유지) */}
        <section className="mt-12 rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-lg font-black tracking-tight text-slate-950">
            사업자 정보
          </h2>
          <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {BUSINESS_INFO.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                <dt className="shrink-0 font-semibold text-slate-500 sm:w-40">
                  {item.label}
                </dt>
                <dd className="text-slate-800">
                  {item.value}
                  {item.note && (
                    <span className="ml-1 text-xs text-slate-500">({item.note})</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Shell>
  );
}
