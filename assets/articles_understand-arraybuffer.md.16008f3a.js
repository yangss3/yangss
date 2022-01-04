import{_ as n,r as a,c as s,b as e,d as p,e as o,a as t,o as c}from"./app.9096b5b7.js";const r='{"title":"深入理解 ArrayBuffer 和 TypedArray","description":"","frontmatter":{},"headers":[{"level":2,"title":"ArrayBuffer","slug":"arraybuffer"},{"level":2,"title":"TypedArray","slug":"typedarray"},{"level":2,"title":"DataView","slug":"dataview"},{"level":2,"title":"总结","slug":"总结"}],"relativePath":"articles/understand-arraybuffer.md","lastUpdated":1641308164901}',l={},u=p("h1",{id:"深入理解-arraybuffer-和-typedarray",tabindex:"-1"},[o("深入理解 ArrayBuffer 和 TypedArray "),p("a",{class:"header-anchor",href:"#深入理解-arraybuffer-和-typedarray","aria-hidden":"true"},"#")],-1),i=t('<p>在 Web 开发中，我们经常有处理文件的需求，例如图片处理，文件上传/下载等等，这时我们可能需要和二进制数据(binary data)打交道，但这往往会让人头疼，因为 JavaScript 中有很多和二进制相关的内置对象，例如：<code>ArrayBuffer</code>, <code>Uint8Array</code>, <code>DataView</code> 等等。它们分别代表什么？有什么区别？该怎么使用它们？下面就来缕一缕。</p><h2 id="arraybuffer" tabindex="-1">ArrayBuffer <a class="header-anchor" href="#arraybuffer" aria-hidden="true">#</a></h2><p>JavaScript 中最基本的二进制对象就是 <code>ArrayBuffer</code>，它代表的是对一个<strong>固定长度的连续内存空间的引用</strong>，比如我们创建一个 buffer 如下：</p><div class="language-js"><pre><code><span class="token keyword">const</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayBuffer</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>buffer<span class="token punctuation">.</span>byteLength<span class="token punctuation">)</span> <span class="token comment">// 16</span>\n</code></pre></div><p>上面的代码会分配一个16字节长度的连续内存空间，在其中填充0作为初始值，并将引用赋值给 <code>buffer</code> 变量。</p><p>这里首先要消除的一点迷惑是：虽然 <code>ArrayBuffer</code> 名字里含有 &#39;Array&#39; 的字样，但 <strong><code>ArrayBuffer</code> 并不是数组</strong>，它和数组没有任何关系：</p><ul><li>它有固定的长度，而且一旦生成(完成分配)，就无法再更改它的长度。</li><li>根据提供初始化参数，它占据准确的内存空间。</li><li>无法通过索引的方式 <code>buffer[index]</code> 访问单个字节，需要通过视图对象(view object)来访问。</li></ul><p>它代表的是一块内存区域，除了知道里面存储的是一段原始的字节序列，此外别无所知。</p><p>上面说到，要想对 <code>ArrayBuffer</code> 进行操作，需要用到一个视图对象(view object)。视图对象本身不存储任何值，它的作用是对 <code>ArrayBuffer</code> 加一层代理接口，透过它可以对 <code>ArrayBuffer</code> 中存储的二进制数据进行描述，例如：</p><ul><li><code>Uint8Array</code>: 将 <code>ArrayBuffer</code> 中的每个字节看作一个8位无符号整数(0-255)</li><li><code>Uint16Array</code>: 将 <code>ArrayBuffer</code> 中的每两个字节看作一个16位无符号整数(0-65535)</li><li><code>Uint32Array</code>: 将 <code>ArrayBuffer</code> 中的每4个字节看作一个32位无符号整数(0-4294967295)</li><li><code>Float64Array</code>: 将 <code>ArrayBuffer</code> 中的每8个字节看作一个浮点数(5.0 x 10^-324 - 1.8 x 10^308)</li></ul><p>所以一个 16字节大小的 <code>ArrayBuffer</code> 可以被解释为 <em>16个8位无符号整数(0-255)</em>, <em>8个16位无符号整数(0-65535)</em>, <em>4个32位无符号整数(0-4294967295)<em>或</em>两个浮点数</em>。</p><p>视图对象除了对 <code>ArrayBuffer</code> 进行描述外，还能通过它操作 <code>ArrayBuffer</code> 内的数据：</p><div class="language-js"><pre><code><span class="token comment">// 创建16字节长度的buffer</span>\n<span class="token keyword">const</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayBuffer</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span>\n<span class="token comment">// 将 buffer 看作是32位整数的序列</span>\n<span class="token keyword">const</span> view <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint32Array</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span>\n\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Uint32Array<span class="token punctuation">.</span><span class="token constant">BYTES_PER_ELEMENT</span><span class="token punctuation">)</span> <span class="token comment">// 每个整数占4个字节</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>view<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token comment">// 4</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>view<span class="token punctuation">.</span>byteLength<span class="token punctuation">)</span> <span class="token comment">// 16</span>\n\n<span class="token comment">// 写入值</span>\nview<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">123456</span>\n\n<span class="token comment">// 迭代值</span>\n<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> num <span class="token keyword">of</span> view<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span>  <span class="token comment">// 123456, 0, 0, 0</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="typedarray" tabindex="-1">TypedArray <a class="header-anchor" href="#typedarray" aria-hidden="true">#</a></h2><p>首先请注意，并没有名为 <code>TypedArray</code> 的构造函数，它只是上面那些视图对象(<code>Uint8Array</code>, <code>Uint16Array</code> 等)的通用术语，表示的是 <code>ArrayBuffer</code> 上的一个视图。 所有的 <code>TypedArray</code> 共享同一套方法和属性，而且它们的行为类似于常规数组，具有索引，可迭代，可读写。</p><p>一个 typed array 的构造函数可以接受5种不同形式的参数：</p><div class="language-js"><pre><code><span class="token keyword">new</span> <span class="token class-name">TypedArray</span><span class="token punctuation">(</span>buffer<span class="token punctuation">,</span> <span class="token punctuation">[</span>byteOffset<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>length<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// (1)</span>\n<span class="token keyword">new</span> <span class="token class-name">TypedArray</span><span class="token punctuation">(</span>arrayLike<span class="token punctuation">)</span> <span class="token comment">// (2)</span>\n<span class="token keyword">new</span> <span class="token class-name">TypedArray</span><span class="token punctuation">(</span>typedArray<span class="token punctuation">)</span> <span class="token comment">// (3)</span>\n<span class="token keyword">new</span> <span class="token class-name">TypedArray</span><span class="token punctuation">(</span>length<span class="token punctuation">)</span> <span class="token comment">// (4)</span>\n<span class="token keyword">new</span> <span class="token class-name">TypedArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// (5)</span>\n</code></pre></div><ol><li>如果提供 <code>ArrayBuffer</code> 作为第一个参数，则在它上面生成一个 view，前面的例子中已经使用过这种语法。除此之外还可以接受起始位置和长度作为可选参数，这样将为指定的 buffer 区间生成 view。</li><li>如果提供一个数组或类数组对象，则会生成一个相同长度的 typed array，同时复制数组的内容：<div class="language-js"><pre><code><span class="token keyword">const</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token comment">// 4</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// 1</span>\n</code></pre></div></li><li>如果提供另一个 <code>TypedArray</code> 作为参数，也会生成一个相同长度的 typed array，同时复制数组的内容，而且如果需要，值的类型可以转换为新的类型：<div class="language-js"><pre><code><span class="token keyword">const</span> arr16 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint16Array</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> arr8 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span>arr16<span class="token punctuation">)</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr8<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// 1</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr8<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// 232, 由于 1000 超出一个字节(8 bits)长度，会发生截断</span>\n</code></pre></div></li><li>如果提供一个长度作为参数，则生成指定长度的 typed array：<div class="language-js"><pre><code><span class="token keyword">const</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint16Array</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span> <span class="token comment">// 生成包含4个元素的 typed array</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Uint16Array<span class="token punctuation">.</span><span class="token constant">BYTES_PER_ELEMENT</span><span class="token punctuation">)</span> <span class="token comment">// 2</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>arr<span class="token punctuation">.</span>byteLength<span class="token punctuation">)</span> <span class="token comment">// 8</span>\n</code></pre></div></li><li>不传任何参数，则生成0长度的 typed array。</li></ol><p>注意，虽然上面除了 (1) ，其它似乎都没有依托 <code>ArrayBuffer</code>， 而是直接生成了 typed array。但实际上 view 是不能独立于 <code>ArrayBuffer</code> 存在的，每个 typed array 必须要有关联的 <code>ArrayBuffer</code>，所以除了 (1) 的情况，其它调用形式都会自动创建一个 <code>ArrayBuffer</code>。</p><p>要访问底层的 <code>ArrayBuffer</code>，可以使用 <code>TypedArray</code> 以下属性：</p><ul><li><code>buffer</code>：<code>ArrayBuffer</code> 的引用</li><li><code>byteLength</code>：<code>ArrayBuffer</code> 的字节长度</li></ul><p>例如可以从一种视图转换为另一种视图：</p><div class="language-js"><pre><code><span class="token keyword">const</span> arr8 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 同一份 ArrayBuffer 的另一种视图</span>\n<span class="token keyword">const</span> arr16 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint16Array</span><span class="token punctuation">(</span>arr8<span class="token punctuation">.</span>buffer<span class="token punctuation">)</span>\n</code></pre></div><p>以下是所有 JavaScript 内置的 typed array：</p><ul><li><code>Uint8Array</code>, <code>Uint16Array</code>, <code>Uint32Array</code>：8位，16位和32位无符号整数</li><li><code>Uint8ClampedArray</code>：8位无符号整数，但是当超出范围时，截断方式与 <code>Uint8Array</code> 不同 (超过255时取255，小于0时取0)</li><li><code>Int8Array</code>, <code>Int16Array</code>, <code>Int32Array</code>：8位，16位和32位有符号整数</li><li><code>Float32Array</code>, <code>Float64Array</code>：32位和64位有符号浮点数</li></ul><p><code>TypedArray</code> 具有常规的数组方法，例如我们可以迭代它 (iterate)，也可以使用 <code>map</code>, <code>slice</code>, <code>find</code>, <code>reduce</code> 等方法。</p><p>但也有一些例外，例如下面的方法不能使用：</p><ul><li>没有 <code>splice</code> 方法：不能删除一个值，因为 typed array 操作的是底层的 <code>ArrayBuffer</code>，即一片连续的长度固定的内存空间，我们无法删除它或改变它的长度，唯一能做的就是给它填充0。</li><li>没有 <code>concat</code> 方法。</li></ul><p>同时也包含两个额外的方法：</p><ul><li><code>arr.set(fromArr, [offset])</code>：从 <code>offset</code>位置 (默认为0) 开始，复制 <code>fromArr</code> 中的元素到 <code>arr</code>。</li><li><code>arr.subarray([begin, end])</code>：为 <code>[begin, end)</code> 区间的数据创建一个相同类型的新的 view，作用与 <code>slice</code> 类似，但是它不会复制出新的数据 (buffer)，只是在原数据上生成新的 view。</li></ul><h2 id="dataview" tabindex="-1">DataView <a class="header-anchor" href="#dataview" aria-hidden="true">#</a></h2><p><code>DataView</code> 是 <code>ArrayBuffer</code> 上一个特殊的，且非常灵活的 &quot;非类型 (untyped)&quot;视图。它允许以任何格式访问任何偏移量的数据。</p><p>这是什么意思？</p><p>前面提到的 typed array，它们的构造函数决定了它们以什么样的格式描述 buffer，一旦创建了视图，整个 typed array 内的每个元素类型都是统一的，例如一个 <code>Uint8Array</code> 类型的 <code>arr</code>，我们通过 <code>arr[i]</code> 就只能访问到它的第 i 个元素。但是 <code>DataView</code> 不同，<code>DataView</code> 使用 <code>.getUint8(i)</code> 或 <code>.getUint16(i)</code> 这样的方式来访问数据，即在方法调用时，而不是在构造函数初始化视图时，确定访问的数据类型。这样大大增加了灵活性。</p><p>要生成一个 <code>DataView</code>, 使用如下语法：</p><div class="language-js"><pre><code><span class="token keyword">new</span> <span class="token class-name">DataView</span><span class="token punctuation">(</span>buffer<span class="token punctuation">,</span> <span class="token punctuation">[</span>byteOffset<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>byteLength<span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre></div><ul><li><code>buffer</code>：底层的 <code>ArrayBuffer</code>，与 typed array 不同，<code>DataView</code> 不会自动为自己创建一个 buffer，所以必须传入 buffer 参数。</li><li><code>byteOffset</code>：视图的起始字节位置 (默认为 0)</li><li><code>byteLength</code>: 视图的字节长度 (默认直到包含 buffer 的末尾)</li></ul><p>例如，我们在同一个 buffer 上以不同的格式提取数字：</p><div class="language-js"><pre><code><span class="token comment">// 四字节的二进制数据， 每个字节包含最大数值 255</span>\n<span class="token keyword">const</span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">255</span><span class="token punctuation">,</span> <span class="token number">255</span><span class="token punctuation">,</span> <span class="token number">255</span><span class="token punctuation">,</span> <span class="token number">255</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span>buffer\n<span class="token keyword">const</span> dataView <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DataView</span><span class="token punctuation">(</span>buffer<span class="token punctuation">)</span>\n\n<span class="token comment">// 获取偏移量 0 处占据 8 bits (一个字节) 的数字</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>dataView<span class="token punctuation">.</span><span class="token function">getUint8</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 255</span>\n\n<span class="token comment">// 获取偏移量 0 处占据 16 bits (两个字节) 的数字</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>dataView<span class="token punctuation">.</span><span class="token function">getUint16</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 65535</span>\n\n<span class="token comment">// 获取偏移量 0 处占据 32 bits (四个字节) 的数字</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>dataView<span class="token punctuation">.</span><span class="token function">getUint32</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 4294967295</span>\n\n<span class="token comment">// 将偏移量 0 处占据 32 bits (四个字节)长度的数据设为 0，即所有字节都设置为 0</span>\ndataView<span class="token punctuation">.</span><span class="token function">setUint32</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>\n</code></pre></div><p>当我们要在同一个 buffer 中存储混合格式的数据时，<code>DataView</code> 非常有用。例如，当我们要存储一连串的 (16位整数，32位浮点数) 这样的数值对时，<code>DataView</code> 可以让我们轻松地访问它们。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-hidden="true">#</a></h2><ul><li><code>ArrayBuffer</code> 是存储二进制数据的核心对象，它本质是一个对固定长度的连续内存区域的引用。</li><li>要操作 <code>ArrayBuffer</code> 内的数据，需要通过视图对象来完成。 <ul><li>它可以是一个 <code>TypedArray</code>，例如 <code>Uint8Array</code>, <code>Uint16Array</code>, <code>Float32Array</code> 等等。</li><li>也可以是一个 <code>DataView</code></li></ul></li><li>在大多数情况下，我们直接创建和操作 typed array，而把 <code>ArrayBuffer</code> 作为底层数据源，如果需要，可以通过 <code>.buffer</code> 来访问它。</li></ul>',42);var d=n(l,[["render",function(n,p,o,t,r,l){const d=a("PubDate");return c(),s("div",null,[u,e(d,{date:"2021/11/17"}),i])}]]);export{r as __pageData,d as default};
