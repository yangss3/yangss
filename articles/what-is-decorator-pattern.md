# 什么是装饰者模式？
<PubDate date="2020/09/07"/>

JavaScript 中的函数在使用时非常灵活，它们可以像变量一样被传递到任何地方，下面我们将看到如何在它们之间转发调用并装饰它们。
## 透明缓存

假设我们有一个 CPU 重负载的函数 `slow(x)`，但它的结果是稳定的。换句话说，对于相同的 `x`，它总是返回相同的结果。如果经常调用该函数，我们可能希望将结果缓存下来，以避免在重新计算上花费额外的时间。但是我们不是将这个功能添加到 `slow()` 中，而是创建一个包装器（wrapper）函数，该函数增加了缓存功能：
```js
function slow(x) {
  // 这里可能会有重负载的 CPU 密集型工作
  alert(`Called with ${x}`)
  return x
}

function cachingDecorator(func) {
  const cache = new Map()

  return function(x) {
    if (cache.has(x)) {    // 如果缓存中有对应的结果
      return cache.get(x) // 从缓存中读取结果
    }

    const result = func(x)  // 否则就调用 func
    cache.set(x, result)  // 然后将结果缓存下来

    return result
  }
}

slow = cachingDecorator(slow)

slow(1) // 计算并缓存结果
slow(1) // 从缓存中拿结果
```

在上面的代码中，`cachingDecorator` 是一个装饰者（decorator）：一个特殊的函数，它接受另一个函数并改变它的行为。从外部代码来看，包装的 `slow` 函数没有发生任何变化，它只是在其行为上添加了缓存功能。

总而言之，使用分离的 `cachingDecorator` 而不是改变 `slow` 本身的代码有几个好处：
- `cachingDecorator` 是可重用的。我们可以将它应用于另一个函数
- 缓存逻辑是独立的，它没有增加 `slow` 本身的复杂性
- 如果需要，我们可以组合多个装饰者（其他装饰者遵循同样的逻辑）

## 使用 `func.call` 设定上下文
上面提到的缓存装饰者不适用于对象方法。例如，在下面的代码中，`worker.slow` 在装饰后不会正常工作：
```js
// 我们将对 worker.slow 的结果进行缓存
const worker = {
  someMethod() {
    return 1
  },

  slow(x) {
    // CPU 密集型任务
    alert("Called with " + x)
    return x * this.someMethod() // (1)
  }
}

// 和之前例子中的代码相同
function cachingDecorator(func) {
  const cache = new Map()
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x)
    }
    const result = func(x) // (2)
    cache.set(x, result)
    return result
  }
}

worker.slow(1) // 原始方法有效
worker.slow = cachingDecorator(worker.slow) // 现在对其进行缓存
worker.slow(2) // Error: Cannot read property 'someMethod' of undefined
```

错误发生在 (1) 中试图访问 `this.someMethod`，原因是 (2) 中包装器调用原始函数 `func(x)` 时丢失了 `this` 上下文，`func` 函数拿到的 `this` 为 `undefined` 。

要解决这个问题需要用到 JS 函数的一个特殊的内置方法 `Function.prototype.call`，它允许显式地为函数调用设置 `this` 上下文，语法如下：
```js
func.call(context, arg1, arg2, ...)
```
它运行 func，提供的第一个参数作为 `this`，后面的作为参数。简单地说，这两个调用几乎相同：
```js
func(1, 2, 3)
func.call(obj, 1, 2, 3)
```
它们调用的都是 `func`，参数是 `1, 2, 3`。唯一的区别是 `func.call` 还会将 `this` 设置为 `obj`。

在我们的例子中，我们可以在包装器中使用 `call` 将上下文传递给原始函数：
```js
const worker = {
  someMethod() {
    return 1
  },

  slow(x) {
    alert("Called with " + x)
    return x * this.someMethod() // (1)
  }
}

function cachingDecorator(func) {
  const cache = new Map()
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x)
    }
    const result = func.call(this, x) // 现在 "this" 被正确地传递了
    cache.set(x, result)
    return result
  }
}

worker.slow = cachingDecorator(worker.slow) // 现在对其进行缓存

worker.slow(2) // 工作正常
worker.slow(2) // 工作正常，使用的缓存
```
现在一切都正常工作了。

为理解地更清晰一些，让我们更深入地看看 `this` 是如何被传递的：

1. 在经过装饰之后，`worker.slow` 现在是包装器 `function (x) { ... }`。
2. 因此，当` worker.slow(2)` 执行时，`slow` 函数内的 `this` 指向 `worker`（指向点符号 `.` 之前的对象）

## 使用 `func.apply` 来传递多参数

上面的 `cachingDecorator` 装饰者只能用于单参数函数，现在如何缓存多参数 `worker.slow` 方法呢?

