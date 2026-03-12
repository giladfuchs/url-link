"use client";

import { Typography, Grid, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

import { appConfig } from "@/lib/config";
import { ModelType } from "@/lib/types";

export default function LoginButtons() {
  const t = useTranslations();

  const routerRef = useRef<ReturnType<typeof useRouter> | null>(null);
  const router = useRouter();

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const openPopup = useCallback((url: string, name: string) => {
    const w = 30 * 16;
    const h = 40 * 16;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const popup = window.open(
      url,
      name,
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );

    const onMessage = (ev: MessageEvent) => {
      const data = ev.data as { token: string };

      if (data) {
        const maxAge = appConfig.HALF_YEAR;

        document.cookie = `auth_token=true; Max-Age=${maxAge}; Path=/; SameSite=Lax`;

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "token_expires_at",
          String(Date.now() + maxAge * 1000),
        );

        window.removeEventListener("message", onMessage);

        if (popup && !popup.closed) popup.close();

        routerRef.current?.replace(`/panel/${ModelType.link}`);
      }
    };

    window.addEventListener("message", onMessage);
  }, []);

  const loginWithGoogle = () =>
    openPopup(`${appConfig.API_URL}/login/google_login`, "google-oauth");

  return (
    <Box display="grid" gap={2} justifyItems="center" sx={{ mt: -2 }}>
      <Typography fontWeight="bold" variant="h3">
        {t("login.title")}
      </Typography>

      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <button onClick={loginWithGoogle} className="auth-btn google">
          {t("login.google")}

          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: "1.25rem", height: "1.25rem" }}
          />
        </button>
      </Grid>

      <Typography variant="h3">{t("login.description1")}</Typography>

      <Typography variant="h3">{t("login.description2")}</Typography>
    </Box>
  );
}
