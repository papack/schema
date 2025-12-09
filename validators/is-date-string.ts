import { ValidationError } from "../core/validate";

// ISO string from Date.prototype.toISOString()
// e.g. 2024-01-01T12:34:56.789Z
const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// must be a full ISO datetime string
export const isDateString = (input: unknown): asserts input is string => {
  if (typeof input !== "string") {
    throw new ValidationError("NOT_A_DATE");
  }

  if (!ISO_DATETIME_REGEX.test(input)) {
    throw new ValidationError("NOT_A_DATE");
  }

  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    throw new ValidationError("NOT_A_DATE");
  }
};

isDateString.empty = "";

isDateString.meta = {
  _js: { type: "string", format: "date-time" },
  _form: { tag: "input", type: "datetime-local" },
};
