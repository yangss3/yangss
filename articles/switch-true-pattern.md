# 使用 switch(ture) 模式
<PubDate date="2021/09/22"/>
> [原文地址](https://seanbarry.dev/posts/switch-true-pattern)

## Fundamental principle

`switch(true)` 模式的基本原则是，`switch` 语句不仅匹配值还可以匹配表达式。case 中的表达式将在匹配前被计算，如果表达式的结果为 `true`，它将被匹配：
```js
switch (true) {
  case 1 + 1 === 2:
    // case 表达式的结果为 true, 这里的会被执行
    break
  default:
    // 这里不会被执行
    break
}
```
## Why is this useful
这种模式可以在很多场景下使用，通常用来取代复杂的 `if/else` 语句。一个常见场景是如果你正在校验数据，并且有一组标准会导致校验失败
```js
const user = {
  firstName: "Nicholas",
  lastName: "Yang",
  email: "yss_2016@outlook.com",
  number: "00447123456789"
}

if (!user) {
  throw new Error("User must be defined.")
}

if (!user.firstName) {
  throw new Error("User's first name must be defined")
}

if (typeof user.firstName !== "string") {
  throw new Error("User's first name must be a string")
}

// ...更多校验语句

return user
```

这可以用 `switch(true)` 来重写，就像这样:
```js
const user = {
  firstName: "Nicholas",
  lastName: "Yang",
  email: "yss_2016@outlook.com",
  number: "00447123456789"
};

switch (true) {
  case !user:
    throw new Error("User must be defined.")
  case !user.firstName:
    throw new Error("User's first name must be defined")
  case typeof user.firstName !== "string":
    throw new Error("User's first name must be a string")
  // ...更多校验
  default:
    return user
}
```

在写 `if/else` 和 `switch(true)` 时，都可以抽象出验证标准，以提高可读性：
```js
switch (true) {
  case !isDefined(user):
    throw new Error("User must be defined.")
  case !isString(user.firstName):
    throw new Error("User's first name must be a string")
  case !isValidEmail(user.email):
    throw new Error("User's email address must be a valid email address")
  case !isValidPhoneNumber(user.number):
    throw new Error("User's phone number must be a valid phone number")
  // ...更多校验
  default:
    return user
}
```
## Summary
在我看来，这种模式在检查多个条件时比使用大量的 `if/else` 块提供了更清晰的可读性。我相信这将会是一个很有争议的问题，但是了解这些模式总是很有用的，在适当的时候就可以使用它们。