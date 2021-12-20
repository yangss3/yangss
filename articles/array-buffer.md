# 深入理解 ArrayBuffer 和 TypedArray
<PubDate date="2021/12/21"/>

在 Web 开发中，我们经常有处理文件的需求，例如图片处理，文件上传/下载等等，这时我们可能需要和二进制数据(binary data)打交道，但这往往会让人头疼，因为 JavaScript 中有很多和二进制相关的内置对象，例如：`ArrayBuffer`, `Uint8Array`, `DataView` 等等。它们分别代表什么？有什么区别？该怎么使用它们？下面就来缕一缕。

## ArrayBuffer
JavaScript 中最基本的二进制对象就是 `ArrayBuffer`，它代表的是对一个**固定长度的连续内存空间的引用**，比如我们创建一个 buffer 如下：
```js
const buffer = new ArrayBuffer(16)
console.log(buffer.byteLength) // 16
```
上面的代码会分配一个16字节长度的连续内存空间，在其中填充0作为初始值，并将引用赋值给 `buffer` 变量。

这里首先要消除的一点迷惑是：虽然 `ArrayBuffer` 名字里含有 'Array' 的字样，但 **`ArrayBuffer` 并不是数组**，它和数组没有任何关系：
- 它有固定的长度，而且一旦生成(完成分配)，就无法再更改它的长度。
- 根据提供初始化参数，它占据准确的内存空间。
- 无法通过索引的方式 `buffer[index]` 访问单个字节，需要通过视图对象(view object)来访问。

它代表的是一块内存区域，除了知道里面存储的是一段原始的字节序列，此外别无所知。

上面说到，要想对 `ArrayBuffer` 进行操作，需要用到一个视图对象(view object)。视图对象本身不存储任何值，它的作用是对 `ArrayBuffer` 加一层代理接口，透过它可以对 `ArrayBuffer` 中存储的二进制数据进行描述，例如：
- `Uint8Array`: 将 `ArrayBuffer` 中的每个字节看作一个8位无符号整数(0-255)
- `Uint16Array`: 将 `ArrayBuffer` 中的每两个字节看作一个16位无符号整数(0-65535)
- `Uint32Array`: 将 `ArrayBuffer` 中的每4个字节看作一个32位无符号整数(0-4294967295)
- `Float64Array`: 将 `ArrayBuffer` 中的每8个字节看作一个浮点数(5.0 x 10^-324 - 1.8 x 10^308)

所以一个 16字节大小的 `ArrayBuffer` 可以被解释为 *16个8位无符号整数(0-255)*, *8个16位无符号整数(0-65535)*, *4个32位无符号整数(0-4294967295)*或*两个浮点数*。

视图对象除了对 `ArrayBuffer` 进行描述外，还能通过它操作 `ArrayBuffer` 内的数据：
```js
// 创建16字节长度的buffer
const buffer = new ArrayBuffer(16)
// 将 buffer 看作是32位整数的序列
const view = new Uint32Array(buffer)

console.log(Uint32Array.BYTES_PER_ELEMENT) // 每个整数占4个字节
console.log(view.length) // 4
console.log(view.byteLength) // 16

// 写入值
view[0] = 123456

// 迭代值
for (const num of view) {
  console.log(num)  // 123456, 0, 0, 0
}
```
## TypedArray
首先请注意，并没有名为 `TypedArray` 的构造函数，它只是上面那些视图对象(`Uint8Array`, `Uint16Array` 等)的通用术语，表示的是 `ArrayBuffer` 上的一个视图。
所有的 `TypedArray` 共享同一套方法和属性，而且它们的行为类似于常规数组，具有索引，可迭代，可读写。

一个 typed array 的构造函数可以接受5种不同形式的参数：
```js
new TypedArray(buffer, [byteOffset], [length]) // (1)
new TypedArray(arrayLike) // (2)
new TypedArray(typedArray) // (3)
new TypedArray(length) // (4)
new TypedArray(); // (5)
```
1. 如果提供 `ArrayBuffer` 作为第一个参数，则在它上面生成一个 view，前面的例子中已经使用过这种语法。除此之外还可以接受起始位置和长度作为可选参数，这样将为指定的 buffer 区间生成 view。
2. 如果提供一个数组或类数组对象，则会生成一个相同长度的 typed array，同时复制数组的内容：
    ```js
    const arr = new Uint8Array([0, 1, 2, 3])
    console.log(arr.length) // 4
    console.log(arr[1]) // 1
    ```
3. 如果提供另一个 `TypedArray` 作为参数，也会生成一个相同长度的 typed array，同时复制数组的内容，而且如果需要，值的类型可以转换为新的类型：
    ```js
    const arr16 = new Uint16Array([1, 1000])
    const arr8 = new Uint8Array(arr16)
    console.log(arr8[0]) // 1
    console.log(arr8[1]) // 232, 由于 1000 超出一个字节(8 bits)长度，会发生截断
    ```
4. 如果提供一个长度作为参数，则生成指定长度的 typed array：
    ```js
    const arr = new Uint16Array(4) // 生成包含4个元素的 typed array
    console.log(Uint16Array.BYTES_PER_ELEMENT) // 2
    console.log(arr.byteLength) // 8
    ```