```js
const worker = {
  slow(min, max) {
    return min + max
  }
}

// 应该记住相同参数的调用
worker.slow = cachingDecorator(worker.slow)
```
之前，对于单个参数 `x`，我们可以只使用 `cache.set(x, result)` 来保存结果，并使用 `cache.get(x)` 来检索并获取结果。但是现在我们需要记住参数组合 `(min,max)`的结果，这里我们可以简单的实现一个哈希（hash）函数将参数组合映射到一个值，然后用这个值作为 map 的键来保存结果。

现在让我们把 `cachingDecorator` 写得更加通用，我们需要将 `func.call(this, x)` 替换成 `func.call(this, ...arguments)`，以将所有参数传递给包装的函数调用，而不仅仅是只传递第一个参数。

这是一个更强大的 `cachingDecorator`：
```js
const worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`)
    return min + max
  }
}

function cachingDecorator(func, hash) {
  const cache = new Map()
  return function() {
    const key = hash(arguments) // (1)
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func.call(this, ...arguments) // (2)

    cache.set(key, result)
    return result
  }
}

function hash(args) {
  return `${args[0]},${args[1]}`
}

worker.slow = cachingDecorator(worker.slow, hash)

worker.slow(3, 5) // 工作正常
worker.slow(3, 5) // 工作正常，使用的缓存
```
现在这个包装器可以处理任意数量的参数了（尽管哈希函数还需要进行调整以允许任意数量的参数，后面会提到）， 这里有两个变化：
1. 在 (1) 行中它调用 `hash` 来从 `arguments` 创建一个单独的键。这里我们使用一个简单拼接函数，更复杂的情况可能需要其他哈希函数
2. 然后 (2) 行使用 `func.call(this, ...arguments)` 将包装器获得的上下文和所有参数传递给原始函数

我们也可以使用 `func.apply(this, arguments)` 代替 `func.call(this, ...arguments)`，`call` 和 `apply` 之间唯一的语法区别是，`call` 期望一个参数列表，而 `apply` 期望一个包含这些参数的类数组对象。因此，这两个调用几乎是等效的：
```js
func.call(context, ...args) // 使用 spread 语法将数组作为列表传递
func.apply(context, args)   // 与使用 call 相同
```
这里只有很小的区别：
- spread 语法 `...` 允许将可迭代对象 `args` 作为列表传递给 `call`。
- `apply` 仅接受类数组对象 `args`。

对于即可迭代又是类数组的对象，例如一个真正的数组，从技术上讲我们使用 `call` 或 `apply` 都行，但是 `apply` 可能会更快，因为大多数 JavaScript 引擎在内部对其进行了优化。

将所有参数连同上下文一起传递给另一个函数被称为“呼叫转移（call forwarding）”，这是它的最简形式：
```js
const wrapper = function() {
  return func.apply(this, arguments)
};
```
当外部代码调用这种包装器 `wrapper` 时，它与原始函数 `func` 的调用是无法区分的。

## 方法借用
上面例子中的哈希函数仅适用于两个参数。如果它可以适用于任何数量的参数就更好了，自然想到的解决方案是使用 `arr.join` 方法：
```js
function hash(args) {
  return args.join()
}
```
……不幸的是，这不行。因为我们正在调用 `hash(arguments)`，函数内部变量 `arguments` 只是一个可迭代的类数组对象，它并不是真正的数组，所以在它上面调用 join 会失败。

不过，有一种简单的方法可以使用数组的 `join` 方法:
```js
function hash() {
  console.log([].join.call(arguments))
}

hash(1, 2) // ok '1,2'
```
这个技巧被称为**方法借用**（method borrowing），我们从常规数组 `[]` 中借用 `join` 方法，并使用 `[].join.call` 在 `arguments` 的上下文中运行它。

它为什么有效？

那是因为原生方法 `arr.join(sep)` 的内部算法非常简单：
1. 让 `sep` 成为第一个参数，如果没有参数，则使用逗号 `,`
2. 让 `result` 为空字符串
3. 将 `this[0]` 附加到 `result`
4. 附加 `sep` 和 `this[1]`
5. 附加 `sep` 和 `this[2]`
6. ……以此类推，直到 `this.length` 个项被粘在一起
7. 返回 `result`

因此，从技术上讲，它需要 `this` 并将 `this[0]`，`this[1]` ...等 `join` 在一起。它的编写方式是故意允许任何类数组的 `this` 的（不是巧合，很多方法都遵循这种做法）。这就是为什么它也可以和 `this=arguments` 一起使用。

通常，用装饰的函数替换一个函数或一个方法是安全的，除了一个例外：如果原始函数上有自己的属性，则装饰后的函数将不再提供这些属性。例如在上面的示例中，如果 `slow` 函数具有任何属性，而 `cachingDecorator(slow)` 则是一个没有这些属性的包装器。一些包装器可能会提供自己的属性。例如，装饰者会计算一个函数被调用了多少次以及花费了多少时间，并通过包装器属性暴露这些信息。

## 一些常用的装饰者
### 间谍装饰者
创建一个装饰者 `spy(func)`，它应该返回一个包装器，该包装器将所有对函数的调用保存在其 `calls` 属性中，每个调用都保存为一个参数数组。

例如：
```js
function work(a, b) {
  alert( a + b ) // work 是一个任意的函数
}

