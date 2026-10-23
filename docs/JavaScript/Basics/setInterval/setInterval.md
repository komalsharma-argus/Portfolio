# setInterval in JavaScript

`setInterval()` repeatedly runs a function at a fixed time interval (in milliseconds) until it is stopped.

## Syntax

```js
setInterval(callback, interval, arg1, arg2, ...);
```

| Parameter | Description |
| --- | --- |
| `callback` | The function to run repeatedly |
| `interval` | Time between each call in milliseconds |
| `arg1, arg2, ...` | Optional arguments passed to the callback |

It returns an ID (in browsers, a number) that identifies the interval.

## Basic Example

```js
setInterval(() => {
  console.log("Runs every 1 second");
}, 1000);
```

## Stopping with clearInterval

```js
const intervalId = setInterval(() => {
  console.log("Tick");
}, 1000);

clearInterval(intervalId);
```

## Stopping After a Number of Runs

```js
let count = 0;

const intervalId = setInterval(() => {
  count++;
  console.log(`Run ${count}`);

  if (count === 5) {
    clearInterval(intervalId);
  }
}, 1000);
```

## Passing Arguments

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

setInterval(greet, 2000, "Sam");
```

## Countdown Example

```js
let seconds = 5;

const timer = setInterval(() => {
  console.log(seconds);
  seconds--;

  if (seconds < 0) {
    clearInterval(timer);
    console.log("Done!");
  }
}, 1000);
```

## Clock Example

```js
setInterval(() => {
  console.log(new Date().toLocaleTimeString());
}, 1000);
```

## Stopping After a Delay

```js
const id = setInterval(() => console.log("Tick"), 1000);

setTimeout(() => clearInterval(id), 5000); // stops after 5 seconds
```

## Key Points

- The first call happens after the first interval, not immediately.
- The interval keeps running until `clearInterval(id)` is called.
- The interval is a minimum time; busy code can delay each run.
- Always store the ID so the interval can be cleared.
