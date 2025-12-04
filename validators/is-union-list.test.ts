import { describe, it, expect } from "bun:test";
import { isUnionList } from "./is-union-list";

describe("isUnionList", () => {
  describe("configuration", () => {
    it("throws if values list is empty", () => {
      expect(() => isUnionList([] as any)).toThrow("UNION_EMPTY");
    });

    it("throws if values contain unsupported base type", () => {
      expect(() => isUnionList([true] as any)).toThrow(
        "UNION_UNSUPPORTED_TYPE"
      );
    });

    it("throws if values contain mixed types", () => {
      expect(() => isUnionList(["a", 1] as any)).toThrow("UNION_MIXED_TYPE");
    });
  });

  // valid numeric union list
  const fnNum = isUnionList([1, 2, 3] as const);

  // valid string union list
  const fnStr = isUnionList(["a", "b", "c"] as const, { allowEmpty: false });

  describe("assertion (number lists)", () => {
    it("accepts valid lists", () => {
      expect(() => fnNum([1, 2])).not.toThrow();
      expect(() => fnNum([3])).not.toThrow();
      expect(() => fnNum([])).not.toThrow(); // allowEmpty = true (default)
    });

    it("throws for non-array input", () => {
      expect(() => fnNum("x")).toThrow("NOT_A_LIST");
      expect(() => fnNum(123)).toThrow("NOT_A_LIST");
    });

    it("throws when items are not numbers", () => {
      expect(() => fnNum(["x"] as any)).toThrow("NOT_IN_UNION");
      expect(() => fnNum([true] as any)).toThrow("NOT_IN_UNION");
    });

    it("throws when number is not in union", () => {
      expect(() => fnNum([4])).toThrow("NOT_IN_UNION");
      expect(() => fnNum([0])).toThrow("NOT_IN_UNION");
    });
  });

  describe("assertion (string lists)", () => {
    it("accepts valid string lists", () => {
      expect(() => fnStr(["a", "b"])).not.toThrow();
    });

    it("throws when empty list is not allowed", () => {
      expect(() => fnStr([])).toThrow("NOT_IN_UNION");
    });

    it("throws when value is not a string", () => {
      expect(() => fnStr([1] as any)).toThrow("NOT_IN_UNION");
    });

    it("throws when string not in union", () => {
      expect(() => fnStr(["x"])).toThrow("NOT_IN_UNION");
    });
  });

  describe("meta (number union)", () => {
    it("contains correct metadata", () => {
      expect(fnNum.meta).toEqual({
        _js: {
          type: "number[]",
          enum: [1, 2, 3],
          allowEmpty: true,
        },
        _form: {
          tag: "select",
          variant: "multiple",
          options: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
          ],
          allowEmpty: true,
        },
        _sqlite: {
          type: "json",
          enum: [1, 2, 3],
        },
        _postgres: {
          type: "jsonb",
          enum: [1, 2, 3],
        },
      });
    });
  });

  describe("meta (string union)", () => {
    it("contains correct metadata", () => {
      expect(fnStr.meta).toEqual({
        _js: {
          type: "string[]",
          enum: ["a", "b", "c"],
          allowEmpty: false,
        },
        _form: {
          tag: "select",
          variant: "multiple",
          options: [
            { value: "a", label: "a" },
            { value: "b", label: "b" },
            { value: "c", label: "c" },
          ],
          allowEmpty: false,
        },
        _sqlite: {
          type: "json",
          enum: ["a", "b", "c"],
        },
        _postgres: {
          type: "jsonb",
          enum: ["a", "b", "c"],
        },
      });
    });
  });

  describe("empty", () => {
    it("has correct default empty value for allowEmpty: true", () => {
      expect(fnNum.empty).toEqual([]);
    });

    it("has correct default empty value for allowEmpty: false", () => {
      expect(fnStr.empty).toEqual(["a"]); // first value
    });
  });
});
