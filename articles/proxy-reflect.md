# 深入理解 Proxy 和 Reflect
<PubDate date="2020/10/18"/>
## Proxy

一个 `Proxy` 对象包装另一个对象并拦截诸如读取/写入属性和其他操作，可以选择自行处理它们，或者透明地将操作转发给原对象。

语法：
```js
const proxy = new Proxy(target, handler)
```
其中：
- `target` —— 是要包装的对象，可以是任何东西，包括函数
- `handler` —— 代理配置：带有“钩子”的对象。比如 `get` 钩子用于读取 `target` 属性，`set` 钩子写入 `target` 属性等等

对 `proxy` 进行操作时，如果在 `handler` 中存在相应的钩子，则该钩子会被调用，并且 Proxy 有机会对该操作进行代理，否则将直接对 `target` 进行操作。

首先，让我们创建一个没有任何钩子的代理：
```js
const target = {}
const proxy = new Proxy(target, {}) // 空的handler对象

proxy.test = 5 // 写入 Proxy 对象 (1)

console.log(target.test) // 返回 5，test属性出现在了 target 上！
console.log(proxy.test) // 还是 5，我们也可以从 proxy 对象读取它 (2)

for(const key in proxy) console.log(key) // 返回 test，迭代也正常工作！ (3)
```
由于没有钩子，所有对 `proxy` 的操作都直接转发给 `target`：
1. 写入操作 `proxy.test=` 会将值写入 `target`
2. 读取操作 `proxy.test` 会从 `target` 返回对应的值
3. 迭代 `proxy` 会从 `target` 返回对应的值

我们可以看到，如果没有任何钩子，`proxy` 是一个 `target` 的透明包装。

`Proxy` 是一种特殊的对象。它没有自己的属性，如果 `handler` 为空，则透明地将操作转发给 `target`

要激活更多功能，我们需要添加钩子来拦截操作，那我们可以用它们拦截什么？

对于对象的大多数操作，JavaScript 规范中都有一个所谓的“内部方法”，它描述了最底层的工作方式。 例如 `[[Get]]`，用于读取属性的内部方法， `[[Set]]`，用于写入属性的内部方法，等等。这些方法仅在规范中使用，我们不能直接通过方法名调用它们。Proxy 钩子会拦截这些方法的调用，对于每个内部方法，下表中都有一个钩子，用于拦截对应的操作：

|内部方法|Handler 方法|何时触发|
|:---:|:---:|:---:|
|[[Get]]|get|读取属性|
|[[Set]]|	set|	写入属性|
|[[HasProperty]]|has|in 运算符|
|[[Delete]]|deleteProperty|delete 操作|
|[[Call]]|apply|proxy 对象作为函数被调用|
|[[Construct]]|construct|new 操作|
|[[GetPrototypeOf]]|getPrototypeOf|Object.getPrototypeOf|
|[[SetPrototypeOf]]|setPrototypeOf|Object.setPrototypeOf|
|[[IsExtensible]]|isExtensible|Object.isExtensible|
|[[PreventExtensions]]|preventExtensions|Object.preventExtensions|
|[[DefineOwnProperty]]|defineProperty|Object.defineProperty, Object.defineProperties|
|[[GetOwnProperty]]|getOwnPropertyDescriptor|Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries|
|[[OwnPropertyKeys]]|ownKeys|Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object/keys/values/entries|

当由内部方法和钩子来完成操作时，JavaScript 强制执行某些不变式。其中大多数用于返回值：
- `[[Set]]` 如果值已成功写入，则必须返回 `true`，否则返回 `false`
- `[[Delete]]` 如果已成功删除该值，则必须返回 `true`，否则返回 `false`
- ……依此类推，我们将在下面的示例中看到更多内容

还有其他一些不变量，例如：
- `[[GetPrototypeOf]]` 应用于代理对象的，必须返回与 `[[GetPrototypeOf]]` 应用于被代理对象相同的值。换句话说，读取代理对象的原型必须始终返回被代理对象的原型。

钩子可以拦截这些操作，但是必须遵循这些规则。不变量确保语言功能的正确和一致的行为。完整的不变量列表请查看[规范](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)。如果你不做奇怪的事情，就不会违反它们。

让我们看看实际示例中的工作原理。