5. 不传任何参数，则生成0长度的 typed array。

注意，虽然上面除了 (1) ，其它似乎都没有依托 `ArrayBuffer`， 而是直接生成了 typed array。但实际上 view 是不能独立于 `ArrayBuffer` 存在的，每个 typed array 必须要有关联的 `ArrayBuffer`，所以除了 (1) 的情况，其它调用形式都会自动创建一个 `ArrayBuffer`。

要访问底层的 `ArrayBuffer`，可以使用 `TypedArray` 以下属性：
- `buffer`：`ArrayBuffer` 的引用
- `byteLength`：`ArrayBuffer` 的字节长度

例如可以从一种视图转换为另一种视图：
```js
const arr8 = new Uint8Array([0, 1, 2, 3])

// 同一份 ArrayBuffer 的另一种视图
const arr16 = new Uint16Array(arr8.buffer)
```
以下是所有 JavaScript 内置的 typed array：
-  `Uint8Array`, `Uint16Array`, `Uint32Array`：8位，16位和32位无符号整数
-  `Uint8ClampedArray`：8位无符号整数，但是当超出范围时，截断方式与 `Uint8Array` 不同 (超过255时取255，小于0时取0)
-  `Int8Array`, `Int16Array`, `Int32Array`：8位，16位和32位有符号整数
-  `Float32Array`, `Float64Array`：32位和64位有符号浮点数

`TypedArray` 具有常规的数组方法，例如我们可以迭代它 (iterate)，也可以使用 `map`, `slice`, `find`, `reduce` 等方法。

但也有一些例外，例如下面的方法不能使用：
- 没有 `splice` 方法：不能删除一个值，因为 typed array 操作的是底层的 `ArrayBuffer`，即一片连续的长度固定的内存空间，我们无法删除它或改变它的长度，唯一能做的就是给它填充0。
- 没有 `concat` 方法。

同时也包含两个额外的方法：
- `arr.set(fromArr, [offset])`：从 `offset`位置 (默认为0) 开始，复制 `fromArr` 中的元素到 `arr`。
- `arr.subarray([begin, end])`：为 `[begin, end)` 区间的数据创建一个相同类型的新的 view，作用与 `slice` 类似，但是它不会复制出新的数据 (buffer)，只是在原数据上生成新的 view。

## DataView
`DataView` 是 `ArrayBuffer` 上一个特殊的，且非常灵活的 "非类型 (untyped)"视图。它允许以任何格式访问任何偏移量的数据。

这是什么意思？

前面提到的 typed array，它们的构造函数决定了它们以什么样的格式描述 buffer，一旦创建了视图，整个 typed array 内的每个元素类型都是统一的，例如一个 `Uint8Array` 类型的 `arr`，我们通过 `arr[i]` 就只能访问到它的第 i 个元素。但是 `DataView` 不同，`DataView` 使用 `.getUint8(i)` 或 `.getUint16(i)` 这样的方式来访问数据，即在方法调用时，而不是在构造函数初始化视图时，确定访问的数据类型。这样大大增加了灵活性。

要生成一个 `DataView`, 使用如下语法：
```js
new DataView(buffer, [byteOffset], [byteLength])
```
- `buffer`：底层的 `ArrayBuffer`，与 typed array 不同，`DataView` 不会自动为自己创建一个 buffer，所以必须传入 buffer 参数。
- `byteOffset`：视图的起始字节位置 (默认为 0)
- `byteLength`: 视图的字节长度 (默认直到包含 buffer 的末尾)

例如，我们在同一个 buffer 上以不同的格式提取数字：
```js
// 四字节的二进制数据， 每个字节包含最大数值 255
const buffer = new Uint8Array([255, 255, 255, 255]).buffer
const dataView = new DataView(buffer)

// 获取偏移量 0 处占据 8 bits (一个字节) 的数字
console.log(dataView.getUint8(0)) // 255

// 获取偏移量 0 处占据 16 bits (两个字节) 的数字
console.log(dataView.getUint16(0)) // 65535

// 获取偏移量 0 处占据 32 bits (四个字节) 的数字
console.log(dataView.getUint32(0)) // 4294967295

// 将偏移量 0 处占据 32 bits (四个字节)长度的数据设为 0，即所有字节都设置为 0
dataView.setUint32(0, 0)
```

当我们要在同一个 buffer 中存储混合格式的数据时，`DataView` 非常有用。例如，当我们要存储一连串的 (16位整数，32位浮点数) 这样的数值对时，`DataView` 可以让我们轻松地访问它们。

## 总结
- `ArrayBuffer` 是存储二进制数据的核心对象，它本质是一个对固定长度的连续内存区域的引用。
- 要操作 `ArrayBuffer` 内的数据，需要通过视图对象来完成。
  - 它可以是一个 `TypedArray`，例如 `Uint8Array`, `Uint16Array`, `Float32Array` 等等。
  - 也可以是一个 `DataView`
- 在大多数情况下，我们直接创建和操作 typed array，而把 `ArrayBuffer` 作为底层数据源，如果需要，可以通过 `.buffer` 来访问它。