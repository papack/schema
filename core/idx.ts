export const idx = <T>(
  cb: (input: unknown) => asserts input is T,
  config: {
    fields: string[];
    unique: boolean;
    order: ("asc" | "desc")[]; // Array um Multicomlumn idx zu unterstützen
  }
) => {
  if (config.fields.length === 0)
    throw new Error("Index must define at least one field.");

  if (config.fields.length !== config.order.length)
    throw new Error("fields and order must have equal length.");

  const fn = (input: unknown): asserts input is T => cb(input);

  fn.meta = {
    ...(cb as any).meta,
    _idx: config,
  };

  fn.empty = (cb as any).empty;

  return fn;
};
