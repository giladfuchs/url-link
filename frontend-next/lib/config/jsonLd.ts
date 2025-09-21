import { baseUrl, SITE_NAME, ICON_IMAGE_URL } from "@/lib/config/config";
import { getT } from "@/lib/utils/helper";

export const generateJsonLdHome = () => {
  const faq = getT("home.seo.faq") as unknown as {
    name: string;
    text: string;
  }[];
  const featureList = getT("home.seo.features");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: SITE_NAME,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: ICON_IMAGE_URL,
          width: 512,
          height: 512,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: SITE_NAME,
        url: baseUrl,
        inLanguage: getT("home.seo.lang"),
        publisher: { "@id": `${baseUrl}#organization` },
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#webapp`,
        name: getT("home.seo.app.name"),
        url: baseUrl,
        applicationCategory: "UtilityApplication",
        applicationSubCategory: "URL Shortener",
        operatingSystem: "Web",
        featureList,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: getT("home.seo.offer.currency"),
        },
      },
      {
        "@type": "WebPage",
        "@id": baseUrl,
        name: getT("home.seo.title"),
        url: baseUrl,
        description: getT("home.seo.description"),
        inLanguage: getT("home.seo.lang"),
        isPartOf: { "@id": `${baseUrl}#website` },
        about: { "@id": `${baseUrl}#webapp` },
        mainEntityOfPage: { "@id": baseUrl },
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        mainEntity: faq.map((item, i) => ({
          "@type": "Question",
          "@id": `${baseUrl}#faq-${i + 1}`,
          name: item.name,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.text,
            inLanguage: getT("home.seo.lang"),
          },
        })),
      },
      {
        "@type": "Service",
        "@id": `${baseUrl}#service`,
        name: getT("home.seo.app.name"),
        description: getT("home.seo.description"),
        provider: { "@id": `${baseUrl}#organization` },
        areaServed: { "@type": "Place", name: "Worldwide" },
        availableLanguage: "Hebrew",
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
