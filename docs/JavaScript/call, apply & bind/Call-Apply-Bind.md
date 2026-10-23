# call, apply, bind in JavaScript

`call`, `apply`, and `bind` are function methods used to set the value of `this` explicitly when invoking a function.

## The Problem

```js
const user = {
  name: "Sam",
  greet(greeting) {
    return `${greeting}, ${this.name}`;
  },
};

const greet = user.greet;
greet("Hello"); // `this` is lost -> "Hello, undefined"
```

## call()

Calls the function immediately with a given `this` and arguments passed individually.

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "Sam" };

greet.call(person, "Hello", "!"); // "Hello, Sam!"
```

Syntax: `func.call(thisArg, arg1, arg2, ...)`

## apply()

Same as `call()`, but arguments are passed as an array.

```js
greet.apply(person, ["Hello", "!"]); // "Hello, Sam!"
```

Syntax: `func.apply(thisArg, [argsArray])`

```js
Math.max.apply(null, [3, 7, 2]); // 7
```

## bind()

Returns a new function with `this` permanently set. It does not call the function immediately.

```js
const greetSam = greet.bind(person);

greetSam("Hello", "!"); // "Hello, Sam!"
```

Syntax: `const newFunc = func.bind(thisArg, arg1, arg2, ...)`

## Partial Application with bind

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);

double(5); // 10
```

## Borrowing Methods

```js
const user1 = {
  name: "Sam",
  sayHi() {
    return `Hi, ${this.name}`;
  },
};

const user2 = { name: "Alex" };

user1.sayHi.call(user2); // "Hi, Alex"
```

## Fixing `this` in Callbacks

```js
const counter = {
  count: 0,
  start() {
    setTimeout(
      function () {
        this.count++;
        console.log(this.count);
      }.bind(this),
      1000
    );
  },
};

counter.start(); // 1
```

## Comparison

| Method | Calls immediately | Arguments | Returns |
| --- | --- | --- | --- |
| `call` | Yes | Individually | Function result |
| `apply` | Yes | As an array | Function result |
| `bind` | No | Individually (optional) | New function |
