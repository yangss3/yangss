# 异步 setup

`setup` 是 Vue 3 新增的一个组件选项，它作为 Composition API 的入口函数，极大地优化了 Vue 代码的组织方式，让代码逻辑复用变得非常简单和直观。而异步的 `setup` (async setup) 可以让你在组件创建之前进行异步操作，比如从服务器获取资源和数据，但是有一些注意事项，详情请看这里的[讨论](https://github.com/vuejs/rfcs/discussions/234)。

## 一个例子
先看一个例子：
```js
import { ref, watch, onMounted, onUnmounted } from 'vue'

export default {
  async setup() {
    const counter = ref(0)

    watch(counter, () => console.log(counter.value))

    // OK!
    onMounted(() => console.log('Mounted'))

    // the await statement
    await someAsyncFunction() // <-----------

    // does NOT work!
    onUnmounted(() => console.log('Unmounted'))

    // still works, but does not auto-dispose
    // after the component is destroyed (memory leak!)
    watch(counter, () => console.log(counter.value * 2))
  }
}
```
在 **await** statement 之后执行以下 composition API，很有可能会出现问题， 因为它们不会自动 dispose:
- `watch` / `watchEffect`
- `computed`
- `effect`

而下面的这些方法将不会正常工作：
- `onMounted` / `onUnmounted` / `onXXX`
- `provide` / `inject`
- `getCurrentInstance`
- ...

## 背后机制
以 `onMounted` 为例。如我们所知，`onMounted` 是一个钩子函数（hook），在当前组件被挂载（mounted）时，执行注册的 listener 函数。请注意，`onMounted`（以及其它的组合API）是全局的，这里所说的"全局"是指它可以被导入并在任何地方被调用——没有本地的上下文与它绑定。
```js
// local: `onMounted` 是组件实例的方法，绑定到组件上下文
component.onMounted(/* ... */)

// global: `onMounted` 没有绑定上下文
onMounted(/* ... */)
```

那么，`onMounted` 是如何知道什么组件被挂载的呢？ Vue 使用一个内部变量来记录当前组件的实例。当 Vue 挂载一个组件时，它将该组件实例存储在一个全局变量中。当钩子在 setup 函数中被调用时，它将使用全局变量来获取当前组件的实例。下面是简化的代码：
```js
let currentInstance = null

// (pseudo code)
export function mountComponent(component) {
  const instance = createComponent(component)

  // 先保存先前的实例
  const prev = currentInstance

  // 将当前组件实例存入全局变量
  currentInstance = instance

  // setup 内部的 hooks 函数被调用时将以 `currentInstance` 作为上下文
  component.setup()

  // 恢复先前的实例
  currentInstance = prev
}
```
一个简化的 `onMounted` 实现可以是这样：
```js
// (pseudo code)
export function onMounted(fn) {
  if (!currentInstance) {
    warn(`"onMounted" can't be called outside of component setup()`)
    return
  }

  // 将 listener 绑定到当前组件实例
  currentInstance.onMounted(fn)
}
```
这样，只要在组件的 setup 里面调用 `onMounted`，就能拿到当前组件的实例。


## 异步 setup 的局限
到目前为止一切都正常，这是基于 JavaScript 是单线程的这一事实。单线程的原子性确保以下语句会紧挨着执行，换句话说，你不可能在同一时间意外地修改 currentInstance：
```js
currentInstance = instance
component.setup()
currentInstance = prev
```
但当 setup 函数是异步的时候，情况就变了。每当 await 一个 promise 时，你可以认为 JS 引擎暂停了这里的工作，去做另一个任务。而在这个等待的时间段内，原子性会丢失，其它组件的创建将不可预测地会改变全局变量，最终导致混乱:


```js
async function setup() {
  console.log(1)
  await someAsyncFunction()
  console.log(2)
}

console.log(3)
setup()
console.log(4)

// 输出
// 3
// 1
// 4
// (awaiting)
// 2
```
异步的 setup 函数不会阻塞后面的任务, 但 setup 内的第一个 await statement 之后的代码，将在异步任务完成之后才会被执行， 这时 setup 函数已经 return，这意味着第一个 await statement 之后的代码将拿不到当前组件实例。

## 解决方案
### 记住并避免它
当然，这是一个显而易见的解决方案。将所有的 effect 和 hooks 移到第一个 await statement 之前，并且记住在那之后不要再使用它们。

幸运的是，如果你使用 ESLint，你可以启用 eslint-plugin-vue 中的 `vue/no-watch-after-await` 和 `vue/no-lifecycle-after-await` 规则，以便在出现错误时发出警告（默认情况下，插件预设中会启用这些规则）。

### 显式绑定组件实例
生命周期钩子（lifecycle hooks）实际上接受第二个参数来显式的绑定实例：
```js
export default ({
  async setup() {
    // 在 await 之前先获取组件实例
    const instance = getCurrentInstance()

    await someAsyncFunction()

    onUnmounted(
      () => console.log('Unmounted'),
      instance // <--- 手动给钩子函数绑定实例
    )
  }
})
```

但是，缺点是此解决方案不适用于 `watch/watchEffect/computed/provide/inject`，因为它们不接受实例参数。
要使这些正常工作，可以使用 Vue 3.2 中新引入的 [effectScope API](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)：
```js
import { effectScope } from 'vue'

export default ({
  async setup() {
    // 在 await之前创建一个 scope, 它会将组件实例绑定到这个作用域内
    const scope = effectScope()

    const data = await someAsyncFunction() // <-----------

    scope.run(() => {
      /* Use `computed`, `watch`, etc. ... */
    })
  }
})
```
### `<script setup>` 编译时处理
在最近的 `<script setup>` 语法[提案](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#top-level-await)中（Vue 3.2 可用），针对也这一问题进行了编译时的处理：
```
<script setup>
  const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```
await 语句将自动编译为在 await 语句之后保留当前组件实例上下文的格式：
```js
import { withAsyncContext } from 'vue'

export default {
  async setup() {
    let __temp, __restore

    const post =
      (([__temp, __restore] = withAsyncContext(() =>
        fetch(`/api/post/1`).then((r) => r.json())
      )),
      (__temp = await __temp),
      __restore(),
      __temp)

    // current instance context preserved
    // e.g. onMounted() will still work.

    return { post }
  }
}

```
有了它，异步函数就可以在与`<script setup>`一起使用时正常工作。唯一的遗憾是它在`<script setup>`之外无法工作。