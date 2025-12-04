import { ValidationError } from "../core/validate";

export const isStringRange = (config: {
  minLength: number;
  maxLength: number;
}) => {
  const { minLength, maxLength } = config;

  if (typeof minLength !== "number" || typeof maxLength !== "number") {
    throw new ValidationError("NOT_A_NUMBER");
  }

  if (minLength < 0 || maxLength < 0) {
    throw new ValidationError("STRING_RANGE_INVALID");
  }

  if (minLength > maxLength) {
    throw new ValidationError("STRING_RANGE_INVALID");
  }

  const fn = (input: unknown): asserts input is string => {
    if (typeof input !== "string") {
      throw new ValidationError("NOT_A_STRING");
    }

    if (input.length < minLength) {
      throw new ValidationError("STRING_TOO_SHORT");
    }

    if (input.length > maxLength) {
      throw new ValidationError("STRING_TOO_LONG");
    }
  };

  fn.empty = "";

  fn.meta = {
    _js: {
      type: "string",
      minLength,
      maxLength,
    },
    _form: {
      tag: "input",
      type: "text",
      minLength,
      maxLength,
    },
    _sqlite: {
      type: "text",
      minLength,
      maxLength,
    },
    _postgres: {
      type:
        minLength === maxLength
          ? `char(${maxLength})`
          : `varchar(${maxLength})`,
      minLength,
      maxLength,
    },
  };

  return fn;
};
