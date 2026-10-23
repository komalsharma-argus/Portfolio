# Throttling in JavaScript

Throttling is a technique that ensures a function runs at most once in a given time interval, no matter how many times it is triggered.

## Explanation

If an event fires continuously (such as scrolling), a throttled handler runs at regular intervals instead of on every event.

```
Events:    | | | | | | | | | | | | | | | |
Throttle:  |         |         |         |      (runs once per interval)
```

## Common Use Cases

- Scroll event handlers
- Window resize handlers
- Mouse move tracking
- Preventing repeated button clicks
- Rate-limiting API calls

## Implementation 1: Using a Flag and setTimeout

```js
function throttle(fn, limit) {
  let inThrottle = false;

  return function (...args) {
    if (inThrottle) return;

    fn.apply(this, args);
    inThrottle = true;

    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}
```

## Implementation 2: Using Timestamps

```js
function throttle(fn, limit) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

## Usage

```js
function onScroll() {
  console.log("Scroll position:", window.scrollY);
}

window.addEventListener("scroll", throttle(onScroll, 200));
// runs at most once every 200ms
```

```js
const log = throttle((msg) => console.log(msg), 1000);

log("a"); // runs
log("b"); // ignored
log("c"); // ignored
// after 1 second, the next call will run
```

## Implementation with Trailing Call

The basic versions drop calls made during the wait. This version also runs the last call after the interval.

```js
function throttle(fn, limit) {
  let lastCall = 0;
  let timerId;

  return function (...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      clearTimeout(timerId);
      lastCall = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

## Debouncing vs Throttling

| Debouncing | Throttling |
| --- | --- |
| Runs after calls stop for a set delay | Runs at regular intervals during continuous calls |
| Resets the timer on every call | Ignores calls until the interval ends |
| Example: search box input | Example: scroll handler |

## Key Points

- Throttling limits a function to one execution per time interval.
- It can be implemented with a flag plus `setTimeout`, or with timestamps.
- It uses a closure to remember state between calls.
