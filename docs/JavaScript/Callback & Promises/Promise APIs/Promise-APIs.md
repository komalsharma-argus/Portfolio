# Promise APIs in JavaScript

The `Promise` object provides static methods for working with multiple Promises at once.

## Promise.all()

Waits for all Promises to fulfill. Rejects immediately if any Promise rejects.

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 1000));

Promise.all([p1, p2, p3]).then(results => {
  console.log(results); // [1, 2, 3]
});
```

```js
Promise.all([p1, Promise.reject(new Error("Failed")), p3])
  .catch(error => console.error(error.message)); // "Failed"
```

- Returns an array of results in the same order as the input.
- Fails fast on the first rejection.

## Promise.allSettled()

Waits for all Promises to settle, whether fulfilled or rejected. It never rejects.

```js
Promise.allSettled([
  Promise.resolve("ok"),
  Promise.reject(new Error("failed")),
]).then(results => console.log(results));
// [
//   { status: "fulfilled", value: "ok" },
//   { status: "rejected", reason: Error: failed }
// ]
```

## Promise.race()

Settles as soon as the first Promise settles (fulfilled or rejected).

```js
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 500));

Promise.race([slow, fast]).then(result => console.log(result)); // "fast"
```

Common use: adding a timeout to an operation.

```js
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timed out")), 3000)
);

Promise.race([fetch("https://api.example.com/data"), timeout]);
```

## Promise.any()

Fulfills as soon as the first Promise fulfills. Ignores rejections unless all Promises reject.

```js
Promise.any([
  Promise.reject(new Error("fail 1")),
  Promise.resolve("success"),
  Promise.reject(new Error("fail 2")),
]).then(result => console.log(result)); // "success"
```

If all Promises reject, it rejects with an `AggregateError`.

```js
Promise.any([
  Promise.reject(new Error("fail 1")),
  Promise.reject(new Error("fail 2")),
]).catch(error => {
  console.log(error.name);          // "AggregateError"
  console.log(error.errors.length); // 2
});
```

## Promise.resolve()

Returns a Promise that is fulfilled with the given value.

```js
Promise.resolve("done").then(console.log); // "done"
```

## Promise.reject()

Returns a Promise that is rejected with the given reason.

```js
Promise.reject(new Error("failed")).catch(error => console.error(error.message));
```

## Comparison

| Method | Fulfills when | Rejects when |
| --- | --- | --- |
| `Promise.all` | All fulfill | Any one rejects |
| `Promise.allSettled` | All settle | Never |
| `Promise.race` | First settles with fulfillment | First settles with rejection |
| `Promise.any` | Any one fulfills | All reject |