### 使用 `get` 钩子设置默认值
最常见的钩子是用于读取/写入属性。要拦截读取操作，`handler` 应该有 `get(target, property, receiver)` 方法。读取属性时触发该方法，参数如下：
- `target` —— 是目标对象，该对象作为第一个参数传递给 `new Proxy`
- `property` —— 目标属性名
- `receiver` —— 如果目标属性是一个 `getter` 访问器属性，则 `receiver` 就是本次读取属性所在的 `this` 对象。通常，这就是 `proxy` 对象本身（或者，如果我们从代理继承，则是从该代理继承的对象）。现在我们不需要此参数，稍后将对其进行详细说明。

让我们用 `get` 实现对象的默认值。

通常，当人们尝试获取不存在的数组项时，他们会得到 `undefined`, 但是我们会将常规数组包装到代理中，以捕获读取操作并在没有此类属性的情况下返回 0：
```js
let numbers = [0, 1, 2]

numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop]
    } else {
      return 0 // 默认值
    }
  }
})

console.log(numbers[1]) // 1
console.log(numbers[123]) // 0 (没有这样的元素)
```
可以看到，使用 `get` 钩子非常容易。

我们可以用 `Proxy` 来实现任何读取默认值的逻辑，想象一下，我们有一本词典，上面有单词及其翻译：
```js
const dictionary = {
  hello: '你好',
  bye: '再见'
}

console.log(dictionary['hello']) // 你好
console.log(dictionary['welcome']) // undefined
```
现在，如果访问的单词不存在，从 `dictionary` 读取将返回 `undefined`。但实际上，返回一个未翻译单词通常比 `undefined` 要好。用 `Proxy` 可以很容易做到这一点：
```js
const dictionary = {
  hello: '你好',
  bye: '再见'
}

dictionary = new Proxy(dictionary, {
  get(target, phrase) { // 拦截读取属性操作
    if (phrase in target) { //如果字典包含该短语
      return target[phrase] // 返回译文
    } else {
      // 否则返回未翻译的短语
      return phrase
    }
  }
})

console.log(dictionary['hello']) // 你好
console.log(dictionary['welcome']) // welcome 未翻译
```

请注意代理如何覆盖变量：
```js
dictionary = new Proxy(dictionary, ...)
```
代理应该在所有地方都完全替代了目标对象。目标对象被代理后，任何人都不应该再引用目标对象。否则很容易搞砸。

### 使用 `set` 钩子进行验证

当写入属性时 `set` 钩子触发， 需要在 `handler` 中定义 `set(target, property, value, receiver)` 方法：
- `target` —— 是目标对象，该对象作为第一个参数传递给 `new Proxy`
- `property` —— 目标属性名称
- `value` —— 目标属性要设置的值
- `receiver` —— 与 `get` 钩子类似，仅与 `setter` 访问器相关



假设我们想要一个专门用于存放数字的数组。如果添加了其它类型的值，则应该抛出一个错误：
```js
let numbers = []

numbers = new Proxy(numbers, { // (*)
  set(target, prop, val) { // 拦截写入操作
    if (typeof val == 'number') {
      target[prop] = val
      return true // 不要忘记返回 true
    } else {
      return false // 失败时要返回 false
    }
  }
})

numbers.push(1) // 添加成功
numbers.push(2) // 添加成功
console.log(numbers.length) // 2
numbers.push("test") // TypeError （proxy 的 `set` 操作返回 false）
```

注意到 `Array` 的内建方法依然生效！ 当使用 `push` 方法添加值时，`length` 属性会自动增加。我们的代理对象 `Proxy` 不会破坏任何东西。

我们不必重写诸如 `push` 和 `unshift` 等添加元素的数组方法，因为 `Proxy` 钩子拦截的是内部方法的调用，而这些添加数组元素的方法在内部都使用 `[[Set]]` 方法。

### 使用 `ownKeys` 和 `getOwnPropertyDescriptor` 进行迭代

`Object.keys`，`for..in` 循环和大多数其他遍历对象属性的方法都使用 `[[OwnPropertyKeys]]` 内部方法（由 `ownKeys` 钩子拦截) 来获取属性列表。

这些方法在细节上有所不同：
- `Object.getOwnPropertyNames(obj)` 返回非 `Symbol` 键
- `Object.getOwnPropertySymbols(obj)`  返回 `Symbol` 键
- `Object.keys/values(obj)` 返回带有 `enumerable` 标记的非 `Symbol` 键值对
- `for..in` 循环遍历所有带有 `enumerable` 标记的非 `Symbol` 键，以及原型对象的键

