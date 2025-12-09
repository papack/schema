import { isDateString } from "./is-date-string";

// ISO datetime string OR empty string
export const isDateOrEmptyString = (
  input: unknown
): asserts input is string => {
  if (input === "") return;
  isDateString(input);
};

isDateOrEmptyString.empty = "";

isDateOrEmptyString.meta = {
  _js: { type: "string", format: "date-time" },
  _form: { tag: "input", type: "datetime-local" },
};
