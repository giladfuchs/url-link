const isDev = process.env.NODE_ENV === "development";

export const baseUrl: string =
  process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://your-store.vercel.app";

export const API_URL: string =
  isDev
    ? `http://localhost:5007`
    : process.env.NEXT_PUBLIC_API_URL!.trim()

// export const API_URL: string = process.env.NEXT_PUBLIC_API_URL!.trim();

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
export const GOOGLE_ANALYTICS = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const FOOTER_DATA =
  process.env.NEXT_PUBLIC_FOOTER_DATA || "contact@gmail.com"

export const ICON_IMAGE_URL = "/logo.png";

export const HALF_YEAR = 15552000;
