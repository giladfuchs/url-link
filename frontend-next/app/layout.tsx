import "lib/assets/styles/globals.css";
import { Box } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";

import Footer from "@/components/layout/footer";
import { LoadingPage } from "@/components/shared/loading-skeleton";
import { AccessibilityBar } from "@/components/shared/wrappers";
import {
  localeCache,
  GOOGLE_ANALYTICS,
  generateMetadataLayout,
} from "@/lib/config";
import IntProvider from "@/lib/provider/IntProvider";
import ThemeProviderLayout from "@/lib/provider/ThemeProviderLayout";
import { Language } from "@/lib/types";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

async function initLocale(): Promise<void> {
  const local = (await cookies()).get("NEXT_LOCALE")?.value as
    | Language
    | undefined;
  if (local && Object.values(Language).includes(local)) {
    localeCache.set(local);
  }
}

export async function generateMetadata(): Promise<Metadata> {
  await initLocale();
  return generateMetadataLayout();
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  await initLocale();

  return (
    <html lang={localeCache.get()} dir={localeCache.dir()}>
      <body suppressHydrationWarning>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
      });
    `,
          }}
        />
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <IntProvider>
            <ThemeProviderLayout dir={localeCache.dir()}>
              <Box
                id="font-scale-wrapper"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  bgcolor: "var(--color-bg)",
                  color: "var(--color-text)",
                  maxWidth: "90rem",
                  mx: "auto",
                  px: 0,
                  overflowX: "clip",
                  "::selection": {
                    backgroundColor: "teal",
                    color: "white",
                  },
                }}
              >
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <Suspense fallback={<LoadingPage />}>{children}</Suspense>
                </Box>
                <Footer />
                <Toaster richColors closeButton position="bottom-center" />
                <AccessibilityBar />
              </Box>
              <Analytics />
              <SpeedInsights />
            </ThemeProviderLayout>
          </IntProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
