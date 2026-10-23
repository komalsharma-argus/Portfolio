# ES6 Classes & Inheritance in JavaScript

ES6 classes provide a cleaner syntax for creating objects and implementing inheritance. They are built on top of prototypes.

## Defining a Class

```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

const user = new User("Sam", 25);
user.greet(); // "Hi, I'm Sam"
```

- `constructor` runs when a new instance is created.
- Methods are placed on the class's prototype and shared by all instances.
- A class must be called with `new`.

## Class Expressions

```js
const User = class {
  constructor(name) {
    this.name = name;
  }
};
```

## Class Fields

```js
class Counter {
  count = 0;

  increment() {
    this.count++;
  }
}
```

## Private Fields and Methods

Prefix with `#` to make them accessible only inside the class.

```js
class Account {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }

  #log(message) {
    console.log(message);
  }
}

const acc = new Account();
acc.deposit(100);
acc.getBalance(); // 100
acc.#balance;     // SyntaxError
```

## Getters and Setters

```js
class Circle {
  constructor(radius) {
    this._radius = radius;
  }

  get area() {
    return Math.PI * this._radius ** 2;
  }

  set radius(value) {
    if (value <= 0) throw new Error("Invalid radius");
    this._radius = value;
  }
}

const c = new Circle(5);
c.area;      // 78.53...
c.radius = 10;
```

## Static Members

Belong to the class itself, not to instances.

```js
class MathHelper {
  static PI = 3.14159;

  static square(n) {
    return n * n;
  }
}

MathHelper.square(4); // 16
MathHelper.PI;        // 3.14159
```

## Inheritance with extends

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  bark() {
    return `${this.name} says woof`;
  }
}

const rex = new Dog("Rex");

rex.eat();  // "Rex is eating"
rex.bark(); // "Rex says woof"

rex instanceof Dog;    // true
rex instanceof Animal; // true
```

## super in the Constructor

In a child class, `super()` must be called before using `this`.

```js
class Dog extends Animal {
  constructor(name, breed) {
    super(name);        // calls the parent constructor
    this.breed = breed;
  }
}
```

## Overriding Methods and Using super

```js
class Dog extends Animal {
  eat() {
    return `${super.eat()} (and wagging its tail)`;
  }
}
```

## Inheriting Static Methods

```js
class Parent {
  static create() {
    return new this();
  }
}

class Child extends Parent {}

Child.create() instanceof Child; // true
```

## Checking Types

```js
rex instanceof Dog;                     // true
Object.getPrototypeOf(Dog) === Animal;  // true
```

## Classes Are Not Hoisted Like Functions

```js
const a = new A(); // ReferenceError
class A {}
```

## Classes Are Functions Underneath

```js
typeof User; // "function"
```

## Key Points

- Use `class` to define blueprints and `new` to create instances.
- Use `extends` for inheritance and `super` to reach the parent.
- Use `#name` for private members and `static` for class-level members.
- Class syntax is a cleaner way to work with prototypes.
