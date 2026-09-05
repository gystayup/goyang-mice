import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthProvider } from "@/lib/auth-provider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { readSiteCopy } from "@/lib/site-copy-db";
import { EXCHANGE_RATES, type CurrencyCode } from "@/data/currency";

const locales = ["ko", "en", "ja", "zh-CN", "zh-TW"] as const;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // 오더 #C60: admin 편집 환율을 서버에서 조회해 CurrencyProvider 에 주입.
  //   DB 실패/무값 → defaultSiteCopy.exchangeRates 폴백 (readSiteCopy 내부 처리).
  const sc = await readSiteCopy();
  const rates: Record<CurrencyCode, number> = {
    KRW: 1,
    USD: sc.exchangeRates.USD ?? EXCHANGE_RATES.USD,
    JPY: sc.exchangeRates.JPY ?? EXCHANGE_RATES.JPY,
    CNY: sc.exchangeRates.CNY ?? EXCHANGE_RATES.CNY,
    TWD: sc.exchangeRates.TWD ?? EXCHANGE_RATES.TWD,
  };

  return (
    <AuthProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <CurrencyProvider rates={rates}>{children}</CurrencyProvider>
      </NextIntlClientProvider>
    </AuthProvider>
  );
}
