# Higher Order Functions in JavaScript

A higher order function is a function that does at least one of the following:

- Takes one or more functions as arguments.
- Returns a function as its result.

This works because functions in JavaScript are first-class values.

## Taking a Function as an Argument

```js
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}

repeat(3, (i) => console.log(`Run ${i}`));
```

## Returning a Function

```js
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
double(5); // 10
```

## Built-in Higher Order Functions

### map()

Transforms each element and returns a new array.

```js
[1, 2, 3].map(n => n * 2); // [2, 4, 6]
```

### filter()

Returns a new array with elements that pass a test.

```js
[1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]
```

### reduce()

Reduces an array to a single value.

```js
[1, 2, 3, 4].reduce((sum, n) => sum + n, 0); // 10
```

### forEach()

Runs a function for each element.

```js
[1, 2, 3].forEach(n => console.log(n));
```

### sort()

Sorts using a compare function.

```js
[3, 1, 2].sort((a, b) => a - b); // [1, 2, 3]
```

### find(), some(), every()

```js
[1, 2, 3].find(n => n > 1);   // 2
[1, 2, 3].some(n => n > 2);   // true
[1, 2, 3].every(n => n > 0);  // true
```

## Chaining

```js
const total = [1, 2, 3, 4, 5]
  .filter(n => n % 2 !== 0)
  .map(n => n * 10)
  .reduce((sum, n) => sum + n, 0);

console.log(total); // 90
```

## Custom Higher Order Function

```js
function applyOperation(a, b, operation) {
  return operation(a, b);
}

applyOperation(4, 2, (x, y) => x + y); // 6
applyOperation(4, 2, (x, y) => x * y); // 8
```

## Function Wrapper

```js
function withLogging(fn) {
  return function (...args) {
    console.log("Calling with", args);
    const result = fn(...args);
    console.log("Result:", result);
    return result;
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);

loggedAdd(2, 3);
```

## Key Points

- A higher order function accepts and/or returns functions.
- Array methods like `map`, `filter`, and `reduce` are common examples.
- They make code shorter, reusable, and more declarative.
