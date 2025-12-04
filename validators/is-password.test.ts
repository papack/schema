import { describe, it, expect } from "bun:test";
import { isPassword } from "./is-password";
import { ValidationError } from "../core/validate";

describe("isPassword", () => {
  const fn = isPassword({
    minLength: 8,
    minNumbers: 2,
    minSpecialChars: 1,
  });

  describe("assertion", () => {
    it("accepts valid passwords", () => {
      expect(() => fn("abCD12!x")).not.toThrow();
      expect(() => fn("xyzABC99@")).not.toThrow();
    });

    it("throws for non-string input", () => {
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

    it("throws when password is too short", () => {
      try {
        //@ts-expect-error
        fn("A1!b");
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("PASSWORD_TOO_SHORT");
      }
    });

    it("throws when password has too few numbers", () => {
      try {
        //@ts-expect-error
        fn("abcdEF!x"); // no numbers
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("PASSWORD_TOO_FEW_NUMBERS");
      }
    });

    it("throws when password has too few special characters", () => {
      try {
        //@ts-expect-error
        fn("abcd12EF"); // no specials
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        expect((err as ValidationError).code).toBe("PASSWORD_TOO_FEW_SPECIALS");
      }
    });
  });

  describe("meta", () => {
    it("contains correct metadata", () => {
      expect(fn.meta).toEqual({
        _js: {
          type: "string",
          minLength: 8,
          minNumbers: 2,
          minSpecialChars: 1,
        },
        _form: {
          tag: "input",
          type: "password",
          minLength: 8,
          minNumbers: 2,
          minSpecialChars: 1,
        },
        _sqlite: {
          type: "text",
        },
        _postgres: {
          type: "text",
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
