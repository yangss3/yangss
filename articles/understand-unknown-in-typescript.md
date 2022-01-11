# 深入理解 TypeScript 中的 unknown
<PubDate date="2021/05/26"/>

假设你在开发一个解析 YAML (YAML 是一种比 JSON 更灵活的数据表示格式) 的工具函数 `parseYAML`，那这个 parser 函数的返回类型应该是什么？

 `any` 好像是不错的选择：

```ts
function parseYAML(yaml: string): any {
  // ...
}
```
理想情况下，你希望用户将返回的结果立刻分配给另一个类型：

```ts
interface Book {
  name: string
  author: string
}
const book: Book = parseYAML(`
  name: 聪格尔传
  author: 狗蛋
`)
```
这很完美，但是理想很美满，现实很骨感。用户很可能会直接接收返回值：

```ts
const book = parseYAML(`
  name: 聪格尔传
  author: 狗蛋
`)
alert(book.title) // 无编译时错误, 但在运行时 alerts "undefined"
book('read') // 无编译时错误, 但在运行时 throws "TypeError: book is not a function"
```
可以看到 `any` 类型通过函数返回值传播给了 `book`，导致类型检查失效，从而导致运行时错误。这很不安全，也违背了 TypeScript 的初衷。

但如果将 `parseYAML` 的返回类型设为 `unknown`，情况就会好转：

```ts
function parseYAML(yaml: string): unknown {
  // ...
}

const book = parseYAML(`
  name: 聪格尔传
  author: 狗蛋
`)

alert(book.title) // ~~~~~~ Object is of type 'unknown'
book("read") // ~~~~~~~ Object is of type 'unknown'
```
错误在编译时就会被暴露出来，这比在运行时出错要好的多。

那么 `unknown` 类型到底是什么？要理解它，先要从 `any` 说起。

`any` 类型的两个主要特点：

- 任何类型可以赋值给 `any` 类型
- `any` 类型可以赋值给任何类型

从**将类型看作值的集合** (前面的文章中有讲过) 的角度来看，`any` 是不满足 TypeScript 的类型系统的，因为在数学意义上，找不到一个集合，它既是其它所有集合的超集 (superset) 又是其它所有集合的子集 (subset)。这也正是 `any` 强大而又危险的根源。因为 TypeScript 的类型检查是基于集合的，所以它对 `any` 不起作用。

而 `unknown` 可以看作是 `any` 的一个替代品，它具备 `any` 的第一个特点，即**所有类型都可以赋值给 `unknown` 类型**。但是不满足第二条，即 **`unknown` 类型只能赋值给 `unknown` 类型** (当然，也可以赋给 `any`)。所以 `unknown` 满足 TypeScript 的类型系统，使用它是安全的。

::: tip 提示
顺带提一句，TypeScript 中还有一个内置类型 `never`， 它正好与 `unknown` 相反。它满足 `any` 的第二条而不满足第一条。即 `never` 类型可以赋给任何类型，但除了 `never`, 任何类型都不能赋给 `never` 类型。在数学意义上，`unknown` 代表全集 (universal set)，`never` 代表空集 (empty set)。
:::

`unknown` 正如它的字面意思：“未知的”，代表未知的类型。试图去访问一个 `unknown` 类型的变量的属性或对 `unknown` 类型的变量进行函数调用，TypeScript 都会抛出错误。实际上你不能对 `unknown` 类型的变量做任何事情，这正是问题的关键。`unknown` 导致的错误将迫使你主动将其缩窄到适当的类型，因为往往这个时候，你比 TypeScript 了解的更多：

```ts
const book = parseYAML(`
  name: 聪格尔传
  author: 狗蛋
`) as Book // 你比 TypeScript 知道的更多，所以使用类型断言来缩窄类型

alert(book.title) // ~~~~~~ Property 'title' does not exist on type 'Book'
book('read') // ~~~~~~~ this expression is not callable
```
因为 `unknown` 不能直接赋给其它任何类型，所以这里需要用到类型断言 (type assertion)，这也使得错误信息更加清晰明了。

当你在声明一个变量或返回一个值但还不确定它的类型时，使用 `unknown` 是一个好的选择，`parseYAML` 的返回值就是一个例子。

当然，使用类型断言并不是将 `unknown` 类型缩窄到具体类型的唯一方法。使用 `instanceof` 检查也可以：

```ts
function processValue(val: unknown) {
  if (val instanceof Date) {
    val // Type is Date
  }
}
```
还可以使用类型守卫 (type guard)：

```ts
function isBook(val: unknown): val is Book {
  return typeof(val) === 'object' && val !== null && 'name' in val && 'author' in val
}

function processValue(val: unknown) {
  if (isBook(val)) {
    val // Type is Book
  }
}
```
在双重断言 (double assertion) 中，也可以使用 `unknown` 替代 `any`：

```ts
declare const foo: Foo
const barAny = foo as any as Bar
const barUnk = foo as unknown as Bar
```
虽然它们在功能上是等价的，但如果以后重构需要将双重断言进行分解，`unknown` 形式的风险更小，因为 `any` 可以逃脱类型系统的束缚并扩散其它地方，而 `unknown` 这样做就会导致错误。

::: tip 提示
顺带提一下，你可能会看到使用 `object` 或 `{}` 类型的代码，它们的作用与这里的 `unknown` 类似，也是广义的类型，但范围比 `unknown` 要稍微窄一些：
- `{}` 类型包含除了 `null` 和 `undefined` 之外的所有值
- `object` 类型包含所有 non-primitive 值，例如它不包含 `11`, `true`, `'foo'`，但是包含所有对象和数组

在 `unknown` 被引入 TypeScript 之前，`{}` 使用的比较多，但是现在，你应该使用 `unknown`，除非你明确知道这个值不可能是 `null` 或 `undefined`。
:::
## 总结

- `unknown` 是 `any` 类型安全的替代品，当你不确定某个值的类型时，应该使用 `unknown`。
- 使用 `unknown` 可以迫使你的用户使用类型断言或其它类型检查来确保代码的类型安全。
