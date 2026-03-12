"use client";

import HomeIcon from "@mui/icons-material/Home";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { memo, useEffect, useRef } from "react";
import { toast } from "sonner";

import { localeCache } from "@/lib/config";
import { ModelType } from "@/lib/types";

export const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  isCategory,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isCategory: boolean;
}) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onClose={onClose} slots={{ transition: undefined }}>
      <DialogTitle>{t("delete.title", { title })}</DialogTitle>

      <DialogContent>
        {t("delete.description")}

        {isCategory && (
          <div style={{ marginTop: "0.5rem", color: "red", fontWeight: 500 }}>
            {t("delete.cascadeWarning")}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("delete.cancel")}</Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          data-testid="confirm-delete-button"
        >
          {t("delete.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FormFieldErrorBase = ({ fieldError }: { fieldError: string }) => {
  const t = useTranslations();
  const lastShown = useRef<string>("");
  const isUnique = fieldError.includes("unique:");

  useEffect(() => {
    if (!fieldError || fieldError === lastShown.current) return;
    lastShown.current = fieldError;

    toast.error(t("form.error.general"), {
      description: isUnique ? t("form.error.unique") : t(fieldError),
    });
  }, [fieldError, isUnique, t]);

  if (!fieldError) return null;

  return (
    <Typography textAlign="center" variant="h1" color="error">
      {isUnique ? t("form.error.unique") : t(fieldError)}
    </Typography>
  );
};

export const FormFieldError = memo(FormFieldErrorBase);

export const HomeButtonClient = () => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        my: "0.25rem",
      }}
    >
      <Button
        size="small"
        endIcon={<HomeIcon sx={{ mr: localeCache.isRtl() ? "0.25rem" : 0 }} />}
        onClick={() =>
          router.push(
            localStorage.getItem("token") ? `/panel/${ModelType.link}` : "/",
          )
        }
      >
        {t("button.home")}
      </Button>
    </Box>
  );
};
