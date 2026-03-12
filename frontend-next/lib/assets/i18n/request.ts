import { getRequestConfig } from "next-intl/server";

import { localeCache } from "@/lib/config";

import translations from "./translations.json";

type Messages = (typeof translations)["en"];

export default getRequestConfig(() => {
  const locale = localeCache.get();

  return {
    locale,
    messages: translations[locale as keyof typeof translations] as Messages,
  };
});
