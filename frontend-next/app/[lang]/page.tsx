import { notFound } from "next/navigation";

import { localeCache } from "@/lib/config";
import { Language } from "@/lib/types";
import { HomeView } from "components/pages/home";

export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () =>
  Object.values(Language).map((lang) => ({ lang }));

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  if (!Object.values(Language).includes(lang)) {
    notFound();
  }

  localeCache.set(lang);
  return <HomeView />;
}