在下面的示例中，我们使用 `ownKeys` 钩子拦截 `for..in` 对 `user` 的遍历，还使用 `Object.keys` 和 `Object.values` 来跳过以下划线 `_` 开头的属性：
```js
let user = {
  name: 'John',
  age: 30,
  _password: '******'
}

user = new Proxy(user, {
  ownKeys(target) {
    return Object.keys(target).filter(key => !key.startWith('_'))
  }
})

// "ownKeys" 过滤掉le _password
for(let key in user) console.log(key) // name，age

// 对这些方法同样有效：
console.log(Object.keys(user)) // name, age
console.log(Object.values(user)) // John, 30
```
如果让 `ownKeys` 钩子返回目标对象不存在的键呢？

```js
let user = {}

user = new Proxy(user, {
  ownKeys(target) {
    return ['a', 'b', 'c']
  }
})

console.log(Object.keys(user)) // nothing
```
什么都没有，这是为什么呢？

原因很简单，`Object.keys` 仅返回带有 `enumerable` 标记的属性。为了检查它，该方法会对每个属性调用 `[[GetOwnProperty]]` 来获得属性描述符。在这里，由于目标对象没有这个属性，其描述符为空，没有 `enumerable` 标记，因此它将略过该属性。

所以要想让 `Object.keys` 返回目标对象不存在的属性，我们还需要拦截 `[[GetOwnProperty]]` 内部方法（使用 `getOwnPropertyDescriptor`），对于不存在的属性，让它返回描述符 `enumerable: true`：
```js
let user = {}

user = new Proxy(user, {
  ownKeys(target) {
    return ['a', 'b', 'c']
  },
  getOwnPropertyDescriptor(target, prop) {
    return {
      enumerable: true,
      configurable: true,
      //...
    }
  }
})

console.log(Object.keys(user)) // ['a', 'b', 'c']
```
是不是很有趣？
### 使用 `deleteProperty` 拦截属性删除
有一个普遍的约定，即下划线 `_` 前缀的属性和方法是内部的，不应从对象外部访问它们。

从技术上讲，这是可能的，我们需要这些钩子进行代理：
- `get` —— 读取此类属性时抛出错误
- `set` —— 写入属性时抛出错误
- `deleteProperty` —— 删除属性时抛出错误
- `ownKeys` —— 在使用 `for..in` 和类似 `Object.keys` 的方法时排除以 `_` 开头的属性

代码如下：
```js
let user = {
  name: 'John',
  _password: '******'
}

user = new Proxy(user, {
  get(target, prop) { //拦截读取操作
    if (prop.startsWith('_')) {
      throw new Error("Access denied")
    }
    const value = target[prop]
    return (typeof value === 'function') ? value.bind(target) : value // (1)
  },
  set(target, prop, val) { // 拦截写入操作
    if (prop.startsWith('_')) {
      throw new Error("Access denied")
    } else {
      target[prop] = val
      return true // 记得返回 true
    }
  },
  deleteProperty(target, prop) { // 拦截属性删除
    if (prop.startsWith('_')) {
      throw new Error("Access denied")
    } else {
      delete target[prop]
      return true // 记得返回 true
    }
  },
  ownKeys(target) { // 拦截读取属性列表
    return Object.keys(target).filter(key => !key.startsWith('_'))
  }
})

// “get” 不允许读取 _password
try {
  alert(user._password) // Error: Access denied
} catch(e) { alert(e.message) }

//  “set” 不允许写入 _password
try {
  user._password = "test" // Error: Access denied
} catch(e) { alert(e.message) }

// “deleteProperty” 不允许删除 _password 属性
try {
  delete user._password // Error: Access denied
} catch(e) { alert(e.message) }

// “ownKeys” 过滤排除 _password
for(const key in user) console.log(key) // name
```

