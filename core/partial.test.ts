import { describe, it, expect } from "bun:test";
import { partial } from "./partial";
import { object } from "./object";
import { value } from "./value";
import { isNumber } from "../validators/is-number";
import { isBoolean } from "../validators/is-boolean";

describe("partial", () => {
  const userSchema = object({
    id: value(isNumber),
    locked: value(isBoolean),
  });

  const node = partial(userSchema);

  describe("validate()", () => {
    it("accepts a fully provided object", () => {
      const out = node.validate({ id: 1, locked: true });
      expect(out).toEqual({ id: 1, locked: true });
    });

    it("accepts a partially provided object", () => {
      const out = node.validate({ locked: false });
      expect(out).toEqual({ locked: false });
    });

    it("accepts an empty object", () => {
      const out = node.validate({});
      expect(out).toEqual({});
    });

    it("throws if input is not an object", () => {
      expect(() => node.validate(null)).toThrow();
      expect(() => node.validate("x")).toThrow();
    });
  });

  describe("describe()", () => {
    it("marks every field as optional and includes underlying description", () => {
      expect(node.describe()).toEqual({
        id: {
          optional: true,
          value: isNumber.meta,
        },
        locked: {
          optional: true,
          value: isBoolean.meta,
        },
      });
    });
  });

  describe("produce()", () => {
    it("always produces an empty object", () => {
      expect(node.produce()).toEqual({});
    });
  });

  describe("shape()", () => {
    it("keeps all original fields in shape", () => {
      expect(Object.keys(node.shape)).toEqual(["id", "locked"]);
    });
  });
});
