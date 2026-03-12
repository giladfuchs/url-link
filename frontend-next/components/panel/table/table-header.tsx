"use client";

import { Add as AddIcon, Logout as LogoutIcon } from "@mui/icons-material";
import {
  Button,
  Box,
  Grid,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { localeCache } from "@/lib/config";
import { useLogout } from "@/lib/utils/hooks";

import type { ModelType } from "@/lib/types";
import type { ChangeEvent } from "react";

interface Props {
  model: ModelType;
  count: number;
  searchValue: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const TableHeader = ({
  model,
  count,
  searchValue,
  onSearchChange,
}: Props) => {
  const t = useTranslations();
  const logout = useLogout();
  const router = useRouter();

  const searchPlaceholder = t("panel.search.placeholder");

  return (
    <Grid
      container
      spacing={1}
      justifyContent="space-between"
      sx={{ my: "1rem" }}
    >
      <Grid size={12}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h1">{t(`panel.${model}.title`)}</Typography>

            <Typography
              variant="h2"
              sx={{ mt: 1 }}
              data-testid="panel-row-count"
            >
              {count}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={t("search.logout")}>
            <IconButton color="error" onClick={logout} size="large">
              <LogoutIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      <Grid size={6}>
        <Button
          data-testid={`add-${model}-button`}
          variant="contained"
          onClick={() => router.push(`/panel/form/${model}/add`)}
          endIcon={<AddIcon sx={{ mr: localeCache.isRtl() ? "0.25rem" : 0 }} />}
        >
          {t(`panel.${model}.add`)}
        </Button>
      </Grid>

      <Grid size={6}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          sx={{ minWidth: "12rem" }}
        />
      </Grid>
    </Grid>
  );
};
