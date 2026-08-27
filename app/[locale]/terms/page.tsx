import type { Metadata } from "next";

import Shell from "@/components/layout/Shell";
import SectionTitle from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "이용약관",
  description: "고양 MICE 플랫폼의 서비스 이용약관 안내 페이지입니다.",
  alternates: {
    canonical: "/ko/terms",
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
  { label: "개인정보관리책임자", value: "심송학" },
];

// 정본 고지 배너 — 비한국어 로케일에서 본문 위에 표시
// 제15조(언어) 원칙: 한국어본 정본, 번역본과 상충 시 한국어본 우선
const authoritativeNotice: Partial<Record<LocaleKey, string>> = {
  en: "This is a reference translation. The Korean-language Terms prevail in case of any conflict.",
  ja: "本ページは参考訳です。相違がある場合は韓国語版が優先します。",
  "zh-CN": "本页面为参考译文。如有出入，以韩语版本为准。",
  "zh-TW": "本頁面為参考译文。如有出入，以韩语版本为准。",
};

// ─── 이용약관 본문 (한국어 정본, 제1조~제15조 + 부칙) ────────────────────────
type Article = { no: string; title: string; paragraphs: string[] };

const articles: Article[] = [
  {
    no: "제1조",
    title: "목적",
    paragraphs: [
      "본 약관은 원새봄 주식회사(이하 “회사”)가 운영하는 고양문화관광·MICE 연구소 플랫폼(이하 “플랫폼”)에서 제공하는 서비스의 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항, 서비스 이용 조건 및 절차를 규정함을 목적으로 합니다.",
    ],
  },
  {
    no: "제2조",
    title: "정의",
    paragraphs: [
      "본 약관에서 사용하는 용어의 정의는 다음과 같습니다.",
      "1. “플랫폼”이란 회사가 문화·관광·MICE 관련 정보 제공 및 티켓 통신판매를 위하여 운영하는 웹사이트 및 관련 서비스를 말합니다.",
      "2. “이용자”란 본 약관에 따라 플랫폼이 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.",
      "3. “티켓 상품”이란 공연·전시·행사 등에 대한 입장권으로서, 회사가 통신판매업 신고 범위 내에서 판매하는 상품을 말합니다.",
      "4. “소개형 정보”란 숙박·음식·카페·투어·의료 등 티켓 외 카테고리에 관하여 회사가 안내·소개 목적으로만 제공하는 정보를 말하며, 회사가 해당 재화·용역을 판매·알선하는 것이 아닙니다.",
      "5. “제휴 사업자”란 소개형 정보에 표시되는 개별 숙박·음식·의료기관 등 제3의 사업자를 말합니다.",
    ],
  },
  {
    no: "제3조",
    title: "서비스의 내용 및 법적 성격",
    paragraphs: [
      "① 회사가 플랫폼을 통해 제공하는 서비스는 다음과 같이 성격이 구분됩니다.",
      "1. 티켓 상품의 통신판매: 회사는 전자상거래 등에서의 소비자보호에 관한 법률(이하 “전자상거래법”)에 따른 통신판매업자로서, 공연·전시·행사 티켓을 판매합니다.",
      "2. 소개형 정보의 제공: 회사는 숙박·음식·카페·투어·의료 등에 관하여 관광·문화 정보를 안내 목적으로만 제공합니다.",
      "② 회사는 관광진흥법상 여행업 등록을 하지 아니하였으며, 여행상품의 판매·알선 등 여행업에 해당하는 행위를 하지 않습니다. 소개형 정보 제공은 관광진흥법상 여행업에 해당하지 않습니다.",
      "③ 회사는 의료법 제27조의2에 따른 외국인환자 유치업 등록을 하지 아니하였으며, 동 조에서 정한 외국인환자 유치·알선 행위를 하지 않습니다. 의료 카테고리의 정보는 의료기관 소개·안내에 한하며, 진료·시술의 알선이나 유치를 포함하지 않습니다.",
      "④ 소개형 정보에 표시된 재화·용역에 관한 실제 계약 및 거래는 이용자와 해당 제휴 사업자 간에 직접 성립하며, 회사는 그 거래의 당사자가 아닙니다.",
    ],
  },
  {
    no: "제4조",
    title: "약관의 효력 및 변경",
    paragraphs: [
      "① 본 약관은 플랫폼에 게시함으로써 효력이 발생합니다.",
      "② 회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 적용일 7일 전(이용자에게 불리하거나 중대한 변경은 30일 전)부터 플랫폼에 공지합니다.",
      "③ 이용자가 변경 약관의 적용일 이후에도 서비스를 계속 이용하는 경우 변경에 동의한 것으로 봅니다.",
    ],
  },
  {
    no: "제5조",
    title: "회원 가입 및 계정",
    paragraphs: [
      "① 이용자는 회사가 정한 절차에 따라 회원으로 가입할 수 있으며, 소셜 로그인 등 회사가 제공하는 방식을 이용할 수 있습니다.",
      "② 이용자는 자신의 계정 정보를 관리할 책임이 있으며, 이를 제3자에게 이용하게 하여 발생한 손해에 대하여 책임을 집니다.",
      "③ 회원은 언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 관련 법령에 따라 지체 없이 처리합니다.",
    ],
  },
  {
    no: "제6조",
    title: "티켓 상품의 구매",
    paragraphs: [
      "① 이용자는 플랫폼에 표시된 절차에 따라 티켓 상품을 구매합니다.",
      "② 티켓 상품의 가격, 회차, 좌석등급, 수량 및 이용조건은 상품 상세 화면에 표시됩니다.",
      "③ 회사는 재고·좌석 상황에 따라 판매를 제한하거나 취소할 수 있으며, 이 경우 이용자에게 통지하고 이미 수령한 대금을 환급합니다.",
    ],
  },
  {
    no: "제7조",
    title: "청약철회 및 환불",
    paragraphs: [
      "① 티켓 상품에 대한 청약철회 및 환불은 전자상거래법 제17조 및 제18조에 따릅니다.",
      "② 다만 공연·전시·행사 등 이용일(관람일)이 지정된 티켓 상품은 전자상거래법 제17조 제2항에 따라 청약철회가 제한될 수 있으며, 구체적인 환불 가능 기간·수수료는 상품 상세 화면 및 각 행사 주최자의 환불 규정에 따릅니다.",
      "③ 소개형 정보와 관련하여 이용자와 제휴 사업자 간에 성립한 거래의 청약철회·환불은 해당 제휴 사업자의 정책에 따르며, 회사는 이에 관여하지 않습니다.",
    ],
  },
  {
    no: "제8조",
    title: "소개형 정보 서비스의 성격 및 책임 제한",
    paragraphs: [
      "① 소개형 정보는 이용자의 편의를 위한 안내 목적으로 제공됩니다.",
      "② 회사는 소개형 정보의 정확성·최신성을 위하여 합리적으로 노력하나, 제휴 사업자가 제공하는 재화·용역의 품질·가격·거래조건·이행에 대하여 책임을 지지 않습니다.",
      "③ 소개형 정보를 통해 인지한 재화·용역에 관한 계약의 체결·이행·분쟁은 이용자와 제휴 사업자 간에 직접 처리되며, 회사는 그 거래의 당사자가 아니므로 이에 대하여 책임을 지지 않습니다.",
    ],
  },
  {
    no: "제9조",
    title: "회사의 의무",
    paragraphs: [
      "① 회사는 관련 법령과 본 약관을 준수하며, 안정적인 서비스 제공을 위하여 노력합니다.",
      "② 회사는 이용자의 개인정보를 관련 법령 및 개인정보 처리방침에 따라 보호합니다.",
    ],
  },
  {
    no: "제10조",
    title: "이용자의 의무",
    paragraphs: [
      "이용자는 다음 행위를 하여서는 안 됩니다.",
      "1. 타인의 정보 도용 또는 허위 정보의 등록",
      "2. 회사 및 제3자의 지식재산권·명예 등 권리 침해",
      "3. 플랫폼의 운영을 방해하는 행위",
      "4. 관련 법령 또는 본 약관에 위배되는 행위",
    ],
  },
  {
    no: "제11조",
    title: "게시물의 관리",
    paragraphs: [
      "① 이용자가 플랫폼에 게시한 게시물의 권리와 책임은 게시한 이용자에게 있습니다.",
      "② 회사는 게시물이 관련 법령 또는 본 약관에 위반된다고 판단되는 경우 사전 통지 없이 삭제·이동하거나 게시를 거부할 수 있습니다.",
    ],
  },
  {
    no: "제12조",
    title: "개인정보의 보호",
    paragraphs: [
      "회사는 이용자의 개인정보를 관련 법령에 따라 보호하며, 그 구체적인 처리에 관하여는 플랫폼에 게시된 「개인정보 처리방침」에 따릅니다.",
    ],
  },
  {
    no: "제13조",
    title: "면책조항",
    paragraphs: [
      "① 회사는 천재지변, 불가항력, 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.",
      "② 회사는 제8조에 따라 소개형 정보와 관련된 이용자·제휴 사업자 간 거래에 대하여 책임을 지지 않습니다.",
      "③ 회사는 이용자가 서비스를 통해 얻은 정보로 인하여 입은 손해에 대하여 회사의 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.",
    ],
  },
  {
    no: "제14조",
    title: "분쟁의 해결 및 준거법·재판관할",
    paragraphs: [
      "① 본 약관 및 서비스 이용에 관하여 회사와 이용자 간에 발생한 분쟁은 상호 협의하여 해결함을 원칙으로 합니다.",
      "② 협의가 이루어지지 않는 경우, 소비자는 전자상거래법 및 소비자기본법에 따른 분쟁조정기관에 조정을 신청할 수 있습니다.",
      "③ 본 약관은 대한민국 법령에 따라 규율되며, 분쟁에 관한 소송의 관할법원은 민사소송법에 따른 법원으로 합니다.",
    ],
  },
  {
    no: "제15조",
    title: "언어",
    paragraphs: [
      "① 본 약관은 한국어본을 정본으로 합니다.",
      "② 회사가 이용자의 편의를 위하여 영어·일본어·중국어(간체·번체) 등 번역본을 제공하는 경우, 해당 번역본은 참고용이며, 번역본과 한국어본의 내용이 상충하는 경우 한국어본이 우선합니다.",
    ],
  },
];

