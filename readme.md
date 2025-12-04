# @papack/schema

Opinionated, fully synchronous TypeScript schemas for developers who want strict, minimal, predictable data structures.  
No nulls. No undefined. No async. No partial optionality.

## Core Rules

- **Sync only** — no Promises anywhere.
- **First error wins** — `validate()` throws immediately.
- **Objects are all-required or all-optional** — never mixed.
- **No null/undefined** —
  - values: `""` or `0`
  - lists: `[]`
- **Only `validate()`** — no `parse`, no `safeParse`.
- **Strong typing** — `Infer<T>` extracts exact static types.
- **Database metadata** — `pk`, `fk`, `idx` attach invisible DB fields.  
  `fk` always defines cascades.
- **Describe** — inspect schema for DB generators, UI forms, etc.
- **Checks** — curried, functional; includes `char(n)`, `isPassword`, `isIban`, etc.
- **Union checks** — support primitive unions, never object unions.

## Installation

```sh
npm install @papack/schema
```

## Concept

With the three primitives — `object`, `list`, `value` — you can express any structure.
Strict, lightweight, zero magic.

---

# Examples

## Basic schema

```ts
import { object, value, isString } from "@papack/schema";

const UserSchema = object({
  name: value(isString),
});

UserSchema.validate({ name: "Max" });
```

---

## PK, Index, FK

```ts
import { object, value, pk, fk, idx, isString, Infer } from "@papack/schema";

const UserSchema = object({
  name: value(
    idx(pk(isString), {
      fields: ["name"],
      order: ["asc"],
      unique: true,
    })
  ),

  gender: value(
    fk(isString, {
      table: "gender",
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  ),
});

type User = Infer<typeof UserSchema>;
UserSchema.validate({ name: "Anna", gender: "w" });
```

## Complete example

```ts
import {
  value,
  object,
  pk,
  fk,
  idx,
  partial,
  pick,
  omit,
  Infer,
  isUnionList,
  isPassword,
  isString,
  extend,
  isBoolean,
} from "@papack/schema";

const UserSchema = object({
  name: value(
    idx(pk(isString), {
      fields: ["name"],
      order: ["asc"],
      unique: true,
    })
  ),

  pw: value(
    isPassword({
      minLength: 8,
      minNumbers: 1,
      minSpecialChars: 1,
    })
  ),

  gender: value(
    fk(isUnionList(["w", "m"], { allowEmpty: true }), {
      table: "gender",
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  ),
});

// Derived schemas
const a = pick(UserSchema, ["name"]);
const b = omit(UserSchema, ["name"]);
const c = partial(UserSchema);

// Extended schema
const d = extend(UserSchema, {
  locked: value(isBoolean),
});

// Final schema
const e = omit(d, ["name"]);
type User = Infer<typeof e>;

const u: User = {
  gender: ["m", "m"],
  locked: false,
  pw: "asdfias2df!sadfed",
};

d.validate(u);
```

---

## Using `describe()`

```ts
const info = UserSchema.describe();
// Structural metadata for:
// - DB schema generation
// - UI form builders
// - tools, automation, codegen
```

## Errors

Errors are short, stable, and i18n-ready.
Examples:

- `"TOO_SMALL"`
- `"NOT_STRING"`
- `"INVALID_UNION"`

`validate()` throws always on the **first** error.

## Design Intent

- Minimal surface, predictable behavior.
- No hidden transformations.
- No optional-field chaos.
