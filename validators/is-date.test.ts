import { describe, it, expect } from "bun:test";
import { isDate } from "./is-date";
import { ValidationError } from "../core/validate";

describe("isDate", () => {
  describe("assertion", () => {
    it("accepts valid date strings", () => {
      expect(() => isDate("2024-01-01")).not.toThrow();
      expect(() => isDate("1999-12-31")).not.toThrow();
      expect(() => isDate("2020-02-29")).not.toThrow(); // leap year
    });

    it("throws for invalid date strings", () => {
      const invalid = ["not-a-date", ""];

      for (const v of invalid) {
        expect(() => isDate(v)).toThrow(ValidationError);
        try {
          isDate(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_DATE");
        }
      }
    });

    it("throws for non-string values", () => {
      const invalid = [123, true, null, {}, [], undefined];

      for (const v of invalid) {
        expect(() => isDate(v)).toThrow(ValidationError);
        try {
          isDate(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_DATE");
        }
      }
    });
  });

  describe("meta", () => {
    it("returns correct metadata", () => {
      expect(isDate.meta).toEqual({
        _js: { type: "string", format: "date" },
        _form: { tag: "input", type: "date" },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value", () => {
      expect(isDate.empty).toBe("");
    });
  });
});
