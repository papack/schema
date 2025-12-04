import { describe, it, expect } from "bun:test";
import { object } from "./object";
import { value } from "./value";
import { isNumber } from "../validators/is-number";
import { isBoolean } from "../validators/is-boolean";

describe("object", () => {
  const node = object({
    id: value(isNumber),
    locked: value(isBoolean),
  });

  describe("validate()", () => {
    it("validates when all required fields exist", () => {
      const out = node.validate({
        id: 10,
        locked: true,
      });

      expect(out).toEqual({
        id: 10,
        locked: true,
      });
    });

    it("strips extra keys from the input", () => {
      const out = node.validate({
        id: 5,
        locked: false,
        extra: "ignored",
        something: 123,
      });

      expect(out).toEqual({
        id: 5,
        locked: false,
      });

      // ensure nothing extra leaked through
      expect(out as any).not.toHaveProperty("extra");
      expect(out as any).not.toHaveProperty("something");
    });

    it("throws if a required key is missing", () => {
      expect(() => node.validate({ id: 1 })).toThrow();
      expect(() => node.validate({ locked: true })).toThrow();
    });

    it("throws if input is not an object", () => {
      expect(() => node.validate(null)).toThrow();
      expect(() => node.validate("x")).toThrow();
    });
  });

  describe("describe()", () => {
    it("describes all keys using each validator's metadata", () => {
      expect(node.describe()).toEqual({
        id: isNumber.meta,
        locked: isBoolean.meta,
      });
    });
  });

  describe("produce()", () => {
    it("produces default values for all fields", () => {
      expect(node.produce()).toEqual({
        id: 0,
        locked: false,
      });
    });
  });

  describe("shape", () => {
    it("contains exactly the schema keys", () => {
      expect(Object.keys(node.shape)).toEqual(["id", "locked"]);
    });
  });
});
