import { appConfig } from "@/lib/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${appConfig.BASE_URL}/sitemap.xml`,
    host: appConfig.BASE_URL,
  };
}
