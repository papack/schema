export const pk = <T>(cb: (input: unknown) => asserts input is T) => {
  const fn = (input: unknown): asserts input is T => cb(input);

  fn.meta = {
    ...(cb as any).meta,
    _pk: {
      isPk: true,
    },
  };
  fn.empty = (cb as any).empty;

  return fn;
};
