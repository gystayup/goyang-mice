// data/locales/reservation-copy.ts — 오더 #D21 [1]-A 예매 페이지 UI 라벨 5로케일.
//
// D20 로 예매 페이지(TicketReservationBooking) 를 정리했으나 UI 라벨이 전부 한국어로 하드코딩되어
// non-KO 로케일에서도 한글 노출. 본 사전으로 이전.
//
// 원문 콘텐츠(공연 설명 등) 번역은 이 오더 범위 아님 — admin 입력 트랙.

import { pick, type LocalizedText, type PageLocale } from "./types";

const t = {
  // 페이지 상단
  notFoundTitle: {
    ko: "예약 가능한 서비스를 찾을 수 없습니다.",
    en: "No reservable service could be found.",
    ja: "予約可能なサービスが見つかりませんでした。",
    "zh-CN": "找不到可预约的服务。",
    "zh-TW": "找不到可預約的服務。",
  } as LocalizedText,
  infoOnlyTitle: {
    ko: "안내 상품입니다",
    en: "Information-only product",
    ja: "ご案内商品です",
    "zh-CN": "仅提供信息的产品",
    "zh-TW": "僅提供資訊的產品",
  } as LocalizedText,
  infoOnlyDesc: {
    ko: "이 카테고리는 예약이 아닌 안내 정보만 제공합니다. 상세 페이지에서 정보를 확인해 주세요.",
    en: "This category provides information only, not reservations. Please check details on the product page.",
    ja: "このカテゴリは予約ではなく、ご案内のみを提供します。詳細ページで内容をご確認ください。",
    "zh-CN": "此类别仅提供信息，不提供预约。请在详情页查看信息。",
    "zh-TW": "此類別僅提供資訊，不提供預約。請於詳情頁查看內容。",
  } as LocalizedText,
  infoOnlyCta: {
    ko: "안내 보기",
    en: "View details",
    ja: "案内を見る",
    "zh-CN": "查看信息",
    "zh-TW": "查看資訊",
  } as LocalizedText,
  sectionEyebrow: {
    ko: "예약",
    en: "Reservation",
    ja: "予約",
    "zh-CN": "预约",
    "zh-TW": "預約",
  } as LocalizedText,
  sectionTitleSuffix: {
    ko: "예약 요청",
    en: "Reservation Request",
    ja: "予約リクエスト",
    "zh-CN": "预约申请",
    "zh-TW": "預約申請",
  } as LocalizedText,
  sectionDesc: {
    ko: "선택한 상품의 상세 설명과 옵션, 결제 방식을 확인한 뒤 바로 예약 요청을 진행할 수 있습니다.",
    en: "Review the selected product, options, and payment methods, then submit your reservation request.",
    ja: "選択した商品の詳細説明・オプション・決済方法を確認してから、予約リクエストをお進めください。",
    "zh-CN": "确认所选产品的详细说明、选项及付款方式后，即可提交预约申请。",
    "zh-TW": "確認所選產品的詳細說明、選項及付款方式後，即可提交預約申請。",
  } as LocalizedText,

  // 좌 · 공연 요약 카드
  labelVenue: { ko: "장소", en: "Venue", ja: "会場", "zh-CN": "场地", "zh-TW": "場地" } as LocalizedText,
  labelDates: { ko: "공연기간", en: "Dates", ja: "公演期間", "zh-CN": "演出期间", "zh-TW": "演出期間" } as LocalizedText,
  labelDuration: { ko: "공연시간", en: "Running time", ja: "上演時間", "zh-CN": "演出时长", "zh-TW": "演出時長" } as LocalizedText,
  labelAge: { ko: "관람연령", en: "Age", ja: "観覧年齢", "zh-CN": "观演年龄", "zh-TW": "觀演年齡" } as LocalizedText,

  // 좌 · 옵션 카드
  optionsTitle: { ko: "좌석 · 옵션", en: "Seats & Options", ja: "座席・オプション", "zh-CN": "座位 · 选项", "zh-TW": "座位 · 選項" } as LocalizedText,

  // 좌 · 결제 수단 안내
  paymentsTitle: { ko: "결제 수단 안내", en: "Payment Methods", ja: "お支払い方法", "zh-CN": "支付方式", "zh-TW": "付款方式" } as LocalizedText,
  paymentsNote: {
    ko: "예약 접수 후 관리자가 확인하고 발권 가능 여부와 결제·정산 진행 상태를 이어서 안내드립니다. 아래 결제 수단은 참고용입니다.",
    en: "After your request, our team will confirm availability and follow up with issuing and settlement details. Payment methods below are for reference.",
    ja: "予約受付後、担当者が発券可否・決済・精算の進行状況を追ってご案内します。以下の決済方法は参考です。",
    "zh-CN": "预约提交后，工作人员将确认出票情况并跟进付款和结算流程。下方付款方式仅供参考。",
    "zh-TW": "預約提交後，工作人員將確認出票情況並跟進付款和結算流程。下方付款方式僅供參考。",
  } as LocalizedText,
  paymentCreditCard: { ko: "크레딧카드", en: "Credit Card", ja: "クレジットカード", "zh-CN": "信用卡", "zh-TW": "信用卡" } as LocalizedText,
  paymentKakaoPay: { ko: "카카오페이", en: "KakaoPay", ja: "カカオペイ", "zh-CN": "KakaoPay", "zh-TW": "KakaoPay" } as LocalizedText,
  paymentBankTransfer: { ko: "계좌송금", en: "Bank Transfer", ja: "銀行振込", "zh-CN": "银行转账", "zh-TW": "銀行轉帳" } as LocalizedText,
  paymentCorporate: { ko: "법인 후불 정산", en: "Corporate Billing", ja: "法人後払い精算", "zh-CN": "法人后付结算", "zh-TW": "法人後付結算" } as LocalizedText,

  // 우 · 예약 폼 헤더
  formHeader: { ko: "예약 신청", en: "Book", ja: "予約する", "zh-CN": "预约", "zh-TW": "預約" } as LocalizedText,

  // 우 · 폼 요약 rows
  summarySelected: { ko: "선택 공연", en: "Show", ja: "選択公演", "zh-CN": "所选演出", "zh-TW": "所選演出" } as LocalizedText,
  summarySeat: { ko: "좌석/패키지", en: "Seat / Package", ja: "座席/パッケージ", "zh-CN": "座位/套餐", "zh-TW": "座位/套餐" } as LocalizedText,
  summaryVenue: { ko: "공연장", en: "Venue", ja: "会場", "zh-CN": "场地", "zh-TW": "場地" } as LocalizedText,

  // 우 · 폼 필드
  fieldDate: { ko: "예약 날짜", en: "Date", ja: "予約日", "zh-CN": "预约日期", "zh-TW": "預約日期" } as LocalizedText,
  fieldQuantity: { ko: "수량", en: "Quantity", ja: "数量", "zh-CN": "数量", "zh-TW": "數量" } as LocalizedText,
  ariaDecrease: { ko: "감소", en: "Decrease", ja: "減らす", "zh-CN": "减少", "zh-TW": "減少" } as LocalizedText,
  ariaIncrease: { ko: "증가", en: "Increase", ja: "増やす", "zh-CN": "增加", "zh-TW": "增加" } as LocalizedText,
  placeholderOrganization: {
    ko: "기관명 또는 단체명",
    en: "Organization or group",
    ja: "機関名または団体名",
    "zh-CN": "机构或团体名称",
    "zh-TW": "機構或團體名稱",
  } as LocalizedText,
  placeholderManager: {
    ko: "예약 담당자명",
    en: "Contact name",
    ja: "予約担当者名",
    "zh-CN": "预约负责人姓名",
    "zh-TW": "預約負責人姓名",
  } as LocalizedText,
  placeholderPhone: { ko: "연락처", en: "Phone", ja: "連絡先", "zh-CN": "联系电话", "zh-TW": "聯絡電話" } as LocalizedText,
  placeholderEmail: { ko: "이메일", en: "Email", ja: "メール", "zh-CN": "邮箱", "zh-TW": "電子郵件" } as LocalizedText,
  fieldPayment: {
    ko: "결제 방식 (참고)",
    en: "Payment method (reference)",
    ja: "決済方法（参考）",
    "zh-CN": "付款方式（参考）",
    "zh-TW": "付款方式（參考）",
  } as LocalizedText,
  placeholderRequest: {
    ko: "좌석 요청, 단체 발권, 세금계산서 요청 등",
    en: "Seat requests, group ticketing, tax invoice, etc.",
    ja: "座席リクエスト・団体発券・税務書類などのご要望",
    "zh-CN": "座位要求、团体出票、发票开具等",
    "zh-TW": "座位要求、團體出票、發票開立等",
  } as LocalizedText,
  totalLabel: {
    ko: "예상 금액",
    en: "Estimated total",
    ja: "予想金額",
    "zh-CN": "预计金额",
    "zh-TW": "預計金額",
  } as LocalizedText,
  totalNote: {
    ko: "예약 접수 후 관리자가 확인해 결제·정산 진행을 안내드립니다.",
    en: "Our team will confirm and follow up on payment and settlement after your request.",
    ja: "予約受付後、担当者が決済・精算の進行をご案内します。",
    "zh-CN": "预约提交后，工作人员将确认并跟进付款和结算。",
    "zh-TW": "預約提交後，工作人員將確認並跟進付款和結算。",
  } as LocalizedText,
  agreeLabel: {
    ko: "개인정보 수집 및 티켓 예약·발권 안내를 위한 연락에 동의합니다.",
    en: "I consent to the collection of personal data and contact for ticket booking and issuance.",
    ja: "個人情報の収集と、チケット予約・発券のご連絡に同意します。",
    "zh-CN": "我同意收集个人信息，并同意就票务预约与出票进行联系。",
    "zh-TW": "我同意收集個人資料，並同意就票務預約與出票進行聯絡。",
  } as LocalizedText,
  submitCta: {
    ko: "예약 요청",
    en: "Send request",
    ja: "予約リクエストを送信",
    "zh-CN": "提交预约申请",
    "zh-TW": "提交預約申請",
  } as LocalizedText,
  submittingLabel: {
    ko: "예약 접수 중...",
    en: "Submitting…",
    ja: "受付中…",
    "zh-CN": "正在提交…",
    "zh-TW": "正在提交…",
  } as LocalizedText,

  // 성공 화면
  successEyebrow: { ko: "Ticket Reservation", en: "Ticket Reservation", ja: "Ticket Reservation", "zh-CN": "Ticket Reservation", "zh-TW": "Ticket Reservation" } as LocalizedText,
  successTitle: {
    ko: "티켓 예약이 접수되었습니다.",
    en: "Your ticket request has been received.",
    ja: "チケットのリクエストを受け付けました。",
    "zh-CN": "您的票务申请已收到。",
    "zh-TW": "您的票務申請已收到。",
  } as LocalizedText,
  successBookingNoLabel: {
    ko: "예약 번호는",
    en: "Booking number:",
    ja: "予約番号は",
    "zh-CN": "预约编号：",
    "zh-TW": "預約編號：",
  } as LocalizedText,
  successBookingNoSuffix: { ko: "입니다.", en: ".", ja: "です。", "zh-CN": "。", "zh-TW": "。" } as LocalizedText,
  successFollowUp: {
    ko: "선택하신 좌석/패키지와 결제방법(참고)이 함께 접수되었으며, 관리자가 발권과 진행 상태를 이어서 안내드립니다.",
    en: "The selected seat/package and payment method (reference) were submitted. Our team will follow up on issuing and progress.",
    ja: "選択された座席/パッケージと決済方法（参考）も一緒に受け付けました。担当者が発券と進行状況をご案内します。",
    "zh-CN": "所选座位/套餐及付款方式（参考）已一并提交，工作人员将继续跟进出票和进度。",
    "zh-TW": "所選座位/套餐及付款方式（參考）已一併提交，工作人員將繼續跟進出票和進度。",
  } as LocalizedText,
  successRestartCta: {
    ko: "다시 예약 작성",
    en: "New request",
    ja: "新しい予約",
    "zh-CN": "重新填写",
    "zh-TW": "重新填寫",
  } as LocalizedText,

  // 에러
  errorSubmitFailed: {
    ko: "예약 접수에 실패했습니다.",
    en: "Failed to submit your request.",
    ja: "予約の受付に失敗しました。",
    "zh-CN": "预约提交失败。",
    "zh-TW": "預約提交失敗。",
  } as LocalizedText,
  errorGeneric: {
    ko: "예약 접수 중 오류가 발생했습니다.",
    en: "An error occurred while submitting your request.",
    ja: "予約の受付中にエラーが発生しました。",
    "zh-CN": "提交预约时发生错误。",
    "zh-TW": "提交預約時發生錯誤。",
  } as LocalizedText,
};

