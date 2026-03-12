import { appConfig } from "@/lib/config";
import { Language, type FaqItem } from "@/lib/types";

import type { Metadata } from "next";
export const generateMetadataLayout = ({
  title,
  description,
  locale,
}: {
  title: string;
  description: string;
  locale: string;
}): Metadata => {
  return {
    metadataBase: new URL(appConfig.BASE_URL) as URL,
    title: appConfig.SITE_NAME,
    description,
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
      url: appConfig.BASE_URL,
      siteName: appConfig.SITE_NAME,
      title: appConfig.SITE_NAME,
      description,
      images: [
        {
          url: appConfig.ICON_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: appConfig.SITE_NAME,
      description,
      images: [appConfig.ICON_IMAGE_URL],
    },
    alternates: {
      canonical: appConfig.BASE_URL,
      languages: (Object.values(Language) as Language[]).reduce(
        (acc, lang) => {
          acc[lang] = `${appConfig.BASE_URL}/${lang}`;
          return acc;
        },
        {} as Record<Language, string>,
      ),
    },
    verification: {
      google: appConfig.GOOGLE_SITE_VERIFICATION,
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
export const generateJsonLdHome = (t: (key: string) => string) => {
  const raw = (t as unknown as { raw: (key: string) => unknown }).raw;

  const faq = raw("seo.faq") as FaqItem[];
  const featureList = raw("seo.features") as string[];

  const lang = t("seo.lang");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${appConfig.BASE_URL}#organization`,
        name: appConfig.SITE_NAME,
        url: appConfig.BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: appConfig.ICON_IMAGE_URL,
          width: 512,
          height: 512,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${appConfig.BASE_URL}#website`,
        name: appConfig.SITE_NAME,
        url: appConfig.BASE_URL,
        inLanguage: lang,
        publisher: { "@id": `${appConfig.BASE_URL}#organization` },
      },
      {
        "@type": "WebApplication",
        "@id": `${appConfig.BASE_URL}#webapp`,
        name: t("seo.app.name"),
        url: appConfig.BASE_URL,
        applicationCategory: "UtilityApplication",
        applicationSubCategory: "URL Shortener",
        operatingSystem: "Web",
        featureList,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: t("seo.offer.currency"),
        },
      },
      {
        "@type": "WebPage",
        "@id": appConfig.BASE_URL,
        name: t("seo.title"),
        url: appConfig.BASE_URL,
        description: t("seo.description"),
        inLanguage: lang,
        isPartOf: { "@id": `${appConfig.BASE_URL}#website` },
        about: { "@id": `${appConfig.BASE_URL}#webapp` },
        mainEntityOfPage: { "@id": appConfig.BASE_URL },
      },
      {
        "@type": "FAQPage",
        "@id": `${appConfig.BASE_URL}#faq`,
        mainEntity: faq.map((item, i) => ({
          "@type": "Question",
          "@id": `${appConfig.BASE_URL}#faq-${i + 1}`,
          name: item.name,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.text,
            inLanguage: lang,
          },
        })),
      },
      {
        "@type": "Service",
        "@id": `${appConfig.BASE_URL}#service`,
        name: t("seo.app.name"),
        description: t("seo.description"),
        provider: { "@id": `${appConfig.BASE_URL}#organization` },
        areaServed: { "@type": "Place", name: "Worldwide" },
        availableLanguage: lang,
        serviceType: "URL Shortening Service",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      },
    ],
  };
};
