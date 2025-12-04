import type { ValueNodeInterface } from "./value";
import type { ObjectNodeInterface } from "./object";
import type { Infer } from "./infer";
import { ValidationError } from "../core/validate";

export const pick = <
  Shape extends Record<string, ValueNodeInterface<any>>,
  Keys extends readonly (keyof Shape)[]
>(
  node: ObjectNodeInterface<{ [K in keyof Shape]: Infer<Shape[K]> }, Shape>,
  keys: Keys
): ObjectNodeInterface<
  { [K in Keys[number]]: Infer<Shape[K]> },
  { [K in Keys[number]]: Shape[K] }
> => {
  type Full = Infer<typeof node>;
  type Output = { [K in Keys[number]]: Full[K] };

  const validate = (input: unknown): Output => {
    const full = node.validate(input) as Full;
    const out = {} as Output;

    for (const key of keys) {
      if (!(key in full)) {
        throw new ValidationError("KEY_MISSING");
      }
      out[key] = full[key];
    }

    return out;
  };

  const describe = () => {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      out[key as string] = node.shape[key]!.describe();
    }
    return out;
  };

  const produce = (): Output => {
    const p = node.produce() as Full;
    const out = {} as Output;
    for (const key of keys) out[key] = p[key];
    return out;
  };

  const newShape = {} as { [K in Keys[number]]: Shape[K] };
  for (const key of keys) {
    newShape[key] = node.shape[key];
  }

  return {
    validate,
    describe,
    produce,
    shape: newShape,
  };
};
