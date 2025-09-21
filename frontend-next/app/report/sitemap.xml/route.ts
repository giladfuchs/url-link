import { baseUrl } from "@/lib/config";
import { Language } from "@/lib/types";
const LAST_MODIFIED = "2025-09-11" as const;

export async function GET() {
  const all = Object.values(Language)
    .filter((lang) => lang !== Language.HE)
    .map((lang) => ({
      url: `${baseUrl}/${lang}`,
      lastModified: LAST_MODIFIED,
    }));
  const routes = [{ url: `${baseUrl}`, lastModified: LAST_MODIFIED }, ...all];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .map(
        (r) =>
          `  <url>\n` +
          `    <loc>${r.url}</loc>\n` +
          `    <lastmod>${r.lastModified}</lastmod>\n` +
          `  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
