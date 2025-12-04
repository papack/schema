import { describe, it, expect } from "bun:test";
import { idx } from "./idx";
import { isString } from "../validators/is-string";

const config = {
  fields: ["email", "username"] as any,
  unique: true,
  order: ["asc", "desc"] as any,
};

describe("idx", () => {
  describe("configuration validation", () => {
    it("throws if fields array is empty", () => {
      expect(() =>
        idx(isString, {
          fields: [],
          unique: true,
          order: [],
        })
      ).toThrow("Index must define at least one field.");
    });

    it("throws if fields and order length mismatch", () => {
      expect(() =>
        idx(isString, {
          fields: ["email"],
          unique: false,
          order: ["asc", "desc"],
        })
      ).toThrow("fields and order must have equal length.");
    });
  });

  describe("validator behavior", () => {
    const fn = idx(isString, config);

    it("accepts valid input", () => {
      expect(() => fn("hello")).not.toThrow();
    });

    it("throws when underlying validator fails", () => {
      expect(() => fn(123)).toThrow("NOT_A_STRING");
    });
  });

  describe("meta", () => {
    const fn = idx(isString, config);

    it("extends metadata with _idx configuration", () => {
      expect(fn.meta).toEqual({
        ...isString.meta,
        _idx: config,
      });
    });

    it("keeps the base metadata untouched", () => {
      expect(isString.meta).not.toHaveProperty("_idx");
    });
  });

  describe("empty", () => {
    const fn = idx(isString, config);

    it("inherits empty from the base validator", () => {
      expect(fn.empty).toBe("");
    });
  });
});
