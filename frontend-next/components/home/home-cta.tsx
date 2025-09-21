"use client";
import LoginButtons from "@/components/home/login-buttons";
import ModelFormContainer from "@/components/panel/form";
import { ModelType } from "@/lib/types";

export default function HomeCTAClient() {
  return (
    <>
      <ModelFormContainer id="add" model={ModelType.link} />
      <LoginButtons />
    </>
  );
}
