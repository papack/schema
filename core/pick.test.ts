import { describe, it, expect } from "bun:test";
import { pick } from "./pick";
import { object } from "./object";
import { value } from "./value";
import { isNumber } from "../validators/is-number";
import { isBoolean } from "../validators/is-boolean";
import { isString } from "../validators/is-string";

describe("pick", () => {
  const userSchema = object({
    id: value(isNumber),
    locked: value(isBoolean),
    name: value(isString),
  });

  const node = pick(userSchema, ["id", "name"]);

  describe("validate()", () => {
    it("picks only the selected fields from a full object", () => {
      const out = node.validate({
        id: 123,
        locked: true,
        name: "John",
      });

      expect(out).toEqual({
        id: 123,
        name: "John",
      });
    });

    it("throws if a picked key is missing", () => {
      expect(() =>
        node.validate({
          id: 1,
          locked: false,
        })
      ).toThrow(); // missing name
    });

    it("throws if input is not an object", () => {
      expect(() => node.validate("x")).toThrow();
      expect(() => node.validate(null)).toThrow();
    });
  });

  describe("describe()", () => {
    it("returns descriptions only for picked keys", () => {
      expect(node.describe()).toEqual({
        id: isNumber.meta,
        name: isString.meta,
      });
    });
  });

  describe("produce()", () => {
    it("produces defaults only for picked keys", () => {
      expect(node.produce()).toEqual({
        id: 0,
        name: "",
      });
    });
  });

  describe("shape()", () => {
    it("keeps only the picked fields in shape", () => {
      expect(Object.keys(node.shape)).toEqual(["id", "name"]);
    });
  });
});
