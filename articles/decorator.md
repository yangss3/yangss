# 装饰着模式 call/apply

> [原文 1](https://juejin.cn/post/6844904089680084999)
> [原文 2](https://juejin.cn/post/6844904089734610957)

JavaScript 在处理函数时提供了非凡的灵活性。它们可以被传递，用作对象，现在我们将看到如何在它们之间 转发（forward） 调用并 装饰（decorate） 它们。

## 透明缓存

假设我们有一个 CPU 重负载的函数 `slow(x)`，但它的结果是稳定的。换句话说，对于相同的 x，它总是返回相同的结果。如果经常调用该函数，我们可能希望将结果缓存下来，以避免在重新计算上花费额外的时间。但是我们不是将这个功能添加到 `slow()` 中，而是创建一个包装器（wrapper）函数，该函数增加了缓存功能:
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

在上面的代码中，`cachingDecorator` 是一个装饰者（decorator）：一个特殊的函数，它接受另一个函数并改变它的行为。从外部代码来看，包装的 `slow` 函数执行的仍然是与之前相同的操作。它只是在其行为上添加了缓存功能。

总而言之，使用分离的 `cachingDecorator` 而不是改变 `slow` 本身的代码有几个好处
- `cachingDecorator` 是可重用的。我们可以将它应用于另一个函数
- 缓存逻辑是独立的，它没有增加 `slow` 本身的复杂性
- 如果需要，我们可以组合多个装饰者（其他装饰者将遵循同样的逻辑）

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
};

function cachingDecorator(func) {
  let cache = new Map()
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

现在让我们把 `cachingDecorator` 写得更加通用。到现在为止，它只能用于单参数函数。

现在如何缓存多参数 worker.slow 方法呢?
```js
const worker = {
  slow(min, max) {
    return min + max
}

// 应该记住相同参数的调用
worker.slow = cachingDecorator(worker.slow)
```
我们需要将 `func.call(this, x)` 替换成 `func.call(this, ...arguments)`，以将所有参数传递给包装的函数调用，而不仅仅是只传递第一个参数。

这是一个更强大的 `cachingDecorator`：
```js
const worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`)
    return min + max
  }
};

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
  return Array.from(args).reduce((p, c) => p + c)
}

worker.slow = cachingDecorator(worker.slow, hash)

worker.slow(3, 5) // 工作正常
worker.slow(3, 5) // 工作正常，使用的缓存
```
现在这个包装器可以处理任意数量的参数了， 这里有两个变化：
1. 在 (1) 行中它调用 `hash` 来从 `arguments` 创建一个单独的键。这里我们使用一个简单的求和函数，更复杂的情况可能需要其他哈希函数
2. 然后 (2) 行使用 `func.call(this, ...arguments)` 将包装器获得的上下文和所有参数（不仅仅是第一个参数）传递给原始函数

我们也可以使用 `func.apply(this, arguments)` 代替 `func.call(this, ...arguments)`，`call` 和 `apply` 之间唯一的语法区别是，`call` 期望一个参数列表，而 `apply` 期望一个包含这些参数的类数组对象。因此，这两个调用几乎是等效的：
```js
func.call(context, ...args) // 使用 spread 语法将数组作为列表传递
func.apply(context, args)   // 与使用 call 相同
```
这里只有很小的区别：
- Spread 语法 `...` 允许将可迭代对象 `args` 作为列表传递给 `call`。
- `apply` 仅接受类数组对象 `args`。

对于即可迭代又是类数组的对象，例如一个真正的数组，从技术上讲我们使用 `call` 或 `apply` 都行，但是 `apply` 可能会更快，因为大多数 JavaScript 引擎在内部对其进行了优化。

将所有参数连同上下文一起传递给另一个函数被称为“呼叫转移（call forwarding）”，这是它的最简形式：
```js
const wrapper = function() {
  return func.apply(this, arguments)
};
```
当外部代码调用这种包装器 `wrapper` 时，它与原始函数 `func` 的调用是无法区分的。