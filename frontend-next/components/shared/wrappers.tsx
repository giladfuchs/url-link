"use client";
import dynamic from "next/dynamic";

import { HomeCTALoading } from "@/components/shared/loading-skeleton";

export const HomeCTA = dynamic(
  () => import("@/components/pages/home/home-cta"),
  {
    ssr: false,
    loading: () => <HomeCTALoading />,
  },
);

export const AccessibilityBar = dynamic(
  () => import("@/components/layout/accessibility-bar"),
  { ssr: false },
);

export const LangToggle = dynamic(
  () => import("@/components/layout/lang-toggle"),
  { ssr: false },
);

export const HomeButton = dynamic(
  () =>
    import("@/components/shared/elements-client").then(
      (mod) => mod.HomeButtonClient,
    ),
  { ssr: false },
);
