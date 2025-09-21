"use client";
import HomeIcon from "@mui/icons-material/Home";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useIntl, FormattedMessage } from "react-intl";

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
  const intl = useIntl();
  return (
    <Dialog open={open} onClose={onClose} slots={{ transition: undefined }}>
      <DialogTitle>
        {intl.formatMessage({ id: "delete.title" }, { title })}
      </DialogTitle>
      <DialogContent>
        {intl.formatMessage({ id: "delete.description" })}
        {isCategory && (
          <div style={{ marginTop: 8, color: "red", fontWeight: 500 }}>
            {intl.formatMessage({ id: "delete.cascadeWarning" })}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {intl.formatMessage({ id: "delete.cancel" })}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          data-testid="confirm-delete-button"
        >
          {intl.formatMessage({ id: "delete.confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const HomeButton = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        my: 1,
      }}
    >
      <Button
        size="small"
        endIcon={<HomeIcon sx={{ mr: localeCache.isRtl() ? 1 : 0 }} />}
        onClick={() =>
          router.push(
            localStorage.getItem("token") ? `/panel/${ModelType.link}` : "/",
          )
        }
      >
        <FormattedMessage id="button.home" />
      </Button>
    </Box>
  );
};
