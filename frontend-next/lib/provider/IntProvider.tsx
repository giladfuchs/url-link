"use client";

import { type ReactNode, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";

import translations from "@/lib/assets/i18n/translations.json";

import { localeCache } from "../config";

import type { Language } from "@/lib/types";

export default function IntProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>(localeCache.get());
  const _locale = localeCache.get();
  useEffect(() => {
    setLocale(localeCache.get());
  }, [_locale]);

  return (
    <IntlProvider locale={locale} messages={translations[locale]}>
      {children}
    </IntlProvider>
  );
}
