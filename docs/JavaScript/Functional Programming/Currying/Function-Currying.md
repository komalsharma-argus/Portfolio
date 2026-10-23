# Function Currying in JavaScript

Currying is a technique that transforms a function taking multiple arguments into a sequence of functions that each take a single argument.

`f(a, b, c)` becomes `f(a)(b)(c)`

## Basic Example

```js
// Normal function
function add(a, b) {
  return a + b;
}

add(2, 3); // 5

// Curried function
function curriedAdd(a) {
  return function (b) {
    return a + b;
  };
}

curriedAdd(2)(3); // 5
```

## Arrow Function Version

```js
const add = a => b => a + b;

add(2)(3); // 5
```

## Three Arguments

```js
const volume = l => w => h => l * w * h;

volume(2)(3)(4); // 24
```

## Partial Application

A curried function can be called with some arguments now and the rest later.

```js
const multiply = a => b => a * b;

const double = multiply(2);
const triple = multiply(3);

double(5); // 10
triple(5); // 15
```

## Why Currying Works: Closures

Each inner function remembers the arguments from the outer functions through closure.

```js
function greet(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = greet("Hello");

sayHello("Sam");  // "Hello, Sam!"
sayHello("Alex"); // "Hello, Alex!"
```

## Generic curry Function

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

curriedSum(1)(2)(3);  // 6
curriedSum(1, 2)(3);  // 6
curriedSum(1)(2, 3);  // 6
curriedSum(1, 2, 3);  // 6
```

`fn.length` is the number of parameters the original function expects.

## Practical Example

```js
const log = level => message => `[${level}] ${message}`;

const info = log("INFO");
const error = log("ERROR");

info("Server started");  // "[INFO] Server started"
error("Server crashed"); // "[ERROR] Server crashed"
```

## With Array Methods

```js
const isGreaterThan = limit => n => n > limit;

[1, 5, 10, 15].filter(isGreaterThan(8)); // [10, 15]
```

## Currying vs Partial Application

| Currying | Partial Application |
| --- | --- |
| Converts `f(a, b, c)` into `f(a)(b)(c)` | Fixes some arguments and returns a function for the rest |
| Each function takes one argument | Returned function can take any number of arguments |

## Key Points

- Currying turns a multi-argument function into nested single-argument functions.
- It relies on closures to remember earlier arguments.
- It helps create reusable, specialized functions.
