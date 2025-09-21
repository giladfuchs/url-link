import { baseUrl } from "@/lib/config/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/report/sitemap.xml`,
    host: baseUrl,
  };
}
