"use client";

import { use } from "react";

import Report from "@/components/shared/report";
export default function ReportPage({
  params,
}: {
  params: Promise<{ password_hash: string }>;
}) {
  const { password_hash } = use(params);
  return <Report password_hash={password_hash} isPublic />;
}
