# TypeScript 笔记
## Functions
### Function Types (函数类型)
```ts
// Named function
function add(x: number,y: number): number {
  return x + y
}

// Anonymous function
let add = function(x: number, y: number) {
  return x + y
}
```
TypeScript 能够根据函数的 return statement 推断出函数的返回类型，因此很多时候在定义函数时可以省略掉 return type。

**函数类型**分为两部分：参数类型和返回类型。在写**函数类型**时，参数类型和返回类型都必须写全，不能省略，即使函数没有返回值，也要用 `void` 来指定返回类型，返回类型与参数列表之间使用 `=>` 分隔：

```ts
let add: (a: number, b: number) => number = function(x: number, y: number): number {
  return x + y
}

// 若省略掉 void 将导致编译错误
let sayHi: (name: string) => void = function(name: string) {
  console.log(`Hi, ${name}!`)
}
```

### Inferring the types (类型推断)
TypeScript 编译器能够根据赋值语句一边的类型推断出另一边的类型：
```ts
// myAdd 被推断出的函数类型：(x: number, y: number) => number
let myAdd = function(x: number, y: number): number { return x + y }
//  参数 x, y 被推断出具有 number 类型
let myAdd: (a: number, b: number) => number = function(x, y) { return x + y }
```
### Optional and Default Parameters (可选和默认参数)
TypeScript 中， 默认情况下，函数定义时的参数列表中的每一个参数都是必须的，在函数调用时都不能省略，否则编译出错。但是也可以通过在参数名后面添加 `?` 符号来将其指定为可选参数，注意可选参数的右边不能有必须参数：
```ts
// 如果不提供 lastName, lastName 将为 undefined
function makeName(firstName: string, lastName?: string){
  if (lastName)
    return `${firstName} ${lastName}`
  else
    return firstName
}

makeName('Nicholas') // ok
```
也可以在函数定义时给参数设置默认值，如果默认初始化参数在参数列表的末尾，则同可选参数一样，可以在调用时省略:
```ts
// 与上面的函数共享函数类型：(fn: string, ln?: string) => string
function makeName(firstName: string, lastName = 'Yang'){
    return `${firstName} ${lastName}`
}

makeName('Nicholas') // Nicholas Yang
makeName('Nicholas', undefined)  // Nicholas Yang
makeName('Nicholas', 'John')  // Nicholas John
```
与可选参数不同，默认初始化参数可以出现在必须参数之前，在这种情况下调用时不能省略该参数，如果要获取该参数的默认值，需要显示传递 `undefined`。

