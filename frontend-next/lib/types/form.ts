import { FormType, ModelType } from "./enums";

import type { Link } from "@/lib/types";
export type FieldValue = string | number | boolean | null;

export class FieldInput {
  constructor(
    public type: FormType,
    public key: string,
    public value: FieldValue = "",
  ) {}
}

export type FormField = FieldInput;

export const link_fields: FormField[] = [
  new FieldInput(FormType.TEXT, "url"),
  new FieldInput(FormType.TEXT, "alias"),
  new FieldInput(FormType.Switch, "active"),
];

export const get_form_by_model = (model: ModelType): FormField[] => {
  switch (model) {
    case ModelType.link:
      return [...link_fields];
    default:
      return [...link_fields];
  }
};

export const create_form_fields = (
  source: FormField[],
  target: FormModelType | undefined,
): FormField[] => {
  if (
    target === undefined ||
    (typeof target === "object" && Object.keys(target).length === 0)
  ) {
    return source.map((field) => {
      return new FieldInput(field.type, field.key, field.value);
    });
  }

  return source.map((field) => {
    const updatedValue = (target as Record<string, FieldValue>)[field.key];

    return new FieldInput(
      field.type,
      field.key,
      typeof updatedValue === "string" ? updatedValue.trim() : updatedValue,
    );
  });
};

export const form_fields_to_data = (
  send_fields: FormField[],
): Record<string, FieldValue> => {
  return Object.fromEntries(
    send_fields.map((f) => {
      let value = f.value;
      if (typeof value === "string") {
        value = value.trim();
        if (value === "") return [f.key, null];
      }

      if (f.type === "number" && typeof value === "string") {
        const num = Number(value);
        return [f.key, isNaN(num) ? null : num];
      }

      return [f.key, value];
    }),
  );
};
export type FormModelType = Link;
