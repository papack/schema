import type { ValueNodeInterface } from "./value";
import type { ObjectNodeInterface } from "./object";
import type { Infer } from "./infer";
import { ValidationError } from "./validate";

export const extend = <
  Shape extends Record<string, ValueNodeInterface<any>>,
  Additions extends Record<string, ValueNodeInterface<any>>
>(
  node: ObjectNodeInterface<{ [K in keyof Shape]: Infer<Shape[K]> }, Shape>,
  additions: Additions
) => {
  type NewShape = Shape & Additions;

  const newShape: NewShape = {
    ...node.shape,
    ...additions,
  };

  type Output = {
    [K in keyof NewShape]: Infer<NewShape[K]>;
  };

  const validate = (input: unknown): Output => {
    if (typeof input !== "object" || input === null) {
      throw new ValidationError("NOT_AN_OBJECT");
    }

    const typedObj = input as { [K in keyof NewShape]: unknown };
    const out = {} as Output;

    for (const key of Object.keys(newShape) as Array<keyof NewShape>) {
      const childNode = newShape[key];

      if (!(key in typedObj)) {
        throw new ValidationError("KEY_MISSING");
      }

      out[key] = childNode.validate(typedObj[key]);
    }

    return out;
  };

  const describe = () => {
    // typed output container
    const out = {} as { [K in keyof NewShape]: unknown };

    for (const key of Object.keys(newShape) as Array<keyof NewShape>) {
      out[key] = newShape[key].describe();
    }

    return out;
  };

  const produce = (): Output => {
    const base = node.produce() as {
      [K in keyof Shape]: Infer<Shape[K]>;
    };

    const out = {} as Output;

    for (const key of Object.keys(newShape) as Array<keyof NewShape>) {
      const childNode = newShape[key];
      if (key in base) {
        out[key] = base[key as keyof Shape] as Output[typeof key];
      } else {
        out[key] = childNode.produce();
      }
    }

    return out;
  };

  return {
    validate,
    describe,
    produce,
    shape: newShape,
  };
};
