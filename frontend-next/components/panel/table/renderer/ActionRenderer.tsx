"use client";

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmDialog } from "@/components/shared/elements-client";
import { appConfig } from "@/lib/config";
import { deleteRowById, useAppDispatch } from "@/lib/store";

import type { ModelType } from "@/lib/types";
import type { ICellRendererParams } from "ag-grid-community";

export default function ActionRenderer({ data }: ICellRendererParams) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  const model = pathname.split("/").at(-1) as ModelType;

  const id: number = data.id;
  const alias: number = data.alias;
  const title: string = data.title;

  const dispatch = useAppDispatch();

  const handleConfirmDelete = async () => {
    setOpen(false);

    try {
      await dispatch(deleteRowById({ model, id })).unwrap();

      toast.success(t("delete.success", { title }));
    } catch {
      toast.error(t("delete.error", { title }));
    }
  };

  const handleCopy = async () => {
    const url = `${appConfig.API_URL}/${alias}`;
    await navigator.clipboard.writeText(url);

    toast.success(t("copy.clipboard"), {
      description: url,
    });
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="copy"
        color="success"
        onClick={handleCopy}
        data-testid="action-copy-button"
      >
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>

      <Link href={`/panel/report/${alias}`}>
        <IconButton
          size="small"
          aria-label="view"
          color="secondary"
          data-testid="action-view-button"
        >
          <VisibilityIcon fontSize="inherit" />
        </IconButton>
      </Link>

      <Link href={`/panel/form/${model}/${alias}`}>
        <IconButton
          size="small"
          aria-label="edit"
          color="primary"
          data-testid="action-edit-button"
        >
          <EditIcon fontSize="inherit" />
        </IconButton>
      </Link>

      <IconButton
        size="small"
        aria-label="delete"
        color="error"
        onClick={() => setOpen(true)}
        data-testid="action-delete-button"
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>

      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        title={title}
        isCategory={true}
      />
    </>
  );
}
