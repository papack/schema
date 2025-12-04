import { describe, it, expect } from "bun:test";
import { pk } from "./pk";
import { isNumber } from "../validators/is-number";

describe("pk", () => {
  const fn = pk(isNumber);

  describe("validator behavior", () => {
    it("accepts valid input", () => {
      expect(() => fn(123)).not.toThrow();
    });

    it("throws if the underlying validator fails", () => {
      expect(() => fn("x")).toThrow("NOT_A_NUMBER");
    });
  });

  describe("meta", () => {
    it("extends metadata with _pk: { isPk: true }", () => {
      expect(fn.meta).toEqual({
        ...isNumber.meta,
        _pk: { isPk: true },
      });
    });

    it("does not mutate the original validator metadata", () => {
      expect(isNumber.meta).not.toHaveProperty("_pk");
    });
  });

  describe("empty", () => {
    it("inherits empty from the base validator", () => {
      expect(fn.empty).toBe(0);
    });
  });
});
