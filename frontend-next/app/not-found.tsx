"use client";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { HomeButton } from "@/components/shared/elements-client";

export default function NotFound() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Typography variant="h1" fontWeight="bold" mb="1.5rem" textAlign="center">
        <FormattedMessage id="notFound.title" />
      </Typography>

      <Typography
        fontSize="1.2rem"
        mb="2rem"
        textAlign="center"
        variant="h2"
        maxWidth="40rem"
      >
        <FormattedMessage id="notFound.description" />
      </Typography>

      <HomeButton />
    </Box>
  );
}
