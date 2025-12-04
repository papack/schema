import type { ValueNodeInterface } from "./value";
import type { ObjectNodeInterface } from "./object";
import type { Infer } from "./infer";
import { ValidationError } from "./validate";

export const omit = <
  Shape extends Record<string, ValueNodeInterface<any>>,
  Keys extends readonly (keyof Shape)[]
>(
  node: ObjectNodeInterface<{ [K in keyof Shape]: Infer<Shape[K]> }, Shape>,
  keys: Keys
): ObjectNodeInterface<
  { [K in Exclude<keyof Shape, Keys[number]>]: Infer<Shape[K]> },
  { [K in Exclude<keyof Shape, Keys[number]>]: Shape[K] }
> => {
  type Full = Infer<typeof node>;
  type RemainingKeys = Exclude<keyof Shape, Keys[number]>;
  type Output = { [K in RemainingKeys]: Full[K] };

  const keySet = new Set<keyof Shape>(keys as readonly (keyof Shape)[]);

  // Typesave helper
  const isRemainingKey = (key: keyof Shape): key is RemainingKeys =>
    !keySet.has(key);

  const validate = (input: unknown): Output => {
    if (typeof input !== "object" || input === null) {
      throw new ValidationError("NOT_AN_OBJECT");
    }

    const obj = input as Record<string, unknown>;
    const out = {} as Output;

    const typedObj = obj as Record<keyof Shape, unknown>;

    for (const key of Object.keys(node.shape) as Array<keyof Shape>) {
      if (!isRemainingKey(key)) continue;

      if (!(key in typedObj)) {
        throw new ValidationError("KEY_MISSING");
      }

      const childNode = node.shape[key]!;
      out[key] = childNode.validate(typedObj[key]);
    }

    return out;
  };

  const describe = () => {
    const out: Record<string, unknown> = {};

    for (const key of Object.keys(node.shape) as Array<keyof Shape>) {
      if (isRemainingKey(key)) {
        out[key as string] = node.shape[key]!.describe();
      }
    }

    return out;
  };

  const produce = (): Output => {
    const p = node.produce() as Full;
    const out = {} as Output;

    for (const key of Object.keys(node.shape) as Array<keyof Shape>) {
      if (isRemainingKey(key)) {
        out[key] = p[key];
      }
    }

    return out;
  };

  const newShape = {} as { [K in RemainingKeys]: Shape[K] };

  for (const key of Object.keys(node.shape) as Array<keyof Shape>) {
    if (isRemainingKey(key)) {
      newShape[key] = node.shape[key];
    }
  }

  return {
    validate,
    describe,
    produce,
    shape: newShape,
  };
};
