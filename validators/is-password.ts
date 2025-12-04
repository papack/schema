import { ValidationError } from "../core/validate";

export const isPassword = (config: {
  minLength: number;
  minNumbers: number;
  minSpecialChars: number;
}) => {
  const { minLength, minNumbers, minSpecialChars } = config;

  const numberRegex = /[0-9]/g;
  const specialRegex = /[^A-Za-z0-9]/g;

  const fn = (input: unknown): asserts input is string => {
    if (typeof input !== "string") {
      throw new ValidationError("NOT_A_STRING");
    }

    if (input.length < minLength) {
      throw new ValidationError("PASSWORD_TOO_SHORT");
    }

    const numbers = input.match(numberRegex)?.length ?? 0;
    if (numbers < minNumbers) {
      throw new ValidationError("PASSWORD_TOO_FEW_NUMBERS");
    }

    const specials = input.match(specialRegex)?.length ?? 0;
    if (specials < minSpecialChars) {
      throw new ValidationError("PASSWORD_TOO_FEW_SPECIALS");
    }
  };

  // Sinnvolles default: leeres PW → invalid → leerer String
  fn.empty = "";

  fn.meta = {
    _js: {
      type: "string",
      minLength,
      minNumbers,
      minSpecialChars,
    },
    _form: {
      tag: "input",
      type: "password",
      minLength,
      minNumbers,
      minSpecialChars,
    },
    _sqlite: {
      type: "text",
    },
    _postgres: {
      type: "text",
    },
  };

  return fn;
};