请注意在 (1) 中 `get` 钩子的重要细节：
```js
get(target, prop) {
  // ...
  const value = target[prop]
  return (typeof value === 'function') ? value.bind(target) : value
}
```
为什么我们需要做一个函数作用域绑定 `value.bind(target)`，原因是，虽然我们不能从外部直接访问对象内部私用属性，但是对象自带的方法却不应该受限制。例如假设，`user` 对象有个 `checkPassword` 方法：
```js
let user = {
  // ...
  checkPassword(password) {
    return password === this._checkPassword
  }
}

user = new Proxy(/* ... */)
```
如果不进行（1）中的作用域绑定，`user` 经行代理之后，访问 `user.checkPassword` 时，`checkPassword` 方法内部的 `this` 指向的是代理之后的对象（`.`之前的对象），这时访问 `this._password` 将会被 `get` 钩子拦截，并抛出错误。这不是我们想要的结果，我们希望对象方法能够正常访问 `_password`，所以需要在 `get` 钩子中做一下判断，如果访问的属性是一个方法（function）, 则将它的 `this` 绑定到目标对象上，这样它就可以绕过代理的拦截。

该解决方案通常可行，但并不理想，如果我们将未代理的原目标对象传给了方法，那对象方法可能会将它传递到其它地方，这样就会引起混乱：哪个是原始对象，哪个是目标对象。而且，一个对象可能会被代理多次（多个代理可能会对该对象添加不同的“调整”），产生意想不到的后果。

因此，在任何地方都不应使用这种代理。现代 Javascript 引擎原生支持[类私有属性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)，以 `#` 作为前缀, 所以 `Proxy` 并不是必需的。

### 使用 `has` 钩子拦截属性检查
用 `has` 钩子拦截 `in` 操作符，对应的钩子为 `has(target, property)`：
- `target` —— 是目标对象，作为第一个参数传递给 `new Proxy`
- `property` —— 属性名称

假设有一个 `range` 对象, 我们想使用 `in` 操作符来检查数字是否在 `range` 范围内：
```js
const range = {
  start: 1,
  end: 10
}
range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end
  }
})

console.log(5 in range) // true
console.log(50 in range) // false
```
漂亮的语法糖，不是吗？而且实现起来非常简单！

### 使用 `apply` 钩子代理函数调用

`apply(target, thisArg, args)` 钩子能使代理以函数的方式被调用：
- `target` —— 目标函数
- `thisArg` ——  `this` 的值
- `args` —— 参数列表

用 `Proxy` 实现延时装饰者：
```js
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms)
    }
  })
}

function sayHi(user) {
  console.log(`Hello, ${user}!`)
}

sayHi = delay(sayHi, 3000)

console.log(sayHi.length) //1 代理上的所有操作都转发到原始函数

sayHi("John") // Hello, John! （3秒后）
```


## Reflect

`Reflect` 是一个内置对象，可简化的创建 `Proxy`

以前的内部方法，比如 `[[Get]]`，`[[Set]]` 等等都只是规范，不能直接调用。`Reflect` 对象使调用这些内部方法成为可能，它的方法是内部方法的最小包装：

|操作|Reflect 调用|内部方法|
|:---:|:---:|:---:|
|obj[prop]|Reflect.get(obj, prop)|[[Get]]|
|obj[prop] = value|Reflect.set(obj, prop, value)|[[Set]]|
|delete obj[prop]|Reflect.deleteProperty(obj, prop)|[[Delete]]|
|new F(value)|Reflect.construct(F, value)|[[Construct]]|
|...|...|...|

这是 Reflect 执行相同操作和调用的示例：
```js
const user = {}

Reflect.set(user, 'name', 'John')

console.log(user.name) // John
```

对于每个可被 `Proxy` 捕获的内部方法，`Reflect` 都有一个对应的方法进行反射（reflect），其名称和参数与 `Proxy` 钩子相同。因此，我们可以用 `Reflect` 来将操作转发到原始对象。

在下面的例子中，钩子 `get` 和 `set` 透明地将读/写操作转发到对象，并显示一条消息：
```js
let user = {
  name: 'John'
}

user = new Proxy(user, {
  get(target, prop, receiver) {
    alert(`GET ${prop}`)
    return Reflect.get(target, prop, receiver) // (1)
  },
  set(target, prop, val, receiver) {
    alert(`SET ${prop}=${val}`)
    return Reflect.set(target, prop, val, receiver) // (2)
  }
})

let name = user.name // shows "GET name"
user.name = "Pete" // shows "SET name=Pete"
```
这里：
- `Reflect.get` 读取一个对象属性
- `Reflect.set` 写入对象属性，成功返回 `true` ，否则返回 `false`

就是说，一切都很简单：如果钩子想要将调用转发给原始对象，则只需使用相同的参数调用 `Reflect.<method>` 就足够了。

