import { describe, it, expect } from "bun:test";
import { fk } from "./fk";
import { isNumber } from "../validators/is-number";

const config = {
  table: "users",
  onDelete: "cascade" as const,
  onUpdate: "restrict" as const,
};

describe("fk", () => {
  const fn = fk(isNumber, config);

  describe("validator behavior", () => {
    it("calls the underlying validator and accepts valid input", () => {
      expect(() => fn(123)).not.toThrow();
    });

    it("throws when underlying validator fails", () => {
      expect(() => fn("x")).toThrow("NOT_A_NUMBER");
    });
  });

  describe("meta", () => {
    it("extends metadata with _fk configuration", () => {
      expect(fn.meta).toEqual({
        ...isNumber.meta,
        _fk: config,
      });
    });

    it("keeps the base metadata untouched", () => {
      expect(isNumber.meta).not.toHaveProperty("_fk");
    });
  });

  describe("empty", () => {
    it("inherits empty from the base validator", () => {
      expect(fn.empty).toBe(0);
    });
  });
});
