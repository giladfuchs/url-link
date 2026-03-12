import { Email as EmailIcon } from "@mui/icons-material";
import { getTranslations } from "next-intl/server";

import { LangToggle } from "@/components/shared/wrappers";
import { appConfig, localeCache } from "@/lib/config";

import type { CSSProperties } from "react";

const SOCIAL_LINKS = [
  {
    icon: EmailIcon,
    href: `mailto:${appConfig.EMAIL_CONTACT}`,
    label: "Email",
    color: "#F44336",
    hover: "#fbe9e7",
  },
];
export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="footer" style={{ direction: localeCache.dir() }}>
      <div className="footer__inner">
        <div className="footer__center">
          <span className="footer__contact">{t("contact")}</span>

          <div className="footer__social-list">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label, color, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="footer__social-link"
                style={
                  {
                    color,
                    "--footer-social-hover": hover,
                  } as CSSProperties
                }
              >
                <Icon className="footer__social-icon" />
              </a>
            ))}
          </div>

          <span className="footer__separator">|</span>

          <a
            href={`/legal/terms/${localeCache.get()}`}
            className="footer__terms"
          >
            {t("terms")}
          </a>
        </div>

        <div className="footer__copyright">{t("copyright")}</div>
        <div className="footer__lang">
          <LangToggle />
        </div>
      </div>
    </footer>
  );
}
