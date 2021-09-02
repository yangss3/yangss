# 装饰着模式 call/apply
> [原文1](https://juejin.cn/post/6844904089680084999)
> [原文2](https://juejin.cn/post/6844904089734610957)

JavaScript 在处理函数时提供了非凡的灵活性。它们可以被传递，用作对象，现在我们将看到如何在它们之间 转发（forward） 调用并 装饰（decorate） 它们。