在大多数情况下，我们不使用 `Reflect` 也可以完成相同的事情，例如，使用 `Reflect.get(target, prop, receiver)` 读取属性可以替换为 `target[prop]`，尽管有一些细微的差别。

### 代理一个 getter

让我们看一个示例，说明为什么 `Reflect.get` 更好。我们还将看到为什么 `get/set` 有第四个参数 `receiver`，而我们以前没有使用过它。

我们有一个带有一个 `_name` 属性和一个 `getter` 的对象 `user` 对象：
```js
const user = {
  _name: 'Guest',
  get name() {
    return this._name
  }
}

const userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]
  }
})

console.log(userProxy.name) // Guest
```
这个 `get` 钩子在这里是透明的，它返回原来的属性，不会做别的任何事情，对于我们的示例而言，这就足够了。

但是让我们将示例变得更加复杂：
```js
const user = {
  _name: 'Guest',
  get name() {
    return this._name
  }
}

const userProxy = new Proxy(user, {
  get(target, prop) {
    return target[prop] // (1) target = user
  }
})

let admin = {
  __proto__: userProxy,
  _name: 'Admin'
}

// Expected: Admin
alert(admin.name) // 输出：Guest （？！？）
```

另一个对象 `admin` 从 `user` 继承后，我们可以观察到错误的行为，读取 `admin.name` 应该返回 `'Admin'`，而不是 `'Guest'`。

问题出现在（1）中：
1. 当我们读取 `admin.name`，由于 `admin` 对象自身没有对应的的属性，搜索将转到其原型上。
2. 原型是 `userProxy`
3. 从代理读取 `name` 属性时，`get` 钩子会触发并从原始对象返回 `target[prop]`
4. 当调用 `target[prop]` 时，若 `prop` 是一个 getter，它将在 this=target 上下文中运行其代码。因此，结果是来自原始对象 `target` （即 `user`）的 `this._name`

为了解决这种问题，我们需要用到 `get` 钩子的第三个参数 `receiver`。它保证传递正确的 `this` 给 `getter`。那如何为 `getter` 传递上下文呢？对于常规函数，我们可以使用 `call/apply`，但这是一个 `getter`，它不能被调用的，只能被访问。

`Reflect.get` 可以做到，如果我们使用它，一切都会正常运行：
```js
const user = {
  _name: 'Guest',
  get name() {
    return this._name
  }
}

const userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver) // (1) target = admin
  }
})

let admin = {
  __proto__: userProxy,
  _name: 'Admin'
}

// Expected: Admin
alert(admin.name) // 输出：Admin （？！？）
```
现在 `receiver` 保留了对正确 `this` 的引用，该引用将在 (1) 行中使用 `Reflect.get` 传递给 `getter`。

`Reflect` 调用的命名方式与 `Proxy` 钩子完全相同，并且接受相同的参数。因此我们可以将钩子重写得更短：
```js
get(target, prop, receiver) {
  return Reflect.get(...arguments)
}
```
`Reflect` 提供了一种安全的方式来转发操作，确保我们不会忘记与此相关的任何内容。

## Proxy 的局限

代理提供了一种独特的方法，可以在最底层更改或调整现有对象的行为。但是，它并不完。
### 内部插槽（Internal slots）
许多内置对象，例如 `Map`, `Set`, `Date`, `Promise` 等等都使用了所谓的 “内部插槽”。它们类似于属性，但仅限于内部使用，仅用于规范目的。例如， `Map` 将项目存储在 `[[MapData]]` 中。内置方法直接访问它们，而不通过 `[[Get]]/[[Set]]` 内部方法。

这就是问题。在像这样的内置对象被代理后，代理对象没有这些内部插槽，因此内置方法将失败。

```js
const map = new Map()

const proxy = new Proxy(map, {})

proxy.set('test', 1) // Error
```
在内部，一个 `Map` 将所有数据存储在其 `[[MapData]]` 内部插槽中。代理对象没有这样的插槽。内建方法 `Map.prototype.set` 方法试图访问内部属性 `this.[[MapData]]`，但由于 this=proxy 在，而 `proxy` 中不能找到它，只能失败。

