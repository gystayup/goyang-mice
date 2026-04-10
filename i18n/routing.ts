import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en", "ja", "zh-CN", "zh-TW"],
  defaultLocale: "ko",
  localePrefix: "always",
});
