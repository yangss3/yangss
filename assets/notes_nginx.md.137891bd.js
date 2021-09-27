import{o as n,c as e,a as s}from"./app.2ac769c5.js";const a='{"title":"Nginx 相关","description":"","frontmatter":{},"headers":[{"level":2,"title":"CentOS 环境安装 nginx","slug":"centos-环境安装-nginx"},{"level":2,"title":"安装依赖包","slug":"安装依赖包"},{"level":2,"title":"安装 nginx","slug":"安装-nginx"},{"level":2,"title":"常用命令","slug":"常用命令"},{"level":2,"title":"Web Server Configuration","slug":"web-server-configuration"},{"level":3,"title":"设置虚拟服务器（virtual server）","slug":"设置虚拟服务器（virtual-server）"},{"level":3,"title":"Configuring Locations","slug":"configuring-locations"},{"level":3,"title":"Location Priority","slug":"location-priority"},{"level":3,"title":"Using Variables","slug":"using-variables"},{"level":3,"title":"Returning Specific Status Codes","slug":"returning-specific-status-codes"},{"level":3,"title":"Rewriting URIs in Requests","slug":"rewriting-uris-in-requests"},{"level":3,"title":"Handling Errors","slug":"handling-errors"},{"level":2,"title":"Serving Static Content","slug":"serving-static-content"},{"level":3,"title":"Root Directory and Index Files","slug":"root-directory-and-index-files"},{"level":3,"title":"Trying Several Options","slug":"trying-several-options"},{"level":3,"title":"Optimizing Performance for Serving Content","slug":"optimizing-performance-for-serving-content"},{"level":3,"title":"Enabling tcp_nopush","slug":"enabling-tcp-nopush"},{"level":2,"title":"NGINX Reverse Proxy","slug":"nginx-reverse-proxy"},{"level":3,"title":"Passing a Request to a Proxied Server","slug":"passing-a-request-to-a-proxied-server"},{"level":3,"title":"Passing Request Headers","slug":"passing-request-headers"},{"level":3,"title":"Configuring Buffers","slug":"configuring-buffers"}],"relativePath":"notes/nginx.md","lastUpdated":1632755233785}',o={},c=[s('<h1 id="nginx-相关"><a class="header-anchor" href="#nginx-相关" aria-hidden="true">#</a> Nginx 相关</h1><h2 id="centos-环境安装-nginx"><a class="header-anchor" href="#centos-环境安装-nginx" aria-hidden="true">#</a> CentOS 环境安装 nginx</h2><blockquote><p>新机器推荐按<a href="http://nginx.org/en/docs/install.html" target="_blank" rel="noopener noreferrer">官网文档</a>的教程进行安装</p></blockquote><h2 id="安装依赖包"><a class="header-anchor" href="#安装依赖包" aria-hidden="true">#</a> 安装依赖包</h2><p>安装 <code>gcc</code> (一般服务器镜像都已安装)</p><div class="language-"><pre><code>yum -y install gcc\n</code></pre></div><p>安装 <code>pcre, zlib, openssl</code></p><div class="language-"><pre><code>yum install -y pcre pcre-devel\nyum install -y zlib zlib-devel\nyum install -y openssl openssl-devel\n</code></pre></div><h2 id="安装-nginx"><a class="header-anchor" href="#安装-nginx" aria-hidden="true">#</a> 安装 nginx</h2><p>下载 nginx <a href="http://nginx.org/en/download.html" target="_blank" rel="noopener noreferrer">安装包</a></p><div class="language-"><pre><code>wget http://nginx.org/download/nginx-1.17.8.tar.gz\n</code></pre></div><p>解压到 <code>/usr/local</code> 目录下</p><div class="language-bash"><pre><code><span class="token function">tar</span> -zxv -f nginx-1.17.8.tar.gz -C /usr/local\n</code></pre></div><p>进入解压后的目录</p><div class="language-bash"><pre><code><span class="token builtin class-name">cd</span> /usr/local/nginx-1.17.8\n\n<span class="token comment"># 执行下面三个命令</span>\n./configure\n<span class="token function">make</span>\n<span class="token function">make</span> <span class="token function">install</span>\n</code></pre></div><p>切换到 <code>/usr/local/nginx/sbin</code> 目录</p><div class="language-bash"><pre><code><span class="token builtin class-name">cd</span> /usr/local/nginx/sbin\n\n<span class="token comment"># 启动</span>\n./nginx\n\n<span class="token comment"># 或者配置软连接</span>\n<span class="token function">ln</span> -s /usr/local/nginx/sbin/nginx /usr/local/sbin\n</code></pre></div><p>访问服务器 ip，查看是否启动成功</p><h2 id="常用命令"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> 常用命令</h2><div class="language-bash"><pre><code>nginx -s reload <span class="token comment"># Reload the configuration file</span>\nnginx -s quit <span class="token comment"># Shut down gracefully</span>\nnginx -s stop <span class="token comment"># Shut down immediately (fast shutdown)</span>\nnginx -s reopen <span class="token comment"># Reopen log files</span>\n</code></pre></div><h2 id="web-server-configuration"><a class="header-anchor" href="#web-server-configuration" aria-hidden="true">#</a> Web Server Configuration</h2><h3 id="设置虚拟服务器（virtual-server）"><a class="header-anchor" href="#设置虚拟服务器（virtual-server）" aria-hidden="true">#</a> 设置虚拟服务器（virtual server）</h3><p>在 <code>http</code> 上下文中，通过 <code>server</code> 指令来定义一个虚拟服务器</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n    <span class="token comment"># Server configuration</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>也可以添加多个 <code>server</code> 块来定义多个虚拟服务器。</p><p><code>server</code> 配置块通常包含一个 <code>listen</code> 指令来指定服务器要监听的请求的 IP 地址和端口。支持 IPv4 和 IPv6 地址，且需要将 IPv6 地址括在方括号中。</p><p>例如一个监听 IP 地址为 127.0.0.1， 端口为 8080 的服务器配置块：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">listen</span> 127.0.0.1:8080</span><span class="token punctuation">;</span>\n  <span class="token comment"># Additional server configuration</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>如果省略端口，则使用标准端口。 同样，如果省略地址，则服务器将侦听所有地址。 如果根本不包含 <code>listen</code> 指令，则根据超级用户权限，“标准”端口为 <code>80/tcp</code>，“默认”端口为 <code>8000/tcp</code>。</p><p>如果有多个 <code>server</code> 块与同一个 IP 地址和端口的请求匹配，nginx 会使用 <code>server</code> 块中 <code>server_name</code> 指令的参数来测试请求的 <code>Host</code> 头字段。 <code>server_name</code> 指令的参数可以是完整名字、通配符（一个包含 <code>*</code> 字符的字符串）或者正则表达式。</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span>\n  <span class="token directive"><span class="token keyword">server_name</span> example.org www.example.org</span><span class="token punctuation">;</span>\n  <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>如果有多个 <code>server_name</code> 都与请求的 <code>Host</code> 头字段匹配，nginx 通过以下规则顺序来确定匹配哪一个：</p><ol><li>完整的名字</li><li>以 <code>*</code> 开头的最长的通配符，例如 <code>*.example.org</code></li><li>以 <code>*</code> 结尾的最长的通配符，例如 <code>mail.*</code></li><li>第一个匹配的正则表达式（以 <code>server</code> 块出现的顺序）</li></ol><p>如果请求的 <code>Host</code> 头字段不匹配任何一个 <code>server_name</code>，nginx 会将请求路由到请求到达的端口的默认服务器。除非你在 <code>listen</code> 指令中包含 <code>default_server</code> 参数来显示指定该 <code>server</code> 块为默认服务器，否者 <code>nginx.conf</code> 文件中的第一个 <code>server</code> 块为默认服务器。</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n  listen 80 default_server\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="configuring-locations"><a class="header-anchor" href="#configuring-locations" aria-hidden="true">#</a> Configuring Locations</h3><p>可以在 <code>server</code> 块中定义 <code>location</code> 块来处理具体的请求，例如将一些请求转发到某个代理服务器，再将一些请求转发到另外的代理服务器，然后对剩下的请求响应本地的静态文件。</p><p>nginx 使用请求的 URI 来测试所有 <code>location</code> 指令的参数，然后使用匹配的 <code>location</code> 块来处理该请求。在每个 <code>location</code> 块内，通常可以（有一些例外）放置更多的 <code>location</code> 指令，以进一步优化特定请求组的处理。</p><p><code>location</code> 指令有两种类型的参数：前缀字符串（pathname）和正则表达式。一个请求的 URI 要匹配一个前缀字符串，它必须要以该前缀字符串开头</p><p>例如下面具有前缀字符串参数的 <code>location</code> 块会匹配 URI 以 <code>/some/path/</code> 开头的请求，例如 <code>/some/path/document.html</code>:</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /some/path/</span> <span class="token punctuation">{</span>\n  <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>正则表达式参数通过 <code>~</code> （大小写敏感） 或 <code>~*</code> （大小写不敏感） 符号来指示，例如下面的 <code>location</code> 块匹配所有 URI 包含 <code>.html</code> 或 <code>.htm</code> 的请求：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> ~ \\.html?</span> <span class="token punctuation">{</span>\n  <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="location-priority"><a class="header-anchor" href="#location-priority" aria-hidden="true">#</a> Location Priority</h3><p>为了找到与请求的 URI 最匹配的 <code>location</code> 块，nginx 首先比较前缀字符串类型的 <code>location</code> 块，然后再去搜寻正则表达式类型的 <code>location</code> 块。</p><p>除非在前缀字符串前面使用了 <code>^~</code> 修饰符，否则正则表达式具有更高的优先级。nginx 确定最佳匹配的 <code>location</code> 块的逻辑如下：</p><ol><li>用 URI 检查所有前缀字符串</li><li><code>=</code> 修饰符定义了请求 URI 和前缀字符串的精确匹配，如果存在精确匹配，停止查找，该 <code>location</code> 块为最佳匹配</li><li>如果与 URI 匹配的最长的前缀字符串的前面存在 <code>^~</code> 修饰符，则跳过正则表达式的检查，该最长的前缀字符串为最佳匹配</li><li>保存匹配的最长前缀字符串</li><li>用 URI 测试正则表达式</li><li>当找到第一个匹配的正则表达式时，停止继续查找，该 <code>location</code> 块为最佳匹配</li><li>如果没有找到匹配的正则表达式，使用前面匹配的最长前缀字符串对应的 <code>location</code> 块</li></ol><p>关于 <code>=</code> 修饰符，一个典型的用法是针对 <code>/</code> 的请求。如果客户端会频繁发起 URI 为 <code>/</code> 的请求，为 <code>location</code> 块指定 <code>= /</code> 作为参数，可以加速请求的处理。因为 nginx 在第一次比较后就能确定最匹配的 <code>location</code> 块：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> = /</span> <span class="token punctuation">{</span>\n  <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>一个 <code>location</code> 块可以包含处理请求的指令，例如提供静态文件或者将请求转发到代理服务器。下面的例子中，匹配第一个 <code>location</code> 块的请求将会获取到本地系统 <code>/data</code> 目录下对应的文件，而匹配第二个 <code>location</code> 块的请求会被转发到域名为 <code>www.example.com</code> 的代理服务器:</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">location</span> /images/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">root</span> /data</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>\n    proxy_pass http://www.example.com\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p><code>root</code> 指令指定一个文件系统路径，指明从哪里去找要服务的文件，将与该 <code>location</code> 块匹配的请求的 URI 添加到 root 路径后面就得到要请求的文件的完整路径，例如在上面的例子中，要响应 URI 为 <code>/images/example.png</code> 的请求，nginx 需要提供路径为 <code>/data/images/example.png</code> 的文件。</p><p><code>proxy_pass</code> 指令会将请求转发到该指令参数指定的代理服务器上，来自代理服务器的响应会被发送回客户端。上面的例子中所有 URI 不以 <code>/images/</code> 开头的请求都将被转发到代理服务器。</p><h3 id="using-variables"><a class="header-anchor" href="#using-variables" aria-hidden="true">#</a> Using Variables</h3><p>在配置文件中使用变量，可以让 nginx 根据不用的情形处理不同的请求。变量可以用作指令的参数，它在运行时阶段被解析。变量名需要以 <code>$</code> 符号开头。变量根据 nginx 的状态定义信息，例如当前正在处理的请求的属性。</p><p>有很多已经定义好的变量，例如 <a href="https://nginx.org/en/docs/http/ngx_http_core_module.html?&amp;_ga=2.148382143.964290018.1595647568-1083603121.1582961132#variables" target="_blank" rel="noopener noreferrer">core HTTP</a> 变量，你可以使用 <code>set</code>，<code>map</code> 和 <code>geo</code> 指令定义自定义变量。 大多数变量是在运行时计算的，并且包含与特定请求有关的信息。 例如，<code>$remote_addr</code> 包含客户端 IP 地址，而 <code>$uri</code> 是当前请求的 URI 值。</p><h3 id="returning-specific-status-codes"><a class="header-anchor" href="#returning-specific-status-codes" aria-hidden="true">#</a> Returning Specific Status Codes</h3><p>某些网站 URI 要求立即返回带有特定错误或重定向代码的响应，例如当页面已临时或永久移动时。最简单的方法是使用 return 指令：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /wrong/url</span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">return</span> <span class="token number">404</span></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p><code>return</code> 指令的第一个参数是响应状态码。可选的第二个参数可以是重定向的 URL（用于代码 301、302、303 和 307），也可以是要在响应正文中返回的文本。例如：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /permanently/moved/url</span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">return</span> <span class="token number">301</span> http://www.example.com/moved/here</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p><code>return</code> 指令可以包含在 <code>location</code> 和 <code>server</code> 上下文中。</p><h3 id="rewriting-uris-in-requests"><a class="header-anchor" href="#rewriting-uris-in-requests" aria-hidden="true">#</a> Rewriting URIs in Requests</h3><p>在请求处理期间，可以使用 <code>rewrite</code> 指令对请求 URI 进行多次修改，该指令具有一个可选参数和两个必需参数。第一个参数（必需）是请求 URI 必须匹配的正则表达式。第二个参数是用于替换匹配 URI 的 URI。可选的第三个参数是一个标志，它可以停止其它 <code>rewrite</code> 指令的进一步处理或发送重定向（代码 301 或 302）。例如：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /users/</span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">rewrite</span> ^/users/(.*)$ /show?user=<span class="token variable">$1</span> break</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>如上例所示，第二个参数中的 <code>user</code> 通过匹配正则表达式来捕获。</p><p>您可以在 <code>server</code> 和 <code>location</code> 上下文中包含多个 <code>rewrite</code> 指令。nginx 会按指令的出现顺序依次执行它们。 一旦某个 <code>server</code> 上下文被选中后，该 <code>server</code> 上下文中的 <code>rewrite</code> 指令将被执行。</p><p>nginx 处理了一组 <code>rewrite</code> 指令后，它将根据新的 URI 选择 <code>location</code> 块。如果所选 <code>location</code> 块包含 <code>rewrite</code> 指令，则会依次执行它们，如果 URI 与任何一个都匹配，则在处理所有定义的 <code>rewrite</code> 指令之后，将开始对新的 <code>location</code> 进行搜索</p><p>以下示例展示了 <code>rewrite</code> 指令和 <code>return</code> 指令的组合:</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n    <span class="token comment">#...</span>\n    <span class="token directive"><span class="token keyword">rewrite</span> ^(/download/.*)/media/(\\w+)\\.?.*$ <span class="token variable">$1</span>/mp3/<span class="token variable">$2</span>.mp3 last</span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">rewrite</span> ^(/download/.*)/audio/(\\w+)\\.?.*$ <span class="token variable">$1</span>/mp3/<span class="token variable">$2</span>.ra  last</span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">return</span>  <span class="token number">403</span></span><span class="token punctuation">;</span>\n    <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>此示例配置区分两组 URI。例如诸如 <code>/download/some/media/file</code> 之类的 URI 被改写为 <code>/download/some/mp3/file.mp3</code>，由于 <code>last</code> 标志，后面的指令（第二个 <code>rewrite</code> 指令和 <code>return</code> 指令）会被跳过，但 nginx 回继续处理这个被重写了 URI 的请求。如果 URI 与任何一个 <code>rewrite</code> 指令都不匹配，则 nginx 会将 403 错误代码返回给客户端。</p><p>有两个参数可中断对 <code>rewrite</code> 指令的处理：</p><ul><li><code>last</code>: 停止执行当前 <code>server</code> 或 <code>location</code> 上下文中的 <code>rewrite</code> 指令，但是 nginx 将搜索与重写的 URI 匹配的 <code>location</code>，并且将应用新 <code>location</code> 中的 <code>rewrite</code> 指令（这意味着可以再次更改 URI）。</li><li><code>break</code>: 与 <code>break</code> 指令类似，在当前上下文中停止处理 <code>rewrite</code> 指令，并取消对与新 URI 匹配的 <code>location</code> 的搜索。不执行新 <code>location</code> 中的 <code>rewrite</code> 指令。</li></ul><h3 id="handling-errors"><a class="header-anchor" href="#handling-errors" aria-hidden="true">#</a> Handling Errors</h3><p>使用 <code>error_page</code> 指令，你可以配置 nginx 以返回自定义页面以及错误代码，在响应中替换不同的错误代码，或者将浏览器重定向到其他 URI。在下面的示例中，<code>error_page</code> 指令指定要返回的页面（<code>/404.html</code>），并带有 <code>404</code> 错误代码</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">error_page</span> <span class="token number">404</span> /404.html</span><span class="token punctuation">;</span>\n</code></pre></div><p>请注意，该指令并不意味着立即返回错误（<code>return</code> 指令可以立即返回），而只是指定错误发生时的处理方式。错误代码可能来自代理服务器，也可能发生在 nginx 处理过程中（例如，当 nginx 无法找到客户端请求的文件时，显示 <code>404</code> 错误）。</p><p>在以下示例中，当 nginx 无法找到页面时，它用代码 <code>301</code> 替换代码 <code>404</code>，并将客户端重定向到 <code>http://example.com/new/path.html</code>。 当客户端仍尝试使用其旧 URI 访问页面时，此配置很有用。 <code>301</code> 代码通知浏览器该页面已永久移动，并且需要在返回时自动用新地址替换旧地址：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /old/path.html</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">error_page</span> <span class="token number">404</span> =301 http://example.com/new/path.html</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>以下配置是在找不到文件时将请求传递到代理服务器的示例。由于在 <code>error_page</code> 指令中的等号后没有指定状态码，因此对客户端的响应具有代理服务器返回的状态码（不一定是 404）</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n    ...\n    <span class="token directive"><span class="token keyword">location</span> /images/</span> <span class="token punctuation">{</span>\n        <span class="token comment"># Set the root directory to search for the file</span>\n        <span class="token directive"><span class="token keyword">root</span> /data/www</span><span class="token punctuation">;</span>\n\n        <span class="token comment"># Disable logging of errors related to file existence</span>\n        <span class="token directive"><span class="token keyword">open_file_cache_errors</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>\n\n        <span class="token comment"># Make an internal redirect if the file is not found</span>\n        <span class="token directive"><span class="token keyword">error_page</span> <span class="token number">404</span> = /fetch<span class="token variable">$uri</span></span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token directive"><span class="token keyword">location</span> /fetch/</span> <span class="token punctuation">{</span>\n        <span class="token directive"><span class="token keyword">proxy_pass</span> http://backend/</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p><code>error_page</code> 指令指示 nginx 在找不到文件时进行内部重定向。 <code>error_page</code> 指令的最终参数中的 <code>$uri</code> 变量为当前请求的 URI，该 URI 在重定向中传递。</p><p>例如，如果未找到 <code>/images/some/file</code>，则将其替换为 <code>/fetch/images/some/file</code>，并开始对 <code>location</code> 进行新的搜索。 最终该请求匹配到第二个 <code>location</code> 块，并被代理到 <code>http://backend/</code>。</p><p><code>open_file_cache_errors</code> 指令可阻止在找不到文件时记录错误消息。由于丢失的文件已得到正确处理，因此此处没有必要记录错误信息。</p><h2 id="serving-static-content"><a class="header-anchor" href="#serving-static-content" aria-hidden="true">#</a> Serving Static Content</h2><h3 id="root-directory-and-index-files"><a class="header-anchor" href="#root-directory-and-index-files" aria-hidden="true">#</a> Root Directory and Index Files</h3><p><code>root</code> 指令指定用于搜索文件的根目录。为了获得请求文件的完整路径，nginx 将请求 URI 附加到 <code>root</code> 指令指定的路径上。<code>root</code> 指令可以位于 <code>http</code>, <code>server</code> 或 <code>location</code> 上下文中。在下面的例子中，<code>root</code> 指令定义在 <code>server</code> 块中，它会被应用到该 <code>server</code> 上下文中所有不包含 <code>root</code> 指令的 <code>location</code> 块：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n  <span class="token directive"><span class="token keyword">root</span> /www/data</span><span class="token punctuation">;</span>\n\n  <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>\n    <span class="token comment">#...</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token directive"><span class="token keyword">location</span> /images/</span> <span class="token punctuation">{</span>\n    <span class="token comment">#...</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token directive"><span class="token keyword">location</span> ~ \\.(mp3|mp4)</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">root</span> /www/media</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>这里，如果请求 URI 以 <code>/images/</code> 开头，nginx 会在 <code>/www/data/images/</code> 中查找对应的文件，但如果请求 URI 以 <code>.mp3</code> 或 <code>.mp4</code> 结尾，nginx 将会到 <code>/www/media/</code> 目录下去查找相应的文件，因为在匹配的 <code>location</code> 块中包含 <code>root</code> 指令，且改写了要查找的根目录。</p><p>如果请求以 <code>/</code> 结尾，则 nginx 将其视为对目录的请求，并尝试在目录中查找索引文件，<code>index</code> 指令定义了索引文件的名称（默认值为 <code>index.html</code>）。继续上面的示例，如果请求 URI 为<code>/images/some/path/</code>，则 nginx 会提供文件 <code>/www/data/images/some/path/index.html</code>（如果存在）。 如果该文件不存在，则默认情况下，nginx 返回 404 状态码（Not Found）。 要将 nginx 配置为返回自动生成的目录列表，可以在 <code>autoindex</code> 指令中包含 <code>on</code> 参数：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /images/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">autoindex</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>您可以在 <code>index</code> 指令中列出多个文件名。 nginx 按照指定的顺序搜索文件，并返回找到的第一个文件。</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">index</span> index.<span class="token variable">$geo</span>.html index.htm index.html</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>此处使用的 <code>$geo</code> 变量是通过 <code>geo</code> 指令设置的自定义变量。变量的值取决于客户端的 IP 地址。</p><p>为了返回索引文件，nginx 会将索引文件的名称附加到基本 URI 之后，然后对这个新的 URI 进行内部重定向。内部重定向会导致对 <code>location</code> 的新搜索，并且可能会在另一个 <code>location</code> 中结束，如以下示例所示：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">root</span> /data</span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">index</span> index.html index.php</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token directive"><span class="token keyword">location</span> ~ \\.php</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">fastcgi_pass</span> localhost:8000</span><span class="token punctuation">;</span>\n    <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>这里，如果请求的 URI 为 <code>/path/</code>，并且 <code>/data/path/index.html</code> 不存在，但 <code>/data/path/index.php</code> 存在，则对 <code>/path/index.php</code> 的内部重定向将匹配到第二个 <code>location</code>。 结果，该请求被代理。</p><h3 id="trying-several-options"><a class="header-anchor" href="#trying-several-options" aria-hidden="true">#</a> Trying Several Options</h3><p><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html?&amp;_ga=2.60795818.660262503.1596359668-1083603121.1582961132#try_files" target="_blank" rel="noopener noreferrer"><code>try_files</code></a> 指令可用于检查指定的文件或目录是否存在。nginx 会进行内部重定向，否则会返回指定的状态码。例如，要检查是否存在与请求 URI 对应的文件，请使用 <code>try_files</code> 指令和 <code>$uri</code> 变量，如下所示：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">root</span> /www/data</span><span class="token punctuation">;</span>\n\n    <span class="token directive"><span class="token keyword">location</span> /images/</span> <span class="token punctuation">{</span>\n        <span class="token directive"><span class="token keyword">try_files</span> <span class="token variable">$uri</span> /images/default.gif</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>该文件以 URI 的形式指定，该 URI 使用当前 <code>location</code> 或 <code>server</code> 上下文中设置的 <code>root</code> 或 <code>alias</code> 指令进行处理。 在上面的情况下，如果不存在与 <code>$uri</code> 对应的文件，则 nginx 将内部重定向到最后一个参数指定的 URI，并返回 <code>/www/data/images/default.gif</code>。</p><p>最后一个参数也可以是状态码（直接放在等号之后）或 <code>location</code> 块的名称。在下面的示例中，如果 <code>try_files</code> 指令的所有参数指定的路径都找不到对应的文件或目录，则返回 404 错误：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">try_files</span> <span class="token variable">$uri</span> <span class="token variable">$uri</span>/ <span class="token variable">$uri</span>.html =404</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>在下面的示例中，如果根据 <code>$uri</code> 或 <code>$uri/</code> 都找不到对应的文件或目录，则该请求将被重定向到指定的 <code>location</code> 块，该 <code>location</code> 块会将请求传递给代理服务器。</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">try_files</span> <span class="token variable">$uri</span> <span class="token variable">$uri</span>/ @backend</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token directive"><span class="token keyword">location</span> @backend</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://backend.example.com</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="optimizing-performance-for-serving-content"><a class="header-anchor" href="#optimizing-performance-for-serving-content" aria-hidden="true">#</a> Optimizing Performance for Serving Content</h3><h4 id="enabling-sendfile"><a class="header-anchor" href="#enabling-sendfile" aria-hidden="true">#</a> Enabling <code>sendfile</code></h4><p>默认情况下，nginx 会自行处理文件传输，并在发送文件之前将文件复制到缓冲区中。启用 <code>sendfile</code> 指令会去除将数据复制到缓冲区的步骤，并允许将数据从一个文件描述符直接复制到另一个文件描述符。另外，为防止一个快速连接完全占用工作进程，可以使用 <code>sendfile_max_chunk</code> 指令将单个 <code>sendfile()</code> 调用中传输的数据量限制为 1MB（在此示例中为 1 MB）：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /mp3</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">sendfile</span>           <span class="token boolean">on</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">sendfile_max_chunk</span> <span class="token number">1m</span></span><span class="token punctuation">;</span>\n    <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="enabling-tcp-nopush"><a class="header-anchor" href="#enabling-tcp-nopush" aria-hidden="true">#</a> Enabling <code>tcp_nopush</code></h3><p>将 <code>tcp_nopush</code> 指令与 <code>sendfile on</code> 指令一起使用。 这使 nginx 在 <code>sendfile()</code> 获得数据块之后立即在一个数据包中发送 HTTP 响应头：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /mp3</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">sendfile</span>   <span class="token boolean">on</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">tcp_nopush</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>\n    <span class="token comment">#...</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h2 id="nginx-reverse-proxy"><a class="header-anchor" href="#nginx-reverse-proxy" aria-hidden="true">#</a> NGINX Reverse Proxy</h2><h3 id="passing-a-request-to-a-proxied-server"><a class="header-anchor" href="#passing-a-request-to-a-proxied-server" aria-hidden="true">#</a> Passing a Request to a Proxied Server</h3><p>当 nginx 代理请求时，它将请求发送到指定的代理服务器，获取响应，然后将其发送回客户端。可以使用指定协议将请求代理到 HTTP 服务器（另一个 nginx 服务器或任何其他服务器）或非 HTTP 服务器（可以运行使用特定框架开发的应用程序，例如 PHP 或 Python）。 支持的协议包括 <code>FastCGI</code>，<code>uwsgi</code>，<code>SCGI</code> 和 <code>memcached</code>。</p><p>要将请求传递到 HTTP 代理服务器，必须在一个 <code>location</code> 块内使用 <code>proxy_pass</code> 指令， 例如：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /some/path/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://www.example.com/link/</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>下面的例子会将所有匹配到这个 <code>location</code> 块的请求转发到指定的代理服务器，转发的地址可以是一个域名或 IP 地址，同时也可以包含一个端口：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> ~ \\.php</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://127.0.0.1:8000</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>如果代理服务器的地址以一个 URI 结尾，nginx 会用该地址替换请求 URI 中与 <code>location</code> 参数匹配的部分。例如上面第一个例子中，代理服务器的地址以 <code>/link/</code> 结尾，那么对于 URI 为 <code>/some/path/page.html</code> 的请求，将会被代理到 <code>http://www.example.com/link/page.html</code>。如果 <code>proxy_pass</code> 指定的地址不包含 URI ，或者无法确定要替换的 URI 部分，则会传递完整的请求 URI。</p><p>要将请求传递到非 HTTP 代理服务器，应使用适当的 <code>**_ pass</code> 指令：</p><ul><li><code>fastcgi_pass</code> 传递请求到一个 FastCGI 服务器</li><li><code>uwsgi_pass</code> 传递请求到一个 uwsgi 服务器</li><li><code>scgi_pass</code> 传递请求到一个 SCGI 服务器</li><li><code>memcached_pass</code> 传递请求到一个 memcached 服务器</li></ul><h3 id="passing-request-headers"><a class="header-anchor" href="#passing-request-headers" aria-hidden="true">#</a> Passing Request Headers</h3><p>默认情况下，nginx 在代理请求中会重新定义两个头字段 &quot;Host&quot; 和 &quot;Connection&quot;，并去除其值为空字符串的头字段。默认 &quot;Host&quot; 设置为 <code>$proxy_host</code> 变量，&quot;Connection&quot; 设置为 <code>close</code>。</p><p>要更改这些设置以及修改其它头字段，请使用 <code>proxy_set_header</code> 指令。可以在 <code>location</code> 块中指定该指令。也可以在特定的 <code>server</code> 上下文或 <code>http</code> 块中指定它。例如：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /some/path/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:8000</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>在这个配置中，头字段 &quot;Host&quot; 被设置为 <code>$host</code> 变量.</p><p>若要阻止某个头字段传递到代理服务器，请将其设置为空字符串：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /some/path/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_set_header</span> Accept-Encoding <span class="token string">&quot;&quot;</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:8000</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><h3 id="configuring-buffers"><a class="header-anchor" href="#configuring-buffers" aria-hidden="true">#</a> Configuring Buffers</h3><p>默认情况下，nginx 缓冲来自代理服务器的响应。响应存储在内部缓冲区中，直到接收到整个响应后才发送给客户端。 缓冲有助于优化客户端的性能，如果将响应从 nginx 同步传递到客户端，则这可能会浪费代理服务器的时间。但是，如果启用缓冲后，nginx 允许代理服务器快速处理响应，而 nginx 将响应存储的时间与客户端下载响应所需的时间一样长。</p><p>负责启用和禁用缓冲的指令是 <code>proxy_buffering</code>。 默认情况下，它设置为 <code>on</code> 即启用了缓冲。</p><p><code>proxy_buffers</code> 指令控制为请求分配的缓冲区的大小和数量。来自代理服务器的响应的第一部分存储在单独的缓冲区中，缓冲区的大小由 <code>proxy_buffer_size</code> 指令设置。这部分通常包含一个相对较小的响应头，并且可以使其小于其余响应的缓冲区。</p><p>在下面的示例中，增加了默认缓冲区数，并使响应第一部分的缓冲区大小小于默认值。</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /some/path/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_buffers</span> <span class="token number">16</span> <span class="token number">4k</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">proxy_buffer_size</span> <span class="token number">2k</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:8000</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>如果禁用了缓冲，则 nginx 会将从代理服务器接收到的响应同步发送到客户端。对于需要尽快开始接收响应的快速交互客户端，此行为可能是理想的。</p><p>要在特定 <code>location</code> 中禁用缓冲，请 <code>location</code> 中将 <code>proxy_buffering</code> 设置为 <code>off</code>，如下：</p><div class="language-nginx"><pre><code><span class="token directive"><span class="token keyword">location</span> /some/path/</span> <span class="token punctuation">{</span>\n    <span class="token directive"><span class="token keyword">proxy_buffering</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>\n    <span class="token directive"><span class="token keyword">proxy_pass</span> http://localhost:8000</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>在这种情况下，nginx 仅使用 <code>proxy_buffer_size</code> 配置的缓冲区来存储响应的当前部分。</p>',139)];o.render=function(s,a,o,t,p,i){return n(),e("div",null,c)};export{a as __pageData,o as default};