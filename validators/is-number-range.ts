import { ValidationError } from "../core/validate";

export const isNumberRange = (min: number, max: number) => {
  if (typeof min !== "number" || Number.isNaN(min)) {
    throw new ValidationError("NOT_A_NUMBER");
  }
  if (typeof max !== "number" || Number.isNaN(max)) {
    throw new ValidationError("NOT_A_NUMBER");
  }
  if (min > max) {
    throw new ValidationError("NUMBER_RANGE_INVALID");
  }

  const fn = (input: unknown): asserts input is number => {
    if (typeof input !== "number" || Number.isNaN(input)) {
      throw new ValidationError("NOT_A_NUMBER");
    }

    if (input < min || input > max) {
      throw new ValidationError("NUMBER_RANGE_VIOLATION");
    }
  };

  fn.empty = min;

  fn.meta = {
    _js: {
      type: "number",
      min,
      max,
    },
    _form: {
      tag: "select",
      type: "number",
      min,
      max,
    },
    _sqlite: {
      type: "real",
      min,
      max,
    },
    _postgres: {
      type: "numeric",
      min,
      max,
    },
  };

  return fn;
};
