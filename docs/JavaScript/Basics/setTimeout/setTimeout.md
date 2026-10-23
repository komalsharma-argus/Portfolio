# setTimeout in JavaScript

`setTimeout()` runs a function once after a specified delay (in milliseconds).

## Syntax

```js
setTimeout(callback, delay, arg1, arg2, ...);
```

| Parameter | Description |
| --- | --- |
| `callback` | The function to run after the delay |
| `delay` | Time to wait in milliseconds (default `0`) |
| `arg1, arg2, ...` | Optional arguments passed to the callback |

It returns a numeric ID (in browsers) that identifies the timer.

## Basic Example

```js
setTimeout(() => {
  console.log("Runs after 2 seconds");
}, 2000);
```

## Passing Arguments

```js
function greet(name, message) {
  console.log(`${message}, ${name}!`);
}

setTimeout(greet, 1000, "Sam", "Hello");
// Hello, Sam!
```

## Using a Named Function

```js
function sayHi() {
  console.log("Hi!");
}

setTimeout(sayHi, 1000); // pass the function, do not call it
```

## Cancelling with clearTimeout

```js
const timerId = setTimeout(() => {
  console.log("This will not run");
}, 3000);

clearTimeout(timerId);
```

## Asynchronous Behavior

`setTimeout` does not block the code that follows it.

```js
console.log("Start");

setTimeout(() => console.log("Timeout"), 1000);

console.log("End");
// Start
// End
// Timeout
```

## Zero Delay

Even with a delay of `0`, the callback runs after the current code finishes.

```js
setTimeout(() => console.log("Timeout"), 0);
console.log("Sync");
// Sync
// Timeout
```

## The `this` Keyword

In a regular function callback, `this` is not the surrounding object. Use an arrow function to keep it.

```js
const user = {
  name: "Sam",
  greet() {
    setTimeout(() => {
      console.log(`Hi, ${this.name}`);
    }, 1000);
  },
};

user.greet(); // Hi, Sam
```

## Chaining Delays

```js
setTimeout(() => {
  console.log("Step 1");
  setTimeout(() => {
    console.log("Step 2");
  }, 1000);
}, 1000);
```

## Key Points

- The delay is a minimum wait time, not a guaranteed exact time.
- It runs the callback only once.
- Use `clearTimeout(id)` to cancel a pending timer.
