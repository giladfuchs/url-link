"use client";
import { TextField, FormControlLabel, Switch } from "@mui/material";
import { useIntl } from "react-intl";

import { FormType } from "@/lib/types";

import type { FieldValue, FormField } from "@/lib/types";

type FormFieldProps = {
  field: FormField;
  onChange: (value: FieldValue, key: string) => void;
};

export default function FieldRenderer({ field, onChange }: FormFieldProps) {
  const intl = useIntl();
  const placeholder = intl.formatMessage({
    id: `form.placeholder.${field.key}`,
  });
  const safeMessage = (id: string, fallback?: string) => {
    try {
      return intl.formatMessage({ id });
    } catch {
      return fallback ?? "";
    }
  };
  switch (field.type) {
    case FormType.Switch:
      return (
        <FormControlLabel
          control={
            <Switch
              data-testid={`form-input-${field.key}`}
              onChange={(e, value) => onChange(value, field.key)}
              checked={!!field.value as boolean}
            />
          }
          label={placeholder}
        />
      );

    case FormType.TEXT:
    case FormType.TEXTAREA:
    case FormType.NUMBER:
    default:
      return (
        <TextField
          fullWidth
          variant="outlined"
          label={safeMessage(`form.label.${field.key}`, placeholder)}
          helperText={safeMessage(`form.helper.${field.key}`) || undefined}
          placeholder={placeholder}
          value={field.value}
          type={field.type === FormType.NUMBER ? "number" : "text"}
          multiline={field.type === FormType.TEXTAREA}
          rows={field.type === FormType.TEXTAREA ? 5 : undefined}
          onChange={(e) => onChange(e.target.value, field.key)}
          data-testid={`form-input-${field.key}`}
        />
      );
  }
}
