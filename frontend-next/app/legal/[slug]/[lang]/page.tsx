import { notFound } from "next/navigation";

import LegalPageView from "@/components/pages/legal";
import { localeCache } from "@/lib/config";
import { Language } from "@/lib/types";
export const dynamic = "force-static";
export const revalidate = false;
export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: Language; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!Object.values(Language).includes(lang)) {
    notFound();
  }

  if (!["terms", "accessibility", "remove"].includes(slug)) {
    notFound();
  }

  localeCache.set(lang);

  return <LegalPageView slug={slug} />;
}
