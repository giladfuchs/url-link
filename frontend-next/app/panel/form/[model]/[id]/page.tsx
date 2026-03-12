"use client";
import { notFound } from "next/navigation";
import { use } from "react";

import FormContainer from "@/components/panel/form";
import { useAppSelector } from "@/lib/store";
import { safeDecodeURIComponent } from "@/lib/utils/helper";
import { ModelType } from "lib/types";

export default function FormPage({
  params,
}: {
  params: Promise<{ model: ModelType; id: string }>;
}) {
  const { model, id } = use(params);
  if (!Object.values(ModelType).includes(model as ModelType)) notFound();
  const decodedId = safeDecodeURIComponent(id);
  const rows = useAppSelector((s) => s.panel.models[model] ?? []);

  return (
    <FormContainer
      model={model}
      id={decodedId}
      findByKey={"alias"}
      rows={rows}
    />
  );
}
