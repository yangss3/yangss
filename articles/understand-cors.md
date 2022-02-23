# 深入理解 CORS
<PubDate date="2021/10/22"/>

跨源资源共享（Cross Origin Resource Sharing）简称 CORS，是一种基于 HTTP 头的安全机制，它允许服务器指定除其自身以外的任何源 Origin (protocol/domain/port)，并让浏览器允许从这些源加载资源。

## 为什么需要 CORS
出于安全考虑，一般情况下，浏览器是不允许跨源请求 (cross-origin request) 的，即来自 `https://domain-a.com` 的客户端代码无法对 `https://domain-b.com` 的资源发起网络请求 (通过 `XMLHttpRequest` 或 `Fetch` API)，这样可以保护站点免受黑客攻击。

但是，随着 web 应用变得越来越复杂，跨源请求是很常见的需求。为了突破浏览器的限制，早期出现了很多跨域的方案，最常见的就是 JSONP (JSON with padding)。

JSONP 利用了 `<script>` 标签的 `src` 可以是任何源 (origin)，即它可以执行来自任何网站的脚本的特点，来实现跨源资源共享。

假设我们的站点 `https://my-website.com` 需要从 `https://weather.com` 获取天气数据，可以这样做：

1. 首先，我们事先声明一个全局函数来接受数据，例如 `getWeather`：
    ```js
    // 定义一个全局函数用于处理天气数据
    function getWeather({ temperature, humidity }) {
      console.log(`temperature: ${temperature}, humidity: ${humidity}`)
    }
    ```
2. 然后，我们创建一个 `<script>` 标签， 并设置 `src="http://weather.com/?callback=getWeather"`，使用我们预先定义好的函数名定义一个 URL 参数 `callback`：
    ```js
    const script = document.createElement('script')
    script.src = 'http://weather.com/?callback=getWeather'
    document.body.append(script)
    ```
3. 远程服务器 `weather.com` 在接收到这个请求后，动态地生成一个脚本，脚本内部使用它想让我们接收的数据调用 `getWeather(...)`：
    ```js
    // weather.com 返回的脚本内容类似这样:
    getWeather({
      temperature: 25,
      humidity: 78
    })
    ```
4. 当我们的站点加载并执行响应回来的脚本时，`getWeather` 就会运行，因为这是我们预先定义好的全局函数，所以我们就拿到了数据。

这种方法是可行的，而且不违反浏览器的安全策略，因为这样做的前提是双方都同意以这种方式传递数据，所以这绝不是一个黑客。现在仍然有提供这种访问的服务，因为它支持非常古老的浏览器版本。

但是 JSONP 也有很多缺点，例如只能行进 GET 请求，无法处理错误等等。为了能安全有效的解决这些问题，CORS 出现了，它允许在满足特定条件的情况下，通过 `XMLHttpRequest` 或 `Fetch` API 进行跨源请求。

## 安全请求

总的来说，跨源请求 (cross-origin request) 可以分为两类：
1. 全安请求
2. 其它所有请求

什么是安全请求 (safe request) ？如果一个请求同时满足下面两个条件，我们称它是安全的：
1. 请求方法是 GET, POST, HEAD 之一
2. 只能包含如下的自定义请求头：
    - `Accept`
    - `Accept-Language`
    - `Content-Language`
    - `Content-Type`，且值只能是 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 之一

任何不满足这两个条件的请求都被认为是不安全的。

其本质区别在于，安全请求可以用 `<form>` 或 `<script>` 来实现，不需要用到任何特殊方法。所以一个古老的服务器也可以处理安全请求。

与此相反，带有非标准头的请求或例如 DELETE 请求都不能用这种方式创建。很长时间以来，JavaScript 都不能发送这样的请求。因此，一个古老的服务器可能会认为这样的请求来自于一个有特权的来源，因为它认为网页是无法发送这些请求的。

当我们试图发送一个不安全的请求时，浏览器会先发送一个特殊的 "预检" (preflight) 请求来询问服务器是否同意接受这种跨源请求？除非服务器响应明确的 CORS 头信息进行确认，否则浏览器不会发送不安全的请求。

如果一个请求是跨源的 (cross-origin)，浏览器会给它加上 `Origin` 头，例如，如果我们从 `https://website-a.com/page` 发起请求 `https://website-b.com/request`，请求头将是这样：

```http
GET /request
Host: website-b.com
Origin: https://website-a.com
...
```
服务器会检查 `Origin` 头信息，如果它同意接受这样的请求，就在响应中添加一个特殊的头`Access-Control-Allow-Origin`。该响应头应包含允许的源 (origin)，在我们的例子中是 `https://website-a.com` ，或者一个星号 `*`，那么请求就会成功，否则将抛出错误。

