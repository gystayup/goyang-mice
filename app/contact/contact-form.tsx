"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import type { PageLocale } from "./_page";

const inquiryTypeOptions: Record<PageLocale, { label: string; value: string }[]> = {
  ko: [
    { label: "연구 협력 문의", value: "research" },
    { label: "DMC 서비스 상담", value: "dmc" },
    { label: "예약 시스템 구축", value: "booking" },
    { label: "행사 운영 문의", value: "event" },
    { label: "제휴 및 파트너십", value: "partnership" },
    { label: "정책 / 기관 협력", value: "policy" },
  ],
  en: [
    { label: "Research Collaboration", value: "research" },
    { label: "DMC Service Consultation", value: "dmc" },
    { label: "Booking System Setup", value: "booking" },
    { label: "Event Operations", value: "event" },
    { label: "Partnership", value: "partnership" },
    { label: "Policy / Institution", value: "policy" },
  ],
  ja: [
    { label: "研究協力のお問い合わせ", value: "research" },
    { label: "DMCサービスのご相談", value: "dmc" },
    { label: "予約システム構築", value: "booking" },
    { label: "イベント運営のお問い合わせ", value: "event" },
    { label: "提携・パートナーシップ", value: "partnership" },
    { label: "政策 / 機関連携", value: "policy" },
  ],
  "zh-CN": [
    { label: "研究合作咨询", value: "research" },
    { label: "DMC服务咨询", value: "dmc" },
    { label: "预约系统建设", value: "booking" },
    { label: "活动运营咨询", value: "event" },
    { label: "合作与伙伴关系", value: "partnership" },
    { label: "政策 / 机构合作", value: "policy" },
  ],
  "zh-TW": [
    { label: "研究合作諮詢", value: "research" },
    { label: "DMC服務諮詢", value: "dmc" },
    { label: "預約系統建置", value: "booking" },
    { label: "活動營運諮詢", value: "event" },
    { label: "合作與夥伴關係", value: "partnership" },
    { label: "政策 / 機構合作", value: "policy" },
  ],
};

type FormState = {
  organization: string;
  manager: string;
  phone: string;
  email: string;
  inquiryType: string;
  message: string;
  agree: boolean;
};

const initialForm: FormState = {
  organization: "",
  manager: "",
  phone: "",
  email: "",
  inquiryType: "dmc",
  message: "",
  agree: false,
};

const copies: Record<PageLocale, ReturnType<typeof buildCopy>> = {} as never;

function buildCopy(locale: PageLocale) {
  const map: Record<PageLocale, {
    eyebrow: string;
    title: string;
    inquiryType: string;
    fields: { organization: string; manager: string; phone: string; email: string; message: string };
    placeholder: string;
    agree: string;
    successTitle: string;
    successDesc: string;
    newInquiry: string;
    submit: string;
    submitting: string;
    subject: string;
    errors: { failed: string; generic: string };
  }> = {
    ko: {
      eyebrow: "Inquiry Form",
      title: "문의 내용을 남겨주세요.",
      inquiryType: "문의 유형",
      fields: { organization: "기관명 또는 단체명", manager: "담당자명", phone: "연락처", email: "이메일", message: "문의 내용" },
      placeholder: "서비스 목적, 예상 일정, 필요한 카테고리, 운영 방식, 결제 연동 여부 등을 적어 주세요.",
      agree: "개인정보 수집 및 문의 응답을 위한 이용에 동의합니다.",
      successTitle: "문의가 정상적으로 접수되었습니다.",
      successDesc: "내용을 확인한 뒤 영업일 기준 1~2일 내에 해당 부서가 연락드릴 예정입니다.",
      newInquiry: "새 문의 작성",
      submit: "문의 접수하기",
      submitting: "문의 접수 중...",
      subject: "DMC 서비스 및 시스템 구축 문의",
      errors: { failed: "문의 접수에 실패했습니다.", generic: "문의 접수 중 오류가 발생했습니다." },
    },
    en: {
      eyebrow: "Inquiry Form",
      title: "Leave your inquiry details.",
      inquiryType: "Inquiry Type",
      fields: { organization: "Organization / Group", manager: "Contact Person", phone: "Phone", email: "Email", message: "Message" },
      placeholder: "Please describe your purpose, expected schedule, required categories, operation needs, and payment requirements.",
      agree: "I agree to the collection of personal information for inquiry response and follow-up contact.",
      successTitle: "Your inquiry has been submitted successfully.",
      successDesc: "We will review your request and usually respond within 1–2 business days.",
      newInquiry: "Write Another Inquiry",
      submit: "Submit Inquiry",
      submitting: "Submitting...",
      subject: "Inquiry about DMC service and booking setup",
      errors: { failed: "Failed to submit the inquiry.", generic: "An error occurred while submitting your inquiry." },
    },
    ja: {
      eyebrow: "Inquiry Form",
      title: "お問い合わせ内容をご記入ください。",
      inquiryType: "お問い合わせ種別",
      fields: { organization: "機関名 / 団体名", manager: "担当者名", phone: "電話番号", email: "メールアドレス", message: "お問い合わせ内容" },
      placeholder: "目的、予定日程、必要なカテゴリ、運営方法、決済連携の有無などをご記入ください。",
      agree: "個人情報の収集およびお問い合わせ対応のための利用に同意します。",
      successTitle: "お問い合わせが正常に受け付けられました。",
      successDesc: "内容を確認の上、営業日基準1〜2日以内に担当部署よりご連絡いたします。",
      newInquiry: "新しいお問い合わせを作成",
      submit: "お問い合わせを送信",
      submitting: "送信中...",
      subject: "DMCサービスおよびシステム構築のお問い合わせ",
      errors: { failed: "送信に失敗しました。", generic: "送信中にエラーが発生しました。" },
    },
    "zh-CN": {
      eyebrow: "Inquiry Form",
      title: "请留下您的咨询内容。",
      inquiryType: "咨询类型",
      fields: { organization: "机构名 / 团体名", manager: "负责人姓名", phone: "联系方式", email: "电子邮箱", message: "咨询内容" },
      placeholder: "请填写服务目的、预期日程、所需类别、运营方式及支付对接需求等。",
      agree: "本人同意收集个人信息并用于处理咨询及后续联络。",
      successTitle: "咨询已成功提交。",
      successDesc: "我们将在确认内容后，于工作日1至2天内由相关部门与您联系。",
      newInquiry: "填写新咨询",
      submit: "提交咨询",
      submitting: "提交中...",
      subject: "关于DMC服务及系统建设的咨询",
      errors: { failed: "提交失败。", generic: "提交过程中发生错误。" },
    },
    "zh-TW": {
      eyebrow: "Inquiry Form",
      title: "請留下您的諮詢內容。",
      inquiryType: "諮詢類型",
      fields: { organization: "機構名 / 團體名", manager: "負責人姓名", phone: "聯絡方式", email: "電子郵件", message: "諮詢內容" },
      placeholder: "請填寫服務目的、預期行程、所需類別、營運方式及支付串接需求等。",
      agree: "本人同意收集個人資料並用於處理諮詢及後續聯絡。",
      successTitle: "諮詢已成功送出。",
      successDesc: "我們將在確認內容後，於工作日1至2天內由相關部門與您聯繫。",
      newInquiry: "填寫新諮詢",
      submit: "送出諮詢",
      submitting: "送出中...",
      subject: "關於DMC服務及系統建置的諮詢",
      errors: { failed: "送出失敗。", generic: "送出過程中發生錯誤。" },
    },
  };
  return map[locale];
}

