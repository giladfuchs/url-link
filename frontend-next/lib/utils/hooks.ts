"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";

export const useLogout = () => {
  const t = useTranslations();
  const router = useRouter();

  return useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expires_at");

    document.cookie = "auth_token=false; Max-Age=0; Path=/; SameSite=Lax";

    toast.success(t("logout.success"));

    router.push("/");
    router.refresh();
  }, [router, t]);
};
