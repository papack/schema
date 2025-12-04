import { describe, it, expect } from "bun:test";
import { isStringRange } from "./is-string-range";
import { ValidationError } from "../core/validate";

describe("isStringRange", () => {
  describe("configuration", () => {
    it("throws if minLength or maxLength is not a number", () => {
      // @ts-expect-error for runtime test
      expect(() => isStringRange({ minLength: "x", maxLength: 10 })).toThrow(
        "NOT_A_NUMBER"
      );
      // @ts-expect-error for runtime test
      expect(() => isStringRange({ minLength: 0, maxLength: "x" })).toThrow(
        "NOT_A_NUMBER"
      );
    });

    it("throws if minLength or maxLength is negative", () => {
      expect(() => isStringRange({ minLength: -1, maxLength: 5 })).toThrow(
        "STRING_RANGE_INVALID"
      );
      expect(() => isStringRange({ minLength: 1, maxLength: -5 })).toThrow(
        "STRING_RANGE_INVALID"
      );
    });

    it("throws if minLength > maxLength", () => {
      expect(() => isStringRange({ minLength: 10, maxLength: 5 })).toThrow(
        "STRING_RANGE_INVALID"
      );
    });
  });

  // valid config
  const fn = isStringRange({ minLength: 2, maxLength: 5 });

  describe("assertion", () => {
    it("accepts strings within valid range", () => {
      expect(() => fn("ab")).not.toThrow();
      expect(() => fn("abc")).not.toThrow();
      expect(() => fn("abcde")).not.toThrow();
    });

    it("throws for non-string values", () => {
      const invalid = [123, true, null, {}, [], undefined];

      for (const v of invalid) {
        expect(() => fn(v)).toThrow(ValidationError);
        try {
          //@ts-expect-error
          fn(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_STRING");
        }
      }
    });

    it("throws when string is too short", () => {
      try {
        //@ts-expect-error
        fn("a");
      } catch (err) {
        expect((err as ValidationError).code).toBe("STRING_TOO_SHORT");
      }
    });

    it("throws when string is too long", () => {
      try {
        //@ts-expect-error
        fn("abcdef");
      } catch (err) {
        expect((err as ValidationError).code).toBe("STRING_TOO_LONG");
      }
    });
  });

  describe("meta", () => {
    it("contains correct metadata", () => {
      expect(fn.meta).toEqual({
        _js: {
          type: "string",
          minLength: 2,
          maxLength: 5,
        },
        _form: {
          tag: "input",
          type: "text",
          minLength: 2,
          maxLength: 5,
        },
        _sqlite: {
          type: "text",
          minLength: 2,
          maxLength: 5,
        },
        _postgres: {
          type: "varchar(5)",
          minLength: 2,
          maxLength: 5,
        },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value", () => {
      expect(fn.empty).toBe("");
    });
  });
});
