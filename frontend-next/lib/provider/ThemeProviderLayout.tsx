"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";

import type { ReactNode } from "react";

export default function ThemeProviderLayout({
  dir,
  children,
}: {
  dir: "ltr" | "rtl";
  children: ReactNode;
}) {
  const theme = useMemo(
    () =>
      createTheme({
        direction: dir,
        palette: {
          primary: { main: "#4338CA" },
          secondary: { main: "#06B6D4" },
          warning: { main: "#ff9800", contrastText: "#fff" },
          error: { main: "#d32f2f", contrastText: "#fff" },
          background: { default: "#f4f9f8" },
        },
        shape: { borderRadius: 8 },
        typography: {
          h1: { fontSize: "2.125rem !important", fontWeight: 800 },
          h2: { fontSize: "1.5rem !important", fontWeight: 700 },
          h3: {
            fontSize: "1.25rem !important",
            fontWeight: 400,
            color: "#666666",
          },
          h5: {
            fontSize: "1rem !important",
            fontWeight: 600,
            marginTop: "1.5rem",
          },
        },
        components: {
          MuiTextField: {
            defaultProps: {
              slotProps: {
                inputLabel: { shrink: true },
                formHelperText: {
                  sx: {
                    whiteSpace: "pre-line",
                    textAlign: dir === "rtl" ? "right" : "left",
                  },
                },
              },
              variant: "outlined",
              fullWidth: true,
            },
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "#ddd" },
                  "&:hover fieldset": { borderColor: "#aaa" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8112cb",
                    borderWidth: 1,
                  },
                  "& input": {
                    padding: "0.75rem",
                    fontSize: "1rem",
                    lineHeight: 1.5,
                  },
                },
                "& .MuiOutlinedInput-root.MuiInputBase-multiline": {
                  alignItems: "flex-start",
                  padding: 0,
                  "& textarea": {
                    maxHeight: "6rem",
                    overflowY: "auto",
                    padding: "0.75rem",
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    resize: "none",
                    boxSizing: "border-box",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: "0.0625rem",
                  },
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1em",
                fontFamily: "inherit",
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
                boxShadow: "none",
                border: "1px solid #ddd",
                transition: "all 0.2s",
                "&.underline-links": { textDecoration: "underline" },
                "@media (prefers-contrast: more)": {
                  color: "yellow",
                  borderColor: "yellow",
                },
              },
            },
          },
        },
      }),
    [dir],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
