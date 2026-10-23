# Callback Function in JavaScript

A callback function is a function passed as an argument to another function, to be called later by that function.

## Basic Example

```js
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

function done() {
  console.log("Greeting finished.");
}

greet("Sam", done);
// Hello, Sam!
// Greeting finished.
```

## Inline and Arrow Callbacks

```js
greet("Sam", function () {
  console.log("Done");
});

greet("Sam", () => console.log("Done"));
```

## Callbacks with Arguments

```js
function calculate(a, b, operation) {
  return operation(a, b);
}

calculate(2, 3, (x, y) => x + y); // 5
calculate(2, 3, (x, y) => x * y); // 6
```

## Callbacks in Built-in Methods

Many array methods accept callbacks.

```js
const nums = [1, 2, 3];

nums.map(n => n * 2);
nums.filter(n => n > 1);
nums.forEach(n => console.log(n));
```

## Synchronous Callbacks

Called immediately, in order, while the main function is running.

```js
[1, 2, 3].forEach(n => console.log(n));
```

## Asynchronous Callbacks

Called later, after an operation finishes.

```js
console.log("Start");

setTimeout(() => {
  console.log("Callback after 1 second");
}, 1000);

console.log("End");
// Start
// End
// Callback after 1 second
```

## Error-First Callbacks

A common convention where the first argument of the callback is an error (or `null`).

```js
function fetchData(callback) {
  const success = true;

  if (success) {
    callback(null, { id: 1 });
  } else {
    callback(new Error("Failed to fetch"));
  }
}

fetchData((error, data) => {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(data);
});
```

## Callback Hell

Nesting many callbacks makes code hard to read and maintain.

```js
step1(function (result1) {
  step2(result1, function (result2) {
    step3(result2, function (result3) {
      console.log(result3);
    });
  });
});
```

Ways to avoid it: use named functions, keep nesting shallow, or use Promises and `async/await`.

## Key Points

- A callback is just a regular function passed as a value.
- Pass the function itself, not its result: `greet("Sam", done)`, not `greet("Sam", done())`.
- Callbacks can run synchronously or asynchronously.
