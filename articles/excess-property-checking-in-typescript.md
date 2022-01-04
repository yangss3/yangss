# TypeScript 中的超出属性检查 (Excess property checking)
<PubDate date="2021/05/21"/>

当你把一个对象的字面量赋值给一个有声明类型的变量时，TypeScript 会确保它具有该类型的属性，而且没有任何未声明的的属性：
```ts
interface Room {
  numDoors: number
  ceilingHeightFt: number
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present'
} // ~~~ Object literal may only specify known properties, and 'elephant' does not exist in type 'Room'
```
但是通过引入一个中间变量，你还是可以把这个字面对象分配给 `Room` 类型：
```ts
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
}
const r: Room = obj // Ok
```
变量 `obj` 的类型被推断为 `{ numDoors: number; ceilingHeightFt: number; elephant: string }`，而这个类型的值集是 `Room` 类型的一个子集，所以赋值能通过类型检查。

那么这两个例子有什么不同？第一个例子中触发了一个叫做”超出属性检查”(excess property checking)的过程，它会帮你捕获结构化类型系统中很容易被漏掉的一类重要的错误。但是这个过程有它的局限性，把它和常规的可赋值检查(assignability checking)混为一谈会使我们更难建立对结构化类型的直觉。认识到超出属性检查(excess property checking)是一个独特的过程将有助于你建立一个更清晰的 TypeScript 类型系统的心智模型。

TypeScript 不仅试图标记那些会在运行时抛出异常的代码。它还试图找到那些不按你的意图执行的代码。下面是一个例子：
```ts
interface Options {
  title: string
  darkMode?: boolean
}
function createWindow(options: Options) {
  if (options.darkMode) {
    setDarkMode()
  }
 // ...
}

createWindow({
  title: 'Spider Solitaire',
  darkmode: true
  // ~~~~~ Object literal may only specify known properties, but
  //       'darkmode' does not exist in type 'Options'.
  //       Did you mean to write 'darkMode'?
})
```
这段代码在运行时阶段不会抛出任何错误。但它也不太可能是你的本意，原因正如错误提示指出的：应该是 `darkMode`（大写的 M），而不是 `darkmode`。

一个纯结构化类型检查器无法发现这种错误，因为 `Options` 类型所表示的值集范围非常宽泛：它包括所有包含 `title` 属性（且是 `string` 类型）的对象，只要这个对象不包含非布尔值的 `darkMode` 属性：
```ts
const o1: Options = document // Ok
const o2: Options = new HTMLAnchorElement // Ok
```
`document` 和 `HTMLAnchorElement` 的实例都有 `title` 属性，且都是字符串，所以这些赋值都可以成功。可见 `Options` 类型有多宽泛 !

超出属性检查(excess property checking)试图在不破坏类型系统的基本结构性质的情况下控制这种情况。它通过禁止对象字面量的未知属性来做到这一点（有时被称为“严格的对象字面检查”）。`document` 和 `new HTMLAnchorElement` 都不是对象字面量，所以没有触发检查。但是 `{ title, darkmode }` 是对象字面量，它会触发这个检查。
```ts
const o: Options = { darkmode: true, title: 'Ski Free' }
 // ~~~ 'darkmode' does not exist in type 'Options'...
```
这也就解释了为什么使用一个不带类型声明的中间变量就可以消除错误提示：
```ts
const intermediate = { darkmode: true, title: 'Ski Free' }
const o: Options = intermediate // Ok
```
另外，如果你使用类型断言(type assertion)，也不会触发超出属性检查(excess property checking)：
```ts
const o = { darkmode: true, title: 'Ski Free' } as Options // OK
```
这也是要尽可能使用类型声明而不是类型断言的理由之一。

如果你不想要这种检查，你可以使用一个 index signature 来告诉 TypeScript 你可以接受额外的属性：
```ts
interface Options {
  darkMode?: boolean
  [otherOptions: string]: unknown
}
const o: Options = { darkmode: true } // OK
```
在“弱”类型（weak type，只包含可选属性的类型）上也有一个类似的检查：
```ts
interface LineChartOptions {
  logscale?: boolean
  invertedYAxis?: boolean
  areaChart?: boolean
}
const opts = { logScale: true }
const o: LineChartOptions = opts
// ~~~ Type '{ logScale: boolean; }' has no properties in common with type 'LineChartOptions'
```

从结构的角度来看，`LineChartOptions` 类型应该包括几乎所有的对象。对于像这样的弱类型，TypeScript 添加了另一个检查，以确保值类型和声明类型至少有一个共同的属性。和超出属性检查(excess property checking)一样，这在捕捉错别字方面很有效，而且不是严格的结构性检查。但与超出属性检查不同，它发生在所有涉及弱类型的赋值过程中，使用中间变量并不能绕过这个检查。

超出属性检查是一种有效的方法，可以在属性名称中捕捉到错别字和其他错误。它对像 `Options` 这样包含可选字段的类型特别有用。但它的范围也非常有限：它只适用于对象字面量。认识到这个限制，并区分超出属性检查和普通的类型检查，这将有助于你建立两者的心智模型。

## 总结
- 当你把一个对象的字面量分配给一个变量或把它作为一个参数传递给一个函数时，它会经过超出属性检查(excess property checking)。
- 超出属性检查是发现错误的有效方法，但它与 TypeScript 类型检查器通常所做的结构可分配性(structural assignability)检查不同。将这些过程混为一谈会使你更难建立可分配性的心智模型
- 注意超出属性检查的局限性：引入一个中间变量将绕过这些检查