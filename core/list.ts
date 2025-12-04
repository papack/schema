import type { ValueNodeInterface } from "./value";
import { ValidationError } from "../core/validate";

export interface ListNodeInterface<T> extends ValueNodeInterface<T[]> {}

export const list = <T>(node: ValueNodeInterface<T>): ListNodeInterface<T> => {
  const validate = (input: unknown) => {
    if (!Array.isArray(input)) {
      throw new ValidationError("NOT_A_LIST");
    }

    const result: T[] = [];

    for (const item of input) {
      result.push(node.validate(item));
    }

    return result;
  };

  const describe = () => {
    return [node.describe()];
  };

  const produce = (): T[] => {
    return [];
  };

  return { validate, describe, produce };
};
