# Debouncing in JavaScript

Debouncing is a technique that delays running a function until a specified time has passed since the last time it was called. If the function is called again before the delay ends, the timer resets.

## Explanation

Imagine a user typing in a search box. Without debouncing, an API request would fire on every keystroke. With debouncing, the request fires only after the user stops typing for a set time (for example, 500ms).

```
Keystrokes:   a   b   c       d   e              (pause)
Timer:        reset reset reset reset reset  -->  runs once
```

## Common Use Cases

- Search box suggestions
- Auto-saving a form
- Window resize handlers
- Validating input after the user stops typing

## Basic Implementation

```js
function debounce(fn, delay) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

How it works:

1. `timerId` is kept in a closure, so it persists between calls.
2. Each call clears the previous timer.
3. A new timer starts, and the function runs only if no new call arrives within `delay`.

## Usage

```js
function search(query) {
  console.log("Searching for:", query);
}

const debouncedSearch = debounce(search, 500);

debouncedSearch("j");
debouncedSearch("ja");
debouncedSearch("jav");
// Only "Searching for: jav" is logged, 500ms after the last call
```

### With an Input Event

```js
const input = document.querySelector("#search");

input.addEventListener(
  "input",
  debounce((event) => {
    console.log(event.target.value);
  }, 500)
);
```

## Leading Edge Option

Run the function immediately on the first call, then ignore calls until the delay passes without activity.

```js
function debounce(fn, delay, immediate = false) {
  let timerId;

  return function (...args) {
    const callNow = immediate && !timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!immediate) fn.apply(this, args);
    }, delay);

    if (callNow) fn.apply(this, args);
  };
}

const onClick = debounce(() => console.log("Clicked"), 1000, true);
```

## Adding a Cancel Method

```js
function debounce(fn, delay) {
  let timerId;

  function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  }

  debounced.cancel = () => clearTimeout(timerId);

  return debounced;
}

const save = debounce(() => console.log("Saved"), 1000);

save();
save.cancel(); // nothing is logged
```

## Key Points

- Debouncing runs the function only after calls stop for the given delay.
- Each new call resets the timer.
- It is implemented with `setTimeout`, `clearTimeout`, and a closure.
