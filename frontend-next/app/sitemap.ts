import { appConfig } from "@/lib/config";
import { Language } from "@/lib/types";

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const LAST_MODIFIED = "2026-03-11";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.values(Language).filter(
    (lang) => lang !== Language.HE,
  );

  return [
    {
      url: appConfig.BASE_URL,
      lastModified: LAST_MODIFIED,
    },
    ...languages.map((lang) => ({
      url: `${appConfig.BASE_URL}/${lang}`,
      lastModified: LAST_MODIFIED,
    })),
  ];
}
