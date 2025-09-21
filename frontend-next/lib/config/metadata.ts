// lib/seo.ts
import {
  baseUrl,
  GOOGLE_SITE_VERIFICATION,
  ICON_IMAGE_URL,
  SITE_NAME,
} from "@/lib/config";
import { getT } from "@/lib/utils/helper";

import type { Metadata } from "next";

export const generateMetadataLayout = (): Metadata => {
  const title = getT("home.seo.title");
  const description = getT("home.seo.description");
  const keywords = getT("home.seo.keywords");
  const locale = getT("home.seo.lang");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: SITE_NAME!,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      type: "website",
      locale,
      url: baseUrl,
      siteName: SITE_NAME!,
      title: SITE_NAME!,
      description,
      images: [{ url: ICON_IMAGE_URL, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME!,
      description,
      images: [ICON_IMAGE_URL],
    },
    alternates: {
      canonical: baseUrl,
    },
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
      other: { rel: "manifest", url: "/site.webmanifest" },
    },
  };
};

export const generateMetadataHome = (): Metadata => {
  const title = getT("home.seo.title");
  const description = getT("home.seo.description");
  const keywords = getT("home.seo.keywords");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: baseUrl,
      images: [ICON_IMAGE_URL],
      type: "website",
    },
    alternates: { canonical: baseUrl },
  };
};
