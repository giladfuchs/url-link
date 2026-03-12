import { getTranslations } from "next-intl/server";

import { legal_sections } from "@/components/pages/legal/legal_sections";
import { TermsPage } from "@/components/pages/legal/terms";
import { HomeButton } from "@/components/shared/wrappers";
import { appConfig, localeCache } from "@/lib/config";

export default async function LegalPageView({ slug }: { slug: string }) {
  const t = await getTranslations();

  const content = legal_sections[slug as "terms" | "accessibility" | "remove"];

  return (
    <main className="legal-page" style={{ direction: localeCache.dir() }}>
      <HomeButton />

      {slug === "terms" && <TermsPage />}

      {content.sections.map((section, idx) => (
        <section
          key={idx}
          className={`legal-page__section${idx > 0 ? " legal-page__section--spaced" : ""}`}
        >
          <h2 className="legal-page__title">{t(section.title)}</h2>

          {section.paragraphs?.map((pid, i) => (
            <p key={i} className="legal-page__paragraph">
              {t(pid)}
            </p>
          ))}

          {section.list && (
            <ul className="legal-page__list">
              {section.list.map((lid, i) => (
                <li key={i} className="legal-page__list-item">
                  {t(lid)}
                </li>
              ))}
            </ul>
          )}

          {section.contact && (
            <p className="legal-page__contact">
              {t(section.contact, { email: "" })}
              <a href={`mailto:${appConfig.EMAIL_CONTACT}`}>
                {appConfig.EMAIL_CONTACT}
              </a>
            </p>
          )}
        </section>
      ))}

      <p className="legal-page__muted">{t("terms.last_update")}: 29/08/2025</p>

      <HomeButton />
    </main>
  );
}
