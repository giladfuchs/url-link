import { Language } from "@/lib/types";

class LocaleCache {
  private locale: Language = Language.HE;

  get(): Language {
    if (typeof document !== "undefined") {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="));
      const value = cookie?.split("=")[1] as Language | undefined;

      return value ?? this.locale;
    }

    return this.locale;
  }

  set(locale: Language) {
    this.locale = locale;
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
    }
  }

  isRtl(): boolean {
    return this.get() === Language.HE;
  }

  dir(): "rtl" | "ltr" {
    return this.isRtl() ? "rtl" : "ltr";
  }
}

export const localeCache = new LocaleCache();
