import { Box, Typography, IconButton, Link, Grid } from "@mui/material";

import { LangToggle } from "@/components/shared/wrappers";
import { localeCache, SOCIAL_LINKS } from "@/lib/config";
import { getT } from "@/lib/utils/helper";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "var(--color-bg)",
        color: "var(--color-text-strong)",
        borderTop: "1px solid var(--color-border)",
        py: { xs: "0.75rem", md: "1rem" },
        direction: localeCache.dir(),
      }}
    >
      <Grid
        container
        sx={{ maxWidth: "45rem", mx: "auto", px: "1rem" }}
        alignItems="center"
        justifyContent="space-between"
        rowGap={{ xs: "0.5rem", md: 0 }}
        columnGap={{ md: "0.75rem" }}
      >
        <Grid size={{ xs: 12, md: "auto" }}>
          <LangToggle />
        </Grid>
        <Grid
          size={{ xs: 12, md: "auto" }}
          container
          alignItems="center"
          wrap="nowrap"
          columnGap="0.4rem"
        >
          {SOCIAL_LINKS.map(({ icon: Icon, href, label, color, hover }) => (
            <div key={label}>
              {getT("footer.contact")}

              <IconButton
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  color,
                  width: "2.25rem",
                  height: "2.25rem",
                  "&:hover": { backgroundColor: hover },
                }}
              >
                <Icon sx={{ fontSize: "1.4rem" }} />
              </IconButton>
            </div>
          ))}
          |
          <Link
            href="/legal/terms"
            sx={{
              color: "var(--color-primary)",
              fontSize: "1rem",
              fontWeight: 500,
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            {getT("footer.terms")}
          </Link>
        </Grid>

        <Grid size={{ xs: 12, md: "auto" }}>
          <Typography
            sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
            fontWeight={600}
            lineHeight={1.2}
          >
            {getT("footer.copyright")}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
