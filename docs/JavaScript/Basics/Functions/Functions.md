# Functions in JavaScript

A function is a reusable block of code that performs a task. It can accept inputs (parameters) and return an output.

## Function Declaration

```js
function greet(name) {
  return `Hello, ${name}!`;
}

greet("Sam"); // "Hello, Sam!"
```

Function declarations are hoisted, so they can be called before they are defined.

## Function Expression

```js
const greet = function (name) {
  return `Hello, ${name}!`;
};
```

Function expressions are not hoisted.

## Arrow Function

```js
const greet = (name) => `Hello, ${name}!`;

const add = (a, b) => a + b;

const square = n => n * n;

const log = () => {
  console.log("No parameters");
};
```

Arrow functions do not have their own `this`.

## Parameters and Arguments

```js
function add(a, b) {   // a, b are parameters
  return a + b;
}

add(2, 3);             // 2, 3 are arguments
```

## Default Parameters

```js
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

greet();        // "Hello, Guest!"
greet("Sam");   // "Hello, Sam!"
```

## Rest Parameters

Collects any number of arguments into an array.

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4); // 10
```

## Return Value

A function returns `undefined` if there is no `return` statement. A `return` ends the function immediately.

```js
function check(n) {
  if (n > 0) return "positive";
  return "not positive";
}
```

## Returning Multiple Values

```js
function minMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}

const [min, max] = minMax([3, 1, 2]);
```

## Immediately Invoked Function Expression (IIFE)

A function that runs as soon as it is defined.

```js
(function () {
  console.log("Runs immediately");
})();
```

## Scope

Variables declared inside a function are not accessible outside it.

```js
function demo() {
  const inside = "local";
}

// inside is not accessible here
```

## Recursion

A function that calls itself.

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

factorial(5); // 120
```

## Methods

A function stored as an object property.

```js
const user = {
  name: "Sam",
  sayHi() {
    return `Hi, I'm ${this.name}`;
  },
};

user.sayHi();
```

## Functions as Values

Functions are first-class: they can be stored in variables, passed as arguments, and returned from other functions.

```js
const operations = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};

operations.add(2, 3); // 5
```
