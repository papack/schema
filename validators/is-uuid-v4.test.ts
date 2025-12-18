import { describe, it, expect } from "bun:test";
import { isUuidv4 } from "./is-uuid-v4";
import { ValidationError } from "../core/validate";

describe("isUuidv4", () => {
  describe("assertion", () => {
    it("accepts valid uuid v4 strings", () => {
      const uuid = crypto.randomUUID();
      expect(() => isUuidv4(uuid)).not.toThrow();
    });

    it("throws ValidationError for non-string values", () => {
      expect(() => isUuidv4(123)).toThrow(ValidationError);
      expect(() => isUuidv4(null)).toThrow(ValidationError);
      expect(() => isUuidv4({})).toThrow(ValidationError);
    });

    it("throws ValidationError for invalid uuid strings", () => {
      expect(() => isUuidv4("")).toThrow(ValidationError);
      expect(() => isUuidv4("not-a-uuid")).toThrow(ValidationError);
      expect(() => isUuidv4("123e4567-e89b-12d3-a456-426614174000")).toThrow(
        ValidationError
      );

      try {
        isUuidv4("not-a-uuid");
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("NOT_A_UUID_V4");
      }
    });
  });

  describe("meta", () => {
    it("contains the correct metadata", () => {
      expect(isUuidv4.meta).toEqual({
        _js: { type: "string", format: "uuid" },
        _form: { tag: "input", type: "text" },
      });
    });
  });

  describe("empty", () => {
    it("has a valid uuid v4 as empty default", () => {
      expect(() => isUuidv4(isUuidv4.empty)).not.toThrow();
    });
  });
});
