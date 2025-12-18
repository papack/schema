import { ValidationError } from "../core/validate";

export const isUuidv4 = (input: unknown): asserts input is string => {
  if (typeof input !== "string") {
    throw new ValidationError("NOT_A_UUID_V4");
  }

  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidV4Regex.test(input)) {
    throw new ValidationError("NOT_A_UUID_V4");
  }
};

isUuidv4.empty = crypto.randomUUID();

isUuidv4.meta = {
  _js: { type: "string", format: "uuid" },
  _form: { tag: "input", type: "text" },
};
