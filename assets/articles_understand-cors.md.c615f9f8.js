import{_ as n,c as a,b as o,d as e,e as t,a as c,r as p,o as l}from"./app.ace6221f.js";const v='{"title":"\u6DF1\u5165\u7406\u89E3 CORS","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4E3A\u4EC0\u4E48\u9700\u8981 CORS","slug":"\u4E3A\u4EC0\u4E48\u9700\u8981-cors"},{"level":2,"title":"\u5B89\u5168\u8BF7\u6C42","slug":"\u5B89\u5168\u8BF7\u6C42"},{"level":2,"title":"\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42","slug":"\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42"},{"level":2,"title":"\u51ED\u636E (Credentials)","slug":"\u51ED\u636E-credentials"},{"level":2,"title":"\u603B\u7ED3","slug":"\u603B\u7ED3"}],"relativePath":"articles/understand-cors.md"}',d={},i=e("h1",{id:"\u6DF1\u5165\u7406\u89E3-cors",tabindex:"-1"},[t("\u6DF1\u5165\u7406\u89E3 CORS "),e("a",{class:"header-anchor",href:"#\u6DF1\u5165\u7406\u89E3-cors","aria-hidden":"true"},"#")],-1),r=c(`<p>\u8DE8\u6E90\u8D44\u6E90\u5171\u4EAB\uFF08Cross Origin Resource Sharing\uFF09\u7B80\u79F0 CORS\uFF0C\u662F\u4E00\u79CD\u57FA\u4E8E HTTP \u5934\u7684\u5B89\u5168\u673A\u5236\uFF0C\u5B83\u5141\u8BB8\u670D\u52A1\u5668\u6307\u5B9A\u9664\u5176\u81EA\u8EAB\u4EE5\u5916\u7684\u4EFB\u4F55\u6E90 Origin (protocol/domain/port)\uFF0C\u5E76\u8BA9\u6D4F\u89C8\u5668\u5141\u8BB8\u4ECE\u8FD9\u4E9B\u6E90\u52A0\u8F7D\u8D44\u6E90\u3002</p><h2 id="\u4E3A\u4EC0\u4E48\u9700\u8981-cors" tabindex="-1">\u4E3A\u4EC0\u4E48\u9700\u8981 CORS <a class="header-anchor" href="#\u4E3A\u4EC0\u4E48\u9700\u8981-cors" aria-hidden="true">#</a></h2><p>\u51FA\u4E8E\u5B89\u5168\u8003\u8651\uFF0C\u4E00\u822C\u60C5\u51B5\u4E0B\uFF0C\u6D4F\u89C8\u5668\u662F\u4E0D\u5141\u8BB8\u8DE8\u6E90\u8BF7\u6C42 (cross-origin request) \u7684\uFF0C\u5373\u6765\u81EA <code>https://domain-a.com</code> \u7684\u5BA2\u6237\u7AEF\u4EE3\u7801\u65E0\u6CD5\u5BF9 <code>https://domain-b.com</code> \u7684\u8D44\u6E90\u53D1\u8D77\u7F51\u7EDC\u8BF7\u6C42 (\u901A\u8FC7 <code>XMLHttpRequest</code> \u6216 <code>Fetch</code> API)\uFF0C\u8FD9\u6837\u53EF\u4EE5\u4FDD\u62A4\u7AD9\u70B9\u514D\u53D7\u9ED1\u5BA2\u653B\u51FB\u3002</p><p>\u4F46\u662F\uFF0C\u968F\u7740 web \u5E94\u7528\u53D8\u5F97\u8D8A\u6765\u8D8A\u590D\u6742\uFF0C\u8DE8\u6E90\u8BF7\u6C42\u662F\u5F88\u5E38\u89C1\u7684\u9700\u6C42\u3002\u4E3A\u4E86\u7A81\u7834\u6D4F\u89C8\u5668\u7684\u9650\u5236\uFF0C\u65E9\u671F\u51FA\u73B0\u4E86\u5F88\u591A\u8DE8\u57DF\u7684\u65B9\u6848\uFF0C\u6700\u5E38\u89C1\u7684\u5C31\u662F JSONP (JSON with padding)\u3002</p><p>JSONP \u5229\u7528\u4E86 <code>&lt;script&gt;</code> \u6807\u7B7E\u7684 <code>src</code> \u53EF\u4EE5\u662F\u4EFB\u4F55\u6E90 (origin)\uFF0C\u5373\u5B83\u53EF\u4EE5\u6267\u884C\u6765\u81EA\u4EFB\u4F55\u7F51\u7AD9\u7684\u811A\u672C\u7684\u7279\u70B9\uFF0C\u6765\u5B9E\u73B0\u8DE8\u6E90\u8D44\u6E90\u5171\u4EAB\u3002</p><p>\u5047\u8BBE\u6211\u4EEC\u7684\u7AD9\u70B9 <code>https://my-website.com</code> \u9700\u8981\u4ECE <code>https://weather.com</code> \u83B7\u53D6\u5929\u6C14\u6570\u636E\uFF0C\u53EF\u4EE5\u8FD9\u6837\u505A\uFF1A</p><ol><li>\u9996\u5148\uFF0C\u6211\u4EEC\u4E8B\u5148\u58F0\u660E\u4E00\u4E2A\u5168\u5C40\u51FD\u6570\u6765\u63A5\u53D7\u6570\u636E\uFF0C\u4F8B\u5982 <code>getWeather</code>\uFF1A<div class="language-js"><pre><code><span class="token comment">// \u5B9A\u4E49\u4E00\u4E2A\u5168\u5C40\u51FD\u6570\u7528\u4E8E\u5904\u7406\u5929\u6C14\u6570\u636E</span>
<span class="token keyword">function</span> <span class="token function">getWeather</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> temperature<span class="token punctuation">,</span> humidity <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">temperature: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>temperature<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, humidity: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>humidity<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre></div></li><li>\u7136\u540E\uFF0C\u6211\u4EEC\u521B\u5EFA\u4E00\u4E2A <code>&lt;script&gt;</code> \u6807\u7B7E\uFF0C \u5E76\u8BBE\u7F6E <code>src=&quot;http://weather.com/?callback=getWeather&quot;</code>\uFF0C\u4F7F\u7528\u6211\u4EEC\u9884\u5148\u5B9A\u4E49\u597D\u7684\u51FD\u6570\u540D\u5B9A\u4E49\u4E00\u4E2A URL \u53C2\u6570 <code>callback</code>\uFF1A<div class="language-js"><pre><code><span class="token keyword">const</span> script <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">&#39;script&#39;</span><span class="token punctuation">)</span>
script<span class="token punctuation">.</span>src <span class="token operator">=</span> <span class="token string">&#39;http://weather.com/?callback=getWeather&#39;</span>
document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>script<span class="token punctuation">)</span>
</code></pre></div></li><li>\u8FDC\u7A0B\u670D\u52A1\u5668 <code>weather.com</code> \u5728\u63A5\u6536\u5230\u8FD9\u4E2A\u8BF7\u6C42\u540E\uFF0C\u52A8\u6001\u5730\u751F\u6210\u4E00\u4E2A\u811A\u672C\uFF0C\u811A\u672C\u5185\u90E8\u4F7F\u7528\u5B83\u60F3\u8BA9\u6211\u4EEC\u63A5\u6536\u7684\u6570\u636E\u8C03\u7528 <code>getWeather(...)</code>\uFF1A<div class="language-js"><pre><code><span class="token comment">// weather.com \u8FD4\u56DE\u7684\u811A\u672C\u5185\u5BB9\u7C7B\u4F3C\u8FD9\u6837:</span>
<span class="token function">getWeather</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">temperature</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span>
  <span class="token literal-property property">humidity</span><span class="token operator">:</span> <span class="token number">78</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div></li><li>\u5F53\u6211\u4EEC\u7684\u7AD9\u70B9\u52A0\u8F7D\u5E76\u6267\u884C\u54CD\u5E94\u56DE\u6765\u7684\u811A\u672C\u65F6\uFF0C<code>getWeather</code> \u5C31\u4F1A\u8FD0\u884C\uFF0C\u56E0\u4E3A\u8FD9\u662F\u6211\u4EEC\u9884\u5148\u5B9A\u4E49\u597D\u7684\u5168\u5C40\u51FD\u6570\uFF0C\u6240\u4EE5\u6211\u4EEC\u5C31\u62FF\u5230\u4E86\u6570\u636E\u3002</li></ol><p>\u8FD9\u79CD\u65B9\u6CD5\u662F\u53EF\u884C\u7684\uFF0C\u800C\u4E14\u4E0D\u8FDD\u53CD\u6D4F\u89C8\u5668\u7684\u5B89\u5168\u7B56\u7565\uFF0C\u56E0\u4E3A\u8FD9\u6837\u505A\u7684\u524D\u63D0\u662F\u53CC\u65B9\u90FD\u540C\u610F\u4EE5\u8FD9\u79CD\u65B9\u5F0F\u4F20\u9012\u6570\u636E\uFF0C\u6240\u4EE5\u8FD9\u7EDD\u4E0D\u662F\u4E00\u4E2A\u9ED1\u5BA2\u3002\u73B0\u5728\u4ECD\u7136\u6709\u63D0\u4F9B\u8FD9\u79CD\u8BBF\u95EE\u7684\u670D\u52A1\uFF0C\u56E0\u4E3A\u5B83\u652F\u6301\u975E\u5E38\u53E4\u8001\u7684\u6D4F\u89C8\u5668\u7248\u672C\u3002</p><p>\u4F46\u662F JSONP \u4E5F\u6709\u5F88\u591A\u7F3A\u70B9\uFF0C\u4F8B\u5982\u53EA\u80FD\u884C\u8FDB GET \u8BF7\u6C42\uFF0C\u65E0\u6CD5\u5904\u7406\u9519\u8BEF\u7B49\u7B49\u3002\u4E3A\u4E86\u80FD\u5B89\u5168\u6709\u6548\u7684\u89E3\u51B3\u8FD9\u4E9B\u95EE\u9898\uFF0CCORS \u51FA\u73B0\u4E86\uFF0C\u5B83\u5141\u8BB8\u5728\u6EE1\u8DB3\u7279\u5B9A\u6761\u4EF6\u7684\u60C5\u51B5\u4E0B\uFF0C\u901A\u8FC7 <code>XMLHttpRequest</code> \u6216 <code>Fetch</code> API \u8FDB\u884C\u8DE8\u6E90\u8BF7\u6C42\u3002</p><h2 id="\u5B89\u5168\u8BF7\u6C42" tabindex="-1">\u5B89\u5168\u8BF7\u6C42 <a class="header-anchor" href="#\u5B89\u5168\u8BF7\u6C42" aria-hidden="true">#</a></h2><p>\u603B\u7684\u6765\u8BF4\uFF0C\u8DE8\u6E90\u8BF7\u6C42 (cross-origin request) \u53EF\u4EE5\u5206\u4E3A\u4E24\u7C7B\uFF1A</p><ol><li>\u5168\u5B89\u8BF7\u6C42</li><li>\u5176\u5B83\u6240\u6709\u8BF7\u6C42</li></ol><p>\u4EC0\u4E48\u662F\u5B89\u5168\u8BF7\u6C42 (safe request) \uFF1F\u5982\u679C\u4E00\u4E2A\u8BF7\u6C42\u540C\u65F6\u6EE1\u8DB3\u4E0B\u9762\u4E24\u4E2A\u6761\u4EF6\uFF0C\u6211\u4EEC\u79F0\u5B83\u662F\u5B89\u5168\u7684\uFF1A</p><ol><li>\u8BF7\u6C42\u65B9\u6CD5\u662F GET, POST, HEAD \u4E4B\u4E00</li><li>\u53EA\u80FD\u5305\u542B\u5982\u4E0B\u7684\u81EA\u5B9A\u4E49\u8BF7\u6C42\u5934\uFF1A <ul><li><code>Accept</code></li><li><code>Accept-Language</code></li><li><code>Content-Language</code></li><li><code>Content-Type</code>\uFF0C\u4E14\u503C\u53EA\u80FD\u662F <code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code>, <code>text/plain</code> \u4E4B\u4E00</li></ul></li></ol><p>\u4EFB\u4F55\u4E0D\u6EE1\u8DB3\u8FD9\u4E24\u4E2A\u6761\u4EF6\u7684\u8BF7\u6C42\u90FD\u88AB\u8BA4\u4E3A\u662F\u4E0D\u5B89\u5168\u7684\u3002</p><p>\u5176\u672C\u8D28\u533A\u522B\u5728\u4E8E\uFF0C\u5B89\u5168\u8BF7\u6C42\u53EF\u4EE5\u7528 <code>&lt;form&gt;</code> \u6216 <code>&lt;script&gt;</code> \u6765\u5B9E\u73B0\uFF0C\u4E0D\u9700\u8981\u7528\u5230\u4EFB\u4F55\u7279\u6B8A\u65B9\u6CD5\u3002\u6240\u4EE5\u4E00\u4E2A\u53E4\u8001\u7684\u670D\u52A1\u5668\u4E5F\u53EF\u4EE5\u5904\u7406\u5B89\u5168\u8BF7\u6C42\u3002</p><p>\u4E0E\u6B64\u76F8\u53CD\uFF0C\u5E26\u6709\u975E\u6807\u51C6\u5934\u7684\u8BF7\u6C42\u6216\u4F8B\u5982 DELETE \u8BF7\u6C42\u90FD\u4E0D\u80FD\u7528\u8FD9\u79CD\u65B9\u5F0F\u521B\u5EFA\u3002\u5F88\u957F\u65F6\u95F4\u4EE5\u6765\uFF0CJavaScript \u90FD\u4E0D\u80FD\u53D1\u9001\u8FD9\u6837\u7684\u8BF7\u6C42\u3002\u56E0\u6B64\uFF0C\u4E00\u4E2A\u53E4\u8001\u7684\u670D\u52A1\u5668\u53EF\u80FD\u4F1A\u8BA4\u4E3A\u8FD9\u6837\u7684\u8BF7\u6C42\u6765\u81EA\u4E8E\u4E00\u4E2A\u6709\u7279\u6743\u7684\u6765\u6E90\uFF0C\u56E0\u4E3A\u5B83\u8BA4\u4E3A\u7F51\u9875\u662F\u65E0\u6CD5\u53D1\u9001\u8FD9\u4E9B\u8BF7\u6C42\u7684\u3002</p><p>\u5F53\u6211\u4EEC\u8BD5\u56FE\u53D1\u9001\u4E00\u4E2A\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u65F6\uFF0C\u6D4F\u89C8\u5668\u4F1A\u5148\u53D1\u9001\u4E00\u4E2A\u7279\u6B8A\u7684 &quot;\u9884\u68C0&quot; (preflight) \u8BF7\u6C42\u6765\u8BE2\u95EE\u670D\u52A1\u5668\u662F\u5426\u540C\u610F\u63A5\u53D7\u8FD9\u79CD\u8DE8\u6E90\u8BF7\u6C42\uFF1F\u9664\u975E\u670D\u52A1\u5668\u54CD\u5E94\u660E\u786E\u7684 CORS \u5934\u4FE1\u606F\u8FDB\u884C\u786E\u8BA4\uFF0C\u5426\u5219\u6D4F\u89C8\u5668\u4E0D\u4F1A\u53D1\u9001\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u3002</p><p>\u5982\u679C\u4E00\u4E2A\u8BF7\u6C42\u662F\u8DE8\u6E90\u7684 (cross-origin)\uFF0C\u6D4F\u89C8\u5668\u4F1A\u7ED9\u5B83\u52A0\u4E0A <code>Origin</code> \u5934\uFF0C\u4F8B\u5982\uFF0C\u5982\u679C\u6211\u4EEC\u4ECE <code>https://website-a.com/page</code> \u53D1\u8D77\u8BF7\u6C42 <code>https://website-b.com/request</code>\uFF0C\u8BF7\u6C42\u5934\u5C06\u662F\u8FD9\u6837\uFF1A</p><div class="language-http"><pre><code>GET /request
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">website-b.com</span></span>
<span class="token header"><span class="token header-name keyword">Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
...
</code></pre></div><p>\u670D\u52A1\u5668\u4F1A\u68C0\u67E5 <code>Origin</code> \u5934\u4FE1\u606F\uFF0C\u5982\u679C\u5B83\u540C\u610F\u63A5\u53D7\u8FD9\u6837\u7684\u8BF7\u6C42\uFF0C\u5C31\u5728\u54CD\u5E94\u4E2D\u6DFB\u52A0\u4E00\u4E2A\u7279\u6B8A\u7684\u5934<code>Access-Control-Allow-Origin</code>\u3002\u8BE5\u54CD\u5E94\u5934\u5E94\u5305\u542B\u5141\u8BB8\u7684\u6E90 (origin)\uFF0C\u5728\u6211\u4EEC\u7684\u4F8B\u5B50\u4E2D\u662F <code>https://website-a.com</code> \uFF0C\u6216\u8005\u4E00\u4E2A\u661F\u53F7 <code>*</code>\uFF0C\u90A3\u4E48\u8BF7\u6C42\u5C31\u4F1A\u6210\u529F\uFF0C\u5426\u5219\u5C06\u629B\u51FA\u9519\u8BEF\u3002</p><p>\u6D4F\u89C8\u5668\u5728\u8FD9\u4E2A\u8FC7\u7A0B\u79CD\u626E\u6F14\u7C7B\u4F3C\u8C03\u89E3\u4EBA\u7684\u89D2\u8272\uFF1A</p><ol><li>\u5B83\u786E\u4FDD\u8DE8\u6E90\u8BF7\u6C42\u53D1\u9001\u6B63\u786E\u7684 <code>Origin</code> \u5934\u3002</li><li>\u5B83\u68C0\u67E5\u54CD\u5E94\u5934 <code>Access-Control-Allow-Origin</code> \u4E2D\u662F\u5426\u5305\u542B\u8BF7\u6C42\u6E90\uFF0C\u5982\u679C\u5B83\u5B58\u5728\uFF0C\u5219\u5141\u8BB8 JavaScript \u8BBF\u95EE\u54CD\u5E94 (response)\uFF0C\u5426\u5219\u629B\u51FA\u9519\u8BEF\u3002</li></ol><p>\u4E0B\u9762\u662F\u4E00\u4E2A\u6210\u529F\u7684\u670D\u52A1\u7AEF\u54CD\u5E94\u5934\uFF1A</p><div class="language-http"><pre><code>200 OK
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span><span class="token header-value">text/html; charset=UTF-8</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
</code></pre></div><p>\u5BF9\u4E8E\u8DE8\u6E90\u8BF7\u6C42\uFF0C\u9ED8\u8BA4\u60C5\u51B5\u4E0B\u53EA\u5141\u8BB8 JavaScript \u8BBF\u95EE\u201C\u5B89\u5168\u201D\u7684\u54CD\u5E94\u5934\uFF1A</p><ul><li><code>Cache-Control</code></li><li><code>Content-Language</code></li><li><code>Content-Type</code></li><li><code>Expires</code></li><li><code>Last-Modified</code></li><li><code>Pragma</code></li></ul><p>\u9664\u6B64\u4E4B\u5916\uFF0C\u8BBF\u95EE\u4EFB\u4F55\u5176\u5B83\u54CD\u5E94\u5934\u90FD\u4F1A\u62A5\u9519\u3002</p><p>\u8981\u6388\u4E88 JavaScript \u5BF9\u5176\u4ED6\u54CD\u5E94\u5934\u7684\u8BBF\u95EE\u6743\uFF0C\u670D\u52A1\u5668\u5FC5\u987B\u53D1\u9001<code>Access-Control-Expose-Headers</code> \u5934\uFF0C\u5E76\u5728\u5176\u4E2D\u6307\u660E\u4EE5\u9017\u53F7\u5206\u9694\u7684\u4E0D\u5B89\u5168\u5934\u540D\u79F0\u5217\u8868\u3002\u4F8B\u5982\uFF1A</p><div class="language-http"><pre><code>200 OK
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span><span class="token header-value">text/html; charset=UTF-8</span></span>
<span class="token header"><span class="token header-name keyword">Content-Length</span><span class="token punctuation">:</span> <span class="token header-value">12345</span></span>
<span class="token header"><span class="token header-name keyword">API-Key</span><span class="token punctuation">:</span> <span class="token header-value">2c9de507f2c54aa1</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Expose-Headers</span><span class="token punctuation">:</span> <span class="token header-value">Content-Length,API-Key</span></span>
</code></pre></div><p>\u6709\u4E86\u8FD9\u6837\u7684 <code>Access-Control-Expose-Headers</code> \u54CD\u5E94\u5934\uFF0CJavaScript \u811A\u672C\u5C31\u53EF\u4EE5\u8BFB\u53D6\u54CD\u5E94\u4E2D\u7684 <code>Content-Length</code> \u548C <code>API-Key</code> \u5934\u3002</p><h2 id="\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42" tabindex="-1">\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42 <a class="header-anchor" href="#\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42" aria-hidden="true">#</a></h2><p>\u8BF7\u6C42\u65B9\u6CD5\u9664\u4E86 <code>GET</code>\uFF0C<code>Post</code>, \u8FD8\u53EF\u4EE5\u662F <code>PATCH</code>\uFF0C<code>DELETE</code> \u7B49\u7B49\u3002\u5728\u8FC7\u53BB\uFF0C\u662F\u65E0\u6CD5\u901A\u8FC7\u7F51\u9875\u53D1\u9001\u8FD9\u79CD\u8BF7\u6C42\u7684\uFF0C\u6240\u4EE5\u4E00\u4E9B\u53E4\u8001\u7684 web \u670D\u52A1\u5668\u5728\u63A5\u6536\u5230\u8FD9\u79CD\u8BF7\u6C42\u65F6\uFF0C\u5B83\u4EEC\u4F1A\u8BA4\u4E3A\uFF1A\u8FD9\u4E00\u5B9A\u4E0D\u662F\u6765\u81EA\u6D4F\u89C8\u5668\u3002\u4E3A\u4E86\u907F\u514D\u8FD9\u79CD\u8BEF\u89E3\uFF0C\u5BF9\u4E8E\u8FD9\u4E9B\u201C\u4E0D\u5B89\u5168\u201D\u7684\u8BF7\u6C42\uFF0C\u6D4F\u89C8\u5668\u4E0D\u4F1A\u7ACB\u523B\u5C06\u5176\u76F4\u63A5\u53D1\u9001\u7ED9\u670D\u52A1\u5668\uFF0C\u800C\u662F\u5148\u53D1\u9001\u4E00\u4E2A\u201C\u9884\u68C0\u201D (preflight) \u8BF7\u6C42\uFF0C\u5411\u670D\u52A1\u5668\u8BE2\u95EE\u6743\u9650\u3002</p><p>\u9884\u68C0\u8BF7\u6C42\u901A\u8FC7 <code>OPTIONS</code> \u65B9\u6CD5\u53D1\u9001\uFF0C\u4E14\u4E0D\u643A\u5E26 body\uFF0C\u53EA\u5305\u542B\u4E09\u4E2A\u8BF7\u6C42\u5934\uFF1A</p><ul><li><code>Access-Control-Request-Method</code>\uFF1A\u6307\u660E\u4E0D\u5B89\u5168\u8BF7\u6C42\u7684\u65B9\u6CD5</li><li><code>Access-Control-Request-Headers</code>\uFF1A\u9017\u53F7\u5206\u9694\u7684\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u5934\u5217\u8868</li><li><code>Origin</code>\uFF1A\u8BF7\u6C42\u6E90\uFF0C\u6307\u660E\u4E0D\u5B89\u5168\u8BF7\u6C42\u6765\u81EA\u54EA\u91CC</li></ul><p>\u5982\u679C\u670D\u52A1\u5668\u540C\u610F\u670D\u52A1\u8FD9\u4E2A\u8BF7\u6C42\uFF0C\u5B83\u5E94\u8BE5\u54CD\u5E94\u7A7A\u7684body\uFF0C200 \u72B6\u6001\u7801\u548C\u5982\u4E0B\u54CD\u5E94\u5934\uFF1A</p><ul><li><code>Access-Control-Allow-Origin</code>\uFF1A\u5141\u8BB8\u7684\u8BF7\u6C42\u6E90\uFF0C\u4F8B\u5982 <code>https://website-a.com</code>, \u6216\u662F\u4E00\u4E2A\u661F\u53F7 <code>*</code> \u8868\u660E\u5141\u8BB8\u4EFB\u4F55\u6E90</li><li><code>Access-Control-Allow-Methods</code>\uFF1A\u5141\u8BB8\u7684\u8BF7\u6C42\u65B9\u6CD5</li><li><code>Access-Control-Allow-Headers</code>\uFF1A\u5141\u8BB8\u7684\u8BF7\u6C42\u5934</li><li><code>Access-Control-Max-Age</code>\uFF1A\u53EF\u4EE5\u6307\u5B9A\u4E00\u4E2A\u7F13\u5B58\u6743\u9650\u7684\u65F6\u95F4\u957F\u5EA6 (\u79D2\u6570)\u3002\u8FD9\u6837\uFF0C\u6D4F\u89C8\u5668\u5C31\u4E0D\u5FC5\u4E3A\u6EE1\u8DB3\u7ED9\u5B9A\u6743\u9650\u7684\u540E\u7EED\u8BF7\u6C42\u53D1\u9001\u9884\u68C0\u3002</li></ul><p>\u4E0B\u9762\u4EE5\u4E00\u4E2A\u8DE8\u6E90\u7684 <code>PATCH</code> \u8BF7\u6C42\u4E3A\u4F8B\uFF0C\u770B\u770B\u5B83\u662F\u5982\u4F55\u4E00\u6B65\u6B65\u5DE5\u4F5C\u7684\uFF1A</p><div class="language-js"><pre><code><span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">&#39;https://website-b.com/request&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">&#39;PATCH&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">headers</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&#39;Content-Type&#39;</span><span class="token operator">:</span> <span class="token string">&#39;application/json&#39;</span><span class="token punctuation">,</span>
    <span class="token string-property property">&#39;API-Key&#39;</span><span class="token operator">:</span> <span class="token string">&#39;secret&#39;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><p>\u6709\u4E09\u4E2A\u539F\u56E0\u5BFC\u81F4\u8BE5\u8BF7\u6C42\u4E0D\u5B89\u5168\uFF08\u53EA\u8981\u4E00\u4E2A\u5C31\u591F\u4E86\uFF09:</p><ul><li>\u8BF7\u6C42\u65B9\u6CD5 <code>PATCH</code></li><li><code>Content-Type</code> \u4E0D\u662F <code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code>, <code>text/plain</code> \u4E4B\u4E00</li><li>\u4E0D\u5B89\u5168\u7684 <code>API-Key</code> \u5934</li></ul><p><strong>\u7B2C\u4E00\u6B65\uFF1A\u6D4F\u89C8\u5668\u53D1\u9001\u9884\u68C0\u8BF7\u6C42</strong></p><p>\u5728\u53D1\u9001\u771F\u6B63\u7684\u8BF7\u6C42\u4E4B\u524D\uFF0C\u6D4F\u89C8\u5668\u4F1A\u5148\u53D1\u9001\u4E00\u4E2A <code>OPTIONS</code> \u9884\u68C0\u8BF7\u6C42\uFF0C\u8BF7\u6C42\u5934\u5982\u4E0B\uFF1A</p><div class="language-http"><pre><code>OPTIONS /request
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">website-b.com</span></span>
<span class="token header"><span class="token header-name keyword">Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Request-Method</span><span class="token punctuation">:</span> <span class="token header-value">PATCH</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Request-Headers</span><span class="token punctuation">:</span> <span class="token header-value">Content-Type,API-Key</span></span>
</code></pre></div><ul><li>\u8BF7\u6C42\u65B9\u6CD5\uFF1A<code>OPTIONS</code></li><li>\u8BF7\u6C42\u8DEF\u5F84\uFF1A<code>/request</code></li><li>\u8DE8\u6E90\u7684\u7279\u6B8A\u7684\u8BF7\u6C42\u5934\uFF1A <ul><li><code>Origin</code>\uFF1A\u8BF7\u6C42\u6E90</li><li><code>Access-Control-Request-Method</code>\uFF1A\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u65B9\u6CD5</li><li><code>Access-Control-Request-Headers</code>\uFF1A\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u5934\u5217\u8868</li></ul></li></ul><p><strong>\u7B2C\u4E8C\u6B65\uFF1A\u670D\u52A1\u5668\u54CD\u5E94\u9884\u68C0\u8BF7\u6C42</strong></p><p>\u670D\u52A1\u5668\u4EE5\u72B6\u6001\u7801 200 \u53D1\u9001\u5982\u4E0B\u54CD\u5E94\u5934\uFF1A</p><div class="language-http"><pre><code>200 OK
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com/page</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Methods</span><span class="token punctuation">:</span> <span class="token header-value">PATCH</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Headers</span><span class="token punctuation">:</span> <span class="token header-value">Content-Type,API-Key</span></span>
</code></pre></div><p>\u8FD9\u610F\u5473\u7740\u670D\u52A1\u5668\u5141\u8BB8\u540E\u9762\u7684 <code>PATCH</code> \u8BF7\u6C42\u3002</p><p>\u5982\u679C\u670D\u52A1\u5668\u5141\u8BB8\u540E\u9762\u6709\u5176\u5B83\u65B9\u6CD5\u7684\u8BF7\u6C42 (<code>PUT</code>, <code>DELETE</code> \u7B49)\u6216\u53EF\u643A\u5E26\u5176\u5B83\u5934\u4FE1\u606F\uFF0C\u53EF\u4EE5\u63D0\u524D\u5141\u8BB8\u5B83\u4EEC\uFF0C\u53EA\u8981\u5C06\u5B83\u4EEC\u6DFB\u52A0\u5230\u5217\u8868\u4E2D\u5373\u53EF\uFF0C\u4F8B\u5982\uFF1A</p><div class="language-"><pre><code>200 OK
Access-Control-Allow-Origin: https://website-a.com/page
Access-Control-Allow-Methods: PUT,PATCH,DELETE
Access-Control-Allow-Headers: API-Key,Content-Type,If-Modified-Since,Cache-Control
Access-Control-Max-Age: 86400
</code></pre></div><p>\u6D4F\u89C8\u5668\u62FF\u5230\u9884\u68C0\u54CD\u5E94\u540E\uFF0C\u770B\u5230 <code>PATCH</code> \u5728 <code>Access-Control-Allow-Methods</code> \u4E2D\uFF0C<code>Content-Type</code>\uFF0C<code>API-Key</code> \u5728 <code>Access-Control-Allow-Headers</code> \u5217\u8868\u4E2D\uFF0C\u6240\u4EE5\u5B83\u53D1\u51FA\u4E86\u4E3B\u8BF7\u6C42\u3002</p><p>\u54CD\u5E94\u5934\u4E2D\u5982\u679C\u6709\u5E26\u79D2\u6570\u7684 <code>Access-Control-Max-Age</code>\uFF0C\u90A3\u4E48\u8BE5\u9884\u68C0\u7684\u6743\u9650\u5C31\u4F1A\u88AB\u7F13\u5B58\u7ED9\u5B9A\u7684\u65F6\u95F4\u3002\u4F8B\u5982\u4E0A\u9762\u7684\u54CD\u5E94\u5C06\u88AB\u7F13\u5B58 86400 \u79D2 (\u4E00\u5929)\u3002\u5728\u8FD9\u4E2A\u65F6\u95F4\u8303\u56F4\u5185\uFF0C\u540E\u7EED\u6EE1\u8DB3\u6761\u4EF6\u7684\u8BF7\u6C42\u5C06\u4E0D\u4F1A\u89E6\u53D1\u9884\u68C0\uFF0C\u800C\u662F\u88AB\u76F4\u63A5\u53D1\u9001\u3002</p><p><strong>\u7B2C\u4E09\u6B65\uFF1A\u6D4F\u89C8\u5668\u53D1\u9001\u4E3B\u8BF7\u6C42</strong></p><p>\u5F53\u9884\u68C0\u8BF7\u6C42\u6210\u529F\u540E\uFF0C\u6D4F\u89C8\u5668\u4F1A\u8FDB\u884C\u4E3B\u8BF7\u6C42\u3002\u8FD9\u91CC\u7684\u8FC7\u7A0B\u4E0E\u5B89\u5168\u8BF7\u6C42\u7684\u8FC7\u7A0B\u662F\u4E00\u6837\u7684\uFF1A</p><div class="language-http"><pre><code>PATCH /request
<span class="token header"><span class="token header-name keyword">Host</span><span class="token punctuation">:</span> <span class="token header-value">website-b.com</span></span>
<span class="token header"><span class="token header-name keyword">Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
<span class="token header"><span class="token header-name keyword">Content-Type</span><span class="token punctuation">:</span> <span class="token header-value">application/json</span></span>
<span class="token header"><span class="token header-name keyword">API-Key</span><span class="token punctuation">:</span> <span class="token header-value">secret</span></span>
</code></pre></div><p><strong>\u7B2C\u56DB\u6B65\uFF1A\u670D\u52A1\u5668\u54CD\u5E94\u4E3B\u8BF7\u6C42</strong></p><p>\u670D\u52A1\u5668\u5728\u4E3B\u54CD\u5E94\u4E2D\u9700\u8981\u6DFB\u52A0 <code>Access-Control-Allow-Origin</code>\uFF1A</p><div class="language-http"><pre><code><span class="token header"><span class="token header-name keyword">Access-Control-Allow-Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
</code></pre></div><p>\u8FD9\u6837\uFF0CJavaScript \u624D\u53EF\u4EE5\u8BBF\u95EE\u5230\u4E3B\u8BF7\u6C42\u7684\u54CD\u5E94\u3002</p><div class="tip custom-block"><p class="custom-block-title">\u6CE8\u610F</p><p>\u9884\u68C0\u8BF7\u6C42\u53D1\u751F\u5728 &quot;\u5E55\u540E&quot;\uFF0C\u5B83\u5BF9 JavaScript \u662F\u4E0D\u53EF\u89C1\u7684\u3002JavaScript \u53EA\u80FD\u8BBF\u95EE\u5BF9\u4E3B\u8BF7\u6C42\u7684\u54CD\u5E94\uFF0C\u5982\u679C\u6CA1\u6709\u5F97\u5230\u670D\u52A1\u5668\u7684\u8BB8\u53EF\uFF0C\u5219\u4F1A\u629B\u51FA\u4E00\u4E2A\u9519\u8BEF\u3002</p></div><h2 id="\u51ED\u636E-credentials" tabindex="-1">\u51ED\u636E (Credentials) <a class="header-anchor" href="#\u51ED\u636E-credentials" aria-hidden="true">#</a></h2><p>\u901A\u5E38\u60C5\u51B5\u4E0B\uFF0C\u5BF9 <code>http://website-b.com</code> \u7684\u53D1\u8D77\u7684\u8BF7\u6C42\u4F1A\u643A\u5E26\u8BE5\u57DF\u7684\u6240\u6709 cookies\u3002\u4F46\u7531 JavaScript \u53D1\u51FA\u7684\u8DE8\u6E90\u8BF7\u6C42\u662F\u4E00\u4E2A\u4F8B\u5916\u3002\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0C\u7531 JavaScript \u53D1\u8D77\u7684\u8DE8\u6E90\u8BF7\u6C42\u4E0D\u4F1A\u643A\u5E26\u4EFB\u4F55 <em>credentials</em> (cookies \u6216 HTTP authentication)\u3002</p><p>\u4F8B\u5982\uFF0C<code>fetch(&#39;http://website-b.com&#39;)</code> \u4E0D\u4F1A\u53D1\u9001\u4EFB\u4F55 cookie\uFF0C\u5373\u4F7F\u5B83\u662F\u5C5E\u4E8E <code>website-b.com</code> \u57DF\u540D\u7684 cookie\u3002</p><p>\u4E3A\u4EC0\u4E48\uFF1F</p><p>\u8FD9\u662F\u56E0\u4E3A\u643A\u5E26 <em>credentials</em> \u7684\u8BF7\u6C42\u6BD4\u6CA1\u6709\u643A\u5E26\u7684\u8BF7\u6C42\u8981&quot;\u5F3A\u5927&quot;\u5F97\u591A\u3002\u5982\u679C\u5141\u8BB8\u643A\u5E26 <em>credentials</em>\uFF0C\u8FD9\u76F8\u5F53\u4E8E\u6388\u4E88 JavaScript \u7528\u6237\u7684\u6743\u9650\uFF0C\u5E76\u53EF\u4EE5\u4F7F\u7528\u4ED6\u4EEC\u7684 <em>credentials</em> \u8BBF\u95EE\u654F\u611F\u4FE1\u606F\u3002</p><p>\u670D\u52A1\u5668\u771F\u7684\u8FD9\u4E48\u4FE1\u4EFB\u8FD9\u4E2A\u811A\u672C\u5417\uFF1F\u6240\u4EE5\uFF0C\u5B83\u5FC5\u987B\u9644\u52A0\u4E00\u4E2A\u5934\u4FE1\u606F\u4EE5\u660E\u786E\u5730\u6307\u660E\u662F\u5426\u5141\u8BB8\u5E26\u6709 <em>credentials</em> \u7684\u8BF7\u6C42\u3002</p><p>\u4E3A\u4E86\u5728 fetch \u4E2D\u53D1\u9001 <em>credentials</em>\uFF0C\u6211\u4EEC\u9700\u8981\u6307\u5B9A <code>credentials: &#39;include&#39;</code>\uFF0C\u50CF\u8FD9\u6837\uFF1A</p><div class="language-js"><pre><code><span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">&#39;http://website-b.com&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">credentials</span><span class="token operator">:</span> <span class="token string">&#39;include&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><p>\u73B0\u5728\uFF0Cfetch \u5C06\u6765\u81EA <code>website-b.com</code> \u7684 cookie \u4E0E\u8BF7\u6C42\u4E00\u8D77\u53D1\u9001\u5230\u8BE5\u7F51\u7AD9\u3002</p><p>\u5982\u679C\u670D\u52A1\u5668\u540C\u610F\u63A5\u53D7\u5E26\u6709 <em>credentials</em> \u7684\u8BF7\u6C42\uFF0C\u90A3\u4E48\u9664\u4E86 <code> Access-Control-Allow-Credentials: true</code> \u4E4B\u5916\uFF0C\u5B83\u8FD8\u5E94\u8BE5\u5728\u54CD\u5E94\u4E2D\u6DFB\u52A0\u4E00\u4E2A <code>Access-Control-Allow-Origin</code> \u5934\u3002\u4F8B\u5982\uFF1A</p><div class="language-http"><pre><code>200 OK
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Origin</span><span class="token punctuation">:</span> <span class="token header-value">https://website-a.com</span></span>
<span class="token header"><span class="token header-name keyword">Access-Control-Allow-Credentials</span><span class="token punctuation">:</span> <span class="token header-value">true</span></span>
</code></pre></div><p>\u8BF7\u6CE8\u610F\uFF1A<code>Access-Control-Allow-Origin</code> \u7981\u6B62\u5BF9\u5E26\u6709 <em>credentials</em> \u7684\u8BF7\u6C42\u4F7F\u7528\u661F\u53F7 <code>*</code>\u3002\u5C31\u50CF\u4E0A\u9762\u663E\u793A\u7684\u90A3\u6837\uFF0C\u800C\u662F\u5FC5\u987B\u63D0\u4F9B\u51C6\u786E\u7684\u6765\u6E90\u3002\u8FD9\u662F\u4E00\u4E2A\u989D\u5916\u7684\u5B89\u5168\u63AA\u65BD\uFF0C\u4EE5\u786E\u4FDD\u670D\u52A1\u5668\u771F\u6B63\u77E5\u9053\u662F\u8C01\u53D1\u8D77\u7684\u8FD9\u4E2A\u8BF7\u6C42\u3002</p><h2 id="\u603B\u7ED3" tabindex="-1">\u603B\u7ED3 <a class="header-anchor" href="#\u603B\u7ED3" aria-hidden="true">#</a></h2><ul><li>\u4ECE\u6D4F\u89C8\u5668\u7684\u89D2\u5EA6\uFF0C\u8DE8\u6E90\u8BF7\u6C42\u5206\u4E3A\u4E24\u79CD\uFF1A\u5B89\u5168\u8BF7\u6C42\u548C\u4E0D\u5B89\u5168\u8BF7\u6C42\u3002</li><li>\u5B89\u5168\u8BF7\u6C42\u5FC5\u987B\u6EE1\u8DB3\u4E24\u4E2A\u7279\u5B9A\u6761\u4EF6\uFF1A <ul><li>\u8BF7\u6C42\u65B9\u6CD5\u53EA\u80FD\u662F GET\uFF0CPOST\uFF0CHEAD</li><li>\u53EA\u80FD\u8BBE\u7F6E\u4EE5\u4E0B\u8BF7\u6C42\u5934 <ul><li><code>Accept</code></li><li><code>Accept-Language</code></li><li><code>Content-Language</code></li><li><code>Content-Type</code> \u53EA\u80FD\u662F <code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code>, <code>text/plain</code> \u4E4B\u4E00</li></ul></li></ul></li><li>\u5B89\u5168\u8BF7\u6C42\u548C\u4E0D\u5B89\u5168\u8BF7\u6C42\u7684\u672C\u8D28\u533A\u522B\u662F\uFF1A\u5B89\u5168\u7684\u8BF7\u6C42\u53EF\u4EE5\u901A\u8FC7 <code>&lt;form&gt;</code> \u6216 <code>&lt;script&gt;</code> \u6807\u7B7E\u6765\u5B9E\u73B0\uFF0C\u8FD9\u4E5F\u662F\u65E9\u671F\u6D4F\u89C8\u5668\u53D1\u9001\u8DE8\u6E90\u8BF7\u6C42\u7684\u65B9\u5F0F\u3002\u800C\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u5728\u5F88\u957F\u4E00\u6BB5\u65F6\u95F4\u5185\uFF0C\u6D4F\u89C8\u5668\u662F\u65E0\u6CD5\u53D1\u9001\u7684\u3002</li><li>\u5B89\u5168\u8BF7\u6C42\u4F1A\u88AB\u6D4F\u89C8\u5668\u76F4\u63A5\u53D1\u9001\uFF1A <ul><li>--&gt; \u6D4F\u89C8\u5668\u52A0\u4E0A <code>Origin</code> \u5934\u4FE1\u606F\uFF0C\u7136\u540E\u53D1\u9001\u7ED9\u670D\u52A1\u5668</li><li>&lt;-- \u5BF9\u4E8E\u6CA1\u6709\u643A\u5E26 credentials \u7684\u8BF7\u6C42\uFF0C\u670D\u52A1\u5668\u8BBE\u7F6E\u5982\u4E0B\u54CD\u5E94\u5934: <ul><li><code>Access-Control-Allow-Origin</code> \u4E3A <code>*</code> \u6216 \u4E0E <code>Origin</code> \u76F8\u540C\u7684\u503C</li></ul></li><li>&lt;-- \u5BF9\u4E8E\u643A\u5E26\u4E86 credentials \u7684\u8BF7\u6C42\uFF0C\u670D\u52A1\u5668\u8BBE\u7F6E\u5982\u4E0B\u54CD\u5E94\u5934\uFF1A <ul><li><code>Access-Control-Allow-Origin</code> \u4E3A\u4E0E <code>Origin</code> \u76F8\u540C\u7684\u503C</li><li><code>Access-Control-Allow-Credentials</code> \u4E3A true</li></ul></li></ul></li><li>\u82E5\u8981\u6388\u6743 JavaScript \u8BBF\u95EE\u9664\u4E86 <code>Cache-Control</code>, <code>Content-Language</code>, <code>Content-Type</code>, <code>Expires</code>, <code>Last-Modified</code>\uFF0C<code>Pragma</code> \u4E4B\u5916\u7684\u54CD\u5E94\u5934\uFF0C\u670D\u52A1\u5668\u5E94\u8BE5\u8BBE\u7F6E <code>Access-Control-Expose-Headers</code> \u5934\uFF0C\u5E76\u5C06\u5141\u8BB8\u8BBF\u95EE\u7684\u5934\u5B57\u6BB5\u5217\u5165\u5176\u4E2D</li><li>\u5BF9\u4E8E\u4E0D\u5B89\u5168\u8BF7\u6C42\uFF0C\u6D4F\u89C8\u5668\u4F1A\u5148\u53D1\u8D77\u4E00\u4E2A\u9884\u68C0\u8BF7\u6C42\u8BE2\u95EE\u670D\u52A1\u5668\u7684\u8BBF\u95EE\u6743\u9650\uFF1A <ul><li>--&gt; \u6D4F\u89C8\u5668\u53D1\u9001 <code>OPTIONS</code> \u8BF7\u6C42\u5230\u76F8\u540C\u7684\u8BF7\u6C42\u5730\u5740\uFF0C\u5E76\u643A\u5E26\u5982\u4E0B\u8BF7\u6C42\u5934\uFF1A <ul><li><code>Access-Control-Request-Method</code>\uFF1A\u4E0D\u5B89\u5168\u8BF7\u6C42\u65B9\u6CD5</li><li><code>Access-Control-Request-Headers</code>\uFF1A\u4E0D\u5B89\u5168\u7684\u8BF7\u6C42\u5934\u5217\u8868</li></ul></li><li>&lt;-- \u670D\u52A1\u5668\u54CD\u5E94 200 \u72B6\u6001\u7801\u4EE5\u53CA\u5982\u4E0B\u54CD\u5E94\u5934\uFF1A <ul><li><code>Access-Control-Allow-Methods</code>\uFF1A\u5141\u8BB8\u7684\u4E0D\u5B89\u5168\u8BF7\u6C42\u65B9\u6CD5\u5217\u8868</li><li><code>Access-Control-Allow-Headers</code>\uFF1A\u5141\u8BB8\u7684\u4E0D\u5B89\u5168\u8BF7\u6C42\u5934\u5217\u8868</li><li><code>Access-Control-Max-Age</code>\uFF1A\u8BE5\u6743\u9650\u7684\u7F13\u5B58\u65F6\u957F</li></ul></li><li>\u7136\u540E\u6D4F\u89C8\u5668\u53D1\u9001\u5B9E\u9645\u7684\u8BF7\u6C42\uFF0C\u8FC7\u7A0B\u540C\u5B89\u5168\u8BF7\u6C42\u4E00\u6837\u3002</li></ul></li></ul>`,75);function u(k,h,g,m,A,C){const s=p("PubDate");return l(),a("div",null,[i,o(s,{date:"2021/10/22"}),r])}var y=n(d,[["render",u]]);export{v as __pageData,y as default};