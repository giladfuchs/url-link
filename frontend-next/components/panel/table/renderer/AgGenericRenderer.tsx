"use client";
import { CheckCircleOutline, HighlightOff } from "@mui/icons-material";

import { formatDate } from "@/lib/utils/helper";

import type { ICellRendererParams } from "ag-grid-community";

export default function AgGenericRenderer({
  value,
  colDef,
}: ICellRendererParams) {
  const field = colDef!.field;

  if (!field) return null;
  if (
    ["created_at", "updated_at"].includes(field) &&
    typeof value === "string"
  ) {
    return <span>{formatDate.dateTime(value)}</span>;
  }

  if (["active"].includes(field)) {
    return value ? (
      <CheckCircleOutline sx={{ color: "green" }} />
    ) : (
      <HighlightOff color="error" />
    );
  }

  return <span>{value}</span>;
}