### Rest Parameters
在 TypeScript 中，可以用一个 rest parameter 来收集参数列表中未指定的所有传递过来的参数值，rest parameter 使用省略号 `...` 来指示，编译器会构建一个与 rest parameter 同名的数组在函数内部使用。rest parameter 可以看作是无穷数量的 optional parameter，当 rest parameter 没有接收到任何值时，同名数组将为空数组：
```ts
// getNameStr 的 function type 为：(name: string, ...rest: string[]) => string
function getNameStr(name1: string, ...restOfNames: string[]){
  return `${name1} ${restOfNames.join(' ')}`
}

let nameStr = getNameStr('Monica', 'Rose', 'Joey', 'Rachael')
```
### this
关于 `this` 在 TypeScript 中的用法, 以及如何让编译器捕获由于不正确使用 `this` 引发的错误，请移步[官方文档](http://www.typescriptlang.org/docs/handbook/functions.html)。
### Overloads (重载)
所谓 overload 就是一个函数在调用时，根据传递的参数的 shape (数量以及类型) 不同，函数表现出不同的行为。
那么 TypeScript 如何对这样一类函数进行类型检查呢？答案就是，为这样的函数提供多个 function type 来作为它的一个重载列表，在该函数被调用时，编译器会使用这个重载列表去进行类型检查：
```ts
const colors = ['red', 'blue', 'green']

function pickColor(x: number): string
function pickColor(x: string): number
function pickColor(x: any) {
  if (typeof x === 'number') {
    return colors[x]
  } else if (typeof x === 'string') {
    return colors.indexOf(x)
  }
}
pickColor(1)  // 'blue'
pickColor('green')  // 2
```
注意上面例子中的 `function pickColor(x: any)` 片段不是重载列表的一部分， `pickColor` 函数只有两个重载，一个接受一个 `number` 参数，另一个接受一个 `string` 参数， 使用任何其它参数类型调用该函数将导致错误。

## [Interfaces](http://www.typescriptlang.org/docs/handbook/interfaces.html)
基于**值的形状**(the shape of values) 的类型检查(type-checking) 是 TypeScript 的一个核心概念，而 interface 用来为这些类型(形状)名命，可以把 interface 当作是一个条款或协议(contract), 用来规范和约束项目内部的代码，或者为外部代码以及第三方库提供对接的规范。
```ts
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label)
}

printLabel({label: 'hello world'})
```
上面的函数 `printLabel` 接受一个 shape (type) 为 `{ label: string }` 的参数，我们可以使用 interface 来定义这样一个 shape，上面的例子可以改写如下：
```ts
interface labeledValue {
  label: string
}

function printLabel(labeledObj: labeledValue) {
  console.log(labeledObj.label)
}

printLabel({ label: 'Shameless' })  // 'Shameless'
let myObj = { label: 'The Walking Dead', season: 10 }
printLabel(myObj)  // ok, 'The Walking Dead'
printLabel({ label: 'Game of Thrones', season: 8 })  // error
```
这里定义了一个接口 `labeledValue` 来描述 `printLabel` 函数参数的 shape，但是在函数调用的时候，我们传递给 `printLabel` 的参数不必显式的实现 `labeledValue` 接口，只要传递的参数的 shape 符合要求即可，而且编译器在执行类型检查时不关心传递进来的参数中属性的位置顺序，只要匹配定义接口中的各个属性的类型即可。

同时，从上面的例子中可以看出，如果调用函数时以变量的形式传递参数（如 `myObj`），参数中可以有额外的属性（如 `season: 10`）, 即传递的变量的 shape 可以是函数期望参数的 shape 的超集。但是如果在调用函数时直接传递对象字面量，那么传递的参数的 shape 必须与函数期望参数的 shape 完全一致（属性的顺序除外），否则会报错。

### Optional Properties
默认情况下，接口中定义的属性都是必须的(required)，例如上面例子中 `printLabel` 函数的参数 `labeledObj` 的属性 `label` 就是必须的，在调用时必须提供。但是像定义函数时指定可选参数一样，也可以在属性名后面紧跟符号 `?` 来为接口定义可选属性：
```ts
interface squareConfig {
  color?: string
  width?: number
}

function createSquare(config: squareConfig): { color: string, area: number } {
  let newSquare = { color: 'red', area: 100 }
  if (config.color) {
    newSquare.color = config.color
  }
  if (config.width) {
    newSquare.area = config.width ** 2
  }
  return newSquare
}

createSquare({ color: 'blue' })
createSquare({ width: 12 })
createSquare({})
```

### Readonly Properties
可以将属性指定为 `readonly`, 这样当实现了该接口的对象被创建之后，这些属性将不能被修改：
```ts
interface Product {
  readonly name: string
  price: number
}

let book: Product = { name: 'Hello, JavaScript', price: 12.5 }
book.name = 'Hello, TypeScript'  // error
book.price = 34
```
TypeScript 有个 `ReadonlyArray<T>` 类型，与 `Array<T>` 类型类似，但是移除了所有的 mutating method (e.g. `pop, push, shift, unshift, reverse`)，这能确保在数组创建之后，你无法再改变它：
```ts
let a: number[] = [1,2,3,4,5]
let b: ReadonlyArray<number> = a
b[1] = 22 // error
b.push(6) // error
b.length = 100 // error
a = b // error
```
从上面可以看到，你甚至不能将 `ReadonlyArray` 赋回给常规数组, 除非使用 type assertion:
```ts
a = b as number[]
```
> 注意 `readonly` 与 `const` 的区别，`const` 针对的是变量，`readonly` 针对的是属性。

### Excess Property Checks
```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 })
```
你可能认为上面的代码没问题，然而 TypeScript 会编译报错，因为当把对象字面量(Object literals)赋值给其它变量，或作为函数参数传递时，TypeScript 会进行额外的属性检查，如果对象字面量具有目标类型不具有的属性，就将导致错误。所以上面代码中最后一行的函数调用将报错，因为在目标参数类型中不存在 `colour` 属性。

当然可以简单的使用 type assertion 来避开这种类型检查：
```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig)
```
但是更好的方法是在定义 interface 时添加一个 string index signature：
```ts
interface SquareConfig {
  color?: string
  width?: number
  [propName: string]: any
}

let sc: SquareConfig = {color: 'red', opacity: 0.5}  // ok
```
上面的例子中，`SquareConfig` 类型的变量可以有任意数量的属性，只要不是 `color` 和 `width`, 它们的类型不重要。

### Function Types
Interface 除了能描述对象类型外，还可以用来描述函数类型，就像函数声明一样，但只需要给出参数列表和返回类型：
```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}
```
一旦定义了这样的接口，就可以用它来指定函数类型：
```ts
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```
事实上如果赋值语句右边的函数不指定任何类型，TypeScript 也会根据左边的类型推断出右边的参数类型和返回类型，然后实施类型检查。

### Indexable Types
Interface 也可以用来描述索引类型，描述的 signature 包括两个部分，索引的类型和被索引值的类型：
```ts
interface StringObj {
  [index: number]: string
}

let myArray: StringObj = ['Bob', 'Fred']
let myObject1: StringObj = {
  3: 'Susan',
  9: 'Rachael',
  '12': 'Monica'   // work
}
let myObject2: StringObj = { '1a': "doesn't work" }  // error
```
TypeScript 支持两种索引类型：`string` 和 `number`, 可以在一个接口中同时定义这两种类型的索引，但是数值索引(numeric indexer)的返回类型必须是字符串索引(string indexer)的返回类型的子类型(subtype)，这是因为在 JavaScript 中，通过索引访问对象时，数值索引实质上是被转换成了字符串索引的，所以数值索引的返回类型必须与字符串索引的返回类型兼容：
```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

如果接口中定义了字符串索引，这将迫使整个类型的所有属性都必须返回与字符串索引的返回类型匹配的类型，否者不能通过类型检查：
```ts
interface numberDictionary {
  [index: string]: number // 这里确定了所有其它属性的返回类型都必须是 number
  length: number  // ok
  name: string  // error
}
```

### Class Types
interface 最常见的用处是为类(class)提供一个需要遵守的协议(contract)，如果一个类要实现某个接口，那么它必须实现这个接口定义的所有内容(属性和方法，包括继承链上的):
```ts
interface clockInterface {
  currentTime: Date
  setTime(d: Date): void
}

class Clock implements clockInterface {
  currentTime: Date
  constructor(h: number, m: number){
    //...
  }
  setTime(d: Date){
    this.currentTime = d
  }
}
```
注意接口只能描述一个类的公有部分(public)：
```ts
interface clockInterface {
  currentTime: Date
}
class Clock implements clockInterface {
  private currentTime: Date  // error
}
```
当使用类和接口时，注意到，一个类描述了两部分：静态部分(static side)和实例部分(instance side)，如果你定义了一个用来描述构造函数的接口，然后试图创建一个类来实现这个接口，你将会失败。This is because when a class implements an interface, only the instance side of the class is checked. Since the constructor sits in the static side, it is not included in this check. 更多细节看官方文档。

### Extending Interfaces
像类的继承一样，接口也可以进行扩展，这允许你将某一个接口中的成员复制到另一个接口中，让你在将接口分割成可重用的组件时有更高的灵活性。扩展接口使用 `extends` 关键字：
```ts
interface Shape {
  color: string;
}

interface Property {
  sideLength: number
}

interface Square extends Shape {
  area: number
}

// 一个接口可以扩展多个接口
interface anotherSquare extends Shape, Property {
  area: number
}

let square = <Square>{}
square.color = 'blue'
square.area = 100

let anotherSq = {} as anotherSquare
anotherSq.color = 'red'
anotherSq.sideLength = 10
anotherSq.area = anotherSq.sideLength ** 2
```

### Hybrid Types
One such  example is an object that acts as both a function and an object, with additional properties:
```ts
interface Counter {
  (start: number): string
  interval: number
  reset(): void
}

function getCounter(): Counter {
  let counter = <Counter>function (start: number) { 
      return new Date(start).toLocaleString()
  }
  counter.interval = 10
  counter.reset = function () {}
  return counter
}
```

### Interfaces Extending Classes
接口也可以 extends 类，当接口扩展一个类时，它继承这个类的所有成员(包括私有和公有部分)，但不包含成员的实现(implementations)，就好比声明了一个拥有这个类所有成员的接口。

- 基类只包含公有成员的情况：
```ts
// 基类只包含公有成员 (public member)
class PublicBase {
  publicState: any
}

// 接口继承类的所有成员
interface PublicBaseInterface extends PublicBase {
  sayHi(): void
}

// 子类显式地实现该接口
class SubA extends PublicBase implements PublicBaseInterface {
  sayHi() { }
}

// 子类也可以隐式的实现该接口，这里 SubB 的实例 (instance) 可以赋值给 PublicBaseInterface 类型，二者兼容
class SubB extends PublicBase {
  sayHi() { }
}

// 如果基类只包含公有成员，非子类也可以实现该接口
class Other implements PublicBaseInterface {
  publicState: any
  sayHi() { }
}

let a: PublicBaseInterface = new SubA() // ok
let b: PublicBaseInterface = new SubB() // ok
let c: PublicBaseInterface = new Other() // ok
```
- 基类包含私有成员或保护成员的情况：
```ts
// 基类包含私有成员 (private member)
class PrivateBase {
  private privateState: any
}

// 接口继承类的所有成员，包括私有成员
interface PrivateBaseInterface extends PrivateBase {
  sayHi(): void
}

// 子类显示地实现该接口
class SubA extends PrivateBase implements PrivateBaseInterface {
  sayHi() { }
}

// 子类也可以隐式的实现该接口，这里 SubB 的实例 (instance) 可以赋值给 PrivateBaseInterface 类型，二者兼容
class SubB extends PrivateBase {
  sayHi() { }
}

// Doesn't work，如果基类包含私有成员或保护成员(protected member)，任何其它非子类都不能实现该接口，
// 因为基类的私有成员和保护成员只能在它的后代 (descendants) 中共享。
class Other implements PrivateBaseInterface {
  private privateState: any
  sayHi() { }
}

let a: PrivateBaseInterface = new SubA() // ok
let b: PrivateBaseInterface = new SubB() // ok
```
> 总之，如果接口 I extends 类 B，那么对于任何类 O 要想 implements 接口 I， 当且仅当类 O 的私有成员和保护成员与类 B 同源。

## Classes
```ts
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greeter() {
    console.log(`Hello, ${this.greeting}`)
  }
}

