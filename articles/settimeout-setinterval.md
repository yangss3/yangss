# setTimeout 和 setInterval
<PubDate date="2020/09/20"/>

这里不介绍这两个函数的具体用法，主要说说周期性调度的问题。

周期性调度一般有两种方式，一种是使用 `setInterval`：
```js
let i = 1
setInterval(function() {
  func(i++)
}, 100)
```
另外一种是嵌套的 `setTimeout`：
```js
let i = 1
setTimeout(function run() {
  func(i++)
  setTimeout(run, 100)
}, 100)

```

`setInterval` 虽然很直观，内部的调度程序每间隔 100 毫秒执行一次 `func(i++)`，但是嵌套的 `setTimeout` 却有很多 `setInterval` 不具备的优点。


**嵌套的 `setTimeout` 能够精确地设置两次执行之间的延时**

你会发现使用 `setInterval` 时，`func` 函数的实际调用间隔要比代码中设定的时间间隔要短，因为 `func` 自身执行所花费的时间消耗了一部分间隔时间。也可能出现这种情况，就是 `func` 的执行所花费的时间比我们预期的时间更长，并且超出了 100 毫秒。在这种情况下，JavaScript 引擎会等待 `func` 执行完成，然后检查调度程序，如果时间到了，则立即执行它。极端情况下，如果函数每次执行时间都超过了设置的延迟时间，那么每次调用之间将完全没有停顿。
但是嵌套的 `setTimeout` 没有有这样的问题，嵌套的 `setTimeout` 能确保延时的固定，这是因为下一次调用是在前一次调用完成时再调度的。

**嵌套的 `setTimeout` 比 `setInterval` 要灵活得多**

用嵌套的 `setTimeout` 可以根据当前执行结果来调度下一次调用，因此下一次调用可以与当前这一次不同。

例如，我们要实现一个服务，每间隔 5 秒向服务器发送一个数据请求，但如果服务器过载了，那么就要降低请求频率，比如将间隔增加到 10、20、40 秒等，以下是伪代码
```js
let delay = 5000;

let timerId = setTimeout(function request() {

  发送请求 ...

  if (request failed due to server overload) {
    // 下一次执行的间隔是当前的 2 倍
    delay *= 2
  }

  timerId = setTimeout(request, delay)

}, delay)
```
并且，如果我们调度的函数占用大量的 CPU，那么我们可以测量执行所需要花费的时间，并安排下次调用是应该提前还是推迟。

**可以用 `setTimeout(func, 0)` 分割 CPU 高占用的任务**

当某项任务执行所消耗时间很长时，有时候会导致浏览器挂起，这种情况是显然不能接受的。

为了方便理解，来考虑一个稍微简单点的例子。比如我们有个函数，从 1 数到 1000000000
```js
let i = 0

let start = Date.now()

function count() {

  // 执行一个耗时的任务
  for (let j = 0; j < 1e9; j++) {
    i++
  }

  alert("Done in " + (Date.now() - start) + 'ms')
}

count()
```

运行时，会观察到 CPU 挂起，服务器端 JS 表现的尤为明显。如果在浏览器下运行，试试点击页面的其他按钮，你会发现整个 JavaScript 的执行都暂停了，除非等这段代码运行完，否则什么也做不了。

下面用 `setTimeout` 分割任务：
```js
let i = 0

const start = Date.now()

function count() {

  // 先完成一部分任务(*)
  while (i % 1e6 !== 0) {
    i++
  }

  if (i == 1e9) {
    alert("Done in " + (Date.now() - start) + 'ms')
  } else {
    setTimeout(count, 0) // 安排下一次任务
  }
}

count()
```
现在，浏览器的 UI 界面即使在计数正在进行的情况下也能正常工作了，`count` 函数调用的间隙能够让 JavaScript 引擎缓一口气，浏览器趁这段时间可以对用户的操作作出回应。
而且用 `setTimeout` 进行分割和不分割这两种做法在执行速度方面几乎没什么差别。