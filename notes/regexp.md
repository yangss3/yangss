# 正则表达式

## 捕获组
- **捕获组** `(xyz)` 和 `\n`：`(xyz)` 匹配 `'xyz'` 并且会记住这个匹配，一个正则表达式可以包含多个捕获组，可以在后面通过 `\n` 来引用对应的捕获组，其中 `n` 代表捕获组出现的顺序，例如 `\1` 代表引用第一个捕获组：
  ```js
  /My favorite fruit is (apple), I eat \d+ \1s? a day/.exec('My favorite fruit is apple, I eat 3 apples a day')
  // ['My favorite fruit is apple, I eat 3 apples a day', 'apple', index: 0, input: 'My favorite fruit is apple, I eat 3 apples a day', groups: undefined]
  ```
- **命名的捕获组** `(?<name>xyz)` 和 `\k<name>`：通过 `?<name>` 标记给捕获组命名。命名的捕获组可以通过 `\k<name>` 的方式引用，而且在匹配结果中，命名的捕获组的匹配结果会出现在 `groups` 字段中，可以通过 `res.groups.[name]` 来访问：
  ```js
  /My favorite fruit is (?<fruit>apple), I eat \d+ \k<fruit>s? a day/.exec('My favorite fruit is apple, I eat 3 apples a day')
  // ['My favorite fruit is apple, I eat 3 apples a day', 'apple', index: 0, input: 'My favorite fruit is apple, I eat 3 apples a day', groups: {fruit: 'apple'}]
  ```
- **非捕获组** `(?:xyz)`：匹配 `'xyz'`，但是结果不会记住这个匹配组，即从匹配结果里获取不到匹配的子串。如果我们只需要对匹配进行分组，而不需要记住这个分组时，可以给分组添加 `?:` 标记，这样性能会更好：
  ```js
  /My favorite fruit is (?:apple|pineapple)/.exec('My favorite fruit is apple')
   // ['My favorite fruit is apple', index: 0, input: 'My favorite fruit is apple', groups: undefined]
  ```

## 断言
- **向前肯定断言** `x(?=y)`：匹配 `'x'` 当且仅当 `'x' 后面紧跟着 'y'`
  ```js
  /Nicholas(?=Yang)/.exec('NicholasYang')
  // ['Nicholas', index: 0, input: 'NicholasYang', groups: undefined]

  /Nicholas(?=Yang)/.exec('Nicholas123')
  // null
  ```
- **向前否定断言** `x(?!y)`：匹配 `'x'` 当且仅当 `'x' 后面不是紧跟着 'y'`
  ```js
  /\d+(?!\.)/.exec('3.14')
  // ['14', index: 2, input: '3.14', groups: undefined]
  // 匹配 '14' 而不是 '3'
  ```
- **向后肯定断言** `(?<=y)x`：匹配 `'x'` 当且仅当 `'x' 前面是 'y'`
  ```js
  /(?<=Nicholas)Yang/.exec('NicholasYang')
  // ['Yang', index: 8, input: 'NicholasYang', groups: undefined]
  ```
- **向后否定断言** `(?<!y)x`：匹配 `'x'` 当且仅当 `'x' 前面不是 'y'`
  ```js
  /(?<!-)\d+/.exec('3') // match
  /(?<!-)\d+/.exec('-3') // not match
  ```

## 匹配中文字符
当需要匹配中文字符时，你通过百度很快就能找到这段正则表达式：
```js
/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/
```
这样做没问题，但是看起来很不优雅。还有一种更简洁的办法，即 [unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes)，基于字符的 unicode 进行匹配，需要配合 `u` 修饰符使用：
```js
const chineseCharRegex = /\p{Script=Han}/u // Script 可以简写为 sc
chineseCharRegex.test('你好') // true
```