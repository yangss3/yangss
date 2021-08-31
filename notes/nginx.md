# CentOS 环境安装 nginx

> 新机器推荐按[官网文档](http://nginx.org/en/docs/install.html)的教程进行安装

## 安装依赖包

安装 `gcc` (一般服务器镜像都已安装)

```
yum -y install gcc
```

安装 `pcre, zlib, openssl`

```
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel
```

## 安装 nginx

下载 nginx [安装包](http://nginx.org/en/download.html)

```
wget http://nginx.org/download/nginx-1.17.8.tar.gz
```

解压到 `/usr/local` 目录下

```bash
tar -zxv -f nginx-1.17.8.tar.gz -C /usr/local
```

进入解压后的目录

```bash
cd /usr/local/nginx-1.17.8

# 执行下面三个命令
./configure
make
make install
```

切换到 `/usr/local/nginx/sbin` 目录

```bash
cd /usr/local/nginx/sbin

# 启动
./nginx

# 或者配置软连接
ln -s /usr/local/nginx/sbin/nginx /usr/local/sbin
```

访问服务器 ip，查看是否启动成功

## 常用命令

```bash
nginx -s reload # Reload the configuration file
nginx -s quit # Shut down gracefully
nginx -s stop # Shut down immediately (fast shutdown)
nginx -s reopen # Reopen log files
```

## Web Server Configuration

### 设置虚拟服务器（virtual server）

在 `http` 上下文中，通过 `server` 指令来定义一个虚拟服务器

```nginx
http {
  server {
    # Server configuration
  }
}
```

也可以添加多个 `server` 块来定义多个虚拟服务器。

`server` 配置块通常包含一个 `listen` 指令来指定服务器要监听的请求的 IP 地址和端口。支持 IPv4 和 IPv6 地址，且需要将 IPv6 地址括在方括号中。

例如一个监听 IP 地址为 127.0.0.1， 端口为 8080 的服务器配置块：

```nginx
server {
  listen 127.0.0.1:8080;
  # Additional server configuration
}
```

如果省略端口，则使用标准端口。 同样，如果省略地址，则服务器将侦听所有地址。 如果根本不包含 `listen` 指令，则根据超级用户权限，“标准”端口为 `80/tcp`，“默认”端口为 `8000/tcp`。

如果有多个 `server` 块与同一个 IP 地址和端口的请求匹配，nginx 会使用 `server` 块中 `server_name` 指令的参数来测试请求的 `Host` 头字段。 `server_name` 指令的参数可以是完整名字、通配符（一个包含 `*` 字符的字符串）或者正则表达式。

```nginx
server {
  listen 80;
  server_name example.org www.example.org;
  #...
}
```

如果有多个 `server_name` 都与请求的 `Host` 头字段匹配，nginx 通过以下规则顺序来确定匹配哪一个：

1. 完整的名字
2. 以 `*` 开头的最长的通配符，例如 `*.example.org`
3. 以 `*` 结尾的最长的通配符，例如 `mail.*`
4. 第一个匹配的正则表达式（以 `server` 块出现的顺序）

如果请求的 `Host` 头字段不匹配任何一个 `server_name`，nginx 会将请求路由到请求到达的端口的默认服务器。除非你在 `listen` 指令中包含 `default_server` 参数来显示指定该 `server` 块为默认服务器，否者 `nginx.conf` 文件中的第一个 `server` 块为默认服务器。

```nginx
server {
  listen 80 default_server
}
```

### Configuring Locations

可以在 `server` 块中定义 `location` 块来处理具体的请求，例如将一些请求转发到某个代理服务器，再将一些请求转发到另外的代理服务器，然后对剩下的请求响应本地的静态文件。

nginx 使用请求的 URI 来测试所有 `location` 指令的参数，然后使用匹配的 `location` 块来处理该请求。在每个 `location` 块内，通常可以（有一些例外）放置更多的 `location` 指令，以进一步优化特定请求组的处理。

`location` 指令有两种类型的参数：前缀字符串（pathname）和正则表达式。一个请求的 URI 要匹配一个前缀字符串，它必须要以该前缀字符串开头

例如下面具有前缀字符串参数的 `location` 块会匹配 URI 以 `/some/path/` 开头的请求，例如 `/some/path/document.html`:

```nginx
location /some/path/ {
  #...
}
```

正则表达式参数通过 `~` （大小写敏感） 或 `~*` （大小写不敏感） 符号来指示，例如下面的 `location` 块匹配所有 URI 包含 `.html` 或 `.htm` 的请求：

```nginx
location ~ \.html? {
  #...
}
```

### Location Priority

为了找到与请求的 URI 最匹配的 `location` 块，nginx 首先比较前缀字符串类型的 `location` 块，然后再去搜寻正则表达式类型的 `location` 块。

除非在前缀字符串前面使用了 `^~` 修饰符，否则正则表达式具有更高的优先级。nginx 确定最佳匹配的 `location` 块的逻辑如下：

1. 用 URI 检查所有前缀字符串
2. `=` 修饰符定义了请求 URI 和前缀字符串的精确匹配，如果存在精确匹配，停止查找，该 `location` 块为最佳匹配
3. 如果与 URI 匹配的最长的前缀字符串的前面存在 `^~` 修饰符，则跳过正则表达式的检查，该最长的前缀字符串为最佳匹配
4. 保存匹配的最长前缀字符串
5. 用 URI 测试正则表达式
6. 当找到第一个匹配的正则表达式时，停止继续查找，该 `location` 块为最佳匹配
7. 如果没有找到匹配的正则表达式，使用前面匹配的最长前缀字符串对应的 `location` 块

关于 `=` 修饰符，一个典型的用法是针对 `/` 的请求。如果客户端会频繁发起 URI 为 `/` 的请求，为 `location` 块指定 `= /` 作为参数，可以加速请求的处理。因为 nginx 在第一次比较后就能确定最匹配的 `location` 块：

```nginx
location = / {
  #...
}
```

一个 `location` 块可以包含处理请求的指令，例如提供静态文件或者将请求转发到代理服务器。下面的例子中，匹配第一个 `location` 块的请求将会获取到本地系统 `/data` 目录下对应的文件，而匹配第二个 `location` 块的请求会被转发到域名为 `www.example.com` 的代理服务器:

```nginx
server {
  location /images/ {
    root /data;
  }

  location / {
    proxy_pass http://www.example.com
  }
}
```

`root` 指令指定一个文件系统路径，指明从哪里去找要服务的文件，将与该 `location` 块匹配的请求的 URI 添加到 root 路径后面就得到要请求的文件的完整路径，例如在上面的例子中，要响应 URI
为 `/images/example.png` 的请求，nginx 需要提供路径为 `/data/images/example.png` 的文件。

`proxy_pass` 指令会将请求转发到该指令参数指定的代理服务器上，来自代理服务器的响应会被发送回客户端。上面的例子中所有 URI 不以 `/images/` 开头的请求都将被转发到代理服务器。

### Using Variables

在配置文件中使用变量，可以让 nginx 根据不用的情形处理不同的请求。变量可以用作指令的参数，它在运行时阶段被解析。变量名需要以 `$` 符号开头。变量根据 nginx 的状态定义信息，例如当前正在处理的请求的属性。

有很多已经定义好的变量，例如 [core HTTP](https://nginx.org/en/docs/http/ngx_http_core_module.html?&_ga=2.148382143.964290018.1595647568-1083603121.1582961132#variables) 变量，你可以使用 `set`，`map` 和 `geo` 指令定义自定义变量。 大多数变量是在运行时计算的，并且包含与特定请求有关的信息。 例如，`$remote_addr` 包含客户端 IP 地址，而 `$uri` 是当前请求的 URI 值。

### Returning Specific Status Codes

某些网站 URI 要求立即返回带有特定错误或重定向代码的响应，例如当页面已临时或永久移动时。最简单的方法是使用 return 指令：

```nginx
location /wrong/url {
  return 404;
}
```

`return` 指令的第一个参数是响应状态码。可选的第二个参数可以是重定向的 URL（用于代码 301、302、303 和 307），也可以是要在响应正文中返回的文本。例如：

```nginx
location /permanently/moved/url {
  return 301 http://www.example.com/moved/here;
}
```

`return` 指令可以包含在 `location` 和 `server` 上下文中。

### Rewriting URIs in Requests

在请求处理期间，可以使用 `rewrite` 指令对请求 URI 进行多次修改，该指令具有一个可选参数和两个必需参数。第一个参数（必需）是请求 URI 必须匹配的正则表达式。第二个参数是用于替换匹配 URI 的 URI。可选的第三个参数是一个标志，它可以停止其它 `rewrite` 指令的进一步处理或发送重定向（代码 301 或 302）。例如：

```nginx
location /users/ {
  rewrite ^/users/(.*)$ /show?user=$1 break;
}
```

如上例所示，第二个参数中的 `user` 通过匹配正则表达式来捕获。

您可以在 `server` 和 `location` 上下文中包含多个 `rewrite` 指令。nginx 会按指令的出现顺序依次执行它们。
一旦某个 `server` 上下文被选中后，该 `server` 上下文中的 `rewrite` 指令将被执行。

nginx 处理了一组 `rewrite` 指令后，它将根据新的 URI 选择 `location` 块。如果所选 `location` 块包含 `rewrite` 指令，则会依次执行它们，如果 URI 与任何一个都匹配，则在处理所有定义的 `rewrite` 指令之后，将开始对新的 `location` 进行搜索

以下示例展示了 `rewrite` 指令和 `return` 指令的组合:

```nginx
server {
    #...
    rewrite ^(/download/.*)/media/(\w+)\.?.*$ $1/mp3/$2.mp3 last;
    rewrite ^(/download/.*)/audio/(\w+)\.?.*$ $1/mp3/$2.ra  last;
    return  403;
    #...
}
```

此示例配置区分两组 URI。例如诸如 `/download/some/media/file` 之类的 URI 被改写为 `/download/some/mp3/file.mp3`，由于 `last` 标志，后面的指令（第二个 `rewrite` 指令和 `return` 指令）会被跳过，但 nginx 回继续处理这个被重写了 URI 的请求。如果 URI 与任何一个 `rewrite` 指令都不匹配，则 nginx 会将 403 错误代码返回给客户端。

有两个参数可中断对 `rewrite` 指令的处理：

- `last`: 停止执行当前 `server` 或 `location` 上下文中的 `rewrite` 指令，但是 nginx 将搜索与重写的 URI 匹配的 `location`，并且将应用新 `location` 中的 `rewrite` 指令（这意味着可以再次更改 URI）。
- `break`: 与 `break` 指令类似，在当前上下文中停止处理 `rewrite` 指令，并取消对与新 URI 匹配的 `location` 的搜索。不执行新 `location` 中的 `rewrite` 指令。

### Handling Errors

使用 `error_page` 指令，你可以配置 nginx 以返回自定义页面以及错误代码，在响应中替换不同的错误代码，或者将浏览器重定向到其他 URI。在下面的示例中，`error_page` 指令指定要返回的页面（`/404.html`），并带有 `404` 错误代码

```nginx
error_page 404 /404.html;
```

请注意，该指令并不意味着立即返回错误（`return` 指令可以立即返回），而只是指定错误发生时的处理方式。错误代码可能来自代理服务器，也可能发生在 nginx 处理过程中（例如，当 nginx 无法找到客户端请求的文件时，显示 `404` 错误）。

在以下示例中，当 nginx 无法找到页面时，它用代码 `301` 替换代码 `404`，并将客户端重定向到 `http://example.com/new/path.html`。 当客户端仍尝试使用其旧 URI 访问页面时，此配置很有用。 `301` 代码通知浏览器该页面已永久移动，并且需要在返回时自动用新地址替换旧地址：

```nginx
location /old/path.html {
    error_page 404 =301 http://example.com/new/path.html;
}
```

以下配置是在找不到文件时将请求传递到代理服务器的示例。由于在 `error_page` 指令中的等号后没有指定状态码，因此对客户端的响应具有代理服务器返回的状态码（不一定是 404）

```nginx
server {
    ...
    location /images/ {
        # Set the root directory to search for the file
        root /data/www;

        # Disable logging of errors related to file existence
        open_file_cache_errors off;

        # Make an internal redirect if the file is not found
        error_page 404 = /fetch$uri;
    }

    location /fetch/ {
        proxy_pass http://backend/;
    }
}
```

`error_page` 指令指示 nginx 在找不到文件时进行内部重定向。 `error_page` 指令的最终参数中的 `$uri` 变量为当前请求的 URI，该 URI 在重定向中传递。

例如，如果未找到 `/images/some/file`，则将其替换为 `/fetch/images/some/file`，并开始对 `location` 进行新的搜索。 最终该请求匹配到第二个 `location` 块，并被代理到 `http://backend/`。

`open_file_cache_errors` 指令可阻止在找不到文件时记录错误消息。由于丢失的文件已得到正确处理，因此此处没有必要记录错误信息。

## Serving Static Content

### Root Directory and Index Files

`root` 指令指定用于搜索文件的根目录。为了获得请求文件的完整路径，nginx 将请求 URI 附加到 `root` 指令指定的路径上。`root` 指令可以位于 `http`, `server` 或 `location` 上下文中。在下面的例子中，`root` 指令定义在 `server` 块中，它会被应用到该 `server` 上下文中所有不包含 `root` 指令的 `location` 块：

```nginx
server {
  root /www/data;

  location / {
    #...
  }

  location /images/ {
    #...
  }

  location ~ \.(mp3|mp4) {
    root /www/media;
  }
}
```

这里，如果请求 URI 以 `/images/` 开头，nginx 会在 `/www/data/images/` 中查找对应的文件，但如果请求 URI 以 `.mp3` 或 `.mp4` 结尾，nginx 将会到 `/www/media/` 目录下去查找相应的文件，因为在匹配的 `location` 块中包含 `root` 指令，且改写了要查找的根目录。

如果请求以 `/` 结尾，则 nginx 将其视为对目录的请求，并尝试在目录中查找索引文件，`index` 指令定义了索引文件的名称（默认值为 `index.html`）。继续上面的示例，如果请求 URI 为`/images/some/path/`，则 nginx 会提供文件 `/www/data/images/some/path/index.html`（如果存在）。 如果该文件不存在，则默认情况下，nginx 返回 404 状态码（Not Found）。 要将 nginx 配置为返回自动生成的目录列表，可以在 `autoindex` 指令中包含 `on` 参数：

```nginx
location /images/ {
    autoindex on;
}
```

您可以在 `index` 指令中列出多个文件名。 nginx 按照指定的顺序搜索文件，并返回找到的第一个文件。

```nginx
location / {
    index index.$geo.html index.htm index.html;
}
```

此处使用的 `$geo` 变量是通过 `geo` 指令设置的自定义变量。变量的值取决于客户端的 IP 地址。

为了返回索引文件，nginx 会将索引文件的名称附加到基本 URI 之后，然后对这个新的 URI 进行内部重定向。内部重定向会导致对 `location` 的新搜索，并且可能会在另一个 `location` 中结束，如以下示例所示：

```nginx
location / {
    root /data;
    index index.html index.php;
}

location ~ \.php {
    fastcgi_pass localhost:8000;
    #...
}
```

这里，如果请求的 URI 为 `/path/`，并且 `/data/path/index.html` 不存在，但 `/data/path/index.php` 存在，则对 `/path/index.php` 的内部重定向将匹配到第二个 `location`。 结果，该请求被代理。

### Trying Several Options

[`try_files`](https://nginx.org/en/docs/http/ngx_http_core_module.html?&_ga=2.60795818.660262503.1596359668-1083603121.1582961132#try_files) 指令可用于检查指定的文件或目录是否存在。nginx 会进行内部重定向，否则会返回指定的状态码。例如，要检查是否存在与请求 URI 对应的文件，请使用 `try_files` 指令和 `$uri` 变量，如下所示：

```nginx
server {
    root /www/data;

    location /images/ {
        try_files $uri /images/default.gif;
    }
}
```

该文件以 URI 的形式指定，该 URI 使用当前 `location` 或 `server` 上下文中设置的 `root` 或 `alias` 指令进行处理。 在上面的情况下，如果不存在与 `$uri` 对应的文件，则 nginx 将内部重定向到最后一个参数指定的 URI，并返回 `/www/data/images/default.gif`。

最后一个参数也可以是状态码（直接放在等号之后）或 `location` 块的名称。在下面的示例中，如果 `try_files` 指令的所有参数指定的路径都找不到对应的文件或目录，则返回 404 错误：

```nginx
location / {
    try_files $uri $uri/ $uri.html =404;
}
```

在下面的示例中，如果根据 `$uri` 或 `$uri/` 都找不到对应的文件或目录，则该请求将被重定向到指定的 `location` 块，该 `location` 块会将请求传递给代理服务器。

```nginx
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://backend.example.com;
}
```

### Optimizing Performance for Serving Content

#### Enabling `sendfile`

默认情况下，nginx 会自行处理文件传输，并在发送文件之前将文件复制到缓冲区中。启用 `sendfile` 指令会去除将数据复制到缓冲区的步骤，并允许将数据从一个文件描述符直接复制到另一个文件描述符。另外，为防止一个快速连接完全占用工作进程，可以使用 `sendfile_max_chunk` 指令将单个 `sendfile()` 调用中传输的数据量限制为 1MB（在此示例中为 1 MB）：

```nginx
location /mp3 {
    sendfile           on;
    sendfile_max_chunk 1m;
    #...
}
```

### Enabling `tcp_nopush`

将 `tcp_nopush` 指令与 `sendfile on` 指令一起使用。 这使 nginx 在 `sendfile()` 获得数据块之后立即在一个数据包中发送 HTTP 响应头：

```nginx
location /mp3 {
    sendfile   on;
    tcp_nopush on;
    #...
}
```

## NGINX Reverse Proxy

### Passing a Request to a Proxied Server

当 nginx 代理请求时，它将请求发送到指定的代理服务器，获取响应，然后将其发送回客户端。可以使用指定协议将请求代理到 HTTP 服务器（另一个 nginx 服务器或任何其他服务器）或非 HTTP 服务器（可以运行使用特定框架开发的应用程序，例如 PHP 或 Python）。 支持的协议包括 `FastCGI`，`uwsgi`，`SCGI` 和 `memcached`。

要将请求传递到 HTTP 代理服务器，必须在一个 `location` 块内使用 `proxy_pass` 指令， 例如：

```nginx
location /some/path/ {
    proxy_pass http://www.example.com/link/;
}
```
下面的例子会将所有匹配到这个 `location` 块的请求转发到指定的代理服务器，转发的地址可以是一个域名或 IP 地址，同时也可以包含一个端口：
```nginx
location ~ \.php {
    proxy_pass http://127.0.0.1:8000;
}
```
如果代理服务器的地址以一个 URI 结尾，nginx 会用该地址替换请求 URI 中与 `location` 参数匹配的部分。例如上面第一个例子中，代理服务器的地址以 `/link/` 结尾，那么对于 URI 为 `/some/path/page.html` 的请求，将会被代理到 `http://www.example.com/link/page.html`。如果 `proxy_pass` 指定的地址不包含 URI ，或者无法确定要替换的 URI 部分，则会传递完整的请求 URI。

要将请求传递到非 HTTP 代理服务器，应使用适当的 `**_ pass` 指令：
- `fastcgi_pass` 传递请求到一个 FastCGI 服务器
- `uwsgi_pass` 传递请求到一个 uwsgi 服务器
- `scgi_pass` 传递请求到一个 SCGI 服务器
- `memcached_pass` 传递请求到一个 memcached 服务器

### Passing Request Headers

默认情况下，nginx 在代理请求中会重新定义两个头字段 "Host" 和 "Connection"，并去除其值为空字符串的头字段。默认 "Host" 设置为 `$proxy_host` 变量，"Connection" 设置为 `close`。

要更改这些设置以及修改其它头字段，请使用 `proxy_set_header` 指令。可以在 `location` 块中指定该指令。也可以在特定的 `server` 上下文或 `http` 块中指定它。例如：
```nginx
location /some/path/ {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://localhost:8000;
}
```
在这个配置中，头字段 "Host" 被设置为 `$host` 变量.

若要阻止某个头字段传递到代理服务器，请将其设置为空字符串：
```nginx
location /some/path/ {
    proxy_set_header Accept-Encoding "";
    proxy_pass http://localhost:8000;
}
```
### Configuring Buffers
默认情况下，nginx 缓冲来自代理服务器的响应。响应存储在内部缓冲区中，直到接收到整个响应后才发送给客户端。 缓冲有助于优化客户端的性能，如果将响应从 nginx 同步传递到客户端，则这可能会浪费代理服务器的时间。但是，如果启用缓冲后，nginx 允许代理服务器快速处理响应，而 nginx 将响应存储的时间与客户端下载响应所需的时间一样长。

负责启用和禁用缓冲的指令是 `proxy_buffering`。 默认情况下，它设置为 `on` 即启用了缓冲。

`proxy_buffers` 指令控制为请求分配的缓冲区的大小和数量。来自代理服务器的响应的第一部分存储在单独的缓冲区中，缓冲区的大小由 `proxy_buffer_size` 指令设置。这部分通常包含一个相对较小的响应头，并且可以使其小于其余响应的缓冲区。

在下面的示例中，增加了默认缓冲区数，并使响应第一部分的缓冲区大小小于默认值。
```nginx
location /some/path/ {
    proxy_buffers 16 4k;
    proxy_buffer_size 2k;
    proxy_pass http://localhost:8000;
}
```
如果禁用了缓冲，则 nginx 会将从代理服务器接收到的响应同步发送到客户端。对于需要尽快开始接收响应的快速交互客户端，此行为可能是理想的。

要在特定 `location` 中禁用缓冲，请 `location` 中将 `proxy_buffering` 设置为 `off`，如下：
```nginx
location /some/path/ {
    proxy_buffering off;
    proxy_pass http://localhost:8000;
}
```
在这种情况下，nginx 仅使用 `proxy_buffer_size` 配置的缓冲区来存储响应的当前部分。
