import { describe, expect, it } from "bun:test";
import { isDateString } from "./is-date-string";
import { ValidationError } from "../core";

describe("isDateString (ISO datetime)", () => {
  it("accepts valid ISO datetime strings", () => {
    expect(() => isDateString("2024-01-01T00:00:00.000Z")).not.toThrow();
    expect(() => isDateString("1999-12-31T23:59:59.999Z")).not.toThrow();
  });

  it("throws for non-ISO datetime strings", () => {
    const invalid = [
      "2024-01-01",
      "2024-01-01T00:00:00Z", // missing milliseconds
      "2024-01-01T00:00:00.000", // missing Z
      "not-a-date",
      "",
    ];

    for (const v of invalid) {
      expect(() => isDateString(v)).toThrow(ValidationError);
      try {
        isDateString(v);
      } catch (err) {
        expect((err as ValidationError).code).toBe("NOT_A_DATE");
      }
    }
  });
});
