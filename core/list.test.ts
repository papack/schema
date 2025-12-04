import { describe, it, expect } from "bun:test";
import { list } from "./list";
import { value } from "./value";
import { isNumber } from "../validators/is-number";

// list node
const node = list(value(isNumber));

describe("list", () => {
  describe("validate()", () => {
    it("validates a valid list", () => {
      const out = node.validate([1, 2, 3]);
      expect(out).toEqual([1, 2, 3]);
    });

    it("throws when input is not a list", () => {
      expect(() => node.validate("x")).toThrow();
      expect(() => node.validate(null)).toThrow();
      expect(() => node.validate({})).toThrow();
    });

    it("throws when an item in the list is invalid", () => {
      expect(() => node.validate([1, "x", 3])).toThrow("NOT_A_NUMBER");
    });

    it("produces a new array, not a reference to the input", () => {
      const inArr = [5, 10];
      const out = node.validate(inArr);
      expect(out).not.toBe(inArr);
    });
  });

  describe("describe()", () => {
    it("returns a single-element array describing the item validator", () => {
      expect(node.describe()).toEqual([isNumber.meta]);
    });
  });

  describe("produce()", () => {
    it("returns an empty array", () => {
      expect(node.produce()).toEqual([]);
    });
  });
});
