# Type Challenges

```ts
type Replace<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer B}${From}${infer A}`
      ? `${B}${To}${A}`
      : S

type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer B}${From}${infer A}`
      ? `${B}${To}${ReplaceAll<A, From, To>}`
      : S
```

```ts
type DropChar<S extends string, C extends string> = ReplaceAll<S, C, ''>
```

```ts
type StartsWith<S extends string, U extends string> =
  S extends `${U}${string}`
    ? true
    : false

type EndsWith<S extends string, U extends string> =
  S extends `${string}${U}`
    ? true
    : false
```

```ts
type CapitalizeWords<S extends string> =
  S extends `${infer W} ${infer Rest}`
    ? `${Capitalize<W>} ${CapitalizeWords<Rest>}`
    : Capitalize<S>

type PascalCase<S extends string> =
  S extends `${infer F}_${infer Rest}`
    ? `${Capitalize<Lowercase<F>>}${PascalCase<Lowercase<Rest>>}`
    : S extends `${infer F}-${infer Rest}`
      ? `${Capitalize<Lowercase<F>>}${PascalCase<Lowercase<Rest>>}`
      : Capitalize<Lowercase<S>>

type CamelCase<S extends string> =
  PascalCase<S> extends `${infer F}${infer Rest}`
    ? `${Lowercase<F>}${Rest}`
    : ''
```

```ts
type Last<T extends any[]> = T extends [...any, infer L] ? L : never
type Pop<T extends any[]> = T extends [...infer R, any] ? R : never
```

```ts
type LookUp<U, T extends string> = U extends { type: T } ? U : never
```

```ts
type Space = ' ' | '\n' | '\t'
type TrimLeft<S extends string> =
  S extends `${Space}${infer R}`
    ? TrimLeft<R>
    : S
type TrimRight<S extends string> =
  S extends `${infer L}${Space}`
    ? TrimRight<L>
    : S
type Trim<S extends string> = TrimLeft<TrimRight<S>>
```

```ts
type AppendArgument<Fn, A> =
  Fn extends (...arg: infer Args) => infer R
    ? (...arg: [...Args, A]) => R
    : never
```

```ts
type StringToTuple<S extends string> =
  S extends `${infer F}${infer Rest}`
    ? [F, ...StringToTuple<Rest>]
    : []


type LengthOfString<S extends string> = StringToTuple<S>['length']
```

```ts
type StringToUnion<S extends string> = StringToTuple<S>[number]
type StringToUnion<S extends string> =
  S extends `${infer F}${infer Rest}`
    ? F | StringToUnion<Rest>
    : never
```

```ts
type Flatten<T extends any[]> =
  T extends [infer F, ...infer Rest]
    ? F extends any[]
      ? [...Flatten<F>, ...Flatten<Rest>]
      : [F, ...Flatten<Rest>]
    : []
```

```ts
type IsNever<T> = [T] extends [never] ? true : false
type IsAny<T> = 0 extends (1 & T) ? true : false
```

```ts
type AppendToObject<
  T extends Record<string, any>,
  U extends string,
  V extends any
> = {
    [K in keyof T | U]:
      K extends U
        ? V
        : K extends keyof T
          ? T[K]
          : never
  }
```

```ts
type Absolute<T extends number | string | bigint> = Replace<`${T}`, '-', ''>
```

```ts
type Merge<F, S> = {
  [K in keyof F | keyof S]:
    K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never
}
```

```ts
type LastChar<S extends string> =
  S extends `${infer F}${infer Rest}`
    ? Rest extends ''
      ? F
      : LastChar<Rest>
    : never
type LastChar<S extends string> = Last<StringToTuple<S>>
```

```ts
type UnionToIntersection<T> =
  (
    T extends any
      ? (arg: T) => any
      : never
  ) extends (arg: infer R) => any
    ? R
    : never
```

```ts
type IsUnion<T, B = T> =
  T extends B
    ? [B] extends [T]
      ? false
      : true
    : never
```


```ts
type PickByType<T extends Record<string, any>, U> = {
  [
    K in keyof T as string extends any
      ? T[K] extends U
        ? K
        : never
      : never
  ]: T[K]
}
```

```ts
type Copy<T> = { [K in keyof T]: T[K] }
type PartialByKeys<T extends Record<string, any>, K extends string = never> =
  [K] extends [never]
    ? Partial<T>
    : Copy<{ [P in keyof T as P extends K ? P : never]?: T[P] } & Omit<T, K>>

type RequiredByKeys<T extends Record<string, any>, K extends string = never> =
  [K] extends [never]
    ? Required<T>
    : Copy<{ [P in keyof T as P extends K ? P : never]-?: T[P] } & Omit<T, K>>
```

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
```

```ts
type GetRequired<T, U extends Required<T> = Required<T>> = {
  [K in keyof T as T[K] extends U[K] ? K : never]: T[K]
}
type GetOptional<T, U extends Required<T> = Required<T>> = {
  [K in keyof T as T[K] extends U[K] ? never : K]: T[K]
}
type RequiredKeys<T> = keyof GetRequired<T>
type OptionalKeys<T> = keyof GetOptional<T>
```
