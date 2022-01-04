# 妙用 switch(true)
<PubDate date="2021/12/25"/>

在需要进行多分支选择时，我们经常使用 `switch` 语句。大多数情况下，我们的匹配条件 (`case` 子句) 都是一个常量值。但其实，`case` 后面还可以是一个任意表达式，这在某些场景下会非常有用。
## 使用 `switch(true)` 匹配表达式

`switch` 语句不仅匹配值还可以匹配表达式。`case` 子句中的表达式将在匹配前被计算，如果表达式的结果与 `switch` 后面的值相等，它将被匹配：
```js
switch (true) {
  case 1 + 1 === 2:
    // case 表达式的结果为 true, 这里的会被执行
    // ...
    break
  default:
    // 这里不会被执行
    break
}
```
## 为什么这很有用

这种模式可以在很多场景下使用，用来取代复杂的 `if/else` 语句。一个常见场景是数据校验：

```js
const user = {
  name: "Nicholas Yang",
  email: "yss_2016@outlook.com",
  number: "00447123456789"
}

if (!user) {
  throw new Error("User must be defined.")
}

if (!user.name) {
  throw new Error("User's name must be defined")
}

if (typeof user.name !== "string") {
  throw new Error("User's name must be a string")
}

// ...更多校验语句

return user
```
当校验条件很多时，这种写法看起来很不简洁和直观，但如果用 `switch(true)` 模式来重写，就会美观很多:

```js
const user = {
  name: "Nicholas Yang",
  email: "yss_2016@outlook.com",
  number: "00447123456789"
}

switch (true) {
  case !user:
    throw new Error("User must be defined.")
  case !user.name:
    throw new Error("User's name must be defined")
  case typeof user.name !== "string":
    throw new Error("User's name must be a string")
  // ...more validations
  default:
    return user
}
```

还可以将校验标准抽象成函数，以提高可读性：

```js
switch (true) {
  case !isDefined(user):
    throw new Error("User must be defined.")
  case !isString(user.name):
    throw new Error("User's name must be a string")
  case !isValidEmail(user.email):
    throw new Error("User's email address must be a valid email address")
  case !isValidPhoneNumber(user.number):
    throw new Error("User's phone number must be a valid phone number")
  // ...more validations
  default:
    return user
}
```
在这种场景下，我个人更推荐使用 `switch(true)` 的写法。