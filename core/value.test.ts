import { describe, it, expect } from "bun:test";
import { value } from "./value";
import { isNumber } from "../validators/is-number";

const node = value(isNumber);

describe("value", () => {
  describe("validate()", () => {
    it("passes valid input through unchanged", () => {
      const out = node.validate(123);
      expect(out).toBe(123);
    });

    it("throws if the validator assertion fails", () => {
      expect(() => node.validate("x")).toThrow("NOT_A_NUMBER");
    });
  });

  describe("describe()", () => {
    it("returns cb.meta", () => {
      expect(node.describe()).toEqual(isNumber.meta);
    });
  });

  describe("produce()", () => {
    it("returns cb.empty", () => {
      expect(node.produce()).toBe(0);
    });
  });
});
