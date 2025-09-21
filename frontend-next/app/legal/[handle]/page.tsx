"use client";
import { Box, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { use } from "react";
import { FormattedMessage } from "react-intl";

import { HomeButton } from "@/components/shared/elements-client";
import { TermsPage } from "@/components/shared/messages";
import { localeCache, legal_sections, email } from "@/lib/config";

export default function LegalPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  if (!["terms", "accessibility", "remove"].includes(handle)) notFound();
  const content =
    legal_sections[handle as "terms" | "accessibility" | "remove"];

  return (
    <Box
      component="main"
      sx={{
        maxWidth: 860,
        mx: "auto",
        px: 2,
        py: 4,
        color: "var(--color-text)",
        bgcolor: "var(--color-bg)",
        direction: localeCache.dir(),
        "& .muted": { color: "#666", fontSize: ".95rem" },
        "& .section": { marginTop: "1rem" },
        "& ul": { margin: "0.5rem 1.25rem 0.5rem 0", padding: 0 },
        "& li": { marginBottom: "0.25rem" },
      }}
    >
      <HomeButton />
      {handle === "terms" && <TermsPage />}

      {content.sections.map((section, idx) => (
        <section key={idx}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            mt={idx > 0 ? 4 : 0}
          >
            <FormattedMessage id={section.title} />
          </Typography>
          {section.paragraphs?.map((pid, i) => (
            <Typography key={i}>
              <FormattedMessage id={pid} />
            </Typography>
          ))}
          {section.list && (
            <ul style={{ margin: "0.5rem 1.25rem 0.5rem 0", padding: 0 }}>
              {section.list.map((lid, i) => (
                <li key={i}>
                  <FormattedMessage id={lid} />
                </li>
              ))}
            </ul>
          )}
          {section.contact && (
            <Typography mt={2}>
              <FormattedMessage
                id={section.contact}
                values={{ email: <a href={`mailto:${email}`}>{email}</a> }}
              />
            </Typography>
          )}
        </section>
      ))}
      <Typography className="muted">
        <FormattedMessage id="terms.last_update" />: 29/08/2025
      </Typography>

      <HomeButton />
    </Box>
  );
}