幸运的是，有一种解决方法：
```js
const map = new Map()

const proxy = new Proxy(map, {
  get(target, prop, receiver) {
    const value = Reflect.get(...arguments)
    return typeof value == 'function' ? value.bind(target) : value
  }
})

proxy.set('test', 1)
console.log(proxy.get('test')) // 1 (works!)
```
现在它可以正常工作，因为 `get` 钩子将函数属性（例如 `map.set`）绑定到目标对象（`map`）本身，因此，当 `set` 钩子的内部实现尝试访问 `this.[[MapData]]` 内部插槽时，它会成功。

### 私有字段
类的私有字段也会发生类似的情况。

例如，`getName()` 方法访问私有的 `#name` 属性会在代理后中断：
```js
class User {
  #name = "Guest"

  getName() {
    return this.#name
  }
}

let user = new User()

user = new Proxy(user, {})

console.log(user.getName()) // Error
```

原因是专用字段是使用内部插槽实现的。JavaScript 访问它们时不使用 `[[Get]]/[[Set]]`。在调用 `getName()` 时 `this` 的值是代理后的 `user`，它没有带私有字段的插槽。

再次，使用 `bind` 方法的可以使它恢复正常：
```js
class User {
  #name = "Guest"

  getName() {
    return this.#name
  }
}

let user = new User()

user = new Proxy(user, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments)
    return typeof value == 'function' ? value.bind(target) : value
  }
})

console.log(user.getName()) // Guest
```
该解决方案也有缺点：将原始对象暴露给方法，可能使其进一步传递并破坏其他代理功能。

## 可取消的 Proxy
假设我们有一个资源，并且想随时关闭对该资源的访问 我们可以做的是将其包装成可撤销的代理，而没有任何钩子。这样的代理会将操作转发给对象，我们可以随时将其禁用。语法：
```js
const { proxy, revoke } = Proxy.revocable(target, handler)
```
一个例子：
```js
const object = {
  data: "Valuable data"
}

const { proxy, revoke } = Proxy.revocable(object, {})

// proxy 正常工作
console.log(proxy.data) // Valuable data

revoke()

// proxy 不再工作（已销毁）
console.log(proxy.data) // Error
```
调用 `revoke()` 会从代理中删除对目标对象的所有内部引用，因此不再连接它们。之后可以对目标对象进行垃圾回收。

我们还可以将 `revoke` 存储在 `WeakMap` 中，以便能够通过代理对象轻松找到它：
```js
const revokes = new WeakMap()

const object = {
  data: "Valuable data"
}

const { proxy, revoke } = Proxy.revocable(object, {})

revokes.set(proxy, revoke)

// 之后...
revoke = revokes.get(proxy)
revoke()

console.log(proxy.data) // Error
```
这种方法的好处是我们不必随身携带 `revoke`。我们可以在需要时从 map 上获取它

这里使用 `WeakMap` 而不是 `Map` ，是因为 `WeakMap` 不会阻止垃圾回收。如果代理对象变得“无法访问”（例如，没有变量再引用它），则 `WeakMap` 允许将其与它的 `revoke` 对象一起从内存中删除，因为我们不再需要它了。

## 几个用例
### 数组负索引
像这样：
```js
const array = [1, 2, 3]

array[-1] // 3
array[-2] // 2
array[-3] // 1
```
换句话说，`array[-n]` 与 `array[array.length - n]` 相同。

用 Proxy 实现起来很简单：

```js
let array = [1, 2, 3]

array = new Proxy(array, {
  get(target, prop, receiver) {
    if (prop < 0) {
      // prop 是 string, 需要先将它转换成 number
      prop = +prop + target.length
    }
    return Reflect.get(target, prop, receiver)
  }
})

array[-1] // 3
array[-2] // 2
array[-3] // 1
```
### Observable
实现一个使对象可观察的函数 `makeObservable(target)`：
```js
const handlers = Symbol('handlers')

function makeObservable(target) {
  //  初始化 handler 存储数组
  target[handlers] = []

  // 存储 handler 函数到数组中以便于未来调用
  target.observe = function(handler) {
    this[handlers].push(handler)
  }

  // 创建代理
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(...arguments) // 转发写入操作到目标对象
      if (success) { // 如果设置属性的时候没有报错
        // 调用所有 handler
        target[handlers].forEach(handler => handler(property, value))
      }
      return success
    }
  })
}

let user = {}

user = makeObservable(user)

user.observe((key, value) => {
  console.log(`SET ${key}=${value}`)
})

user.name = "John" // SET name=John
```
