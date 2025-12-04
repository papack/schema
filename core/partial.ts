import type { ValueNodeInterface } from "./value";
import type { ObjectNodeInterface } from "./object";
import type { Infer } from "./infer";
import { ValidationError } from "../core/validate";

export const partial = <Shape extends Record<string, ValueNodeInterface<any>>>(
  node: ObjectNodeInterface<{ [K in keyof Shape]: Infer<Shape[K]> }, Shape>
): ObjectNodeInterface<
  Partial<{ [K in keyof Shape]: Infer<Shape[K]> }>,
  { [K in keyof Shape]: Shape[K] }
> => {
  type Full = Infer<typeof node>;
  type Output = Partial<Full>;

  const validate = (input: unknown): Output => {
    if (typeof input !== "object" || input === null) {
      throw new ValidationError("NOT_AN_OBJECT");
    }

    const obj = input as Record<string, unknown>;
    const out: Output = {};

    for (const key in node.shape) {
      if (key in obj) {
        const childNode = node.shape[key as keyof Shape]!;
        out[key] = childNode.validate(obj[key]);
      }
    }

    return out;
  };

  const describe = () => {
    const out: Record<string, unknown> = {};
    for (const key in node.shape) {
      out[key] = {
        optional: true,
        value: node.shape[key]!.describe(),
      };
    }
    return out;
  };

  const produce = (): Output => {
    return {};
  };

  const newShape = { ...node.shape };

  return {
    validate,
    describe,
    produce,
    shape: newShape,
  };
};
