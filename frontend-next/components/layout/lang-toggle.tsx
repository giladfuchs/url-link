"use client";

import TranslateTwoToneIcon from "@mui/icons-material/TranslateTwoTone";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { localeCache } from "@/lib/config";
import { Language } from "@/lib/types";

import type { MouseEvent } from "react";

const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: Language.EN, label: "English 🇺🇸" },
  { code: Language.ES, label: "Español 🇪🇸" },
  { code: Language.HE, label: "עברית 🇮🇱" },
];

export default function LangToggleClient() {
  const t = useTranslations();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const switchLang = (lang: Language) => {
    const segments = window.location.pathname.split("/");
    const current = segments.at(-1);

    localeCache.set(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = localeCache.dir();

    if (!current || Object.values(Language).includes(current as Language)) {
      segments[segments.length - 1] = lang;
      router.push(segments.join("/") || `/legal/terms/${lang}`);
    }

    router.refresh();
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "0.5rem",
          zIndex: 1300,
        }}
      >
        <Typography sx={{ userSelect: "none" }}>
          {t("language_change")}
        </Typography>

        <IconButton
          sx={{
            bgcolor: "var(--color-border)",
            "&:hover": { bgcolor: "var(--color-label-bg)" },
            width: "2rem",
            height: "2rem",
          }}
          aria-label="Change language"
        >
          <TranslateTwoToneIcon />
        </IconButton>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {LANG_OPTIONS.map(({ code, label }) => (
          <MenuItem
            key={code}
            onClick={() => {
              handleClose();
              switchLang(code);
            }}
          >
            <Typography variant="body2">{label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
