# 深入理解 WeakMap 和 WeakSet
<PubDate date="2021/11/05"/>

JS 引擎在值可访问（并可能被使用）时将其存储在内存中。

例如：
```js
let john = { name: "John" }

// 该对象能被访问，john 是它的引用

// 覆盖引用
john = null

// 该对象将会被从内存中清除
```
通常，当对象、数组这类数据结构在内存中时，它们的子元素，如对象的属性、数组的元素都是可以访问的。例如，如果把一个对象放入到数组中，那么只要这个数组存在，那么这个对象也就存在，即使没有其它对该对象的引用：
```js
let john = { name: "John" }

const array = [ john ]

john = null // 覆盖引用

// john 被存储在数组里, 所以它不会被垃圾回收机制回收
// 我们可以通过 array[0] 来获取它
```
类似的，如果我们使用对象作为常规 `Map` 的键，那么当 `Map` 存在时，该对象也将存在。它会占用内存，并且不会被垃圾回收机制回收：
```js
let john = { name: "John" }

const map = new Map()
map.set(john, "xxx")

john = null // 覆盖引用

// john 被存储在 map 中，
// 我们可以使用 map.keys() 来获取它
```

而 `WeakMap` 在这方面有着根本上的不同。它不会阻止垃圾回收机制对作为键的对象的回收。

让我们通过例子来看看这指的到底是什么。

## WeakMap

`WeakMap` 和 `Map` 的第一个不同点就是，`WeakMap` 的键必须是对象，不能是原始值（primitive）：
```js
const weakMap = new WeakMap()

const obj = {}

weakMap.set(obj, 'ok') // 正常工作（以对象作为键）

// 不能使用字符串作为键
weakMap.set('hello', "Whoops") // Error，"test" 不是一个对象
```
现在，如果我们在 `weakMap` 中使用一个对象作为键，并且没有其它对这个对象的引用， 那么该对象将会被从内存（和 `weakMap`）中自动清除：

```js
let john = { name: 'John' }

const weakMap = new WeakMap()
weakMap.set(john, 'xxx')

john = null // 覆盖引用

// john 被从内存中删除了！
```
`WeakMap` 是不可迭代的，也不支持 `keys()`，`values()` 和 `entries()` 方法，所以没有办法获取 `WeakMap` 的所有键或值，`WeakMap` 只有以下的方法:
- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`

为什么会有这种限制？这是技术的原因。如果一个对象丢失了其它所有引用（就像上面示例中的 `john`），那么它就会被垃圾回收机制自动回收。但是在从技术的角度并不能准确知道何时会被回收。

这些都是由 JS 引擎决定的。JS 引擎可能会选择立即执行内存清理，如果现在正在发生很多删除操作，那么 JS 引擎可能就会选择等一等，稍后再进行内存清理。因此，从技术上讲，`WeakMap` 的当前元素的数量是未知的。JS 引擎可能清理了其中的垃圾，可能没清理，也可能清理了一部分。因此，不支持访问 `WeakMap` 的所有键/值的方法。

那么，在哪里我们会需要这样的数据结构呢？ `WeakMap` 的主要应用场景是额外数据的存储。

假如我们正在处理一个属于另一个代码的对象，也可能是第三方库，并想存储一些与之相关的数据，那么这些数据就应该与这个对象共存亡，这时候 `WeakMap` 正是处理这种情况的利器。我们将这些数据放到 `WeakMap` 中，并使用该对象作为这些数据的键，那么当该对象被垃圾回收机制回收后，这些数据也会被自动清除。

例如，我们有用于处理用户访问计数的代码。收集到的信息被存储在 map 中：一个用户对象作为键，其访问次数为值。当一个用户离开时（该用户对象将被垃圾回收机制回收），这时我们就不再需要他的访问次数了

下面是一个使用 Map 的计数函数的例子

```js
const visitsCountMap = new Map()

// 递增用户来访次数
function countUser(user) {
  const count = visitsCountMap.get(user) || 0
  visitsCountMap.set(user, count + 1)
}
```
在其它地方使用此计数函数：
```js
let john = { name: "John" }

countUser(john) // 统计访问次数

// 不久之后，john 离开了
john = null
```
现在 `john` 这个对象应该被垃圾回收，但他仍在内存中，因为它是 `visitsCountMap` 中的一个键。当我们移除用户时，我们需要手动清理 `visitsCountMap`，否则它将在内存中无限增大。在复杂的架构中，这种清理会成为一项繁重的任务。

我们可以通过使用 `WeakMap` 来避免这样的问题：
```js

const visitsCountMap = new WeakMap();

// 递增用户来访次数
function countUser(user) {
  const count = visitsCountMap.get(user) || 0
  visitsCountMap.set(user, count + 1)
}
```
现在我们不需要去手动清理 `visitsCountMap` 了。当 `john` 对象变成不可访问时，即便它是 `WeakMap` 里的一个键，它以及它在 `WeakMap` 里所存储的信息都会一同被从内存中删除。

## WeakSet
`WeakSet` 的表现与 `WeakMap` 类似：
- 只能向 `WeakSet` 添加对象，而不能是原始值。
- 对象只有在其它地方能被访问的时候，才能留在 `WeakSet` 中。
- 跟 `Set` 一样，`WeakSet` 支持 `add`，`has` 和 `delete` 方法，但不支持 `size` 和 `keys()`，并且不可迭代。
