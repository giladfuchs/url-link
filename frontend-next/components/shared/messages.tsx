"use client";
import { Box, Typography } from "@mui/material";
import { memo, useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "sonner";

const FormFieldErrorBase = ({ fieldError }: { fieldError: string }) => {
  const intl = useIntl();
  const lastShown = useRef<string>("");
  const isUnique = fieldError.includes("unique:");

  useEffect(() => {
    if (!fieldError || fieldError === lastShown.current) return;
    lastShown.current = fieldError;
    toast.error(intl.formatMessage({ id: "form.error" }), {
      description: isUnique
        ? intl.formatMessage({ id: "form.error.unique" })
        : intl.formatMessage({ id: fieldError }),
    });
  }, [fieldError, intl, isUnique]);

  if (!fieldError) return null;

  return (
    <Typography textAlign="center" variant="h1" color="error">
      {isUnique ? (
        <FormattedMessage id="form.error.unique" />
      ) : (
        <FormattedMessage id={fieldError} />
      )}
    </Typography>
  );
};

export const FormFieldError = memo(FormFieldErrorBase);

export const TermsPage = () => {
  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: "1.875rem", m: 0, mb: 1.5 }}>
        <FormattedMessage id="terms.title" />
      </Typography>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.1.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.1.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.1.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.1.p2.lead" />
          </strong>
        </Typography>
        <ul style={{ margin: "0.5rem 1.25rem 0.5rem 0", padding: 0 }}>
          <li>
            <FormattedMessage id="terms.1.def.1" />
          </li>
          <li>
            <FormattedMessage id="terms.1.def.2" />
          </li>
          <li>
            <FormattedMessage id="terms.1.def.3" />
          </li>
          <li>
            <FormattedMessage id="terms.1.def.4" />
          </li>
          <li>
            <FormattedMessage id="terms.1.def.5" />
          </li>
        </ul>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.2.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.2.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.2.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.2.p2.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.2.p2.text" />
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.3.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.3.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.3.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.3.p2.lead" />
          </strong>
        </Typography>
        <ul style={{ margin: "0.5rem 1.25rem 0.5rem 0", padding: 0 }}>
          <li>
            <FormattedMessage id="terms.3.li.1" />
          </li>
          <li>
            <FormattedMessage id="terms.3.li.2" />
          </li>
          <li>
            <FormattedMessage id="terms.3.li.3" />
          </li>
        </ul>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.4.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.4.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.4.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.4.p2.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.4.p2.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.4.p3.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.4.p3.text" />
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.5.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.5.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.5.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.5.p2.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.5.p2.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.5.p3.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.5.p3.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.5.p4.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.5.p4.text" />
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.6.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.6.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.6.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.6.p2.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.6.p2.text" />
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.7.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <strong>
            <FormattedMessage id="terms.7.p1.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.7.p1.text" />
        </Typography>
        <Typography>
          <strong>
            <FormattedMessage id="terms.7.p2.lead" />
          </strong>
        </Typography>
        <Typography>
          <FormattedMessage id="terms.7.p2.text" />
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.8.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <FormattedMessage id="terms.8.p1.text" />
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ fontSize: "1.25rem", mt: 4, mb: 1 }}>
        <FormattedMessage id="terms.9.title" />
      </Typography>
      <Box className="section">
        <Typography>
          <FormattedMessage id="terms.9.p1.text" />
        </Typography>
      </Box>
      <br />
    </Box>
  );
};
