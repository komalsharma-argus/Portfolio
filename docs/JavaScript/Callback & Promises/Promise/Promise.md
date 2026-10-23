# Promise in JavaScript

A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

## States

| State | Meaning |
| --- | --- |
| `pending` | Initial state, not yet finished |
| `fulfilled` | Operation completed successfully |
| `rejected` | Operation failed |

Once a Promise is fulfilled or rejected, it is settled and its state cannot change.

## Creating a Promise

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation succeeded");
  } else {
    reject(new Error("Operation failed"));
  }
});
```

- `resolve(value)` marks the Promise as fulfilled.
- `reject(error)` marks the Promise as rejected.

## Consuming a Promise

```js
promise
  .then(result => console.log(result))
  .catch(error => console.error(error.message))
  .finally(() => console.log("Finished"));
```

| Method | Runs when |
| --- | --- |
| `then()` | The Promise is fulfilled |
| `catch()` | The Promise is rejected |
| `finally()` | The Promise settles, either way |

## Asynchronous Example

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000).then(() => console.log("1 second passed"));
```

## Promise Chaining

Each `then()` returns a new Promise, so calls can be chained.

```js
Promise.resolve(1)
  .then(n => n + 1)   // 2
  .then(n => n * 2)   // 4
  .then(n => console.log(n)); // 4
```

A value returned from `then()` is passed to the next `then()`. A returned Promise is awaited before continuing.

## Error Handling in Chains

An error thrown anywhere in the chain skips to the nearest `catch()`.

```js
Promise.resolve()
  .then(() => {
    throw new Error("Something went wrong");
  })
  .then(() => console.log("Skipped"))
  .catch(error => console.error(error.message));
```

## Shortcuts

```js
Promise.resolve("done");              // already fulfilled
Promise.reject(new Error("failed"));  // already rejected
```

## Callbacks vs Promises

```js
// Callbacks
getData(function (a) {
  getMore(a, function (b) {
    console.log(b);
  });
});

// Promises
getData()
  .then(a => getMore(a))
  .then(b => console.log(b));
```

## Key Points

- A Promise is either pending, fulfilled, or rejected.
- Use `then`, `catch`, and `finally` to handle the result.
- Chaining avoids deeply nested callbacks.
- Always handle rejections with `catch()`.
