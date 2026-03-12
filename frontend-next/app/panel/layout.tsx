"use client";
import { useEffect, useState } from "react";

import ReduxProvider from "@/lib/provider/ReduxProvider";
import { useLogout } from "@/lib/utils/hooks";

import type { ReactNode } from "react";

export default function PanelLayout({ children }: { children: ReactNode }) {
  const logout = useLogout();

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const expiresAt = Number(localStorage.getItem("token_expires_at"));
      const isExpired = !expiresAt || Date.now() > expiresAt;

      if (!token || isExpired) {
        await logout();
      } else {
        setIsAllowed(true);
      }
    };

    void checkAuth();
  }, [logout]);

  if (!isAllowed) return null;

  return <ReduxProvider>{children}</ReduxProvider>;
}
