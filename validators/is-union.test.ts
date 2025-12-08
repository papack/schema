import { describe, it, expect } from "bun:test";
import { isUnion } from "./is-union";

describe("isUnion", () => {
  describe("configuration", () => {
    it("throws if no values are provided", () => {
      expect(() => isUnion()).toThrow("UNION_EMPTY");
    });

    it("throws if unsupported types are used", () => {
      // @ts-expect-error for runtime test
      expect(() => isUnion(true)).toThrow("UNION_UNSUPPORTED_TYPE");
    });

    it("throws if values contain mixed types", () => {
      expect(() => isUnion("a", 1)).toThrow("UNION_MIXED_TYPE");
    });
  });

  // valid unions
  const fnNum = isUnion(1, 2, 3);
  const fnStr = isUnion("a", "b", "c");

  describe("assertion (number union)", () => {
    it("accepts valid values", () => {
      expect(() => fnNum(1)).not.toThrow();
      expect(() => fnNum(3)).not.toThrow();
    });

    it("throws if input is wrong type", () => {
      expect(() => fnNum("1")).toThrow("NOT_IN_UNION");
    });

    it("throws if value not in union", () => {
      expect(() => fnNum(99)).toThrow("NOT_IN_UNION");
    });
  });

  describe("assertion (string union)", () => {
    it("accepts valid values", () => {
      expect(() => fnStr("a")).not.toThrow();
      expect(() => fnStr("c")).not.toThrow();
    });

    it("throws if wrong type", () => {
      expect(() => fnStr(123)).toThrow("NOT_IN_UNION");
    });

    it("throws if string not in union", () => {
      expect(() => fnStr("x")).toThrow("NOT_IN_UNION");
    });
  });

  describe("meta (number union)", () => {
    it("contains correct metadata", () => {
      expect(fnNum.meta).toEqual({
        _js: {
          type: "number",
        },
        _form: {
          tag: "select",
          options: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
          ],
        },
      });
    });
  });

  describe("meta (string union)", () => {
    it("contains correct metadata", () => {
      expect(fnStr.meta).toEqual({
        _js: {
          type: "string",
        },
        _form: {
          tag: "select",
          options: [
            { value: "a", label: "a" },
            { value: "b", label: "b" },
            { value: "c", label: "c" },
          ],
        },
      });
    });
  });

  describe("empty", () => {
    it("returns the first value as empty default", () => {
      expect(fnNum.empty).toBe(1);
      expect(fnStr.empty).toBe("a");
    });
  });
});
