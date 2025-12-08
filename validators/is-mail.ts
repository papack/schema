import { ValidationError } from "../core/validate";

export const isMail = (input: unknown): asserts input is string => {
  if (typeof input !== "string") {
    throw new ValidationError("NOT_A_MAIL");
  }

  // Minimales, aber stabiles Email-Pattern (RFC 5322 light)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(input)) {
    throw new ValidationError("NOT_A_MAIL");
  }
};

isMail.empty = "";

isMail.meta = {
  _js: { type: "string" },
  _form: { tag: "input", type: "email" },
};
