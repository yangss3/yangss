import{_ as a,c as t,b as e,d as s,e as p,a as o,r as c,o as r}from"./app.ace6221f.js";const _='{"title":"\u5999\u7528 switch(true)","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F7F\u7528 switch(true) \u5339\u914D\u8868\u8FBE\u5F0F","slug":"\u4F7F\u7528-switch-true-\u5339\u914D\u8868\u8FBE\u5F0F"},{"level":2,"title":"\u4E3A\u4EC0\u4E48\u8FD9\u5F88\u6709\u7528","slug":"\u4E3A\u4EC0\u4E48\u8FD9\u5F88\u6709\u7528"}],"relativePath":"articles/switch-true-pattern.md"}',l={},u=s("h1",{id:"\u5999\u7528-switch-true",tabindex:"-1"},[p("\u5999\u7528 switch(true) "),s("a",{class:"header-anchor",href:"#\u5999\u7528-switch-true","aria-hidden":"true"},"#")],-1),k=o(`<p>\u5728\u9700\u8981\u8FDB\u884C\u591A\u5206\u652F\u9009\u62E9\u65F6\uFF0C\u6211\u4EEC\u7ECF\u5E38\u4F7F\u7528 <code>switch</code> \u8BED\u53E5\u3002\u5927\u591A\u6570\u60C5\u51B5\u4E0B\uFF0C\u6211\u4EEC\u7684\u5339\u914D\u6761\u4EF6 (<code>case</code> \u5B50\u53E5) \u90FD\u662F\u4E00\u4E2A\u5E38\u91CF\u503C\u3002\u4F46\u5176\u5B9E\uFF0C<code>case</code> \u540E\u9762\u8FD8\u53EF\u4EE5\u662F\u4E00\u4E2A\u4EFB\u610F\u8868\u8FBE\u5F0F\uFF0C\u8FD9\u5728\u67D0\u4E9B\u573A\u666F\u4E0B\u4F1A\u975E\u5E38\u6709\u7528\u3002</p><h2 id="\u4F7F\u7528-switch-true-\u5339\u914D\u8868\u8FBE\u5F0F" tabindex="-1">\u4F7F\u7528 <code>switch(true)</code> \u5339\u914D\u8868\u8FBE\u5F0F <a class="header-anchor" href="#\u4F7F\u7528-switch-true-\u5339\u914D\u8868\u8FBE\u5F0F" aria-hidden="true">#</a></h2><p><code>switch</code> \u8BED\u53E5\u4E0D\u4EC5\u5339\u914D\u503C\u8FD8\u53EF\u4EE5\u5339\u914D\u8868\u8FBE\u5F0F\u3002<code>case</code> \u5B50\u53E5\u4E2D\u7684\u8868\u8FBE\u5F0F\u5C06\u5728\u5339\u914D\u524D\u88AB\u8BA1\u7B97\uFF0C\u5982\u679C\u8868\u8FBE\u5F0F\u7684\u7ED3\u679C\u4E0E <code>switch</code> \u540E\u9762\u7684\u503C\u76F8\u7B49\uFF0C\u5B83\u5C06\u88AB\u5339\u914D\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">switch</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">case</span> <span class="token number">1</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">===</span> <span class="token number">2</span><span class="token operator">:</span>
    <span class="token comment">// case \u8868\u8FBE\u5F0F\u7684\u7ED3\u679C\u4E3A true, \u8FD9\u91CC\u7684\u4F1A\u88AB\u6267\u884C</span>
    <span class="token comment">// ...</span>
    <span class="token keyword">break</span>
  <span class="token keyword">default</span><span class="token operator">:</span>
    <span class="token comment">// \u8FD9\u91CC\u4E0D\u4F1A\u88AB\u6267\u884C</span>
    <span class="token keyword">break</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="\u4E3A\u4EC0\u4E48\u8FD9\u5F88\u6709\u7528" tabindex="-1">\u4E3A\u4EC0\u4E48\u8FD9\u5F88\u6709\u7528 <a class="header-anchor" href="#\u4E3A\u4EC0\u4E48\u8FD9\u5F88\u6709\u7528" aria-hidden="true">#</a></h2><p>\u8FD9\u79CD\u6A21\u5F0F\u53EF\u4EE5\u5728\u5F88\u591A\u573A\u666F\u4E0B\u4F7F\u7528\uFF0C\u7528\u6765\u53D6\u4EE3\u590D\u6742\u7684 <code>if/else</code> \u8BED\u53E5\u3002\u4E00\u4E2A\u5E38\u89C1\u573A\u666F\u662F\u6570\u636E\u6821\u9A8C\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;Nicholas Yang&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token string">&quot;yss_2016@outlook.com&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">number</span><span class="token operator">:</span> <span class="token string">&quot;00447123456789&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>user<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User must be defined.&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>user<span class="token punctuation">.</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s name must be defined&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> user<span class="token punctuation">.</span>name <span class="token operator">!==</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s name must be a string&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment">// ...\u66F4\u591A\u6821\u9A8C\u8BED\u53E5</span>

<span class="token keyword">return</span> user
</code></pre></div><p>\u5F53\u6821\u9A8C\u6761\u4EF6\u5F88\u591A\u65F6\uFF0C\u8FD9\u79CD\u5199\u6CD5\u770B\u8D77\u6765\u5F88\u4E0D\u7B80\u6D01\u548C\u76F4\u89C2\uFF0C\u4F46\u5982\u679C\u7528 <code>switch(true)</code> \u6A21\u5F0F\u6765\u91CD\u5199\uFF0C\u5C31\u4F1A\u7F8E\u89C2\u5F88\u591A:</p><div class="language-js"><pre><code><span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;Nicholas Yang&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token string">&quot;yss_2016@outlook.com&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">number</span><span class="token operator">:</span> <span class="token string">&quot;00447123456789&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">switch</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">case</span> <span class="token operator">!</span>user<span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User must be defined.&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">case</span> <span class="token operator">!</span>user<span class="token punctuation">.</span>name<span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s name must be defined&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">case</span> <span class="token keyword">typeof</span> user<span class="token punctuation">.</span>name <span class="token operator">!==</span> <span class="token string">&quot;string&quot;</span><span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s name must be a string&quot;</span><span class="token punctuation">)</span>
  <span class="token comment">// ...more validations</span>
  <span class="token keyword">default</span><span class="token operator">:</span>
    <span class="token keyword">return</span> user
<span class="token punctuation">}</span>
</code></pre></div><p>\u8FD8\u53EF\u4EE5\u5C06\u6821\u9A8C\u6807\u51C6\u62BD\u8C61\u6210\u51FD\u6570\uFF0C\u4EE5\u63D0\u9AD8\u53EF\u8BFB\u6027\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">switch</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">case</span> <span class="token operator">!</span><span class="token function">isDefined</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User must be defined.&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">case</span> <span class="token operator">!</span><span class="token function">isString</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s name must be a string&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">case</span> <span class="token operator">!</span><span class="token function">isValidEmail</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>email<span class="token punctuation">)</span><span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s email address must be a valid email address&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">case</span> <span class="token operator">!</span><span class="token function">isValidPhoneNumber</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>number<span class="token punctuation">)</span><span class="token operator">:</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;User&#39;s phone number must be a valid phone number&quot;</span><span class="token punctuation">)</span>
  <span class="token comment">// ...more validations</span>
  <span class="token keyword">default</span><span class="token operator">:</span>
    <span class="token keyword">return</span> user
<span class="token punctuation">}</span>
</code></pre></div><p>\u5728\u8FD9\u79CD\u573A\u666F\u4E0B\uFF0C\u6211\u4E2A\u4EBA\u66F4\u63A8\u8350\u4F7F\u7528 <code>switch(true)</code> \u7684\u5199\u6CD5\u3002</p>`,12);function i(d,w,m,y,h,g){const n=c("PubDate");return r(),t("div",null,[u,e(n,{date:"2021/12/25"}),k])}var b=a(l,[["render",i]]);export{_ as __pageData,b as default};
