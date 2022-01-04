# Blob 是什么？
<PubDate date="2021/11/22"/>

前面讲到了 `ArrayBuffer` 和 `TypedArray` 等概念，它们属于 ECMA 标准，是 JavaScript 的一部分。

而在浏览器中，也有一个用于描述二进制数据的对象，即 `Blob` (Binary large object)。它是一个不可变的包含原始数据的类文件对象。`Blob` 的主要作用是方便在浏览器中进行文件操作，例如上传，下载，图片展示等等。

`Blob` 主要包含两个部分，一个可选的字符串类型的 `type`（通常是 MIME-type）和一个包含 `ArrayBuffer` / [ArrayBufferView](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) / `Blob` / `String` 的 `blobParts`：

<img src="../assets/blob.svg" class="mx-auto mt-20px mb-30px">

创建一个 `Blob` 的语法如下：

```js
new Blob(blobParts, [options])
```

- `blobParts`：一个数组，里面可以是 `ArrayBuffer`, ArrayBufferView, `Blob`, `String`，或它们的任意组合。
- `options`：可选的对象
  - `type`： `Blob` 中存储的数据的 MIME-type，默认值为空字符串。
  - `endings`：是否转换行尾以使 `Blob` 对应于当前操作系统的换行(`\r\n` 或 `\n`)。默认情况下是 `'transparent'` (不做任何操作)，但也可以是 `'native'` (转换)。

例如，从 string 创建 `Blob`：
```js
const blob = new Blob(['<html>...</html>'], { type: 'text/html' })
```
从 typed array 和 string 创建 `Blob`：
```js
const hello = new Uint8Array([72, 101, 108, 108, 111]) // 'Hello' 的二进制形式
const blob = new Blob([hello, ' ', 'world'], { type: 'text/plain' })
```

有一点需要注意，我们无法直接更改 `Blob` 内的数据，但可以从 `Blob` 中提取片段生成新的 `Blob`：

```js
blob.slice([byteStart], [byteEnd], [contentType])
```

- `byteStart`：起始字节位置，默认为 0
- `byteEnd`：结束字节位置 (不包含)，默认到 blob 末尾
- `contentType`：新的 blob 的类型, 默认与原 blob 相同

`blob.slice` 的用法与 `array.slice` 类似，同样支持负位置索引。

## Blob 转 URL
前面说到 `Blob` 为文件而生，所以可以很容易的将 `Blob` 使用于 `<a>`, `<img>` 或其它接受 url 的标签，用于展示其内容。

这正是因为 `Blob` 包含了一个 `type`，用于指定所存储的数据类型 (MIME-type)，有了这个类型，我们就可以正确的下载/上传 `Blob` 对象，也可以通过网络请求发送 `Blob`，这时 `type` 会自动成为 `Content-Type`。

看下面这个例子，用户可以通过点击链接来下载一个包含 `'Hello, world'` 的文本文件：
```html
<a download="hello.txt" id="link">Download</a>

<script>
const blob = new Blob(['Hello, world'], { type: 'text/plain' })
const link = document.querySelector('#link')
link.href = URL.createObjectURL(blob)
</script>
```
也可以通过 JavaScript 动态生成 link，然后通过 `link.click()` 模拟点击行为，这样无需任何 HTML，可以实现自动下载：
```js
const link = document.createElement('a')

link.download = 'hello.txt'

const blob = new Blob(['Hello, world'], { type: 'text/plain' })

link.href = URL.createObjectURL(blob)

link.click()

URL.revokeObjectURL(link.href)
```
这里用到了 `URL.createObjectURL` 和 `URL.revokeObjectURL` 两个浏览器内置方法。

`URL.createObjectURL` 接收一个 `Blob` 对象，并为它生成一个唯一的 URL (`blob:<origin>/<uuid>`)。

对每个 `URL.createObjectURL` 生成的 URL，浏览器会在内部存储一个 URL -> Blob 的映射。这样可以通过很简短的 URL 就能访问到 `Blob`。而且该 URL 只在当前打开的文档中有效，即作用域为当前 session。

但同时这也有一个副作用。由于存在 URL -> Blob 映射， `Blob` 本身会驻留在内存中。除非页面被卸载，否则浏览器无法自动释放它。这可能不是我们想要的。

通过调用 `URL.revokeObjectURL(url)` 可以从内部映射中删除对 `Blob` 的引用，如果 `Blob` 没有其它引用，它将会被清除，并释放内存。

