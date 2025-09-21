"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";

export const useLogout = () => {
  const intl = useIntl();
  const router = useRouter();
  return useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expires_at");
    document.cookie = "auth_token=false; Max-Age=0; Path=/; SameSite=Lax";
    toast.success(intl.formatMessage({ id: "logout.success" }));
    router.push("/");
    router.refresh();
  }, [intl, router]);
};
