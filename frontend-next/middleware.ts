import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
enum Language {
  EN = "en",
  ES = "es",
  HE = "he",
}

const LANGUAGES = new Set<string>(Object.values(Language));
const LANG_REGEX = new RegExp(`^/(${Array.from(LANGUAGES).join("|")})(?:/|$)`);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get("auth_token")?.value;
  const local = req.cookies.get("NEXT_LOCALE")?.value;
  const first = pathname.split("/")[1] as string;

  // 1. If logged in and at "/" or already in a language path → go to panel
  if (auth === "true" && (pathname === "/" || LANGUAGES.has(first))) {
    return NextResponse.redirect(new URL("/panel/link", req.url));
  }

  if (
    pathname === "/" &&
    local &&
    local !== Language.HE &&
    LANGUAGES.has(local)
  ) {
    return NextResponse.redirect(new URL(`/${local}`, req.url));
  }

  const m = pathname.match(LANG_REGEX);
  if (m) {
    const lang = m[1] as Language;
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", lang, {
      maxAge: 31536000,
      path: "/",
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
