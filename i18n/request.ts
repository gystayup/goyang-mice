import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

import ko from "../messages/ko.json";
import en from "../messages/en.json";
import ja from "../messages/ja.json";
import zhCN from "../messages/zh-CN.json";
import zhTW from "../messages/zh-TW.json";

const messages: Record<string, unknown> = { ko, en, ja, "zh-CN": zhCN, "zh-TW": zhTW };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: messages[locale] as Record<string, unknown>,
  };
});
