export type AppConfig = {
  BASE_URL: string;
  API_URL: string;

  SITE_NAME: string;
  GOOGLE_ANALYTICS?: string;
  GOOGLE_SITE_VERIFICATION: string;

  EMAIL_CONTACT: string;

  ICON_IMAGE_URL: string;

  HALF_YEAR: number;
};

export const appConfig: AppConfig = Object.freeze({
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!.trim(),

  API_URL: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5007").trim(),

  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? "URL-LINK",

  GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,

  GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION!,

  EMAIL_CONTACT: process.env.NEXT_PUBLIC_EMAIL_CONTACT!,

  ICON_IMAGE_URL: "/logo.png",

  HALF_YEAR: 15552000,
});
