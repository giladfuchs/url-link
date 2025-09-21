import translationsServerRaw from "@/lib/assets/i18n/translations_server.json";
import { localeCache } from "@/lib/config";

/* ------------------------- 🌐 Internationalization ------------------------- */

const translationsServer = translationsServerRaw as Record<
  string,
  Record<string, unknown>
>;

export const getT = (key: string): string =>
  (translationsServer[localeCache.get()] as Record<string, string>)[key] ?? key;

export function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function filterBySearch<T extends object>(
  items: T[],
  searchValue: string,
): T[] {
  if (!searchValue) return items;

  const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return items.filter((item) =>
    regex.test(
      Object.values(item)
        .filter((v) => typeof v === "string")
        .join(" "),
    ),
  );
}

export const array_obj_to_obj_with_key = <T extends Record<string, unknown>>(
  iterable: T[],
  value: unknown,
  key: string,
): T | undefined => {
  return iterable.find((o) => o[key]?.toString() === value?.toString());
};

/* ----------------------------- 🗓️ Date Format ----------------------------- */
export const formatDate = {
  dateTime: (iso: string, timeZone = "Asia/Jerusalem") => {
    const date = new Date(`${iso}Z`);
    return date.toLocaleString("he-IL", {
      timeZone,
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },
};
