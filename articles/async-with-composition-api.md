# Async with Composition API

`setup` 是 Vue 3 新增的一个组件选项 (component option)，它作为 Composition API 的入口函数，极大地优化了 Vue 代码的组织方式，让代码逻辑复用变得异常容易。而异步的 `setup` (async setup) 可以让你在组件创建之前就进行异步操作，比如从服务器获取资源和数据，但是有一些坑需要引起注意。

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

甚至下面的这些方法将不会工作：
- `onMounted` / `onUnmounted` / `onXXX`
- `provide` / `inject`
- `getCurrentInstance`
- ...

## 背后机制
让我们以 `onMounted` API为例。正如我们所知，`onMounted` 是一个钩子函数（hook），在当前组件被挂载（mounted）时，执行注册的 listener。请注意，`onMounted`（以及其它的组合API）是全局的，这里所说的"全局" 是指它可以被导入并在任何地方被调用——没有本地的上下文与它绑定。
```js
// local: `onMounted` 是组件实例的方法，绑定到组件上下文
component.onMounted(/* ... */)

// global: `onMounted` 没有绑定上下文
onMounted(/* ... */)
```

那么，`onMounted` 是如何知道什么组件被挂载的呢？ Vue 采取了一个有趣的方法来解决这个问题。它使用一个内部变量来记录当前组件的实例。当 Vue 挂载一个组件时，它将该实例存储在一个全局变量中。当钩子在 setup 函数中被调用时，它将使用全局变量来获取当前组件的实例。下面是简化的代码：
```js
let currentInstance = null

// (pseudo code)
export function mountComponent(component) {
  const instance = createComponent(component)

  // hold the previous instance
  const prev = currentInstance

  // set the instance to global
  currentInstance = instance

  // hooks called inside the `setup()` will have
  // the `currentInstance` as the context
  component.setup()

  // restore the previous instance
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

  // bound listener to the current instance
  currentInstance.onMounted(fn)
}
```
这样，只要在组件的 setup 里面调用 `onMounted`，就能拿到当前组件的实例。


### 异步 setup 的局限
到目前为止还不错，这是基于 JavaScript 是单线程的这一事实。单线程的原子性确保以下语句会紧挨着执行，换句话说，你不可能在同一时间意外地修改 currentInstance
```js
currentInstance = instance
component.setup()
currentInstance = prev
```

但当 setup 函数是异步的时候，情况就变了。每当 await 一个 promise 时，你可以认为引擎暂停了这里的工作，去做另一个任务。而在这个等待的时间段内，原子性会丢失，其它组件的创建将不可预测地会改变全局变量，最终导致混乱:


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