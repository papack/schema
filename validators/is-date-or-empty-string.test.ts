import { describe, expect, it } from "bun:test";
import { ValidationError } from "../core";
import { isDateOrEmptyString } from "./is-date-or-empty-string";

describe("isDateOrEmptyString", () => {
  it("accepts empty string", () => {
    expect(() => isDateOrEmptyString("")).not.toThrow();
  });

  it("accepts ISO datetime and rejects everything else", () => {
    expect(() => isDateOrEmptyString("2024-06-01T10:20:30.123Z")).not.toThrow();

    const invalid = ["2024-01-01", "foo", 123, null];

    for (const v of invalid) {
      expect(() => isDateOrEmptyString(v as any)).toThrow(ValidationError);
    }
  });
});
