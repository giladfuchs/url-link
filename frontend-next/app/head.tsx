import { appConfig } from "@/lib/config";

export default function Head() {
  return (
    <>
      <link rel="preconnect" href={appConfig.API_URL} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={appConfig.API_URL} />
      <meta
        name="google-site-verification"
        content={appConfig.GOOGLE_SITE_VERIFICATION}
      />
    </>
  );
}
