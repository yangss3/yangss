import{o as n,c as a,a as s}from"./app.b10b3c62.js";const p='{"title":"深入理解 WeakMap 和 WeakSet","description":"","frontmatter":{},"headers":[{"level":2,"title":"WeakMap","slug":"weakmap"},{"level":2,"title":"WeakSet","slug":"weakset"}],"relativePath":"articles/weakmap-weakset.md","lastUpdated":1630852994624}',e={},o=[s('<h1 id="深入理解-weakmap-和-weakset"><a class="header-anchor" href="#深入理解-weakmap-和-weakset" aria-hidden="true">#</a> 深入理解 WeakMap 和 WeakSet</h1><p>JS 引擎在值可访问（并可能被使用）时将其存储在内存中。</p><p>例如：</p><div class="language-js"><pre><code><span class="token keyword">let</span> john <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&quot;John&quot;</span> <span class="token punctuation">}</span>\n\n<span class="token comment">// 该对象能被访问，john 是它的引用</span>\n\n<span class="token comment">// 覆盖引用</span>\njohn <span class="token operator">=</span> <span class="token keyword">null</span>\n\n<span class="token comment">// 该对象将会被从内存中清除</span>\n</code></pre></div><p>通常，当对象、数组这类数据结构在内存中时，它们的子元素，如对象的属性、数组的元素都是可以访问的。例如，如果把一个对象放入到数组中，那么只要这个数组存在，那么这个对象也就存在，即使没有其它对该对象的引用：</p><div class="language-js"><pre><code><span class="token keyword">let</span> john <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&quot;John&quot;</span> <span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token punctuation">[</span> john <span class="token punctuation">]</span>\n\njohn <span class="token operator">=</span> <span class="token keyword">null</span> <span class="token comment">// 覆盖引用</span>\n\n<span class="token comment">// john 被存储在数组里, 所以它不会被垃圾回收机制回收</span>\n<span class="token comment">// 我们可以通过 array[0] 来获取它</span>\n</code></pre></div><p>类似的，如果我们使用对象作为常规 <code>Map</code> 的键，那么当 <code>Map</code> 存在时，该对象也将存在。它会占用内存，并且不会被垃圾回收机制回收：</p><div class="language-js"><pre><code><span class="token keyword">let</span> john <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&quot;John&quot;</span> <span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\nmap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>john<span class="token punctuation">,</span> <span class="token string">&quot;xxx&quot;</span><span class="token punctuation">)</span>\n\njohn <span class="token operator">=</span> <span class="token keyword">null</span> <span class="token comment">// 覆盖引用</span>\n\n<span class="token comment">// john 被存储在 map 中，</span>\n<span class="token comment">// 我们可以使用 map.keys() 来获取它</span>\n</code></pre></div><p>而 <code>WeakMap</code> 在这方面有着根本上的不同。它不会阻止垃圾回收机制对作为键的对象的回收。</p><p>让我们通过例子来看看这指的到底是什么。</p><h2 id="weakmap"><a class="header-anchor" href="#weakmap" aria-hidden="true">#</a> WeakMap</h2><p><code>WeakMap</code> 和 <code>Map</code> 的第一个不同点就是，<code>WeakMap</code> 的键必须是对象，不能是原始值（primitive）：</p><div class="language-js"><pre><code><span class="token keyword">const</span> weakMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\nweakMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>obj<span class="token punctuation">,</span> <span class="token string">&#39;ok&#39;</span><span class="token punctuation">)</span> <span class="token comment">// 正常工作（以对象作为键）</span>\n\n<span class="token comment">// 不能使用字符串作为键</span>\nweakMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">,</span> <span class="token string">&quot;Whoops&quot;</span><span class="token punctuation">)</span> <span class="token comment">// Error，&quot;test&quot; 不是一个对象</span>\n</code></pre></div><p>现在，如果我们在 <code>weakMap</code> 中使用一个对象作为键，并且没有其它对这个对象的引用， 那么该对象将会被从内存（和 <code>weakMap</code>）中自动清除：</p><div class="language-js"><pre><code><span class="token keyword">let</span> john <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&#39;John&#39;</span> <span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> weakMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\nweakMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>john<span class="token punctuation">,</span> <span class="token string">&#39;xxx&#39;</span><span class="token punctuation">)</span>\n\njohn <span class="token operator">=</span> <span class="token keyword">null</span> <span class="token comment">// 覆盖引用</span>\n\n<span class="token comment">// john 被从内存中删除了！</span>\n</code></pre></div><p><code>WeakMap</code> 是不可迭代的，也不支持 <code>keys()</code>，<code>values()</code> 和 <code>entries()</code> 方法，所以没有办法获取 <code>WeakMap</code> 的所有键或值，<code>WeakMap</code> 只有以下的方法:</p><ul><li><code>weakMap.get(key)</code></li><li><code>weakMap.set(key, value)</code></li><li><code>weakMap.delete(key)</code></li><li><code>weakMap.has(key)</code></li></ul><p>为什么会有这种限制呢？这是技术的原因。如果一个对象丢失了其它所有引用（就像上面示例中的 <code>john</code>），那么它就会被垃圾回收机制自动回收。但是在从技术的角度并不能准确知道何时会被回收。</p><p>这些都是由 JS 引擎决定的。JS 引擎可能会选择立即执行内存清理，如果现在正在发生很多删除操作，那么 JS 引擎可能就会选择等一等，稍后再进行内存清理。因此，从技术上讲，<code>WeakMap</code> 的当前元素的数量是未知的。JS 引擎可能清理了其中的垃圾，可能没清理，也可能清理了一部分。因此，不支持访问 <code>WeakMap</code> 的所有键/值的方法。</p><p>那么，在哪里我们会需要这样的数据结构呢？ <code>WeakMap</code> 的主要应用场景是额外数据的存储。</p><p>假如我们正在处理一个属于另一个代码的一个对象，也可能是第三方库，并想存储一些与之相关的数据，那么这些数据就应该与这个对象共存亡，这时候 <code>WeakMap</code> 正是处理这种情况的利器。我们将这些数据放到 <code>WeakMap</code> 中，并使用该对象作为这些数据的键，那么当该对象被垃圾回收机制回收后，这些数据也会被自动清除。</p><p>例如，我们有用于处理用户访问计数的代码。收集到的信息被存储在 map 中：一个用户对象作为键，其访问次数为值。当一个用户离开时（该用户对象将被垃圾回收机制回收），这时我们就不再需要他的访问次数了</p><p>下面是一个使用 Map 的计数函数的例子</p><div class="language-js"><pre><code><span class="token keyword">const</span> visitsCountMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 递增用户来访次数</span>\n<span class="token keyword">function</span> <span class="token function">countUser</span><span class="token punctuation">(</span><span class="token parameter">user</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> count <span class="token operator">=</span> visitsCountMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token number">0</span>\n  visitsCountMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>在其它地方使用此计数函数：</p><div class="language-js"><pre><code><span class="token keyword">let</span> john <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">&quot;John&quot;</span> <span class="token punctuation">}</span>\n\n<span class="token function">countUser</span><span class="token punctuation">(</span>john<span class="token punctuation">)</span> <span class="token comment">// 统计访问次数</span>\n\n<span class="token comment">// 不久之后，john 离开了</span>\njohn <span class="token operator">=</span> <span class="token keyword">null</span>\n</code></pre></div><p>现在 <code>john</code> 这个对象应该被垃圾回收，但他仍在内存中，因为它是 <code>visitsCountMap</code> 中的一个键。当我们移除用户时，我们需要手动清理 <code>visitsCountMap</code>，否则它将在内存中无限增大。在复杂的架构中，这种清理会成为一项繁重的任务。</p><p>我们可以通过使用 <code>WeakMap</code> 来避免这样的问题：</p><div class="language-js"><pre><code>\n<span class="token keyword">const</span> visitsCountMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 递增用户来访次数</span>\n<span class="token keyword">function</span> <span class="token function">countUser</span><span class="token punctuation">(</span><span class="token parameter">user</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> count <span class="token operator">=</span> visitsCountMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token number">0</span>\n  visitsCountMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>现在我们不需要去手动清理 <code>visitsCountMap</code> 了。当 <code>john</code> 对象变成不可访问时，即便它是 <code>WeakMap</code> 里的一个键，它也会连同它作为 <code>WeakMap</code> 里的键所对应的信息一同被从内存中删除。</p><h2 id="weakset"><a class="header-anchor" href="#weakset" aria-hidden="true">#</a> WeakSet</h2><p><code>WeakSet</code> 的表现与 <code>WeakMap</code> 类似：</p><ul><li>只能向 <code>WeakSet</code> 添加对象，而不能是原始值</li><li>对象只有在其它地方能被访问的时候，才能留在 <code>WeakSet</code> 中</li><li>跟 <code>Set</code> 一样，<code>WeakSet</code> 支持 <code>add</code>，<code>has</code> 和 <code>delete</code> 方法，但不支持 <code>size</code> 和 <code>keys()</code>，并且不可迭代</li></ul>',33)];e.render=function(s,p,e,t,c,k){return n(),a("div",null,o)};export{p as __pageData,e as default};
