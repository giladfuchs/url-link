"use client";

import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

import { HomeButtonClient } from "@/components/shared/elements-client";

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations();

  return (
    <main className="not-found">
      <h1 className="not-found__title">{t("errorPage.title")}</h1>

      <p className="not-found__description">{t("errorPage.message")}</p>

      <Button
        onClick={reset}
        variant="contained"
        sx={{
          fontSize: "1rem",
          padding: "0.5rem 1rem",
        }}
      >
        {t("errorPage.retry")}
      </Button>
      <HomeButtonClient />
    </main>
  );
}
