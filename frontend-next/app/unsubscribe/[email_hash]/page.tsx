"use client";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { use, useMemo, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { toast } from "sonner";

import { HomeButton } from "@/components/shared/elements-client";
import API from "@/lib/utils/api";

import type { AxiosError } from "axios";

const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const validate_email = (v: string) => {
  return email_regex.test(v);
};
const decode_email = (hash: string) => {
  try {
    const pad =
      hash.length % 4 === 0 ? hash : hash + "=".repeat(4 - (hash.length % 4));
    return atob(pad.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return "";
  }
};
export default function UnsubscribePage({
  params,
}: {
  params: Promise<{ email_hash: string }>;
}) {
  const { email_hash } = use(params);
  const intl = useIntl();

  const initial_email = useMemo(() => decode_email(email_hash), [email_hash]);
  const [email, set_email] = useState(initial_email);
  const [loading, set_loading] = useState(false);
  const [removedEmail, setSuccessRemovedEmail] = useState<string | null>(null);
  const [failRemovedEmail, setFailRemovedEmail] = useState<string | null>(null);

  const submit = async () => {
    if (!email) {
      toast.error(intl.formatMessage({ id: "unsubscribe.required" }));
      return;
    }
    if (!validate_email(email)) {
      const msgIntl = intl.formatMessage({ id: "unsubscribe.invalid" });
      setFailRemovedEmail(msgIntl);
      toast.error(msgIntl);
      return;
    }
    set_loading(true);
    setSuccessRemovedEmail(null);

    setFailRemovedEmail(null);

    try {
      const res = await API.get<string>(`/unsubscribe/${email}`);
      const msgEmail = res.data || email;
      const msgIntl = intl.formatMessage(
        { id: "unsubscribe.success" },
        { email: msgEmail },
      );
      setSuccessRemovedEmail(msgIntl);
      toast.success(msgIntl);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const msgIntl = intl.formatMessage(
        { id: "unsubscribe.error" },
        { error: error.response?.data?.message ?? error.message ?? "" },
      );
      setFailRemovedEmail(msgIntl);
      toast.error(msgIntl);
    } finally {
      set_loading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: "2rem" }}>
      <Box sx={{ display: "grid", gap: "1rem" }}>
        <Typography variant="h1">
          <FormattedMessage id="unsubscribe.title" />
        </Typography>

        {!removedEmail && (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            sx={{ display: "grid", gap: "1rem" }}
          >
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => set_email(e.target.value.trim())}
              autoFocus
              autoComplete="email"
              inputMode="email"
              placeholder={intl.formatMessage({
                id: "unsubscribe.placeholder",
              })}
            />
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <FormattedMessage id="unsubscribe.processing" />
                  <CircularProgress color="secondary" />
                </>
              ) : (
                <FormattedMessage id="unsubscribe.button" />
              )}
            </Button>
          </Box>
        )}

        {removedEmail && (
          <Typography variant="h2" color="success" role="alert">
            {removedEmail}
          </Typography>
        )}
        {failRemovedEmail && (
          <Typography variant="h2" color="error">
            {failRemovedEmail}
          </Typography>
        )}
        <HomeButton />
      </Box>
    </Container>
  );
}
