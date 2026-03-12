"use client";
import LoginButtons from "@/components/pages/home/login-buttons";
import ModelFormContainer from "@/components/panel/form";
import { ModelType } from "@/lib/types";

export default function HomeCTAClient() {
  return (
    <div style={{ height: "35rem", width: "100%" }}>
      <ModelFormContainer id="add" model={ModelType.link} />
      <LoginButtons />
    </div>
  );
}
