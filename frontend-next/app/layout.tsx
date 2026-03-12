import "lib/assets/styles/globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";
import Script from "next/script";
import { getTranslations } from "next-intl/server";
import { Toaster } from "sonner";

import Footer from "@/components/layout/footer";
import { AccessibilityBar } from "@/components/shared/wrappers";
import { appConfig, localeCache } from "@/lib/config";
import IntProvider from "@/lib/provider/IntProvider";
import ThemeProviderLayout from "@/lib/provider/ThemeProviderLayout";
import { Language } from "@/lib/types";
import { generateMetadataLayout } from "@/lib/utils/seo";

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

  const t = await getTranslations("home.seo");

  return generateMetadataLayout({
    title: t("title"),
    description: t("description"),
    locale: t("lang"),
  });
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
          src={`https://www.googletagmanager.com/gtag/js?id=${appConfig.GOOGLE_ANALYTICS}`}
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
gtag('config', '${appConfig.GOOGLE_ANALYTICS}', {
  page_path: window.location.pathname,
});
`,
          }}
        />

        <AppRouterCacheProvider options={{ key: "mui" }}>
          <IntProvider>
            <ThemeProviderLayout dir={localeCache.dir()}>
              <div
                id="font-scale-wrapper"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                  maxWidth: "90rem",
                  margin: "0 auto",
                  overflowX: "clip",
                }}
              >
                <main style={{ flexGrow: 1 }}>{children}</main>

                <Footer />

                <Toaster richColors closeButton position="bottom-center" />

                <AccessibilityBar />
              </div>

              <Analytics />
            </ThemeProviderLayout>
          </IntProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
