import { ValidationError } from "../core/validate";

export const isUnionList = <const Values extends readonly (string | number)[]>(
  values: Values,
  config: { allowEmpty: boolean } = { allowEmpty: true }
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

  const fn = (input: unknown): asserts input is Values[number][] => {
    if (!Array.isArray(input)) {
      throw new ValidationError("NOT_A_LIST");
    }

    if (!config.allowEmpty && input.length === 0) {
      throw new ValidationError("NOT_IN_UNION");
    }

    for (const item of input) {
      if (typeof item !== baseType) {
        throw new ValidationError("NOT_IN_UNION");
      }
      if (!values.includes(item as Values[number])) {
        throw new ValidationError("NOT_IN_UNION");
      }
    }
  };

  fn.empty = config.allowEmpty ? [] : [values[0]];

  fn.meta = {
    _js: {
      type: `${baseType}[]`,
      enum: values,
      allowEmpty: config.allowEmpty,
    },
    _form: {
      tag: "select",
      variant: "multiple",
      options: values.map((v) => ({ value: v, label: String(v) })),
      allowEmpty: config.allowEmpty,
    },
    _sqlite: {
      type: "json",
      enum: values,
    },
    _postgres: {
      type: "jsonb",
      enum: values,
    },
  };

  return fn;
};