let greeter = new Greeter('world')
greeter.greeter()  // Hello, world
```
TypeScript 类的用法与 ES6 类的用法基本一致，但是增加了私有成员(private member)和保护成员(protected member)的概念。

### Public by default
默认情况下，类的成员都是公有的, 当然你也可以用关键字 public 来显式的指定公有成员：
```ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```
- 类的公有属性可以在它的子类(subclass)中通过 `this` 来访问。
- 类的公有方法可以在它的子类中通过 `super` 来访问。
```ts
class Animal {
  name: string;
  constructor(theName: string) { this.name = theName }
  move(distanceInMeters: number = 0) {
      console.log(`${this.name} moved ${distanceInMeters}m.`)
  }
}

class Snake extends Animal {
  length: number
  constructor(name: string, len: number) {
    super(name)  // 在子类的构造函数内必须首先调用父类的构造函数
    this.length = len
  }
  move(distanceInMeters = 5) {  // 重载父类的 move 方法
      console.log("Slithering...")
      super.move(distanceInMeters)  // 访问父类的公有方法
  }
  getInfo(){
    return `${this.name}/* 访问父类的公有属性 */ is ${this.length}m long` //
  }
}
```
### Understanding private
当类的成员被标记成 `private`, 该成员不能在该类的外部被访问：
```ts
class Animal {
  private name: string;
  constructor(theName: string) { this.name = theName }
  move(distanceInMeters: number = 0) {
      console.log(`${this.name} moved ${distanceInMeters}m.`)
  }
}

new Animal('Dog').name  // Error！, 'name' 是私有属性，无法在 Animal 外部访问
```
TypeScript 是一种结构化的类型系统，当比较两个不同的类型时，不论这两个类型来自哪里，只要它们所有成员的类型都是兼容的，就认为这两个类型是兼容的。

然而当被比较的类型中含有 `private` 或 `protected` 成员时，情况又有所不同，这样的两个类型要兼容，除了成员本身的类型要兼容之外，它们所有同名的私有成员或保护成员都必须同源，即声明于同一个地方。

```ts
class Animal {
  private name: string
  constructor(theName: string) { this.name = theName }
}

class Elephant extends Animal {
  constructor(theName: string) { super(theName) }
}

class Employee {
  private name: string
  constructor(theName: string) { this.name = theName }
}

let animal = new Animal('Jack')
let elephant = new Elephant('Rose')
let employee = new Employee('Rachael')

animal = elephant // Ok
animal = employee // Error, 私有成员不同源，即使有完全相同的 shape，也不兼容
```
- 类的私有成员只在该类的内部可见，在任何继承类内部都不可见，也无法通过实例直接访问

### Understanding protected
类的保护成员与私有成员类似，唯一的区别是保护成员在继承类内部是可以直接访问的：
```ts
class SuperClass {
  constructor(
    public publicProp: any,
    private privateProp: any,
    protected protectedProp: any
  ) { }
  publicMethod() { }
  private privateMethod() { }
  protected protectedMethod() { }
}

class SubClass extends SuperClass {
  constructor(pub: any, pri: any, pro: any) { super(pub, pri, pro) }
  test() {
    this.publicProp // ok
    this.protectedProp // ok 基类的保护成员在派生类中可见
    this.privateProp // error 基类的私有成员在派生类中不可见
    super.publicMethod() // ok
    super.protectedMethod() // ok 基类的保护成员在派生类中可见
    super.privateMethod() // error 基类的私有成员在派生类中不可见
  }
}

// 在实例上只能访问公有成员，私有和保护成员都不可见
let sc = new SuperClass(1, 2, 3)
sc.privateProp // error
sc.privateMethod() // error
sc.protectedProp // error
sc.protectedMethod() // error
```

构造函数也可以被指定为 `protected`，这意味着这个类不能被实例化，但是仍然可以被继承：
```ts
class ProtectedClass {
  protected constructor() { }
}

// ProtectedClass 类可以被继承，因为它的构造函数在子类内部可以被访问
class SubClass extends ProtectedClass {
  constructor() { super() }
}

let sc = new SubClass()
let pc = new ProtectedClass()  // Error! ProtectedClass 的构造函数是 protected，外部不可见，不能被实例化
```
- 类的保护成员只在该类和该类的继承类中可见，无法通过实例访问。
### Readonly modifier
可以用 `readonly` 关键字来声明只读属性，只读属性必须在声明时初始化，或在构造函数中初始化，一旦被初始化，它们的值就不能被修改：
```ts
class ReadonlyClass {
  readonly prop1: any
  readonly prop2: any = 1
  constructor(theProp: any) { this.prop1 = theProp }
  changeProps() {
    this.prop1 = 2 // Error
    this.prop2 = 2 // Error
  }
}

let rc = new ReadonlyClass('a')
rc.prop1 = 1 // Error
rc.prop2 = 'a' // Error

```
### Parameter Properties
如果类中声明的属性在构造函数中只是被简单的立即初始化，可以将属性的声明放到构造函数的参数列表中，这可将声明过程和初始化过程合二为一：
```ts
class myClass {
  prop1: any
  private prop2: any
  protected prop3: any
  readonly prop4: any
  // 属性只是简单的在构造函数中初始化
  constructor(p1: any, p2: any, p3: any, p4: any) {
    this.prop1 = p1
    this.prop2 = p2
    this.prop3 = p3
    this.prop4 = p4
  }
}

// 上面可以简化成如下，注意，使用这种形式时，公有属性的 public 关键字不能省略
class myClass {
  constructor(
    public prop1: any,
    private prop2: any,
    protected prop3: any,
    public readonly prop4: any
  ) { }
}
```

### Accessors
TypeScript 支持以 getters/setters 方式来拦截对对象属性的访问：
```ts
let passcode = "secret passcode"

class Employee {
  private _fullName: string

  get fullName(): string {
    return this._fullName
  }

  set fullName(newName: string) {
    if (passcode && passcode === "secret passcode") {
      this._fullName = newName
    }
    else {
      console.log("Error: Unauthorized update of employee!")
    }
  }
}

let employee = new Employee()
employee.fullName = "Bob Smith"
if (employee.fullName) {
  console.log(employee.fullName)
}
```

### Static Properties
静态成员只能通过类(class)来访问，不能通过实例(instance)来访问:
```ts
class Grid {
  static origin = { x: 0, y: 0 }
  calculateDistanceFromOrigin(point: { x: number; y: number; }) {
    let xDist = (point.x - Grid.origin.x)
    let yDist = (point.y - Grid.origin.y)
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale
  }
  constructor(public scale: number) { }
}

let grid1 = new Grid(1.0)  // 1x scale
let grid2 = new Grid(5.0)  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }))
console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }))
```
### Abstract Classes
抽象类通常被用来继承，而不能被实例化。不同于接口，接口中不能包含成员的实现，而抽象类可以包含实现。抽象类中可以声明抽象方法，但是不能提供方法的实现，必须在其派生类中提供实现。使用 `abstract` 关键字来定义抽象类和抽象方法：
```ts
abstract class Animal {
  abstract makeSound(): void // 必须在派生类中提供实现
  move() {
    console.log("roaming the earth...")
  }
}

class Dog extends Animal {
  makeSound() { console.log('wang!') }
  feed() { }
}

let a = new Animal() // error, 抽象类不能被实例化
let dog: Animal = new Dog()
dog.makeSound() // ok
dog.move()  // ok
dog.feed() // error, 抽象类中不包含 feed 方法
```

### Using a class as an interface
可以把类当作接口来使用：
```ts
class Point {
  x: number
  y: number
}

interface Point3d extends Point {
  z: number
}

