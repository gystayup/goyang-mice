import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthProvider } from "@/lib/auth-provider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";

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

  return (
    <AuthProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <CurrencyProvider>{children}</CurrencyProvider>
      </NextIntlClientProvider>
    </AuthProvider>
  );
}