浏览器在这个过程种扮演类似调解人的角色：
1. 它确保跨源请求发送正确的 `Origin` 头。
2. 它检查响应头 `Access-Control-Allow-Origin` 中是否包含请求源，如果它存在，则允许 JavaScript 访问响应 (response)，否则抛出错误。

下面是一个成功的服务端响应头：

```http
200 OK
Content-Type:text/html; charset=UTF-8
Access-Control-Allow-Origin: https://website-a.com
```

对于跨源请求，默认情况下只允许 JavaScript 访问“安全”的响应头：

- `Cache-Control`
- `Content-Language`
- `Content-Type`
- `Expires`
- `Last-Modified`
- `Pragma`

除此之外，访问任何其它响应头都会报错。

要授予 JavaScript 对其他响应头的访问权，服务器必须发送`Access-Control-Expose-Headers` 头，并在其中指明以逗号分隔的不安全头名称列表。例如：

```http
200 OK
Content-Type:text/html; charset=UTF-8
Content-Length: 12345
API-Key: 2c9de507f2c54aa1
Access-Control-Allow-Origin: https://website-a.com
Access-Control-Expose-Headers: Content-Length,API-Key
```

有了这样的 `Access-Control-Expose-Headers` 响应头，JavaScript 脚本就可以读取响应中的 `Content-Length` 和 `API-Key` 头。

## 不安全的请求

请求方法除了 `GET`，`Post`, 还可以是 `PATCH`，`DELETE` 等等。在过去，是无法通过网页发送这种请求的，所以一些古老的 web 服务器在接收到这种请求时，它们会认为：这一定不是来自浏览器。为了避免这种误解，对于这些“不安全”的请求，浏览器不会立刻将其直接发送给服务器，而是先发送一个“预检” (preflight) 请求，向服务器询问权限。

预检请求通过 `OPTIONS` 方法发送，且不携带 body，只包含三个请求头：

- `Access-Control-Request-Method`：指明不安全请求的方法
- `Access-Control-Request-Headers`：逗号分隔的不安全的请求头列表
- `Origin`：请求源，指明不安全请求来自哪里

如果服务器同意服务这个请求，它应该响应空的body，200 状态码和如下响应头：

- `Access-Control-Allow-Origin`：允许的请求源，例如 `https://website-a.com`, 或是一个星号 `*` 表明允许任何源
- `Access-Control-Allow-Methods`：允许的请求方法
- `Access-Control-Allow-Headers`：允许的请求头
- `Access-Control-Max-Age`：可以指定一个缓存权限的时间长度 (秒数)。这样，浏览器就不必为满足给定权限的后续请求发送预检。

下面以一个跨源的 `PATCH` 请求为例，看看它是如何一步步工作的：

```js
const response = await fetch('https://website-b.com/request', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'API-Key': 'secret'
  }
})
```
有三个原因导致该请求不安全（只要一个就够了）:

- 请求方法 `PATCH`
- `Content-Type` 不是 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 之一
- 不安全的 `API-Key` 头

**第一步：浏览器发送预检请求**

在发送真正的请求之前，浏览器会先发送一个 `OPTIONS` 预检请求，请求头如下：

```http
OPTIONS /request
Host: website-b.com
Origin: https://website-a.com
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: Content-Type,API-Key
```
- 请求方法：`OPTIONS`
- 请求路径：`/request`
- 跨源的特殊的请求头：
  - `Origin`：请求源
  - `Access-Control-Request-Method`：不安全的请求方法
  - `Access-Control-Request-Headers`：不安全的请求头列表

**第二步：服务器响应预检请求**

服务器以状态码 200 发送如下响应头：

```http
200 OK
Access-Control-Allow-Origin: https://website-a.com/page
Access-Control-Allow-Methods: PATCH
Access-Control-Allow-Headers: Content-Type,API-Key
```
这意味着服务器允许后面的 `PATCH` 请求。

如果服务器允许后面有其它方法的请求 (`PUT`, `DELETE` 等)或可携带其它头信息，可以提前允许它们，只要将它们添加到列表中即可，例如：

```
200 OK
Access-Control-Allow-Origin: https://website-a.com/page
Access-Control-Allow-Methods: PUT,PATCH,DELETE
Access-Control-Allow-Headers: API-Key,Content-Type,If-Modified-Since,Cache-Control
Access-Control-Max-Age: 86400
```
浏览器拿到预检响应后，看到 `PATCH` 在 `Access-Control-Allow-Methods` 中，`Content-Type`，`API-Key` 在 `Access-Control-Allow-Headers` 列表中，所以它发出了主请求。

