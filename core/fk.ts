export const fk = <T>(
  cb: (input: unknown) => asserts input is T,
  config: {
    table: string;
    onDelete: "cascade" | "restrict" | "no-action";
    onUpdate: "cascade" | "restrict" | "no-action";
  }
) => {
  const fn = (input: unknown): asserts input is T => cb(input);

  fn.meta = {
    ...(cb as any).meta,
    _fk: config,
  };

  fn.empty = (cb as any).empty;
  return fn;
};