function getCopy(locale: PageLocale) {
  return buildCopy(locale);
}

export default function ContactForm({ locale = "ko" }: { locale?: PageLocale }) {
  const copy = getCopy(locale);
  const inquiryTypes = inquiryTypeOptions[locale] ?? inquiryTypeOptions.ko;
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (submitted) {
    return (
      <div className="rounded-[30px] border border-emerald-200 bg-emerald-50 p-8 text-emerald-950 shadow-soft">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <h3 className="mt-5 text-2xl font-black tracking-tight">{copy.successTitle}</h3>
        <p className="mt-4 text-sm leading-7">{copy.successDesc}</p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setError("");
            setForm(initialForm);
          }}
          className="mt-6 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white"
        >
          {copy.newInquiry}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
          const response = await fetch("/api/inquiries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inquiry_type: form.inquiryType,
              organization_name: form.organization,
              contact_name: form.manager,
              phone: form.phone,
              email: form.email,
              subject: copy.subject,
              message: form.message,
              privacy_agreed: form.agree,
            }),
          });

          const result = (await response.json()) as {
            success: boolean;
            error?: string;
          };

          if (!response.ok || !result.success) {
            throw new Error(result.error || copy.errors.failed);
          }

          setSubmitted(true);
        } catch (submitError) {
          setError(
            submitError instanceof Error ? submitError.message : copy.errors.generic
          );
        } finally {
          setSubmitting(false);
        }
      }}
      className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-soft"
    >
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
        {copy.eyebrow}
      </div>
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
        {copy.title}
      </h3>

      <div className="mt-6">
        <div className="mb-3 text-sm font-semibold text-slate-700">
          {copy.inquiryType}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {inquiryTypes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setForm((current) => ({ ...current, inquiryType: item.value }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                form.inquiryType === item.value
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          { key: "organization" as const, label: copy.fields.organization, type: "text" },
          { key: "manager" as const, label: copy.fields.manager, type: "text" },
          { key: "phone" as const, label: copy.fields.phone, type: "tel" },
          { key: "email" as const, label: copy.fields.email, type: "email" },
        ].map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {field.label}
            </label>
            <input
              required
              type={field.type}
              value={form[field.key]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {copy.fields.message}
          </label>
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder={copy.placeholder}
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <input
          type="checkbox"
          required
          checked={form.agree}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              agree: event.target.checked,
            }))
          }
          className="mt-1 h-4 w-4 shrink-0 accent-slate-900"
        />
        <span className="text-sm leading-6 text-slate-600">{copy.agree}</span>
      </label>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!form.agree || !form.inquiryType || submitting}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? copy.submitting : copy.submit}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