在上面自动下载的例子中，因为只需要下载一次，所以后面立刻调用了 `URL.revokeObjectURL` 来释放内存。但在手动点击链接进行下载的例子中，我们希望可以多次下载，所以没有调用 `URL.revokeObjectURL`，如果这样做，链接上的 `Blob` url 将会失效，因为它们之间的映射关系已经被移除了。

## Blob 转 Base64
除了可以通过 `URL.createObjectURL` 生成 `Blob` url 外，还可以将 `Blob` 转换成 base64 编码的字符串。

这种编码方式将二进制数据表示为一串安全的“可读”字符。更重要的是，我们可以在 [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 中使用这种编码。

一个 Data URL 具有这样的形式：`data:[<mediatype>][;base64],<data>`。我们可以在任何地方使用这样的 url，就像常规 url 一样。例如

```html
<img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">
```
浏览器会解码这个字符串并展示这张图片<img class="inline-block ml-1" src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">。

要将 `Blob` 转换成 base64，可以使用浏览器内置的 [`FileReader` API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)，它能以多种不同的格式从 `Blob` 种读取数据。

下面是使用 base64 的形式下载 `Blob` 的例子：

```js
const link = document.createElement('a')

link.download = 'hello.txt'

const blob = new Blob(['Hello, world!'], { type: 'text/plain' })

const reader = new FileReader()

reader.readAsDataURL(blob) // 以 base64 的格式从 blob 中读取数据

reader.onload = function() {
  link.href = reader.result // data url
  link.click()
}
```
这两种创建 `Blob` URL 的方法都是可行的。但通常 `URL.createObjectURL(blob)` 更简单而且速度更快。两者对比如下：

| URL.createObjectURL(blob)  | Blob to data url |
| --- |--- |
| 如果对内存泄露比较在意，需要手动 revoke 进行清理 | 无内存泄漏问题，无需手动清理 |
| 直接访问 `Blob`，没有 encoding / decoding 过程| 需要进行 base64 编码，当 `Blob` 很大时，会有性能问题，而且会占用更大的内存空间 |

## 为 image 生成 Blob

也可以为图片生成 `Blob`，然后进行上传和下载等等。

对图片的操作可以借助 [`canvas`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) 元素实现
  - 使用 [`canvas.drawImage`](https://developer.mozilla.org/en-US/docs/Web/api/CanvasRenderingContext2D/drawImage) 将图片画在 canvas 画布上。
  - 调用 [`.toBlob(callback, type, quality)`](https://developer.mozilla.org/en-US/docs/Web/api/HTMLCanvasElement/toBlob) 获取 `Blob`，等待完成后会执行 `callback` 回调。

```js
// 获取图片元素
const img = document.querySelector('img')

// 创建一个相同尺寸的画布
const canvas = document.createElement('canvas')
canvas.width = img.clientWidth
canvas.height = img.clientHeight

const context = canvas.getContext('2d')

// 复制图片到画布 (还可能通过这个方法对图片进行裁剪)
context.drawImage(img, 0, 0)

// toBlob 是异步操作, callback 会在完成后执行
canvas.toBlob(function(blob) {
  // 拿到 blob，进行下载
  const link = document.createElement('a')
  link.download = 'example.png'

  link.href = URL.createObjectURL(blob)
  link.click()

  // 删除内部 blob 引用, 让浏览器释放内存
  URL.revokeObjectURL(link.href)
}, 'image/png')
```

## Blob 转 ArrayBuffer
我们可以使用 `Blob()` 构造函数从几乎任何东西创建一个 blob，包括 `ArrayBuffer` 和所有 `ArrayBufferView`。

但如果我们要行进 low-level 的操作，可以使用 `FileReader` 获取 `Blob` 最底层的 `ArrayBuffer`：

```js
// 从 Blob 获取 ArrayBuffer
const fileReader = new FileReader()

fileReader.readAsArrayBuffer(blob)

fileReader.onload = function(event) {
  const arrayBuffer = fileReader.result
}
```

## 总结

- `ArrayBuffer`, `Uint8Array ` 等等其它 `ArrayBufferView` 都属于二进制数据，而 `Blob` 代表的是有类型 (type) 的二进制数据。
- 因为 `Blob` 具有类型，这使得它可以方便地进行上传/下载操作，这些操作在浏览器中非常常见。
- `XMLHttpRequest`, `fetch` web请求原生地支持 Blob 类型。
- `Blob` 和 low-level 的二进制数据类型可以进行相互转换。