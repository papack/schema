import { describe, it, expect } from "bun:test";
import { isNumberRange } from "./is-number-range";
import { ValidationError } from "../core/validate";

describe("isNumberRange", () => {
  describe("parameter validation", () => {
    it("throws for non-number min", () => {
      // @ts-expect-error intentional invalid calls
      expect(() => isNumberRange("x", 10)).toThrow(ValidationError);
    });

    it("throws for non-number max", () => {
      // @ts-expect-error intentional invalid calls
      expect(() => isNumberRange(0, "x")).toThrow(ValidationError);
    });

    it("throws for NaN min or max", () => {
      expect(() => isNumberRange(NaN, 10)).toThrow(ValidationError);
      expect(() => isNumberRange(0, NaN)).toThrow(ValidationError);
    });

    it("throws when min > max", () => {
      expect(() => isNumberRange(10, 0)).toThrow("NUMBER_RANGE_INVALID");
    });
  });

  // create a valid range function
  const fn = isNumberRange(5, 10);

  describe("assertion", () => {
    it("accepts numbers within range", () => {
      expect(() => fn(5)).not.toThrow();
      expect(() => fn(7)).not.toThrow();
      expect(() => fn(10)).not.toThrow();
    });

    it("throws when input is below min", () => {
      try {
        //@ts-expect-error
        fn(4);
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("NUMBER_RANGE_VIOLATION");
      }
    });

    it("throws when input is above max", () => {
      try {
        //@ts-expect-error
        fn(11);
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("NUMBER_RANGE_VIOLATION");
      }
    });

    it("throws for non-number values", () => {
      const invalid = ["x", null, {}, [], true];

      for (const v of invalid) {
        expect(() => fn(v)).toThrow(ValidationError);
        try {
          //@ts-expect-error
          fn(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_NUMBER");
        }
      }
    });
  });

  describe("meta", () => {
    it("contains correct metadata", () => {
      expect(fn.meta).toEqual({
        _js: { type: "number", min: 5, max: 10 },
        _form: { tag: "select", type: "number", min: 5, max: 10 },
        _sqlite: { type: "real", min: 5, max: 10 },
        _postgres: { type: "numeric", min: 5, max: 10 },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value", () => {
      expect(fn.empty).toBe(5);
    });
  });
});
