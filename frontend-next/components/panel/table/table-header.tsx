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
import { FormattedMessage } from "react-intl";

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
  const logout = useLogout();
  const router = useRouter();

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
            <Typography variant="h1">
              <FormattedMessage id={`panel.${model}.title`} />
            </Typography>
            <Typography
              variant="h2"
              sx={{ mt: 1 }}
              data-testid="panel-row-count"
            >
              {count}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={<FormattedMessage id="search.logout" />}>
            <IconButton color="error" onClick={() => logout()} size="large">
              <LogoutIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
      <Grid size={6}>
        <Button
          data-testid={`add-${model}-button`}
          variant="contained"
          onClick={() => router.push(`/panel/form/${model}/add`)}
          endIcon={<AddIcon sx={{ mr: localeCache.isRtl() ? 1 : 0 }} />}
        >
          <FormattedMessage id={`panel.${model}.add`} />
        </Button>
      </Grid>
      <Grid size={6}>
        <FormattedMessage id="panel.search.placeholder">
          {(msg) => (
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={String(msg)}
              aria-label={String(msg)}
              value={searchValue}
              onChange={onSearchChange}
              sx={{ minWidth: "12rem" }}
            />
          )}
        </FormattedMessage>
      </Grid>
    </Grid>
  );
};
