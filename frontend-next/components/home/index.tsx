import { Box, Typography } from "@mui/material";

import { HomeCTA } from "@/components/shared/wrappers";
import { generateJsonLdHome } from "@/lib/config";
import { getT } from "@/lib/utils/helper";

export const HomeView = () => {
  const faq = getT("home.seo.faq") as unknown as {
    name: string;
    text: string;
  }[];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLdHome()),
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          width: "100%",
        }}
      >
        <h1 className="sr-only">{getT("home.seo.title")}</h1>
        <h2 className="sr-only">{getT("home.seo.description")}</h2>
        <Typography component="h2" variant="h1" sx={{ m: 0 }}>
          {getT("home.title")}
        </Typography>
        <Box component="ul" sx={{ lineHeight: 1, m: 0, pl: "1rem", mb: -3 }}>
          <li>
            <Typography variant="h3" sx={{ m: 0, mb: "0.5rem" }}>
              {getT("home.subtitle")}
            </Typography>
          </li>
          <li>
            <Typography variant="h3" sx={{ m: 0, mb: "0.5rem" }}>
              {getT("home.description1")}
            </Typography>
          </li>
          <li>
            <Typography variant="h3" sx={{ m: 0 }}>
              {getT("home.description2")}
            </Typography>
          </li>
        </Box>
        <HomeCTA />
        <Box sx={{ maxWidth: "40rem", mt: 6 }}>
          <Typography variant="h2" gutterBottom>
            {getT("home.faq.title")}
          </Typography>
          {faq.map((item, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {item.name}
              </Typography>
              <Typography>{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};
