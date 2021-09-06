# package.json 配置说明

## name
`package.json` 文件中最重要的就是 `name` 和 `version` 字段，这两项是必填的。名称和版本一起构成一个标识符，该标识符被认为是完全唯一的。对包的更改应该与对版本的更改一起进行。

`name` 必须小于等于214个字符，不能以 `.` 或 `_` 开头，不能有大写字母，因为名称最终成为 URL 的一部分因此不能包含任何非 URL 安全字符。
npm 官方建议我们不要使用与核心 node 模块相同的名称。不要在名称中包含 `'js'` 或 `'node'`。如果需要可以使用 `engines` 字段来指定运行环境。

该名称会作为参数传递给 `require`，因此它应该是简短的，但也需要具有合理的描述性。

## version
`version` 一般的格式是 `x.x.x`, 并且需要遵循该规则。每次发布时 `version` 不能与已存在的一致。

## description
`description` 是一个字符串，用于描述你的包信息。有助于人们在 npm 库中搜索的时候发现你的模块。

## keywords
`keywords` 是一个字符串组成的数组，有助于人们在 npm 库中搜索的时候发现你的模块。

## homepage
项目的主页地址。

## bugs
用于项目问题的反馈，可以包含项目 issue 地址，或者是一个邮箱
```json
"bugs": { 
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}
```

## license
当前项目的协议，让用户知道他们有何权限来使用你的模块，以及使用该模块有哪些限制。

## author 和 contributors

`author` 是具体一个人，`contributors` 表示一群人，他们都表示当前项目的共享者。同时每个人都是一个对象。具有 `name` 字段和可选的 `url` 及`email` 字段。

```json
"author": {
  "name" : "yangss",
  "email" : "yangss@xxx.com",
  "url" : "https://yangss.com/"
}
```
也可以写成一个字符串:
```json
"author": "yangss yangss@xx.com (https://yangss.com/)"
```

## files
用于指定发布模块时需要包含的文件。`files` 属性的值是一个数组，内容是模块下文件名或者文件夹名，如果是文件夹名，则文件夹下所有的文件也会被包含进来。

可以在模块根目录下创建一个 `.npmignore` 文件，写在这个文件里边的文件即便被写在 `files` 属性里也会被排除在外，这个文件的写法与 `.gitignore` 类似。

## main
指定模块加载的入口文件，`require` 导入的时候就会加载这个文件。这个字段的默认值是模块根目录下面的 `index.js`。

## bin
指定每个内部命令对应的可执行文件的位置。如果你编写的是一个 node 命令行工具时会用到 `bin` 字段：
```json
"bin": {
  "foo": "bin/foo.js",
}
```
如果全局安装这个模块，我们在命令行中输入 `foo`， node 会去执行 `bin/foo.js` 这个文件。

如果作为项目依赖的方式局部安装这个模块，在 `node_modules/.bin/` 生成对应的文件， npm 会寻找这个文件，在`node_modules/.bin/` 目录下建立符号链接。由于 `node_modules/.bin/` 目录会在运行时加入系统的 `PATH` 变量，因此在运行 `npm` 时，就可以不带路径，直接通过命令来调用这些脚本
所有 `node_modules/.bin/` 目录下的命令，都可以用 `npm run [命令]` 的格式运行

## directories
制定一些方法来描述模块的结构, 用于告诉用户每个目录在什么位置。

## repository
指定一个代码存放地址，对想要为你的项目贡献代码的人有帮助
```json
"repository" : {
  "type" : "git", 
  "url" : "https://github.com/npm/npm.git"
}
```

## scripts
用于配置 npm 脚本命令，可以给项目中需要经常运行的脚本命令定义一个别名：
```json
"scripts": {
  "start": "node ./start.js"
}
```
`scripts` 可以直接调用 `node_modules` 中安装的模块（如果这个模块提供了命令行运行的模式）：
```json
"scripts": {
  "build": "webpack"
}
// npm run build => npx webpack
```

## peerDependencies
如果你的模块依赖于某一个模块，但是你又不想将其作为本模块的依赖进行安装（比如这个模块可能被其它很多模块使用），可以使用 `peerDependencies` 字段来指定这个模块，以及所需要的版本，
```js
{
  "name": "my-less-plugin",
  "peerDependencies": {
    "less": "3.9.x"
  }
}
```
## engines
`engines` 字段指明了该模块运行的平台，比如 `node` 或者 `npm` 的某个版本或者浏览器
```json
"engines": { 
  "node" : ">=0.10.3 <0.12", 
  "npm" : "~1.0.20" 
}
```

## private
如果这个属性被设置为 `true`，npm 将拒绝发布它，这是为了防止一个私有模块被无意间发布出去。
```json
"private": true
```

## publishConfig

## preferGlobal
`preferGlobal` 的值是布尔值，表示当用户不将该模块安装为全局模块时（即不用`--global/-g`参数），要不要显示警告，表示该模块的本意就是安装为全局模块。
```json
"preferGlobal": true
```
## config