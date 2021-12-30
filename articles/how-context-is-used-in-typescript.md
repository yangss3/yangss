# 理解上下文 (Context) 在类型推断中的作用
<PubDate date="2021/03/08"/>

TypeScript 在进行类型推断时，不仅会利用值 (value) 还会考虑值出现的上下文。这通常工作的很好，但是有时候也会带来一些问题。理解 TypeScript 是如何使用上下文 (context) 的，有助于我们理解问题的原因，并知道如何避免和解决它们。

在 JavaScript 中，我们很容易从一个表达式中分解出一个变量，而不改变代码的行为。例如下面两段代码是等价：

```js
// 字面量调用
setLanguage('JavaScript')

// 拆分出变量
let language = 'JavaScript'
setLanguage(language)
```

在 TypeScript 中，这样的分解也没问题：

```ts
function setLanguage(language: string) { /* ... */ }

setLanguage('JavaScript') // ok

let language = 'JavaScript'
setLanguage(language) // ok
```

但是通常的最佳实践是，我们应该尽可能的将字符串声明为更精确的字符串字面量的联合类型：

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python'
function setLanguage(language: Language) { /* ... */ }

setLanguage('JavaScript') // ok

let language = 'JavaScript'
setLanguage(language) // ~~~~~~ Argument of type 'string' is not assignable to parameter of type 'Language'
```

问题出现了。当分解出独立的变量后，再调用 `setLanguage` 就无法通过类型检查。

问题出在哪？首先，TypeScript 根据 `setLanguage` 的函数声明知道它的参数是 `Language` 类型，而字符串字面量 `'JavaScript'` 是可以赋给 `Language` 类型的，所以 `setLanguage('JavaScript')` 没问题。但是如果分解出一个变量，TypeScript 会在变量第一次赋值时推断出它i的类型，这里 `language` 会被推断为 `string` 类型，而 `string` 无法赋值给 `Language`，因为它代表的值集更大。所以 `setLanguage(language)` 会报错。

有两个方法可以解决这个问题。一个是为变量 `language` 添加类型声明以限制其类型：

```ts
let language: Language = 'JavaScript'
setLanguage(language) // ok
```

这样做还有一个好处就是可以充分利用类型检查，更早的发现类似拼写错误等 bug。

另一个方法是将变量声明成 `const`：

```ts
const language = 'JavaScript'
setLanguage(language) // ok
```
通过 `const` 关键字， TypeScript 知道 `language` 不会被更改，所以它推断出 `language` 为字面量类型 `'JavaScript'`，这是可以赋值给 `Language` 类型的。

出现上面这个问题根源是我们将值从使用它的上下文 (Context) 中分离了出来，有时候这没问题，但大多情况下不能正常工作。

下面再来看看几个丢失上下文导致错误的例子，以及应该如何解决它们。

## Tuple 类型

除了字符串字面类型 (string literal type)，tuple 类型也会出现上面的情况，看下面的例子：

```ts
function locate(where: [number, number]) { /* ... */ }

locate([10, 20]) // ok

const pos = [10, 20]
locale(pos) // ~~~~~~ Argument of type 'number[]' is not assignable to parameter of type '[number, number]'
```
发生了什么？ 首先，直接传入字面量 `locate([10, 20])`，没有问题，道理和上面一样。那为什么 `locate[pos]` 不行，我们已经使用了 `const` 声明。

因为使用 `const` 声明数组只能提供 shallow constant，TypeScript 只能推断出 `pos` 的类型为 `number[]`，无法确定其元素个数。而 `number[]` 类型无法赋值给 tuple 类型。

如何在不使用 `any` 的情况下解决这个问题？

同样你可以为 `pos` 添加类型声明，让 TypeScript 准确知道你的意图，而不是让它通过 shallow const 去推断：

```ts
const pos: [number, number] = [10, 20]
locate(pos) // ok
```
还有一种可行的办法是使用 `as const` 断言，告诉 TypeScript 希望对 `pos` 深度 constant：

```ts
const pos = [10, 20] as const
locate(pos) // ~~~~~~ Type 'readonly [10, 20]' is 'readonly' and cannot be assigned to the mutable type '[number, number]'
```
还是不行！如果你在编辑器里将鼠标 hover 到 `pos` 上，会看到它的类型被推断为 `readonly [10, 20]`，这太精确了，因为 `locate` 函数并不保证不会更改它的参数 `where` 的内容，所以无法通过类型检查。一个直观的解决办法是给 `locate` 的参数加上 `readonly` 声明：

```ts
function locate(where: readonly [number, number]) { /* ... */ }

const pos = [10, 20] as const
locate(pos) // ok
```
但如果这违背了你的本意，那你还是应该使用类型声明。

使用 `const` 上下文可以巧妙地解决在类型推断中丢失上下文的问题，但是这也有缺点。如果你在定义时就犯了错误，这个错误不会立即暴露出来，而是在使用时才抛出。这就可能造成迷惑，特别是如果错误发生在深度嵌套的对象中，你很难分辨错误的源头在哪里：

```ts
const pos = [10, 20, 30] as const // 错误其实发生在这里

locate(pos) // ~~~~~~ Argument of type 'readonly [10, 20, 30]' is not assignable to
            // parameter of type 'readonly [number, number]'
            // Types of property 'length' are incompatible
            // Type '3' is not assignable to type '2'
```

## 对象类型
将包含一些字符串字面值或元组 (tuple) 的对象从其上下文分离时，也会出现上面的问题：

```ts
type Language = 'JavaScript' | 'TypeScript' | 'Python'
interface ProgrammingLanguage {
 language: Language
 organization: string
}

function learning(language: ProgrammingLanguage) { /* ... */ }

learning({ language: 'TypeScript', organization: 'Microsoft' }) // OK

const ts = {
 language: 'TypeScript',
 organization: 'Microsoft'
}
learning(ts) // ~~~~~~ Argument of type '{ language: string; organization: string; }'
            // is not assignable to parameter of type 'ProgrammingLanguage'
            // Types of property 'language' are incompatible
            // Type 'string' is not assignable to type 'Language'
```

问题出在 `ts` 对象中的 `language` 被推断为 `string` 类型。解决办法同上面一样，可以为 `ts` 加上类型声明 (`const ts: ProgrammingLanguage = ...`)，或使用 `const` 断言 (`as const`)。

## 总结
- TypeScript 会结合上下文 (context) 信息进行类型推断。
- 如果对变量进行分解会导致类型错误，可以考虑添加类型声明。
- 如果变量确实是常量，可以使用 `const` 断言 ( `as const`)。但要注意这可能导致在使用才抛出错误，而不是在定义时就发现错误。