"use client";
import { Grid, Button, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FormFieldError } from "@/components/shared/messages";

import FieldRenderer from "./field-renderer";

import type { FieldValue, FormField } from "@/lib/types";

interface DynamicFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (send_fields: FormField[]) => void;
  fieldError: string | null;
  isLoading: boolean;
}

export default function DynamicForm({
  title,
  fields,
  onSubmit,
  fieldError,
  isLoading,
}: DynamicFormProps) {
  const router = useRouter();
  const [localFields, setLocalFields] = useState<FormField[]>([]);

  useEffect(() => {
    setLocalFields(fields);
  }, [fields]);

  const handleChange = (value: FieldValue, key: string) => {
    const updatedFields = localFields.map((field) =>
      field.key === key ? { ...field, value } : field,
    );
    setLocalFields(updatedFields);
  };

  return (
    <Grid<"form">
      container
      justifyContent="center"
      component="form"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoading) onSubmit(localFields);
      }}
    >
      <Grid size={{ xs: 12, sm: 10, md: 6, lg: 5 }}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            data-testid="form-title"
            variant="h2"
            textAlign="center"
            fontWeight="bold"
          >
            <FormattedMessage id={title} />
          </Typography>
          {typeof window !== "undefined" &&
            window.location.href.includes("form") && (
              <Button
                size="small"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                <FormattedMessage id="form.button.back" />
              </Button>
            )}
        </Grid>

        <Grid
          container
          direction="column"
          spacing={3}
          sx={{
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 200ms ease",
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          {localFields.map((field) => (
            <Grid key={field.key}>
              <FieldRenderer field={field} onChange={handleChange} />
            </Grid>
          ))}

          {fieldError && <FormFieldError fieldError={fieldError} />}

          <Grid display="flex" justifyContent="center" mt={1}>
            {isLoading ? (
              <CircularProgress size={28} />
            ) : (
              <Button
                type="submit"
                data-testid="form-submit-button"
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  backgroundColor: "var(--color-accent)",
                  "&:hover": {
                    backgroundColor: "var(--color-accent)",
                    opacity: 0.9,
                  },
                }}
              >
                <FormattedMessage id="form.button.submit" />
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
