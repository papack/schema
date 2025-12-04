import type { ValueNodeInterface } from "./value";

export type Infer<TNode> = TNode extends ValueNodeInterface<infer U>
  ? U
  : never;
