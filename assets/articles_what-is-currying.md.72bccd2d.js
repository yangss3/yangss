import{_ as a,c as p,b as t,d as n,e as o,a as c,r as e,o as u}from"./app.ace6221f.js";const _='{"title":"\u4EC0\u4E48\u662F\u67EF\u91CC\u5316 (Currying)\uFF1F","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4E3A\u4EC0\u4E48\u9700\u8981\u67EF\u91CC\u5316\uFF1F","slug":"\u4E3A\u4EC0\u4E48\u9700\u8981\u67EF\u91CC\u5316\uFF1F"},{"level":2,"title":"\u67EF\u91CC\u5316\u9AD8\u7EA7\u5B9E\u73B0","slug":"\u67EF\u91CC\u5316\u9AD8\u7EA7\u5B9E\u73B0"}],"relativePath":"articles/what-is-currying.md"}',l={},i=n("h1",{id:"\u4EC0\u4E48\u662F\u67EF\u91CC\u5316-currying-\uFF1F",tabindex:"-1"},[o("\u4EC0\u4E48\u662F\u67EF\u91CC\u5316 (Currying)\uFF1F "),n("a",{class:"header-anchor",href:"#\u4EC0\u4E48\u662F\u67EF\u91CC\u5316-currying-\uFF1F","aria-hidden":"true"},"#")],-1),k=c(`<p><a href="https://en.wikipedia.org/wiki/Currying" target="_blank" rel="noopener noreferrer">\u67EF\u91CC\u5316\uFF08Currying\uFF09</a>\u662F\u4E00\u79CD\u5173\u4E8E\u51FD\u6570\u7684\u9AD8\u9636\u6280\u672F\uFF0C\u5B83\u662F\u4E00\u79CD\u5BF9\u51FD\u6570\u7684\u8F6C\u6362\uFF0C\u5C06\u4E00\u4E2A\u51FD\u6570\u8C03\u7528\u4ECE <code>f(a, b, c)</code> \u7684\u5F62\u5F0F\u8F6C\u6362\u4E3A <code>f(a)(b)(c)</code> \u7684\u5F62\u5F0F\u3002\u67EF\u91CC\u5316\u672C\u8EAB\u4E0D\u4F1A\u8C03\u7528\u51FD\u6570\uFF0C\u5B83\u53EA\u662F\u5BF9\u51FD\u6570\u8FDB\u884C\u8F6C\u6362\u3002</p><p>\u8BA9\u6211\u4EEC\u5148\u6765\u770B\u4E00\u4E2A\u4F8B\u5B50\uFF0C\u4EE5\u66F4\u597D\u5730\u7406\u89E3\u6211\u4EEC\u6B63\u5728\u8BB2\u7684\u5185\u5BB9\uFF0C\u7136\u540E\u518D\u8FDB\u884C\u4E00\u4E2A\u5B9E\u9645\u5E94\u7528\u3002</p><p>\u6211\u4EEC\u5C06\u521B\u5EFA\u4E00\u4E2A\u8F85\u52A9\u51FD\u6570 <code>curry(f)</code>\uFF0C\u8BE5\u51FD\u6570\u5C06\u5BF9\u4E24\u4E2A\u53C2\u6570\u7684\u51FD\u6570 <code>f</code> \u6267\u884C\u67EF\u91CC\u5316\u3002\u6362\u53E5\u8BDD\u8BF4\uFF0C\u5BF9\u4E8E\u4E24\u4E2A\u53C2\u6570\u7684\u51FD\u6570 <code>f(a, b)</code> \u6267\u884C <code>curry(f)</code> \u4F1A\u5C06\u5176\u8F6C\u6362\u4E3A\u4EE5 <code>f(a)(b)</code> \u5F62\u5F0F\u8C03\u7528\u7684\u51FD\u6570\uFF1A</p><div class="language-js"><pre><code><span class="token comment">// curry(f) \u6267\u884C\u67EF\u91CC\u5316\u8F6C\u6362</span>
<span class="token keyword">function</span> <span class="token function">curry</span><span class="token punctuation">(</span><span class="token parameter">f</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">a</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">f</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// \u7528\u6CD5</span>
<span class="token keyword">function</span> <span class="token function">sum</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">+</span> b
<span class="token punctuation">}</span>

<span class="token keyword">const</span> curriedSum <span class="token operator">=</span> <span class="token function">curry</span><span class="token punctuation">(</span>sum<span class="token punctuation">)</span>

<span class="token function">curriedSum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token comment">// 3</span>
</code></pre></div><p>\u6B63\u5982\u4F60\u6240\u770B\u5230\u7684\uFF0C\u5B9E\u73B0\u975E\u5E38\u7B80\u5355\uFF1A\u53EA\u6709\u4E24\u4E2A\u5305\u88C5\u5668\uFF08wrapper\uFF09</p><ul><li><code>curry(sum)</code> \u7684\u7ED3\u679C\u5C31\u662F\u4E00\u4E2A\u5305\u88C5\u5668 <code>function(a)</code></li><li>\u5F53\u5B83\u88AB\u50CF <code>curriedSum(1)</code> \u8FD9\u6837\u8C03\u7528\u65F6\uFF0C\u5B83\u7684\u53C2\u6570\u4F1A\u88AB\u4FDD\u5B58\u5728\u8BCD\u6CD5\u73AF\u5883\u4E2D\uFF0C\u7136\u540E\u8FD4\u56DE\u4E00\u4E2A\u65B0\u7684\u5305\u88C5\u5668 <code>function(b)</code></li><li>\u7136\u540E\u8FD9\u4E2A\u5305\u88C5\u5668\u88AB\u4EE5 2 \u4E3A\u53C2\u6570\u8C03\u7528\uFF0C\u800C\u5B83\u5C06\u8BE5\u8C03\u7528\u4F20\u9012\u7ED9\u539F\u59CB\u7684 <code>sum</code> \u51FD\u6570</li></ul><p>\u67EF\u91CC\u5316\u66F4\u9AD8\u7EA7\u7684\u5B9E\u73B0\uFF0C\u4F8B\u5982 lodash \u5E93\u7684 <code>_.curry</code>\uFF0C\u4F1A\u8FD4\u56DE\u4E00\u4E2A\u5305\u88C5\u5668\uFF0C\u8BE5\u5305\u88C5\u5668\u5141\u8BB8\u51FD\u6570\u88AB\u6B63\u5E38\u8C03\u7528\u6216\u8005\u4EE5\u504F\u51FD\u6570\uFF08partial\uFF09\u7684\u65B9\u5F0F\u8C03\u7528\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">sum</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">+</span> b
<span class="token punctuation">}</span>

<span class="token keyword">const</span> curriedSum <span class="token operator">=</span> _<span class="token punctuation">.</span><span class="token function">curry</span><span class="token punctuation">(</span>sum<span class="token punctuation">)</span> <span class="token comment">// \u4F7F\u7528\u6765\u81EA lodash \u5E93\u7684 _.curry</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">curriedSum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 3\uFF0C\u4ECD\u53EF\u6B63\u5E38\u8C03\u7528</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">curriedSum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 3\uFF0C\u4EE5\u504F\u51FD\u6570\u7684\u65B9\u5F0F\u8C03\u7528</span>
</code></pre></div><h2 id="\u4E3A\u4EC0\u4E48\u9700\u8981\u67EF\u91CC\u5316\uFF1F" tabindex="-1">\u4E3A\u4EC0\u4E48\u9700\u8981\u67EF\u91CC\u5316\uFF1F <a class="header-anchor" href="#\u4E3A\u4EC0\u4E48\u9700\u8981\u67EF\u91CC\u5316\uFF1F" aria-hidden="true">#</a></h2><p>\u8981\u4E86\u89E3\u5B83\u7684\u597D\u5904\uFF0C\u6211\u4EEC\u9700\u8981\u4E00\u4E2A\u5B9E\u9645\u4E2D\u7684\u4F8B\u5B50\u3002</p><p>\u4F8B\u5982\uFF0C\u6211\u4EEC\u6709\u4E00\u4E2A\u7528\u4E8E\u683C\u5F0F\u5316\u8F93\u51FA\u4FE1\u606F\u7684\u65E5\u5FD7\u51FD\u6570 <code>log(date, importance, message)</code>\u3002\u5728\u5B9E\u9645\u9879\u76EE\u4E2D\uFF0C\u6B64\u7C7B\u51FD\u6570\u5177\u6709\u5F88\u591A\u6709\u7528\u7684\u529F\u80FD\uFF0C\u4F8B\u5982\u901A\u8FC7\u7F51\u7EDC\u53D1\u9001\u65E5\u5FD7\uFF0C\u5728\u8FD9\u513F\u6211\u4EEC\u4EC5\u4F7F\u7528 <code>console.log</code>\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter">date<span class="token punctuation">,</span> importance<span class="token punctuation">,</span> message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">[</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>date<span class="token punctuation">.</span><span class="token function">getHours</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>date<span class="token punctuation">.</span><span class="token function">getMinutes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">] [</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>importance<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">] </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>message<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u8BA9\u6211\u4EEC\u5C06\u5B83\u67EF\u91CC\u5316\uFF1A</p><div class="language-js"><pre><code>log <span class="token operator">=</span> _<span class="token punctuation">.</span><span class="token function">curry</span><span class="token punctuation">(</span>log<span class="token punctuation">)</span>
</code></pre></div><p>\u67EF\u91CC\u5316\u4E4B\u540E\uFF0C<code>log</code> \u4ECD\u6B63\u5E38\u8FD0\u884C\uFF1A</p><div class="language-js"><pre><code><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&quot;DEBUG&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;some debug&quot;</span><span class="token punctuation">)</span>  <span class="token comment">// log(a, b, c)</span>
</code></pre></div><p>\u4E5F\u53EF\u4EE5\u4EE5\u67EF\u91CC\u5316\u5F62\u5F0F\u8FD0\u884C\uFF1A</p><div class="language-js"><pre><code><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token string">&quot;DEBUG&quot;</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token string">&quot;some debug&quot;</span><span class="token punctuation">)</span> <span class="token comment">// log(a)(b)(c)</span>
</code></pre></div><p>\u73B0\u5728\uFF0C\u6211\u4EEC\u53EF\u4EE5\u8F7B\u677E\u5730\u4E3A\u5F53\u524D\u65E5\u5FD7\u521B\u5EFA\u4FBF\u6377\u51FD\u6570\uFF1A</p><div class="language-js"><pre><code><span class="token comment">// logNow \u4F1A\u662F\u5E26\u6709\u56FA\u5B9A\u7B2C\u4E00\u4E2A\u53C2\u6570\u7684\u65E5\u5FD7\u7684\u504F\u51FD\u6570</span>
<span class="token keyword">const</span> logNow <span class="token operator">=</span> <span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// \u4F7F\u7528\u5B83</span>
<span class="token function">logNow</span><span class="token punctuation">(</span><span class="token string">&quot;INFO&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;message&quot;</span><span class="token punctuation">)</span> <span class="token comment">// [HH:mm] INFO message</span>
</code></pre></div><p>\u73B0\u5728\uFF0C<code>logNow</code> \u662F\u5177\u6709\u56FA\u5B9A\u7B2C\u4E00\u4E2A\u53C2\u6570\u7684 <code>log</code>\uFF0C\u6362\u53E5\u8BDD\u8BF4\uFF0C\u5C31\u662F\u66F4\u7B80\u77ED\u7684\u201C\u504F\u5E94\u7528\u51FD\u6570\uFF08partially applied function\uFF09\u201D\u6216\u201C\u504F\u51FD\u6570\uFF08partial\uFF09\u201D\u3002</p><p>\u6211\u4EEC\u53EF\u4EE5\u66F4\u8FDB\u4E00\u6B65\uFF0C\u4E3A\u5F53\u524D\u7684\u8C03\u8BD5\u65E5\u5FD7\uFF08debug log\uFF09\u63D0\u4F9B\u4FBF\u6377\u51FD\u6570\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">const</span> debugNow <span class="token operator">=</span> <span class="token function">logNow</span><span class="token punctuation">(</span><span class="token string">&quot;DEBUG&quot;</span><span class="token punctuation">)</span>

<span class="token function">debugNow</span><span class="token punctuation">(</span><span class="token string">&quot;message&quot;</span><span class="token punctuation">)</span> <span class="token comment">// [HH:mm] DEBUG message</span>
</code></pre></div><h2 id="\u67EF\u91CC\u5316\u9AD8\u7EA7\u5B9E\u73B0" tabindex="-1">\u67EF\u91CC\u5316\u9AD8\u7EA7\u5B9E\u73B0 <a class="header-anchor" href="#\u67EF\u91CC\u5316\u9AD8\u7EA7\u5B9E\u73B0" aria-hidden="true">#</a></h2><p>\u5B9E\u73B0\u4EE3\u7801\u76F8\u5F53\u7B80\u6D01\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">curry</span><span class="token punctuation">(</span><span class="token parameter">func</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">curried</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>args<span class="token punctuation">.</span>length <span class="token operator">&gt;=</span> func<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// (1)</span>
      <span class="token keyword">return</span> <span class="token function">func</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>args2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// (2)</span>
        <span class="token keyword">return</span> <span class="token function">curried</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> args<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>args2<span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u5B83\u4E5F\u5F88\u5BB9\u6613\u7406\u89E3\uFF0C<code>curry(func)</code> \u8C03\u7528\u7684\u7ED3\u679C\u662F\u8FD4\u56DE\u5305\u88C5\u5668 <code>curried</code>, \u5F53\u6211\u4EEC\u8FD0\u884C\u5B83\u65F6\uFF0C\u8FD9\u91CC\u6709\u4E24\u4E2A\u6267\u884C\u5206\u652F\uFF1A</p><ol><li>\u5982\u679C\u4F20\u5165\u7684 <code>args</code> \u957F\u5EA6\u4E0E\u539F\u59CB\u51FD\u6570\u6240\u5B9A\u4E49\u7684\u53C2\u6570\u957F\u5EA6\uFF08<code>func.length</code>\uFF09\u76F8\u540C\u6216\u8005\u66F4\u957F\uFF0C\u90A3\u4E48\u5C06\u8C03\u7528\u4F20\u9012\u7ED9\u539F\u59CB\u51FD\u6570\u5373\u53EF\u3002</li><li>\u5426\u5219\uFF0C\u8FD4\u56DE\u53E6\u4E00\u4E2A\u5305\u88C5\u5668\uFF08\u504F\u51FD\u6570\uFF09\uFF0C\u5B83\u5C06\u4E4B\u524D\u4F20\u5165\u7684\u53C2\u6570\u4E0E\u65B0\u7684\u53C2\u6570\u5408\u5E76\uFF0C\u7136\u540E\u91CD\u65B0\u8C03\u7528 <code>curried</code>\u3002\u5728\u65B0\u4E00\u8F6E\u7684\u8C03\u7528\u4E2D\uFF0C\u91CD\u590D 1\uFF0C2 \u6B65\u9AA4\u3002</li></ol><p>\u7528\u4F8B\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">function</span> <span class="token function">sum</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> c</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">+</span> b <span class="token operator">+</span> c
<span class="token punctuation">}</span>

<span class="token keyword">const</span> curriedSum <span class="token operator">=</span> <span class="token function">curry</span><span class="token punctuation">(</span>sum<span class="token punctuation">)</span>

<span class="token function">curriedSum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token comment">// 6\uFF0C\u4ECD\u7136\u53EF\u4EE5\u88AB\u6B63\u5E38\u8C03\u7528</span>
<span class="token function">curriedSum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token comment">// 6\uFF0C\u5BF9\u7B2C\u4E00\u4E2A\u53C2\u6570\u7684\u67EF\u91CC\u5316</span>
<span class="token function">curriedSum</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token comment">// 6\uFF0C\u5168\u67EF\u91CC\u5316</span>
</code></pre></div>`,30);function r(d,m,g,f,y,w){const s=e("PubDate");return u(),p("div",null,[i,t(s,{date:"2020/10/17"}),k])}var h=a(l,[["render",r]]);export{_ as __pageData,h as default};