// 부칙 — 시행일 자리표시자는 배포 전 확정 예정
// TODO(legal): 서비스 시행 일자 확정 후 "2026년 ○○월 ○○일" 부분을 대체할 것.
const supplementary = {
  title: "부칙",
  text: "본 약관은 2026년 ○○월 ○○일부터 시행합니다.",
};

// 항 번호("1. ", "2. " …) 로 시작하는 문단은 좌측 살짝 들여쓰기하여 호(號) 구조를 시각화
function isNumberedItem(text: string): boolean {
  return /^\d+\.\s/.test(text);
}

export default async function TermsPage(props: {
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
          eyebrow="Terms"
          title="이용약관"
          desc="회사와 이용자의 권리·의무, 서비스 이용 조건 및 절차를 규정합니다."
        />

        {/* 정본 고지 배너 — 비한국어 로케일에서만 표시 (제15조 언어 조항) */}
        {notice && (
          <div className="mt-8 rounded-[16px] border border-amber-300 bg-amber-50 px-5 py-3 text-sm leading-6 text-amber-900">
            {notice}
          </div>
        )}

        {/* 약관 본문 — 한국어 정본 */}
        <div className="mt-10 space-y-10 text-slate-800">
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

          {/* 부칙 */}
          <section>
            <h2 className="text-lg font-black tracking-tight text-slate-950">
              {supplementary.title}
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-7">
              <p className="text-slate-800">{supplementary.text}</p>
            </div>
          </section>
        </div>

        {/* 사업자 정보 — 통신판매업 필수 게재 */}
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
