import { describe, it, expect } from "bun:test";
import { isMail } from "./is-mail";
import { ValidationError } from "../core/validate";

describe("isMail", () => {
  describe("assertion", () => {
    it("accepts valid email addresses", () => {
      const valid = [
        "test@example.com",
        "user.name+tag@domain.co",
        "a@b.io",
        "x@y.z",
      ];

      for (const v of valid) {
        expect(() => isMail(v)).not.toThrow();
      }
    });

    it("throws for invalid email addresses", () => {
      const invalid = [
        "",
        "no-at-symbol",
        "missing-domain@",
        "@missing-local.com",
        "a@b",
        "a@b.",
        "a@.com",
        "white space@example.com",
        "test@@example.com",
        "test@exa mple.com",
      ];

      for (const v of invalid) {
        expect(() => isMail(v)).toThrow(ValidationError);

        try {
          isMail(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_MAIL");
        }
      }
    });

    it("throws for non-string values", () => {
      const invalid = [123, false, null, {}, [], undefined];

      for (const v of invalid) {
        expect(() => isMail(v)).toThrow(ValidationError);

        try {
          isMail(v);
        } catch (err) {
          expect((err as ValidationError).code).toBe("NOT_A_MAIL");
        }
      }
    });
  });

  describe("meta", () => {
    it("returns correct metadata", () => {
      expect(isMail.meta).toEqual({
        _js: { type: "string" },
        _form: { tag: "input", type: "email" },
        _sqlite: { type: "text" },
        _postgres: { type: "text" },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value", () => {
      expect(isMail.empty).toBe("");
    });
  });
});
