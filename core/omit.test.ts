import { describe, it, expect } from "bun:test";
import { omit } from "./omit";
import { object } from "./object";
import { value } from "./value";
import { isNumber } from "../validators/is-number";
import { isBoolean } from "../validators/is-boolean";

describe("omit", () => {
  const userSchema = object({
    id: value(isNumber),
    locked: value(isBoolean),
  });

  const node = omit(userSchema, ["locked"]);

  describe("validate()", () => {
    it("validates an object with only the remaining fields", () => {
      const out = node.validate({ id: 10 });
      expect(out).toEqual({ id: 10 });
    });

    it("throws if a required remaining key is missing", () => {
      expect(() => node.validate({})).toThrow();
    });

    it("throws if input is not an object", () => {
      expect(() => node.validate(null)).toThrow();
      expect(() => node.validate("x")).toThrow();
    });
  });

  describe("describe()", () => {
    it("returns description only for non-omitted keys", () => {
      expect(node.describe()).toEqual({
        id: isNumber.meta,
      });
    });
  });

  describe("produce()", () => {
    it("produces defaults only for the remaining keys", () => {
      expect(node.produce()).toEqual({
        id: 0,
      });
    });
  });

  describe("shape", () => {
    it("contains only the remaining fields", () => {
      expect(Object.keys(node.shape)).toEqual(["id"]);
    });
  });
});
