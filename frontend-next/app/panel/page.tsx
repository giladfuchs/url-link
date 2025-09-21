import { redirect } from "next/navigation";

import { ModelType } from "@/lib/types";

export default function PanelRedirectPage() {
  redirect(`/panel/${ModelType.link}`);
}