export function getReservationCopy(locale: PageLocale) {
  return {
    notFoundTitle: pick(locale, t.notFoundTitle),
    infoOnlyTitle: pick(locale, t.infoOnlyTitle),
    infoOnlyDesc: pick(locale, t.infoOnlyDesc),
    infoOnlyCta: pick(locale, t.infoOnlyCta),
    sectionEyebrow: pick(locale, t.sectionEyebrow),
    sectionTitleSuffix: pick(locale, t.sectionTitleSuffix),
    sectionDesc: pick(locale, t.sectionDesc),

    labelVenue: pick(locale, t.labelVenue),
    labelDates: pick(locale, t.labelDates),
    labelDuration: pick(locale, t.labelDuration),
    labelAge: pick(locale, t.labelAge),

    optionsTitle: pick(locale, t.optionsTitle),

    paymentsTitle: pick(locale, t.paymentsTitle),
    paymentsNote: pick(locale, t.paymentsNote),
    paymentMethods: [
      pick(locale, t.paymentCreditCard),
      pick(locale, t.paymentKakaoPay),
      pick(locale, t.paymentBankTransfer),
      pick(locale, t.paymentCorporate),
    ],

    formHeader: pick(locale, t.formHeader),
    summarySelected: pick(locale, t.summarySelected),
    summarySeat: pick(locale, t.summarySeat),
    summaryVenue: pick(locale, t.summaryVenue),

    fieldDate: pick(locale, t.fieldDate),
    fieldQuantity: pick(locale, t.fieldQuantity),
    ariaDecrease: pick(locale, t.ariaDecrease),
    ariaIncrease: pick(locale, t.ariaIncrease),
    placeholderOrganization: pick(locale, t.placeholderOrganization),
    placeholderManager: pick(locale, t.placeholderManager),
    placeholderPhone: pick(locale, t.placeholderPhone),
    placeholderEmail: pick(locale, t.placeholderEmail),
    fieldPayment: pick(locale, t.fieldPayment),
    placeholderRequest: pick(locale, t.placeholderRequest),
    totalLabel: pick(locale, t.totalLabel),
    totalNote: pick(locale, t.totalNote),
    agreeLabel: pick(locale, t.agreeLabel),
    submitCta: pick(locale, t.submitCta),
    submittingLabel: pick(locale, t.submittingLabel),

    successEyebrow: pick(locale, t.successEyebrow),
    successTitle: pick(locale, t.successTitle),
    successBookingNoLabel: pick(locale, t.successBookingNoLabel),
    successBookingNoSuffix: pick(locale, t.successBookingNoSuffix),
    successFollowUp: pick(locale, t.successFollowUp),
    successRestartCta: pick(locale, t.successRestartCta),

    errorSubmitFailed: pick(locale, t.errorSubmitFailed),
    errorGeneric: pick(locale, t.errorGeneric),
  };
}

export type ReservationCopy = ReturnType<typeof getReservationCopy>;