let point3d: Point3d = { x: 1, y: 2, z: 3 }
```
## Generics
简单的例子：
```ts
function identity<T>(arg: T): T {
  return arg
}

let num = identity<number>(12) // explicitly invoke  显式的传入类型参数 T => number
let str = identity<string>('hello') // explicitly invoke  显式的传入类型参数 T => string
let strArr = identity(['a','b']) // implicitly invoke  编译器自动推断出类型 T => string[]
```
注意对于 generic function，不能在函数内部把类型参数当作某种具体的类型来使用：
```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);  // Error: 无法确定 arg 是否有 length 方法，因为 T 可以是任何类型
  return arg;
}
```
### Generic Types
与普通函数类型类似，在写泛型函数类型的 signature 时要加上类型参数：
```ts
function identity<T>(arg: T): T {
  return arg
}
let myIdentity1: <T>(arg: T) => T = identity

// 也可将泛型函数类型放到接口中
interface GenericIdentityFn {
  <T>(arg: T): T
}
let myIdentity2: GenericIdentityFn = identity

// 更进一步，可以把类型参数移到接口上，使接口内的其它成员都能使用。
// 但是在使用泛型接口时，需要为类型参数指定具体的类型
interface GenericInterface<T> {
  (arg: T): T
}
let myIdentity3: GenericInterface<number> = identity
```

### Generic Classes
```ts
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
  constructor(val: T, fn: (x: T, y: T) => T) {
    this.zeroValue = val
    this.add = fn
  }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y)
```
### Generic Constraints
前面说过我们不能在泛型函数内部将泛型类型参数当作某种具体的类型去使用：
```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);  // Error: T doesn't have .length
  return arg;
}
```
但是如果我们预先知道我们可能需要使用某些属性，同时又想保留函数的泛型特性，该如何做呢？可以将函数的泛型类型参数加以限制，限制为具有某些特定属性的类型：
```ts
function constraintIdentityFn<T extends { length: number }>(arg: T): T {
  console.log(arg.length)  // 这里，编译器知道了 arg 有 length 属性，所以会通过检查
  return arg
}

// 或者使用一个接口来描述限制
interface ConstraintInterface {
  length: number
}
function constraintIdentityFn<T extends ConstraintInterface>(arg: T): T {
  console.log(arg.length)
  return arg
}

constraintIdentityFn(3)  // Error: Number does not have a .length property
constraintIdentityFn('hello') // Ok
constraintIdentityFn({ value: 3, length: 10 }) // Ok
```
可以声明一个类型参数，同时让它受限于另外一个类型参数
```ts
// 这里类型 K 被类型 T 的 key 限制
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

getProperty({a:1,b:2}, 'a')
getProperty({a:1,b:2}, 'b')
getProperty({a:1,b:2}, 'c')  // error
```

## Enums
枚举让我们可以定义一组名命的常量，TypeScript 支持数值和字符串枚举。
### Numeric enums
```ts
enum Direction {
  Up, // 默认初始化为 0，其后依次递增1
  Down, // 1
  Left, // 2
  Right // 3
}

enum Direction {
  Up = 1, // 初始化为1，其后依次递增1
  Down, // 2
  Left, // 3
  Right // 4
}

enum Direction {
  Up = 3,
  Down, // 4
  Left = 8,
  Right // 9
}

enum Direction {
  Up = 3,
  Down, // 4
  Left = Up, // 3
  Right // 4
}
```
注意，数值型枚举的没有被初始化的成员要么处于第一个位置，要么紧跟在被数值常量(numeric constant)初始化过的成员或被其它常量枚举成员初始化过的成员后面。也就是说下面的例子是不允许的：
```ts
enum notOK {
  A = getSomeValue()
  B // error, A 没有被常量初始化，所以 B 需要一个初始化器
}
```
使用枚举非常简单，可以像访问对象属性一样直接访问枚举的成员:
```ts
enum Response {
  No,
  Yes
}
let answer: Response = Response.No

function respond(recipient: string, message: Response) { }
respond('Princess Caroline', Response.Yes)
```
### String enums
字符串枚举的每个成员都必须被初始化，要么被常量初始化，要么被其它成员初始化：
```ts
enum Direction {
  Up = 'North',
  Down = 'South',
  Left = 'West',
  Right = 'East'
}
```
### Heterogeneous enums
TypeScript 支持，但是不建议用这样的枚举
```ts
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

### Computed and constant members
枚举的每个成员要么是 constant，要么是 computed。

