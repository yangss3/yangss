import{_ as a,c as o,b as e,d as n,e as p,a as t,r as c,o as l}from"./app.ace6221f.js";const b='{"title":"\u6DF1\u5165\u7406\u89E3 TypeScript \u4E2D\u7684 unknown","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u603B\u7ED3","slug":"\u603B\u7ED3"}],"relativePath":"articles/understand-unknown-in-typescript.md"}',k={},u=n("h1",{id:"\u6DF1\u5165\u7406\u89E3-typescript-\u4E2D\u7684-unknown",tabindex:"-1"},[p("\u6DF1\u5165\u7406\u89E3 TypeScript \u4E2D\u7684 unknown "),n("a",{class:"header-anchor",href:"#\u6DF1\u5165\u7406\u89E3-typescript-\u4E2D\u7684-unknown","aria-hidden":"true"},"#")],-1),i=t(`<p>\u5047\u8BBE\u4F60\u5728\u5F00\u53D1\u4E00\u4E2A\u89E3\u6790 YAML (YAML \u662F\u4E00\u79CD\u6BD4 JSON \u66F4\u7075\u6D3B\u7684\u6570\u636E\u8868\u793A\u683C\u5F0F) \u7684\u5DE5\u5177\u51FD\u6570 <code>parseYAML</code>\uFF0C\u90A3\u8FD9\u4E2A parser \u51FD\u6570\u7684\u8FD4\u56DE\u7C7B\u578B\u5E94\u8BE5\u662F\u4EC0\u4E48\uFF1F</p><p><code>any</code> \u597D\u50CF\u662F\u4E0D\u9519\u7684\u9009\u62E9\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">parseYAML</span><span class="token punctuation">(</span>yaml<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u7406\u60F3\u60C5\u51B5\u4E0B\uFF0C\u4F60\u5E0C\u671B\u7528\u6237\u5C06\u8FD4\u56DE\u7684\u7ED3\u679C\u7ACB\u523B\u5206\u914D\u7ED9\u53E6\u4E00\u4E2A\u7C7B\u578B\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">interface</span> <span class="token class-name">Book</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token builtin">string</span>
  author<span class="token operator">:</span> <span class="token builtin">string</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> book<span class="token operator">:</span> Book <span class="token operator">=</span> <span class="token function">parseYAML</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  name: \u806A\u683C\u5C14\u4F20
  author: \u72D7\u86CB
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
</code></pre></div><p>\u8FD9\u5F88\u5B8C\u7F8E\uFF0C\u4F46\u662F\u7406\u60F3\u5F88\u7F8E\u6EE1\uFF0C\u73B0\u5B9E\u5F88\u9AA8\u611F\u3002\u7528\u6237\u5F88\u53EF\u80FD\u4F1A\u76F4\u63A5\u63A5\u6536\u8FD4\u56DE\u503C\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">const</span> book <span class="token operator">=</span> <span class="token function">parseYAML</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  name: \u806A\u683C\u5C14\u4F20
  author: \u72D7\u86CB
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
<span class="token function">alert</span><span class="token punctuation">(</span>book<span class="token punctuation">.</span>title<span class="token punctuation">)</span> <span class="token comment">// \u65E0\u7F16\u8BD1\u65F6\u9519\u8BEF, \u4F46\u5728\u8FD0\u884C\u65F6 alerts &quot;undefined&quot;</span>
<span class="token function">book</span><span class="token punctuation">(</span><span class="token string">&#39;read&#39;</span><span class="token punctuation">)</span> <span class="token comment">// \u65E0\u7F16\u8BD1\u65F6\u9519\u8BEF, \u4F46\u5728\u8FD0\u884C\u65F6 throws &quot;TypeError: book is not a function&quot;</span>
</code></pre></div><p>\u53EF\u4EE5\u770B\u5230 <code>any</code> \u7C7B\u578B\u901A\u8FC7\u51FD\u6570\u8FD4\u56DE\u503C\u4F20\u64AD\u7ED9\u4E86 <code>book</code>\uFF0C\u5BFC\u81F4\u7C7B\u578B\u68C0\u67E5\u5931\u6548\uFF0C\u4ECE\u800C\u5BFC\u81F4\u8FD0\u884C\u65F6\u9519\u8BEF\u3002\u8FD9\u5F88\u4E0D\u5B89\u5168\uFF0C\u4E5F\u8FDD\u80CC\u4E86 TypeScript \u7684\u521D\u8877\u3002</p><p>\u4F46\u5982\u679C\u5C06 <code>parseYAML</code> \u7684\u8FD4\u56DE\u7C7B\u578B\u8BBE\u4E3A <code>unknown</code>\uFF0C\u60C5\u51B5\u5C31\u4F1A\u597D\u8F6C\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">parseYAML</span><span class="token punctuation">(</span>yaml<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">unknown</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> book <span class="token operator">=</span> <span class="token function">parseYAML</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  name: \u806A\u683C\u5C14\u4F20
  author: \u72D7\u86CB
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>

<span class="token function">alert</span><span class="token punctuation">(</span>book<span class="token punctuation">.</span>title<span class="token punctuation">)</span> <span class="token comment">// ~~~~~~ Object is of type &#39;unknown&#39;</span>
<span class="token function">book</span><span class="token punctuation">(</span><span class="token string">&quot;read&quot;</span><span class="token punctuation">)</span> <span class="token comment">// ~~~~~~~ Object is of type &#39;unknown&#39;</span>
</code></pre></div><p>\u9519\u8BEF\u5728\u7F16\u8BD1\u65F6\u5C31\u4F1A\u88AB\u66B4\u9732\u51FA\u6765\uFF0C\u8FD9\u6BD4\u5728\u8FD0\u884C\u65F6\u51FA\u9519\u8981\u597D\u7684\u591A\u3002</p><p>\u90A3\u4E48 <code>unknown</code> \u7C7B\u578B\u5230\u5E95\u662F\u4EC0\u4E48\uFF1F\u8981\u7406\u89E3\u5B83\uFF0C\u5148\u8981\u4ECE <code>any</code> \u8BF4\u8D77\u3002</p><p><code>any</code> \u7C7B\u578B\u7684\u4E24\u4E2A\u4E3B\u8981\u7279\u70B9\uFF1A</p><ul><li>\u4EFB\u4F55\u7C7B\u578B\u53EF\u4EE5\u8D4B\u503C\u7ED9 <code>any</code> \u7C7B\u578B</li><li><code>any</code> \u7C7B\u578B\u53EF\u4EE5\u8D4B\u503C\u7ED9\u4EFB\u4F55\u7C7B\u578B</li></ul><p>\u4ECE<strong>\u5C06\u7C7B\u578B\u770B\u4F5C\u503C\u7684\u96C6\u5408</strong> (\u524D\u9762\u7684\u6587\u7AE0\u4E2D\u6709\u8BB2\u8FC7) \u7684\u89D2\u5EA6\u6765\u770B\uFF0C<code>any</code> \u662F\u4E0D\u6EE1\u8DB3 TypeScript \u7684\u7C7B\u578B\u7CFB\u7EDF\u7684\uFF0C\u56E0\u4E3A\u5728\u6570\u5B66\u610F\u4E49\u4E0A\uFF0C\u627E\u4E0D\u5230\u4E00\u4E2A\u96C6\u5408\uFF0C\u5B83\u65E2\u662F\u5176\u5B83\u6240\u6709\u96C6\u5408\u7684\u8D85\u96C6 (superset) \u53C8\u662F\u5176\u5B83\u6240\u6709\u96C6\u5408\u7684\u5B50\u96C6 (subset)\u3002\u8FD9\u4E5F\u6B63\u662F <code>any</code> \u5F3A\u5927\u800C\u53C8\u5371\u9669\u7684\u6839\u6E90\u3002\u56E0\u4E3A TypeScript \u7684\u7C7B\u578B\u68C0\u67E5\u662F\u57FA\u4E8E\u96C6\u5408\u7684\uFF0C\u6240\u4EE5\u5B83\u5BF9 <code>any</code> \u4E0D\u8D77\u4F5C\u7528\u3002</p><p>\u800C <code>unknown</code> \u53EF\u4EE5\u770B\u4F5C\u662F <code>any</code> \u7684\u4E00\u4E2A\u66FF\u4EE3\u54C1\uFF0C\u5B83\u5177\u5907 <code>any</code> \u7684\u7B2C\u4E00\u4E2A\u7279\u70B9\uFF0C\u5373<strong>\u6240\u6709\u7C7B\u578B\u90FD\u53EF\u4EE5\u8D4B\u503C\u7ED9 <code>unknown</code> \u7C7B\u578B</strong>\u3002\u4F46\u662F\u4E0D\u6EE1\u8DB3\u7B2C\u4E8C\u6761\uFF0C\u5373 <strong><code>unknown</code> \u7C7B\u578B\u53EA\u80FD\u8D4B\u503C\u7ED9 <code>unknown</code> \u7C7B\u578B</strong> (\u5F53\u7136\uFF0C\u4E5F\u53EF\u4EE5\u8D4B\u7ED9 <code>any</code>)\u3002\u6240\u4EE5 <code>unknown</code> \u6EE1\u8DB3 TypeScript \u7684\u7C7B\u578B\u7CFB\u7EDF\uFF0C\u4F7F\u7528\u5B83\u662F\u5B89\u5168\u7684\u3002</p><div class="tip custom-block"><p class="custom-block-title">\u63D0\u793A</p><p>\u987A\u5E26\u63D0\u4E00\u53E5\uFF0CTypeScript \u4E2D\u8FD8\u6709\u4E00\u4E2A\u5185\u7F6E\u7C7B\u578B <code>never</code>\uFF0C \u5B83\u6B63\u597D\u4E0E <code>unknown</code> \u76F8\u53CD\u3002\u5B83\u6EE1\u8DB3 <code>any</code> \u7684\u7B2C\u4E8C\u6761\u800C\u4E0D\u6EE1\u8DB3\u7B2C\u4E00\u6761\u3002\u5373 <code>never</code> \u7C7B\u578B\u53EF\u4EE5\u8D4B\u7ED9\u4EFB\u4F55\u7C7B\u578B\uFF0C\u4F46\u9664\u4E86 <code>never</code>, \u4EFB\u4F55\u7C7B\u578B\u90FD\u4E0D\u80FD\u8D4B\u7ED9 <code>never</code> \u7C7B\u578B\u3002\u5728\u6570\u5B66\u610F\u4E49\u4E0A\uFF0C<code>unknown</code> \u4EE3\u8868\u5168\u96C6 (universal set)\uFF0C<code>never</code> \u4EE3\u8868\u7A7A\u96C6 (empty set)\u3002</p></div><p><code>unknown</code> \u6B63\u5982\u5B83\u7684\u5B57\u9762\u610F\u601D\uFF1A\u201C\u672A\u77E5\u7684\u201D\uFF0C\u4EE3\u8868\u672A\u77E5\u7684\u7C7B\u578B\u3002\u8BD5\u56FE\u53BB\u8BBF\u95EE\u4E00\u4E2A <code>unknown</code> \u7C7B\u578B\u7684\u53D8\u91CF\u7684\u5C5E\u6027\u6216\u5BF9 <code>unknown</code> \u7C7B\u578B\u7684\u53D8\u91CF\u8FDB\u884C\u51FD\u6570\u8C03\u7528\uFF0CTypeScript \u90FD\u4F1A\u629B\u51FA\u9519\u8BEF\u3002\u5B9E\u9645\u4E0A\u4F60\u4E0D\u80FD\u5BF9 <code>unknown</code> \u7C7B\u578B\u7684\u53D8\u91CF\u505A\u4EFB\u4F55\u4E8B\u60C5\uFF0C\u8FD9\u6B63\u662F\u95EE\u9898\u7684\u5173\u952E\u3002<code>unknown</code> \u5BFC\u81F4\u7684\u9519\u8BEF\u5C06\u8FEB\u4F7F\u4F60\u4E3B\u52A8\u5C06\u5176\u7F29\u7A84\u5230\u9002\u5F53\u7684\u7C7B\u578B\uFF0C\u56E0\u4E3A\u5F80\u5F80\u8FD9\u4E2A\u65F6\u5019\uFF0C\u4F60\u6BD4 TypeScript \u4E86\u89E3\u7684\u66F4\u591A\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">const</span> book <span class="token operator">=</span> <span class="token function">parseYAML</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
  name: \u806A\u683C\u5C14\u4F20
  author: \u72D7\u86CB
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span> <span class="token keyword">as</span> Book <span class="token comment">// \u4F60\u6BD4 TypeScript \u77E5\u9053\u7684\u66F4\u591A\uFF0C\u6240\u4EE5\u4F7F\u7528\u7C7B\u578B\u65AD\u8A00\u6765\u7F29\u7A84\u7C7B\u578B</span>

<span class="token function">alert</span><span class="token punctuation">(</span>book<span class="token punctuation">.</span>title<span class="token punctuation">)</span> <span class="token comment">// ~~~~~~ Property &#39;title&#39; does not exist on type &#39;Book&#39;</span>
<span class="token function">book</span><span class="token punctuation">(</span><span class="token string">&#39;read&#39;</span><span class="token punctuation">)</span> <span class="token comment">// ~~~~~~~ this expression is not callable</span>
</code></pre></div><p>\u56E0\u4E3A <code>unknown</code> \u4E0D\u80FD\u76F4\u63A5\u8D4B\u7ED9\u5176\u5B83\u4EFB\u4F55\u7C7B\u578B\uFF0C\u6240\u4EE5\u8FD9\u91CC\u9700\u8981\u7528\u5230\u7C7B\u578B\u65AD\u8A00 (type assertion)\uFF0C\u8FD9\u4E5F\u4F7F\u5F97\u9519\u8BEF\u4FE1\u606F\u66F4\u52A0\u6E05\u6670\u660E\u4E86\u3002</p><p>\u5F53\u4F60\u5728\u58F0\u660E\u4E00\u4E2A\u53D8\u91CF\u6216\u8FD4\u56DE\u4E00\u4E2A\u503C\u4F46\u8FD8\u4E0D\u786E\u5B9A\u5B83\u7684\u7C7B\u578B\u65F6\uFF0C\u4F7F\u7528 <code>unknown</code> \u662F\u4E00\u4E2A\u597D\u7684\u9009\u62E9\uFF0C<code>parseYAML</code> \u7684\u8FD4\u56DE\u503C\u5C31\u662F\u4E00\u4E2A\u4F8B\u5B50\u3002</p><p>\u5F53\u7136\uFF0C\u4F7F\u7528\u7C7B\u578B\u65AD\u8A00\u5E76\u4E0D\u662F\u5C06 <code>unknown</code> \u7C7B\u578B\u7F29\u7A84\u5230\u5177\u4F53\u7C7B\u578B\u7684\u552F\u4E00\u65B9\u6CD5\u3002\u4F7F\u7528 <code>instanceof</code> \u68C0\u67E5\u4E5F\u53EF\u4EE5\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">processValue</span><span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">unknown</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>val <span class="token keyword">instanceof</span> <span class="token class-name">Date</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    val <span class="token comment">// Type is Date</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u8FD8\u53EF\u4EE5\u4F7F\u7528\u7C7B\u578B\u5B88\u536B (type guard)\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">function</span> <span class="token function">isBook</span><span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">unknown</span><span class="token punctuation">)</span><span class="token operator">:</span> val <span class="token keyword">is</span> Book <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">typeof</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span> val <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token string">&#39;name&#39;</span> <span class="token keyword">in</span> val <span class="token operator">&amp;&amp;</span> <span class="token string">&#39;author&#39;</span> <span class="token keyword">in</span> val
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">processValue</span><span class="token punctuation">(</span>val<span class="token operator">:</span> <span class="token builtin">unknown</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isBook</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    val <span class="token comment">// Type is Book</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><p>\u5728\u53CC\u91CD\u65AD\u8A00 (double assertion) \u4E2D\uFF0C\u4E5F\u53EF\u4EE5\u4F7F\u7528 <code>unknown</code> \u66FF\u4EE3 <code>any</code>\uFF1A</p><div class="language-ts"><pre><code><span class="token keyword">declare</span> <span class="token keyword">const</span> foo<span class="token operator">:</span> Foo
<span class="token keyword">const</span> barAny <span class="token operator">=</span> foo <span class="token keyword">as</span> <span class="token builtin">any</span> <span class="token keyword">as</span> Bar
<span class="token keyword">const</span> barUnk <span class="token operator">=</span> foo <span class="token keyword">as</span> <span class="token builtin">unknown</span> <span class="token keyword">as</span> Bar
</code></pre></div><p>\u867D\u7136\u5B83\u4EEC\u5728\u529F\u80FD\u4E0A\u662F\u7B49\u4EF7\u7684\uFF0C\u4F46\u5982\u679C\u4EE5\u540E\u91CD\u6784\u9700\u8981\u5C06\u53CC\u91CD\u65AD\u8A00\u8FDB\u884C\u5206\u89E3\uFF0C<code>unknown</code> \u5F62\u5F0F\u7684\u98CE\u9669\u66F4\u5C0F\uFF0C\u56E0\u4E3A <code>any</code> \u53EF\u4EE5\u9003\u8131\u7C7B\u578B\u7CFB\u7EDF\u7684\u675F\u7F1A\u5E76\u6269\u6563\u5176\u5B83\u5730\u65B9\uFF0C\u800C <code>unknown</code> \u8FD9\u6837\u505A\u5C31\u4F1A\u5BFC\u81F4\u9519\u8BEF\u3002</p><div class="tip custom-block"><p class="custom-block-title">\u63D0\u793A</p><p>\u987A\u5E26\u63D0\u4E00\u4E0B\uFF0C\u4F60\u53EF\u80FD\u4F1A\u770B\u5230\u4F7F\u7528 <code>object</code> \u6216 <code>{}</code> \u7C7B\u578B\u7684\u4EE3\u7801\uFF0C\u5B83\u4EEC\u7684\u4F5C\u7528\u4E0E\u8FD9\u91CC\u7684 <code>unknown</code> \u7C7B\u4F3C\uFF0C\u4E5F\u662F\u5E7F\u4E49\u7684\u7C7B\u578B\uFF0C\u4F46\u8303\u56F4\u6BD4 <code>unknown</code> \u8981\u7A0D\u5FAE\u7A84\u4E00\u4E9B\uFF1A</p><ul><li><code>{}</code> \u7C7B\u578B\u5305\u542B\u9664\u4E86 <code>null</code> \u548C <code>undefined</code> \u4E4B\u5916\u7684\u6240\u6709\u503C</li><li><code>object</code> \u7C7B\u578B\u5305\u542B\u6240\u6709 non-primitive \u503C\uFF0C\u4F8B\u5982\u5B83\u4E0D\u5305\u542B <code>11</code>, <code>true</code>, <code>&#39;foo&#39;</code>\uFF0C\u4F46\u662F\u5305\u542B\u6240\u6709\u5BF9\u8C61\u548C\u6570\u7EC4</li></ul><p>\u5728 <code>unknown</code> \u88AB\u5F15\u5165 TypeScript \u4E4B\u524D\uFF0C<code>{}</code> \u4F7F\u7528\u7684\u6BD4\u8F83\u591A\uFF0C\u4F46\u662F\u73B0\u5728\uFF0C\u4F60\u5E94\u8BE5\u4F7F\u7528 <code>unknown</code>\uFF0C\u9664\u975E\u4F60\u660E\u786E\u77E5\u9053\u8FD9\u4E2A\u503C\u4E0D\u53EF\u80FD\u662F <code>null</code> \u6216 <code>undefined</code>\u3002</p></div><h2 id="\u603B\u7ED3" tabindex="-1">\u603B\u7ED3 <a class="header-anchor" href="#\u603B\u7ED3" aria-hidden="true">#</a></h2><ul><li><code>unknown</code> \u662F <code>any</code> \u7C7B\u578B\u5B89\u5168\u7684\u66FF\u4EE3\u54C1\uFF0C\u5F53\u4F60\u4E0D\u786E\u5B9A\u67D0\u4E2A\u503C\u7684\u7C7B\u578B\u65F6\uFF0C\u5E94\u8BE5\u4F7F\u7528 <code>unknown</code>\u3002</li><li>\u4F7F\u7528 <code>unknown</code> \u53EF\u4EE5\u8FEB\u4F7F\u4F60\u7684\u7528\u6237\u4F7F\u7528\u7C7B\u578B\u65AD\u8A00\u6216\u5176\u5B83\u7C7B\u578B\u68C0\u67E5\u6765\u786E\u4FDD\u4EE3\u7801\u7684\u7C7B\u578B\u5B89\u5168\u3002</li></ul>`,31);function d(r,y,w,m,g,f){const s=c("PubDate");return l(),o("div",null,[u,e(s,{date:"2021/05/26"}),i])}var _=a(k,[["render",d]]);export{b as __pageData,_ as default};