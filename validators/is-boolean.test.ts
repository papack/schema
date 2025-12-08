import { describe, it, expect } from "bun:test";
import { isBoolean } from "./is-boolean";
import { ValidationError } from "../core/validate";

describe("isBoolean", () => {
  describe("assertion", () => {
    it("accepts true and false", () => {
      expect(() => isBoolean(true)).not.toThrow();
      expect(() => isBoolean(false)).not.toThrow();
    });

    it("throws ValidationError for non-boolean values", () => {
      expect(() => isBoolean(1)).toThrow(ValidationError);
      expect(() => isBoolean("x")).toThrow(ValidationError);
      expect(() => isBoolean(null)).toThrow(ValidationError);

      try {
        isBoolean("x");
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("NOT_A_BOOLEAN");
      }
    });
  });

  describe("meta", () => {
    it("contains the correct metadata", () => {
      expect(isBoolean.meta).toEqual({
        _js: { type: "boolean" },
        _form: { tag: "checkbox" },
      });
    });
  });

  describe("empty", () => {
    it("has the correct empty default", () => {
      expect(isBoolean.empty).toBe(false);
    });
  });
});
