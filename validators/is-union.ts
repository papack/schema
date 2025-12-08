import { ValidationError } from "../core/validate";

export const isUnion = <const Values extends readonly (string | number)[]>(
  ...values: Values
) => {
  if (values.length === 0) {
    throw new ValidationError("UNION_EMPTY");
  }

  const baseType = typeof values[0];

  if (baseType !== "string" && baseType !== "number") {
    throw new ValidationError("UNION_UNSUPPORTED_TYPE");
  }

  for (const v of values) {
    if (typeof v !== baseType) {
      throw new ValidationError("UNION_MIXED_TYPE");
    }
  }

  const fn = (input: unknown): asserts input is Values[number] => {
    if (typeof input !== baseType) {
      throw new ValidationError("NOT_IN_UNION");
    }

    if (!values.includes(input as Values[number])) {
      throw new ValidationError("NOT_IN_UNION");
    }
  };

  fn.empty = values[0];

  fn.meta = {
    _js: {
      type: baseType,
    },
    _form: {
      tag: "select",
      options: values.map((v) => ({ value: v, label: String(v) })),
    },
  };

  return fn;
};
