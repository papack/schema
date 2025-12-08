import { ValidationError } from "../core/validate";

export const isDate = (input: unknown): asserts input is string => {
  if (typeof input !== "string" || (input as any) instanceof Date) {
    throw new ValidationError("NOT_A_DATE");
  }

  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    throw new ValidationError("NOT_A_DATE");
  }
};

isDate.empty = "";

isDate.meta = {
  _js: { type: "string", format: "date" },
  _form: { tag: "input", type: "date" },
};
