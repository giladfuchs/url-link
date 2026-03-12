import { getTranslations } from "next-intl/server";

import { HomeButton } from "@/components/shared/wrappers";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <main className="not-found">
      <h1 className="not-found__title">{t("notFound.title")}</h1>

      <p className="not-found__description">{t("notFound.description")}</p>

      <HomeButton />
    </main>
  );
}
