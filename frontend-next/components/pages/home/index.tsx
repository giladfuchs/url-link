import { getTranslations } from "next-intl/server";

import { HomeCTA } from "@/components/shared/wrappers";
import { generateJsonLdHome } from "@/lib/utils/seo";

import type { FaqItem } from "@/lib/types";

export const HomeView = async () => {
  const t = await getTranslations("home");

  const faq = t.raw("seo.faq") as FaqItem[];

  const keywords = t.raw("seo.keywords") as string[];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLdHome(t)),
        }}
      />

      <section className="home-view">
        <h1 className="sr-only">{t("seo.title")}</h1>
        <h2 className="sr-only">{t("seo.description")}</h2>

        <h2>{t("title")}</h2>

        <ul className="home-view__list">
          <li>
            <h3 className="home-view__subtitle">{t("subtitle")}</h3>
          </li>
          <li>
            <h3 className="home-view__subtitle">{t("description1")}</h3>
          </li>
          <li>
            <h3 className="home-view__subtitle">{t("description2")}</h3>
          </li>
        </ul>

        <HomeCTA />

        <section className="home-view__faq" aria-labelledby="faq-title">
          <h2 id="faq-title" className="home-view__faq-title">
            {t("faq.title")}
          </h2>

          {faq.map((item, i) => (
            <article key={i} className="home-view__faq-item">
              <h3 className="home-view__faq-question">{item.name}</h3>
              <p className="home-view__faq-answer">{item.text}</p>
            </article>
          ))}
        </section>

        <div className="keywords-list">
          {keywords.map((keyword, i) => (
            <span key={i} className="keyword-chip">
              {keyword}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
};
