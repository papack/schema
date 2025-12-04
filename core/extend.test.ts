import { describe, it, expect } from "bun:test";
import { extend } from "./extend";
import { object } from "./object";
import { value } from "./value";
import { isNumber } from "../validators/is-number";
import { isBoolean } from "../validators/is-boolean";

describe("extend", () => {
  const userSchema = object({
    id: value(isNumber),
  });

  const extended = extend(userSchema, {
    locked: value(isBoolean),
  });

  describe("validate()", () => {
    it("validates a combined object from base + extension", () => {
      const out = extended.validate({
        id: 1,
        locked: true,
      });

      expect(out).toEqual({
        id: 1,
        locked: true,
      });
    });
  });

  describe("describe()", () => {
    it("returns merged description for all fields", () => {
      expect(extended.describe()).toEqual({
        id: isNumber.meta,
        locked: isBoolean.meta,
      });
    });
  });

  describe("produce()", () => {
    it("produces merged default values from both schemas", () => {
      const out = extended.produce();
      expect(out).toEqual({
        id: 0,
        locked: false,
      });
    });
  });

  describe("shape", () => {
    it("contains the combined fields", () => {
      expect(Object.keys(extended.shape)).toEqual(["id", "locked"]);
    });
  });
});
