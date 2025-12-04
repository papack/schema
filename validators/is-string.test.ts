import { describe, it, expect } from "bun:test";
import { isString } from "./is-string";
import { ValidationError } from "../core/validate";

describe("isString", () => {
  describe("assertion", () => {
    it("accepts valid strings", () => {
      expect(() => isString("")).not.toThrow();
      expect(() => isString("hello")).not.toThrow();
      expect(() => isString("123")).not.toThrow();
    });

    it("throws for non-string values", () => {
      const invalid = [123, true, null, {}, [], undefined];

      for (const v of invalid) {
        expect(() => isString(v)).toThrow(ValidationError);
        try {
          isString(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_STRING");
        }
      }
    });
  });

  describe("meta", () => {
    it("contains correct metadata", () => {
      expect(isString.meta).toEqual({
        _js: { type: "string" },
        _form: { tag: "input", type: "text" },
        _sqlite: { type: "text" },
        _postgres: { type: "text" },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value", () => {
      expect(isString.empty).toBe("");
    });
  });
});