响应头中如果有带秒数的 `Access-Control-Max-Age`，那么该预检的权限就会被缓存给定的时间。例如上面的响应将被缓存 86400 秒 (一天)。在这个时间范围内，后续满足条件的请求将不会触发预检，而是被直接发送。

**第三步：浏览器发送主请求**

当预检请求成功后，浏览器会进行主请求。这里的过程与安全请求的过程是一样的：

```http
PATCH /request
Host: website-b.com
Origin: https://website-a.com
Content-Type: application/json
API-Key: secret
```

**第四步：服务器响应主请求**

服务器在主响应中需要添加 `Access-Control-Allow-Origin`：

```http
Access-Control-Allow-Origin: https://website-a.com
```
这样，JavaScript 才可以访问到主请求的响应。

::: tip 注意
 预检请求发生在 "幕后"，它对 JavaScript 是不可见的。JavaScript 只能访问对主请求的响应，如果没有得到服务器的许可，则会抛出一个错误。
:::

## 凭据 (Credentials)

通常情况下，对 `http://website-b.com` 的发起的请求会携带该域的所有 cookies。但由 JavaScript 发出的跨源请求是一个例外。默认情况下，由 JavaScript 发起的跨源请求不会携带任何 *credentials* (cookies 或 HTTP authentication)。

例如，`fetch('http://website-b.com')` 不会发送任何 cookie，即使它是属于 `website-b.com` 域名的 cookie。

为什么？

这是因为携带 *credentials* 的请求比没有携带的请求要"强大"得多。如果允许携带 *credentials*，这相当于授予 JavaScript 用户的权限，并可以使用他们的 *credentials* 访问敏感信息。

服务器真的这么信任这个脚本吗？所以，它必须附加一个头信息以明确地指明是否允许带有 *credentials* 的请求。

为了在 fetch 中发送 *credentials*，我们需要指定 `credentials: 'include'`，像这样：

```js
fetch('http://website-b.com', {
  credentials: 'include'
})
```
现在，fetch 将来自 `website-b.com` 的 cookie 与请求一起发送到该网站。

如果服务器同意接受带有 *credentials* 的请求，那么除了 ` Access-Control-Allow-Credentials: true` 之外，它还应该在响应中添加一个 `Access-Control-Allow-Origin` 头。例如：

```http
200 OK
Access-Control-Allow-Origin: https://website-a.com
Access-Control-Allow-Credentials: true
```

请注意：`Access-Control-Allow-Origin` 禁止对带有 *credentials* 的请求使用星号 `*`。就像上面显示的那样，而是必须提供准确的来源。这是一个额外的安全措施，以确保服务器真正知道是谁发起的这个请求。

## 总结
- 从浏览器的角度，跨源请求分为两种：安全请求和不安全请求。
- 安全请求必须满足两个特定条件：
  - 请求方法只能是 GET，POST，HEAD
  - 只能设置以下请求头
    - `Accept`
    - `Accept-Language`
    - `Content-Language`
    - `Content-Type` 只能是 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 之一
- 安全请求和不安全请求的本质区别是：安全的请求可以通过 `<form>` 或 `<script>` 标签来实现，这也是早期浏览器发送跨源请求的方式。而不安全的请求在很长一段时间内，浏览器是无法发送的。
- 安全请求会被浏览器直接发送：
  - --> 浏览器加上 `Origin` 头信息，然后发送给服务器
  - <-- 对于没有携带 credentials 的请求，服务器设置如下响应头:
    - `Access-Control-Allow-Origin` 为 `*` 或 与 `Origin` 相同的值
  - <-- 对于携带了 credentials 的请求，服务器设置如下响应头：
    - `Access-Control-Allow-Origin` 为与 `Origin` 相同的值
    - `Access-Control-Allow-Credentials` 为 true
- 若要授权 JavaScript 访问除了 `Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified`，`Pragma` 之外的响应头，服务器应该设置 `Access-Control-Expose-Headers` 头，并将允许访问的头字段列入其中
- 对于不安全请求，浏览器会先发起一个预检请求询问服务器的访问权限：
  - --> 浏览器发送 `OPTIONS` 请求到相同的请求地址，并携带如下请求头：
    - `Access-Control-Request-Method`：不安全请求方法
    - `Access-Control-Request-Headers`：不安全的请求头列表
  - <-- 服务器响应 200 状态码以及如下响应头：
    - `Access-Control-Allow-Methods`：允许的不安全请求方法列表
    - `Access-Control-Allow-Headers`：允许的不安全请求头列表
    - `Access-Control-Max-Age`：该权限的缓存时长
  - 然后浏览器发送实际的请求，过程同安全请求一样。