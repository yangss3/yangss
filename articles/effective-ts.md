# Effective TypeScript

## 理解代码生成与类型无关
TypeScript 的编译器 `tsc` 做了两件事：
- 将下一代 TypeScript/JavaScript 转换为可在浏览器中使用的旧版本的 JavaScript（转译）
- 检查你的代码是否有类型错误

令人惊讶的是，这两种行为是完全相互独立的。换句话说，你的代码中的类型不会影响最终生成的JavaScript。由于最终执行的是 JavaScript，这意味着你的类型不会影响你的代码运行方式。

## 有类型错误的代码也可以生成 JavaScript
因为代码的输出与类型检查无关，因此，有类型错误的代码也能产生输出！

这可能会很令人惊讶。你可以把 TypeScript 的所有错误看作是一种警告：需要你引起注意并检查代码，但它们不会阻止 JavaScript 的生成。
