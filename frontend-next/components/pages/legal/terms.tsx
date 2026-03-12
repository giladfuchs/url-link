import { getTranslations } from "next-intl/server";

export async function TermsPage() {
  const t = await getTranslations();

  return (
    <section className="legal-page__terms">
      <h1 className="legal-page__main-title">{t("terms.title")}</h1>

      <h2 className="legal-page__sub-title">{t("terms.1.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.1.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.1.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.1.p2.lead")}</strong>
        </p>

        <ul className="legal-page__list">
          <li className="legal-page__list-item">{t("terms.1.def.1")}</li>
          <li className="legal-page__list-item">{t("terms.1.def.2")}</li>
          <li className="legal-page__list-item">{t("terms.1.def.3")}</li>
          <li className="legal-page__list-item">{t("terms.1.def.4")}</li>
          <li className="legal-page__list-item">{t("terms.1.def.5")}</li>
        </ul>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.2.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.2.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.2.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.2.p2.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.2.p2.text")}</p>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.3.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.3.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.3.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.3.p2.lead")}</strong>
        </p>

        <ul className="legal-page__list">
          <li className="legal-page__list-item">{t("terms.3.li.1")}</li>
          <li className="legal-page__list-item">{t("terms.3.li.2")}</li>
          <li className="legal-page__list-item">{t("terms.3.li.3")}</li>
        </ul>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.4.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.4.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.4.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.4.p2.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.4.p2.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.4.p3.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.4.p3.text")}</p>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.5.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.5.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.5.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.5.p2.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.5.p2.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.5.p3.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.5.p3.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.5.p4.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.5.p4.text")}</p>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.6.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.6.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.6.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.6.p2.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.6.p2.text")}</p>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.7.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">
          <strong>{t("terms.7.p1.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.7.p1.text")}</p>

        <p className="legal-page__paragraph">
          <strong>{t("terms.7.p2.lead")}</strong>
        </p>
        <p className="legal-page__paragraph">{t("terms.7.p2.text")}</p>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.8.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">{t("terms.8.p1.text")}</p>
      </section>

      <h2 className="legal-page__sub-title">{t("terms.9.title")}</h2>
      <section className="legal-page__section">
        <p className="legal-page__paragraph">{t("terms.9.p1.text")}</p>
      </section>
    </section>
  );
}
