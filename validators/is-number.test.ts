import { describe, it, expect } from "bun:test";
import { isNumber } from "./is-number";
import { ValidationError } from "../core/validate";

describe("isNumber", () => {
  describe("assertion", () => {
    it("accepts valid numbers", () => {
      expect(() => isNumber(0)).not.toThrow();
      expect(() => isNumber(123)).not.toThrow();
      expect(() => isNumber(-50)).not.toThrow();
      expect(() => isNumber(3.14)).not.toThrow();
    });

    it("throws for NaN", () => {
      expect(() => isNumber(NaN)).toThrow(ValidationError);
      try {
        isNumber(NaN);
      } catch (err) {
        expect((err as ValidationError).code).toBe("NOT_A_NUMBER");
      }
    });

    it("throws for non-number values", () => {
      const invalid = ["x", true, null, {}, [], undefined];

      for (const v of invalid) {
        expect(() => isNumber(v)).toThrow(ValidationError);
        try {
          isNumber(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_NUMBER");
        }
      }
    });
  });

  describe("meta", () => {
    it("returns correct metadata", () => {
      expect(isNumber.meta).toEqual({
        _js: { type: "number" },
        _form: { tag: "input", type: "number" },
        _sqlite: { type: "real" },
        _postgres: { type: "numeric" },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value", () => {
      expect(isNumber.empty).toBe(0);
    });
  });
});
