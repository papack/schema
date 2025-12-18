export interface ValueNodeInterface<T> {
  validate: (input: unknown) => T;
  produce: () => T;
  describe: () => unknown;
}

type RuntimeCB<T> = {
  (input: unknown): asserts input is T;
  meta?: unknown;
  empty?: T;
};

export const value = <T>(cb: RuntimeCB<T>): ValueNodeInterface<T> => {
  const validate = (input: unknown) => {
    cb(input); // throws if invalid
    return input as T;
  };

  const describe = () => {
    return cb.meta;
  };

  const produce = (): T => {
    const empty = cb.empty;

    if (typeof empty === "function") {
      return empty() as T;
    }

    return empty as T;
  };

  return { validate, describe, produce };
};
