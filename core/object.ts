import type { ValueNodeInterface } from "./value";
import type { Infer } from "./infer";
import { ValidationError } from "../core/validate";

export interface ObjectNodeInterface<T, Shape> extends ValueNodeInterface<T> {
  readonly shape: Shape;
}

export const object = <Shape extends Record<string, ValueNodeInterface<any>>>(
  shape: Shape
): ObjectNodeInterface<{ [K in keyof Shape]: Infer<Shape[K]> }, Shape> => {
  type Output = { [K in keyof Shape]: Infer<Shape[K]> };

  const validate = (input: unknown): Output => {
    if (typeof input !== "object" || input === null) {
      throw new ValidationError("NOT_AN_OBJECT");
    }

    const obj = input as Record<string, unknown>;
    const out = {} as Output;

    for (const key in shape) {
      if (!(key in obj)) {
        throw new ValidationError("KEY_MISSING");
      }

      const childNode = shape[key];
      if (childNode === undefined) continue;
      out[key] = childNode.validate(obj[key]);
    }

    return out;
  };

  const describe = () => {
    const out: Record<string, unknown> = {};
    for (const key in shape) {
      const childNode = shape[key];
      if (childNode === undefined) continue;
      out[key] = childNode.describe();
    }
    return out;
  };

  const produce = (): Output => {
    const out = {} as Output;
    for (const key in shape) {
      const childNode = shape[key];
      if (childNode === undefined) continue;
      out[key] = childNode.produce() as any;
    }
    return out;
  };

  return { validate, describe, produce, shape };
};