满足以下条件之一的成员是 constant 成员：
- 是枚举的第一个成员，且没有被初始化。此时默认为常量1
- 没有被初始化，但是跟在数值成员的后面。 此时默认值是前面成员的值加1
- 被常量枚举表达式(constant enum expression)初始化。关于常量枚举表达式，请看[官方文档](http://www.typescriptlang.org/docs/handbook/enums.html)。

除此之外其它所有成员被认为是 computed 成员：
```ts
enum myEnum {
  // constant members
  A = 2, // numeric literal
  B, // follow a numeric constant member
  C = B,  // reference to previously defined constant member
  D = AnotherEnum.A, // reference to previously defined constant member from a different enum
  E = A + D, // +, -, *, /, % ... operators with constant member as operands

  // computed member
  F = '123'.length
}
```
### <span id="des">Union enums and enum member types</span>
There is a special subset of constant enum member that aren't calculated: literal enum members. A literal enum member is a constant enum member with no initialized value, or with values that are initialized to
- any string literal (e.g. `'foo', 'bar', 'baz'`)
- any numeric literal (e.g. `1, 100`)
- a unary minus applied to any numeric literal (e.g. `-1, -100`)

When all members in an enum have literal enum values, some special semantics come to play.

首先就是枚举成员也可以当作类型来使用：
```ts
enum ShapeKind { Circle, Square }

interface Circle {
  kind: ShapeKind.Circle
  radius: number
}

interface Square {
  kind: ShapeKind.Square
  sideLength: number
}

let c: Circle = {
  kind: ShapeKind.Square, // error
  radius: 100
}
```
这样的话，枚举本身可以看成是它的所有成员类型的一个联合类型(union type)，而 TypeScript 的类型系统可以根据这个联合类型来帮你捕捉如下代码中 bug：
```ts
enum E { Foo, Bar }

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) { // Error, 因为编译器知道这里 if 条件将永远为 true，所以报错
    //...
  }
}
```
### enums at runtime
在运行时阶段，枚举实际上就是一个对象(查看编译生成的 js 代码即可知)，因此下面的代码可行：
```ts
enum E { Foo, Bar }

function f(obj: {Foo: number}){
  return obj.Foo
}

f(E) // Works，因为 E 有属性 'Foo'，且类型为 number
```

### Reverse mappings
数值型枚举可以逆向映射，从枚举值映射到枚举名：
```ts
enum E { Foo, Bar }
console.log(E[E.Foo]) // 'Foo'
console.log(E[E.Bar]) // 'Bar'
```
字符串型枚举不能逆向映射。

### <i style="color:red">const</i> enums
常量枚举的成员只能使用常量枚举表达式进行初始化，与普通枚举不同，常量枚举在编译期间被完全移除，不会生成对应的 js 代码，常量枚举成员在被引用点会被直接替换成对应的值，因此，常量枚举不能有计算成员。常量枚举使用关键字 `const` 来定义：
```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```
上面的代码编译后生成的 js 代码如下：
```ts
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```
### Ambient enums

## Type Inference
### Basic
在某些地方(变量初始化、对象成员初始化、函数默认参数初始化、函数返回值)如果没有显式提供类型声明，TypeScript 会进行类型推断给出类型信息：
```ts
let x = 3 // 变量 x 被推断出类型为 number

function f(a = 'default Value') { // f 的参数 a 被推断出类型为 string，返回类型被推断为 number
  return a.length
}
```

### Best common type
当类型推断需要在多个表达式中进行时，TypeScript 会在所有候选类型中选出一个最公共的类型来作为推断结果：
```ts
let x = [1, 3, null] // x 的类型被推断为： (number | null)[]

class Animal { }
class Dog extends Animal { }
class Cat extends Animal { }
let y = [new Dog(), new Cat()] // y 的类型被推断为 (Dog | Cat)[]
let z = [new Dog(), new Cat(), new Animal()] // z 的类型被推断为 Animal[]
```
为了推断 `x, y, z` 的类型，必须要考虑数组中每个元素的类型，TypeScript 会通过最优公共类型算法(the best common type algorithm)找出与其它所有类型都兼容的类型作为最终推断结果，如果不存在这样的类型，TypeScript 会将其推断为联合类型(union type)。

### Contextual Typing
```ts
window.onmousedown = function(mouseEvent){
  mouseEvent.button // ok
  mouseEvent.haha // error
}
```
TypeScript 能根据赋值运算符左边的类型推断右边的类型，上面根据 `window.onmousedown` 推断出参数 `mouseEvent` 的类型，访问不存在于 `mouseEvent` 中的属性就会报错。

## Type Compatibility
### Introduction
TypeScript 中的类型兼容性是基于结构子类型(structural subtyping)的，一种类型与另一种类型兼容只需要它们的各个成员都兼容即可：
```ts
 interface Named {
   name: string
 }

 class Person {
   name: string
 }

 let p: Named = new Person() // ok
```
TypeScript 的结构化类型系统的基本规则是：如果 `y` 具有至少与 `x` 完全相同的成员，则 `x` 与 `y` 兼容。例如：
```ts
interface X {
  name: string
}

let x: X
let y = { name: 'Nicholas', age: 27 } // y 的推断类型为：{name: string, age: number}
x = y // ok, y 包含至少与 x 完全相同的成员
```
`y` 是否能赋值给 `x`，编译器会去检查 `x` 的每一个成员是否都能在 `y` 中找到完全兼容的一个成员与之对应。

同样的赋值操作检查也发生在函数调用传参时，接着上面的例子：
```ts
function f(x: X) {
  console.log(x.name)
}

f(y) // ok
```

### Functions

#### 函数参数的兼容性
原始类型以及对象类型之间的兼容性是很直观的，但是两个函数的兼容性就有点复杂了。先看一个简单的例子，两个仅参数列表不相同的函数：
```ts
let x = (a: number) => 0   // x 的类型被推断为 (a: number) => number
let y = (b: number, c: string) => 0  // y 的类型被推断为 (b: number, c: string) => number

y = x // ok
x = y // error
```
编译器在检查 `x` 是否能赋值给 `y` 时，首先检查函数的参数列表， `x` 的每一个参数都必须在 `y` 中有对应的与之兼容的参数(名称可以不同，但是类型和出现的位置必须相同)，才能通过检查。所以上面允许 `y = x` ，不允许 `x = y`。

这看起来好像与对象类型的兼容性检查规则正好相反，但这在
JavaScript 中是很常见的，函数可以忽略额外的函数参数，通过查看编译生成的 js 代码就容易理解了。

#### 返回类型的兼容性
然后来看针对返回类型的检查，两个仅返回类型不同的两个函数：
```ts
let x = () => ({ name: 'Alice' }) // x 的类型被推断为 () => {name: string}
let y = () => ({ name: 'Nicholas', location: 'China' }) // y 的类型被推断为 () => {name: string, location: string}

x = y // ok
y = x // error: x 的返回类型缺少 location 属性
```
TypeScript 要求 source function 的返回类型必须是 target function 的返回类型的子类型，赋值才被允许。

#### Function Parameter Bivariance
前面说到，函数在赋值时进行参数类型检查，如果把函数的参数列表看作一个对象，那么目标函数的参数列表必须是源函数的参数列表的子类型，赋值才被允许。那么就会出现如下这种很常见且合理的需求，但是无法通过类型检查的情况：
```ts
enum EventType { Mouse, KeyBoard }

interface Event { timestamp: number }
interface MSEvent extends Event { x: number; y: number; }
interface KBEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) { }

// 这里 listenEvent 的第二个参数会出现函数赋值的情况，
// 目标函数的参数列表类型可以看作为 Event，源函数的参数列表类型看作为 MSEvent，
// 因为目标参数类型不是源参数类型的子类型，所以赋值不被允许。
// 但是单从函数的调用上来看，这种需求又是合理的，因为 MSEvent 是 Event 的子类。
listenEvent(EventType.Mouse, (e: MSEvent) => console.log(e.x, e.y))  // error

// 但是可以有如下不太理想的替代方案
listenEvent(EventType.Mouse, (e: Event) => console.log((<MSEvent>e).x, (<MSEvent>e).y))
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MSEvent) => console.log(e.x, e.y)))

```
#### Optional Parameters and Rest Parameters
在比较函数的兼容性时，对 optional parameters 和 rest parameters 会做相同的处理，如果一个函数具有 rest parameter，会被当作为具有无限多个 optional parameter 的函数来处理：
```ts
let f1 = (a: string, b?: number) => { }
let f2 = (c: string, d?: number, e?: string) => { }
let f3 = (g: string, h?: string) => { }

f1 = f2 // ok 源参数列表中存在额外的可选参数，可以通过检查
f2 = f1 // ok 目标参数列表中存在额外的可选参数，可以通过检查
f1 = f3 // error 不属于上述两种情况
```
更多细节请看[官方文档](http://www.typescriptlang.org/docs/handbook/type-compatibility.html)。
#### Functions with Overloads
When a function has overloads, each overload in the source type must be matched by a compatible signature on the target type. This ensures that the target function can be called in all the same situations as the source function.

### Enums
枚举类型与数值类型(number)是兼容的：
```ts
enum Color { red, green, blue }
let a: number
let b: Color
a = Color.red // ok
b = 5 // ok
```
但是来自不同枚举类型的枚举值之间是不兼容的：
```ts
enum Color { red, green, blue }
enum Status { ready, waiting }

let c = Color.red
c = Status.ready // error
```

### Classes
类的兼容性规则与对象字面量和接口的规则相似，但是有个例外，当对两个类进行比较时，仅实例成员被比较，静态成员和构造函数不影响类的兼容性：
```ts
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class People {
  name: string
  static remark = "I'm a person"
  constructor(fn: string, ln: string) {
    this.name = fn + ' ' + ln
  }
}

let a = new Animal('Jack')
let p = new People('Nicholas', 'Yang')

// 静态成员和构造函数不影响兼容性，在没有私有和保护成员的情况下，只要各共有成员都兼容，任何两个类都是兼容的
a = p // ok
p = a // ok
```
但是类的私有成员和保护成员会影响两个类的兼容型，当两个类具有私有或保护成员时，它们的实例兼容的必要条件是它们的私有和保护成员同源，即来自于同一个类的声明，否者即使二者具有完全相同的 shape，也不兼容：
```ts
class Animal {
  name: string
  private age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

class People {
  name: string
  private age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

let a = new Animal('Jack',3)
let p = new People('Nicholas', 18)

// 虽然两个类有完全相同的shape，但是它们的私有成员来自不同的类声明，所以不兼容
a = p // error
p = a // error
```
### Generics
由于 TypeScript 是结构类型系统，因此泛型类型的类型参数仅在作为成员类型的一部分使用时才会影响结果类型：
```ts
interface Empty<T> { }
let x: Empty<number>
let y: Empty<string>
x = y // ok, 类型参数没有在成员中使用，不影响结果类型的兼容性

interface notEmpty<T> {
  data: T
}
let a: notEmpty<number>
let b: notEmpty<string>
a = b // error, 类型参数是成员类型的一部分
```

## [Advanced Types](http://www.typescriptlang.org/docs/handbook/advanced-types.html)
### Intersection Types (交叉类型)
交叉类型就是把多个不同的类型组合成一个类型，让它拥有这些类型的所有特性，例如 `Person & Serializable & Loggable` 是 `Person`， `Serializable`，`Loggable` 这三种类型的交叉类型，这个交叉类型的实例将拥有这三个类型的所有成员。
### Union Types (联合类型)
联合类型和交叉类型很相似，但是使用方式截然不同。在 JavaScript 中我们经常有这样的需求，一个函数某个参数可以是多种不同的类型，例如下面的例子：
```ts
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: any) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // "    Hello world"
padLeft("Hello world", 'Nicholas, ') // "Nicholas, Hello world"
padLeft("Hello world", {}) // passes at compile time, fails at runtime.
```
在提到联合类型之前只能像这样实现，这也是 JavaScript 中的解决方式，但是有一个问题是参数 `padding` 的类型是 `any`，意味着这个 `padding` 参数可以接受任何类型的值，而不仅仅是 `string` 和 `number`，这与 TypeScript 类型控制的灵魂背道而驰，解决办法就是使用联合类型：
```ts
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
}
padLeft("Hello world", 4) // ok
padLeft("Hello world", 'Nicholas, ') // ok
padLeft("Hello world", true) // error, fails at compile time
```
联合类型的意思是这个类型的实例可以是多种类型之一，每个类型用符号 `|` 分隔，例如 `string | number| boolean` 是 `string`，`number` 和 `boolean` 的一个联合类型。

如果一个变量是联合类型，我们只能通过这个变量访问这个联合的所有类型的共有部分：
```ts
interface Fish {
  swim(): void
  layEggs(): void
}

interface Bird {
  fly(): void
  layEggs(): void
}

function getSmallPet(): Fish | Bird {
  return { swim() {}, layEggs() {} }
}

let pet = getSmallPet()
pet.layEggs()
pet.swim() // error
pet.fly() // error
```
### Type Guards and Differentiating Types
如上面例子看到的那样，`getSmallPet` 虽然返回一个 `Fish` 和 `Bird` 的联合类型，但是我们只能访问这两个类型共有的成员 `layEggs`，即使在运行时阶段(runtime)可以确定返回类型为 `Fish`，但是 `pet.swim()` 依然无法通过编译检查。这使得联合类型在某些时候显得有点 tricky，不过也有应对办法，最简单直观的就是使用类型断言(type assertion):
```ts
let pet = getSmallPet()

if ((<Fish>pet).swim) {
  (<Fish>pet).swim()
} else {
  (<Bird>pet).fly()
}
```
上面的方法虽然可行，但是不够简洁，我们需要进行多次类型断言，一个更好的解决方案是使用类型守卫(type guards).
#### User-Defined Type Guards
一个 type guard 是一个表达式，这个表达式用来执行运行时类型检查。要定义一个 type guard，只需要定义一个返回类型为类型谓词(type predicate)的函数即可：
```ts
function isFish(pet: Fish|Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined
}
```
这里的 `pet is Fish` 就是类型谓词(type predicate)，类型谓词遵循 `parameterName is Type` 这样的形式，其中 `parameterName` 必须是来自当前函数参数列表的参数名。任何时候，只要 `isFish` 在某个兼容的变量上调用，TypeScript 就会将这个变量的类型缩窄到具体的类型：
```ts
let pet = getSmallPet()

if (isFish(pet)) {
  pet.swim()
} else {
  pet.fly()
}
```
可以看到，通过 type guard 之后，TypeScript 不仅知道在 `if` 分支，`pet` 的类型是 `Fish`，而且也知道在 `else` 分支，`pet` 的类型是 `Bird`。

#### <span style="color:red">typeof</span> type guards
我们回到前面 `padLeft` 函数的例子，可以定义两个 user-defined type guard 来将其改写为：
```ts
function isNumber(x: any): x is Number {
  return typeof x === 'number'
}

function isString(x: any): x is String {
  return typeof x === 'string'
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```
然而必须定义一个函数来确定一个类型是否为原始类型(primitive)是很痛苦的，幸运的是，TypeScript 可以将 `typeof x === 'number'` 这样的语句直接视为 <span style="color:red">typeof</span> type guard，而不必将 `typeof x === 'number'` 封装到 user-defined type guard 中。这意味着下面的代码就已经包含了 type guard：
```ts
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") { // typeof type guard
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") { // typeof type guard
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```
<span style="color:red">typeof</span> type guard 有两种形式，`typeof v === typename` 和 `typeof v !== typename`，其中 `typename` 必须为 `'number'`，`'string'`，`'boolean'`，`'symbol'` 四者之一，若为其它值，TypeScript 则不会将这个表达式视为 type guard。

#### <span style="color:red">instanceof</span> type guards
对于非原始类型，即类的实例，使用 `instanceof` 进行 type guard，`instanceof` 左边是实例对象，右边是类的构造函数：
```ts
interface Padder {
  getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) { }
  getPaddingString() {
      return Array(this.numSpaces + 1).join(" ");
  }
  getNumberOfSpace() {
    return this.numSpaces
  }
}

class StringPadder implements Padder {
  constructor(private value: string) { }
  getPaddingString() {
      return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5 ?
      new SpaceRepeatingPadder(4) :
      new StringPadder("  ");
}

let padder = getRandomPadder()

if (padder instanceof StringPadder) {
  // padder 缩窄为 StringPadder 类型
  padder.getPaddingString()
} else {
  // padder 缩窄为 SpaceRepeatingPadder 类型
  padder.getPaddingString() // ok
  padder.getNumberOfSpace() // ok
}
```
### Nullable Types
TypeScript 有两个特殊类型：`null` 和 `undefined`，默认情况下，`null` 和 `undefined` 可以赋值给任何类型的变量。也就是说在默认情况下，当你声明某个类型的变量时，实际上变量的类型是当前声明类型与 `null` 和 `undefined` 的联合类型。这可能不是我们想要的效果，要解决这个问题，可以在配置文件 `tsconfig.json` 中将 `compilerOptions.strictNullChecks` 选项设置为 `true`：
```json
{
  "compilerOptions": {
    // ...
    "strictNullChecks": true
  }
}
```
这样设置之后，声明变量时就不会自动包含 `null` 和 `undefined` 类型，除非你显式的声明为联合类型。

当开启了严格空检查之后，可选参数/属性(optional parameters / properties)的类型会自动加上 `| undefined`：
```ts
// optional parameters
function f(x: number, y?:number) { // y 的类型为 number | undefined
  return x + (y || 0)
}

f(2) // ok
f(2, undefined) // ok
f(2, null) // error, null 类型不能赋值给 number | undefined 类型

// optional properties
interface I {
  a: number
  b?: number // b 的实际类型为： number | undefined
}

let i = <I>{}
i.a = 2 // ok
i.a = undefined // error, undefined 不能赋值给 number
i.b = 3 // ok
i.b = undefined // ok
i.b = null // error， null 不能赋值给 number | undefined
```
#### Type guards and type assertions
由于 nullable 类型是通过 union 实现的，因此在使用 nullable 类型时需要先消除空类型：
```ts
function broken(name: string | null) {
  return name.charAt(0).toUpperCase() + name.slice(1) // error, name is possibly undefined
}
// 在 JavaScript 中常用如下方法消除空值
function fixed(name: string | null) {
  name = name || 'default'
  return name.charAt(0).toUpperCase() + name.slice(1) // ok
}
```
但是当遇到如下这种情况时，上面消除空类型的方法又不可行：
```ts
function broken(name: string | null) {
  function greeting(greet: string) {
    return name.charAt(0).toUpperCase() + name.slice(1) + ', ' + greet  // error, name is possibly undefined
  }
  name = name || 'default'
  return greeting('hello')
}
```
上面编译器无法消除空类型的原因是，函数内部的嵌套函数的执行上下文是不确定的，编译器无法跟踪嵌套函数所有的调用，尤其是如果嵌套函数被 return 到函数外部，当这个函数被执行时，它内部变量例如 `name` 的类型是不明确的。

在这种情况下需要使用类型断言操作符(type assertion operator) `!` 来手动的消除空值，语法为：`identifier!`，这将移除变量 `identifier` 的类型中的 `undefined` 和 `null`：
```ts
function fixed(name: string | null) {
  function greeting(greet: string) {
    return name!.charAt(0).toUpperCase() + name!.slice(1) + ', ' + greet  // ok
  name = name || 'default'
  return greeting('hello')
}
```

### Type Aliases (类型别名)
类型别名，顾名思义，就是为某个类型创建一个新的名字，并没用创建一个新的类型。类型别名与接口的概念有点类似，但是可以为包括原始类型，联合类型等任何其它类型创建别名：
```ts
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver

function getName(p: NameOrResolver): Name {
  if(typeof p === 'string') {
    return p
  } else {
    return p()
  }
}
```
> 注意：为原始类型创建别名不是常见的用法，尽管它可以作为编写文档的一种形式。

类似接口，类型别名也可以是泛型的：
```ts
type Container<T> = { value: T }
```
也可以像下面这样在属性中嵌套的引用类型别名本身：

```ts
type Tree<T> = {
  value: T
  left: Tree<T>
  right: Tree<T>
}
```
除此之外，类型别名不能出现在声明语句右边的任何位置，下面这样是错误的：
```ts
type myAlias = Array<myAlias> // error
```
#### Interfaces vs. Type Aliases
如前面所说的，类型别名可以跟接口非常相似，但是它们之间还是有一些微妙的差别。其中一个重要的差别是，type aliases 不能被扩展(extended)和实现(implemented)，也不能去扩展和实现其它类型，当需要完成这样的任务时，请使用接口。

### String Literal Types
字符串字面量类型允许你为一个字符串变量指定一个确定的值。字符串字面量类型通常与联合类型，类型守卫以及类型别名一起使用，你可以使用这些特性去模拟字符串枚举的行为：
```ts
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === 'ease-in') {
      // ...
    } else if (easing === 'ease-out') {
      // ...
    } else if (easing === 'ease-in-out') {
      // ...
    } else {
      // error
    }
  }
}

let button = new UIElement()
button.animate(0, 0, 'ease-in') // ok
button.animate(0, 0, 'uneasy') // error，'uneasy' 类型不能赋值给 'ease-in' | 'ease-out' | 'ease-in-out' 类型
```
如上面看到的，你只能传递三个允许的字符，其它任何值都会造成错误。

### Numeric Literal Types
与字符串字面量类型类似，也有数值字面量类型：
```ts
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  // 只能返回 1，2，3，4，5，6，这六个数字之一，返回任何其它值都是错误
}
```

### Enum Member Types
前面讲[枚举](#des)的时候有说过，枚举成员也可以当作类型来使用，整个枚举可以看作是枚举成员类型的一个联合(union)。

### Discriminated Unions
你可以结合使用单例类型(singleton types)，联合类型(union types)，类型守卫(type guards)以及类型别名(type aliases)来创建更高级的模式，即 discriminated unions。
> 通常我们说的单例类型(singleton types)，指的就是枚举成员类型以及数值/字符串字面量类型。

要实现 discriminated unions，需要实现下面三点：
1. 被联合的所有类型都有一个相同的的单例类型属性 -- the discriminant
```ts
// 每个类型都有属性 kind，且为单例类型
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}
```
2. 创建一个联合类型
```ts
type Shape = Square | Rectangle | Circle
```
3. 使用 discriminated union：
```ts
function area(s: Shape) {
  switch (s.kind) {
    // 这里会有一个隐式的 type guard 的效果
    // 编译器能够通过 s.kind 属性的 singleton type 来缩窄 s 的类型
    case "square": return s.size * s.size; // s 的类型被缩窄为 Square
    case "rectangle": return s.height * s.width; // s 的类型被缩窄为 Rectangle
    case "circle": return Math.PI * s.radius ** 2; // s 的类型被缩窄为 Circle
  }
}
```
继续看下面的情况，还是上面的 `area` 函数，如果将 `switch` 的分支减少一个：
```ts
function area(s: Shape) {
  switch (s.kind) {
    case "square": return s.size * s.size;
    case "rectangle": return s.height * s.width;
}

area({ kind: 'circle', radius: 3 }) // ok，undefined
```
可以看到，即使 `switch` 的分支没有覆盖 `s` 的 discriminated union 的所有情况，编译器也不会提示错误。在这种情况下如果我们希望在编译阶段就发现问题，可以打开严格空检查设置 `--strictNullChecks`，并为函数显式指定返回类型，比如为 `area` 函数显式的指定返回类型为 number，下面的代码就不能通过编译检查：
```ts
function area(s: Shape): number { // error, Function lacks ending return statement and return type does not include 'undefined'
  switch (s.kind) {
    case "square": return s.size * s.size;
    case "rectangle": return s.height * s.width;
}
```
更多用法请看官方文档。

### Polymorphic <span style="color:red">this</span> types (多态的 this 类型)
多态的 this 类型，顾名思义 this 代表的类型是多态的，不是固定的，请看下面的例子：
```ts
class BasicCalculator {
  constructor(protected value: number = 0) { }
  currentValue(): number {
    return this.value
  }
  add(operand: number): this { // 返回 polymorphic this 类型
    this.value += operand
    return this
  }
  multiply(operand: number): this { // 返回 polymorphic this 类型
    this.value *= operand
    return this
  }
}

let b = new BasicCalculator(2).add(1).multiply(5).currentValue()
```
因为 `add`，`multiply` 方法返回对象本身，因此可以写链式调用方法的语句。现在我们扩展 `BasicCalculator` 类：
```ts
class ScientificCalculator extends BasicCalculator {
  constructor(value = 0) {
    super(value)
  }
  sin(): this { // 返回 polymorphic this 类型
    this.value = Math.sin(this.value)
    return this
  }
}
let s = new ScientificCalculator(3).add(4).sin().multiply(5).currentValue() // ok
```
可以看到这里的链式调用语句也能正常工作，这正是因为 `BasicCalculator` 的 `add` 和 `multiply` 方法返回的是 polymorphic this 类型，它能保证 `add` 和 `multiply` 在被调用时，将实际返回类型绑定到正确实例类型上。反之，如果 `add` 和 `multiply` 不是返回 polymorphic this 类型，而是返回具体的类类型，`ScientificCalculator` 的实例将无法继续使用链式调用，因为 `add` 将始终返回 `BasicCalculator`, 而 `BasicCalculator` 没有 `sin` 方法：
```ts
class BasicCalculator {
  constructor(protected value: number = 0) { }
  currentValue(): number {
    return this.value
  }
  add(operand: number): BasicCalculator { // 返回 BasicCalculator
    this.value += operand
    return this
  }
  multiply(operand: number): BasicCalculator { // 返回 BasicCalculator
    this.value *= operand
    return this
  }
}

class ScientificCalculator extends BasicCalculator {
  constructor(value = 0) {
    super(value)
  }
  sin(): this { // 返回 polymorphic this 类型
    this.value = Math.sin(this.value)
    return this
  }
}

new ScientificCalculator(3).add(4).sin() // error, Property 'sin' dose not exist on type 'BasicCalculator'
```

### Index types
利用索引类型，编译器可以检查使用动态属性名的代码，例如 JavaScript 中很常见的代码：
```ts
function pluck(o, names) {
  return names.map(n => o[n])
}
```
在 TypeScript 中利用索引类型查询(index type query)和索引访问操作符(indexed access operator)，可以这样写这个函数：
```ts
function pluck<T, K extends keyof T>(o: T, names: k[]): T[k][] {
  return names.map(n => o[n])
}

let person = {
  name: 'Nicholas',
  age: 34
}

let subset1 = pluck(person, ['name']) // ok
let subset2 = pluck(person, ['name', 'age']) // ok
let subset3 = pluck(person, ['gender']) // error
```
这样 TypeScript 就可以加入类型检查，例如上面 `names` 的元素必须是 `person` 的属性，否则不能通过编译。

上面使用的到的操作符 `keyof` 称作索引类型查询操作符(index type query operator)，对于任意类型 `T`，`keyof T` 代表的是 `T` 的所有公有属性名的联合类型：
```ts
interface Person {
  name: string
  age: number
  gender: string
}

class Book {
  constructor(
    public author: Person,
    public title: string,
    public price: number,
    private publisher: string,
  ) {}
}

type personProps = keyof Person // "name" | "age" | "gender"
type bookProps = keyof Book // "author" | "title" | "price"，不包含 "publisher"
```
第二个用到的操作符是 `T[K]`，即索引访问操作符(indexed access operator)，这里类型语法也反映了表达式语法，即 `person["name"]` 具有 `Person["name"]` 类型，在上面的例子中就是 `string` 类型，然而在泛型上下文里，`T[K]` 的类型是根据 `T` 和 `K` 的类型动态确定的，这正是它的强大之处：
```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name] // o[name] 的类型为 T[K]
}

let name = getProperty(person, 'name')  // string
let age = getProperty(person, 'age') // number
```
### Mapped types
这个类型太高级，详情请看[官方文档](http://www.typescriptlang.org/docs/handbook/advanced-types.html)。
### Conditional Types
TypeScript 2.8 版本引入了条件类型，形式如下：
```ts
T extends U ? X : Y
```
意思是，如果 `T` 可赋给 `U`，结果类型为 `X`，否者为 `Y`。

一个条件类型 `T extends U ? X : Y` 要么被解析为 `X` 或 `Y`，要么被延迟解析，当条件判断依赖于一个或多个类型参数时就会出现延迟解析。是否解析为 `X` 或 `Y`, 或推迟解析，取决于类型系统是否有足够的信息去推断出 `T` 是否总是可以赋给 `U`.

详情请看[官方文档](http://www.typescriptlang.org/docs/handbook/advanced-types.html)

2.8 版本预定义了几个条件类型：

- `Exclude<T, U>`：Exclude from `T` those types that are assignable to `U`
- `Extract<T, U>`：Extract from `T` those types that are assignable to `U`
- `NonNullable<T>`：Exclude `null` and `undefined` from `T`
- `ReturnType<T>`：Obtain the return type of a function type
- `InstanceType<T>`：Obtain the instance type of a constructor function type

```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // never
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // never
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```
## Modules
TypeScript 继承了 ES6 中 modules 的概念，modules 在它自己的作用域内被执行，而不是在全局作用域。
在一个 module 中声明的变量、函数、类等等在其它 modules 中是不可见的，除非显式的将这些变量导出。而要在一个module 中使用其它 modules 导出的变量，必须先将这些变量导入。

任何包含 top-level `import` 或 `export` 的文件都被视为 module，而不包含 top-level `import` 或 `export` 的文件被视为普通脚本，它里面的内容暴露在全局作用域内。

### Export
#### Exporting a declaration
使用关键字 `export` 可以导出任何声明，例如 variable, function, class, interface, type alias, enum 等等：

*module.ts*
```ts
// 导出 interface
export interface StringValidator {
  isAcceptable(s: string): boolean
}
// 导出 variable
export const numberRegexp = /^[0-9]+$/
// 导出 class
export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}
```
*module.ts* 也可以改写为：
```ts
interface StringValidator {
  isAcceptable(s: string): boolean
}

const numberRegexp = /^[0-9]+$/

class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}

// 按原名导出
export { StringValidator, numberRegexp }
// 按别名 validatorAlias 导出
export { ZipCodeValidator as validatorAlias }
```
#### Re-exports
如果一个模块要扩展另一个模块，并暴露它的一部分功能，可以使用 re-export 语法：

*extended-module.ts*
```ts
export class ParseIntBasedZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && parseInt(s).toString() === s
  }
}
// 以别名的方式重新导出 ZipCodeValidator
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from './module'
// re-export 整个 module
export * from './module'
```
re-export 不会将 original module 导入到当前 module 的作用域，也不会引入一个本地变量。

### Import
*another-module.ts*

```ts
import { StringValidator, numberRegexp, ZipCodeValidator } from './module';

let myValidator = new ZipCodeValidator()
```
导入变量时也可以重命名：
```ts
import { ZipCodeValidator as ZipCodeAlias } from './module';

let myValidator = new ZipCodeAlias()
```
将整个 module 作为一个变量导入：
```ts
import * as Validator from './module';

let myValidator = new Validator.ZipCodeValidator()
class NewValidator implements Validator.StringValidator {
  // ...
}
```
### Default exports
每个 module 可以有一个 `default` 导出，而且只能有一个

*default-export-module.ts*
```ts
export default class ParseIntBasedZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && parseInt(s).toString() === s
  }
}
```
使用 `export default` 导出的模块，导入的方式也有所不同：
*import-default-module.ts*
```ts
import Validator from './default-export-module'

let myValidator = new Validator()
```
`default` 导出可以导出 anonymous function：
*anonymous.ts*
```ts
export default (s: string) => { return s.length }
```
*test.ts*
```ts
import myFunc from './anonymous'

let len = myFunc('hello')  // 5
```
甚至可以导出字面常量：
*OneTwoThree.ts*
```ts
export default '123'
```
*log.ts*
```ts
import num from './OneTwoThree'

console.log(num) // '123'
```

### `export =` and `import = require()`
TypeScript 支持模拟传统 CommonJS 和 AMD 的工作流。

`export =` 语法用于导出单个对象，可以是一个 class、interface、namespace、function、enum：

*ZipCodeValidator.ts*
```ts
let numberRegexp = /^[0-9]+$/
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator
```
对于使用 `export =` 导出的模块，必须使用 `import module = require('module')` 语法导入：

*Test.ts*
```ts
import zip = require('./ZipCodeValidator)

// Some samples to try
let strings = ["Hello", "98052", "101"]

// Validators to use
let validator = new zip()

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(`"${ s }" - ${ validator.isAcceptable(s) ? "matches" : "does not match" }`);
})
```
关于 Module 的更多内容可以参考[这里](https://basarat.gitbooks.io/typescript/content/docs/project/modules.html)