work = spy(work)

work(1, 2) // 3
work(4, 5) // 9

for (const args of work.calls) {
  alert( 'call:' + args.join() ) // "call:1,2", "call:4,5"
}
```
解决方案：
```js
function spy(func) {

  function wrapper(...args) {
    // 使用 ...args 而不是 arguments 来获取真正的参数数组
    wrapper.calls.push(args)
    return func.apply(this, args)
  }

  wrapper.calls = [];

  return wrapper;
}
```
### 延迟装饰者
创建一个装饰者` delay(f, ms)`，该装饰者将 `f` 的每次调用延时 `ms` 毫秒。

例如：
```js
function f(x) {
  alert(x)
}

// create wrappers
const f1000 = delay(f, 1000)
const f1500 = delay(f, 1500)

f1000('hello') // 在 1000ms 后显示 "hello"
f1500('world') // 在 1500ms 后显示 "world"
```
解决方案：
```js
function delay(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  }
}
```
注意这里使用的是箭头函数（arrow function），我们知道，箭头函数没有自己的 `this` 和 `arguments`，所以 `f.apply(this, arguments)` 从包装器中获取 `this` 和 `arguments`，这正是我们需要的。 如果使用常规函数，我们仍然可以通过使用中间变量来传递正确的 `this`，但这有点麻烦：
```js
function delay(f, ms) {
  return function(...args) {
    const savedThis = this // 将 this 存储到中间变量
    setTimeout(function() {
      f.apply(savedThis, args)
    }, ms)
  }
}
```
### 去抖装饰者
`debounce(f, ms)` 装饰者的结果应该是一个包装器，该包装器最多允许每隔 `ms` 毫秒将调用传递给 `f` 一次。

换句话说，当我们调用 debounced 函数时，它保证之后所有在距离上一次调用的时间间隔少于 `ms` 毫秒的调用都会被忽略。

例如：
```js
const f = debounce(alert, 1000)

f(1) // 立即执行
f(2) // 被忽略

setTimeout(() => f(3), 100) // 被忽略（只过去了 100 ms）
setTimeout(() => f(4), 1100) // 运行
setTimeout(() => f(5), 1500) // 被忽略（距上一次运行不超过 1000 ms）
```

在实际中，对于那些用于检索/更新某些内容的函数而言，当我们知道在短时间内不会有什么新内容的时候，`debounce` 就显得很有用，可以减少浪费资源。

解决方案：
```js
function debounce(f, ms) {
  let isCoolDown = false

  return function() {
    if (isCoolDown) return

    f.apply(this, arguments)

    isCoolDown = true

    setTimeout(() => isCoolDown = false, ms)
  }
}
```

### 节流装饰者

创建一个装饰者 `throttle(f, ms)`，它返回一个包装器，最多每隔 `ms` 毫秒将调用传递给 `f` 一次。那些属于冷却期的调用将被忽略。

与 `debounce` 的区别是，如果被忽略的调用是冷却期间的最后一次，那么它会在延时结束时执行。

例如：
```js
function f(a) {
  console.log(a)
}

// f1000 最多每 1000ms 将调用传递给 f 一次
let f1000 = throttle(f, 1000)

f1000(1) // 显示 1
f1000(2) // (节流，尚未到 1000ms)
f1000(3) // (节流，尚未到 1000ms)

// 当 1000ms 时间到...
// ...输出 3，中间值 2 被忽略
```

解决方案：
```js
function throttle(f, ms) {

  let isCoolDown = false
  let savedArgs
  let savedThis

  function wrapper() {

    if (isCoolDown) { // (2)
      savedArgs = arguments
      savedThis = this
      return
    }

    f.apply(this, arguments) // (1)

    isCoolDown = true

    setTimeout(function() {
      isCoolDown = false // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null
      }
    }, ms)
  }

  return wrapper
}
```
1. 在第一次调用期间，`wrapper` 只运行 `f` 并设置冷却状态 `isCoolDown = true`
2. 在这种状态下，所有调用都记忆在 `savedArgs/savedThis` 中。请注意，上下文和参数（arguments）同等重要，应该被记下来，我们需要他们以重现调用
3. 然后经过 `ms` 毫秒后，触发 `setTimeout`，冷却状态被移除 `isCoolDown = false`，如果我们忽略了调用，则将使用最后记忆的参数和上下文执行 `wrapper`

第 3 步运行的是 `wrapper`，而不是 `func`，因为我们不仅需要执行 `func`，还需要再次进入冷却状态并设置 `setTimeout` 以重置它。