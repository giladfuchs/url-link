"use client";
import { use } from "react";

import Report from "@/components/shared/report";
export default function ReportPage({
  params,
}: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = use(params);
  return <Report alias={alias} />;
}
