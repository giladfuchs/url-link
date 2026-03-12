import "ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
declare global {
  var __agAllRegistered: boolean | undefined;
}
if (!globalThis.__agAllRegistered) {
  ModuleRegistry.registerModules([AllCommunityModule]);
  globalThis.__agAllRegistered = true;
}

import { ModelType } from "./enums";

import type { Link, Breakdown } from "@/lib/types";
import type { ColDef } from "ag-grid-community";

export type AGTableModelType = Link | Breakdown;
export const baseMetricsCols: ColDef<Partial<Breakdown>>[] = [
  {
    field: "clicks",
    width: 95,
  },
  {
    field: "uniques",
    width: 95,
  },
];
export const columns_link: ColDef<Link>[] = [
  {
    field: "alias",
    width: 160,
  },
  {
    field: "id",
    cellRenderer: "ActionRenderer",
    width: 150,
  },
  {
    field: "url",

    minWidth: 320,
  },
  ...baseMetricsCols,

  {
    field: "active",
    cellRenderer: "AgGenericRenderer",
    width: 100,
  },
  {
    field: "created_at",
    cellRenderer: "AgGenericRenderer",
    width: 145,
  },
  {
    field: "updated_at",
    cellRenderer: "AgGenericRenderer",
    width: 145,
  },
] as ColDef<Link>[];

export const get_columns_ag_by_model = (
  model: ModelType,
): ColDef<AGTableModelType>[] => {
  let columns;
  switch (model) {
    case ModelType.link:
      columns = [...columns_link];
      break;

    default:
      columns = [...columns_link];
  }

  return columns as ColDef<AGTableModelType>[];
};
