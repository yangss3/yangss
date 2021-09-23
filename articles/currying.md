# 柯里化（Currying）
<PubDate date="2021/05/17"/>

[柯里化（Currying）](https://en.wikipedia.org/wiki/Currying)是一种关于函数的高阶技术，它是一种函数的转换，将一个函数调用从 `f(a, b, c)` 的形式转换为 `f(a)(b)(c)` 的调用形式。柯里化不会调用函数，它只是对函数进行转换。

让我们先来看一个例子，以更好地理解我们正在讲的内容，然后再进行一个实际应用。

我们将创建一个辅助函数 `curry(f)`，该函数将对两个参数的函数 `f` 执行柯里化。换句话说，对于两个参数的函数 `f(a, b)` 执行 `curry(f)` 会将其转换为以 `f(a)(b)` 形式运行的函数：
```js
// curry(f) 执行柯里化转换
function curry(f) { 
  return function(a) {
    return function(b) {
      return f(a, b)
    }
  }
}

// 用法
function sum(a, b) {
  return a + b
}

const curriedSum = curry(sum)

curriedSum(1)(2)// 3
```
正如你所看到的，实现非常简单：只有两个包装器（wrapper）
- `curry(sum)` 的结果就是一个包装器 `function(a)`
- 当它被像 `curriedSum(1)` 这样调用时，它的参数会被保存在词法环境中，然后返回一个新的包装器 `function(b)`
- 然后这个包装器被以 2 为参数调用，而它将该调用传递给原始的 `sum` 函数

柯里化更高级的实现，例如 lodash 库的 `_.curry`，会返回一个包装器，该包装器允许函数被正常调用或者以偏函数（partial）的方式调用：
```js
function sum(a, b) {
  return a + b
}

const curriedSum = _.curry(sum) // 使用来自 lodash 库的 _.curry

console.log(curriedSum(1, 2)) // 3，仍可正常调用
console.log(curriedSum(1)(2)) // 3，以偏函数的方式调用
```

## 为什么需要柯里化？
要了解它的好处，我们需要一个实际中的例子。

例如，我们有一个用于格式化输出信息的日志函数 `log(date, importance, message)`。在实际项目中，此类函数具有很多有用的功能，例如通过网络发送日志，在这儿我们仅使用 `console.log`：
```js
function log(date, importance, message) {
  console.log(`[${date.getHours()}:${date.getMinutes()}] [${importance}] ${message}`)
}
```
让我们将它柯里化！
```js
log = _.curry(log)
```
柯里化之后，`log` 仍正常运行：
```js
log(new Date(), "DEBUG", "some debug")  // log(a, b, c)
```
但是也可以以柯里化形式运行：
```js
log(new Date())("DEBUG")("some debug") // log(a)(b)(c)
```
现在，我们可以轻松地为当前日志创建便捷函数：
```js
// logNow 会是带有固定第一个参数的日志的偏函数
const logNow = log(new Date())

// 使用它
logNow("INFO", "message") // [HH:mm] INFO message
```
现在，`logNow` 是具有固定第一个参数的 `log`，换句话说，就是更简短的”偏应用函数（partially applied function）”或“偏函数（partial）”。

我们可以更进一步，为当前的调试日志（debug log）提供便捷函数：
```js
let debugNow = logNow("DEBUG")

debugNow("message") // [HH:mm] DEBUG message
```

## 柯里化高级实现
实现代码相当简洁：
```js
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) { // (1)
      return func.apply(this, args)
    } else {
      return function(...args2) { // (2)
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}
```
它也很容易理解，`curry(func)` 调用的结果是返回包装器 `curried`, 当我们运行它时，这里有两个执行分支：

1. 如果传入的 `args` 长度与原始函数所定义的参数长度（`func.length`）相同或者更长，那么将调用传递给原始函数即可。
2. 否则，返回另一个包装器（偏函数），它将之前传入的参数与新的参数合并，然后重新调用 `curried`。在新一轮的调用中，重复 1，2 步骤。

用例：
```js
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

curriedSum(1, 2, 3) // 6，仍然可以被正常调用
curriedSum(1)(2,3) // 6，对第一个参数的柯里化
curriedSum(1)(2)(3) // 6，全柯里化
```
