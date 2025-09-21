import { HomeView } from "@/components/home";
import { generateMetadataHome, localeCache } from "@/lib/config";
import { Language } from "@/lib/types";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  localeCache.set(Language.HE);
  return generateMetadataHome();
}

export default async function HomePage() {
  localeCache.set(Language.HE);
  return <HomeView />;
}
