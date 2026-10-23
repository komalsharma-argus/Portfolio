# Loops in JavaScript

Loops run a block of code repeatedly until a condition is no longer met.

## for

```js
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

Syntax: `for (initialization; condition; update) { ... }`

## while

Runs while the condition is `true`. The condition is checked before each iteration.

```js
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}
```

## do...while

Runs the block at least once, then checks the condition.

```js
let i = 0;
do {
  console.log(i);
  i++;
} while (i < 5);
```

## for...of

Iterates over the values of iterable objects such as arrays and strings.

```js
for (const fruit of ["apple", "banana"]) {
  console.log(fruit);
}

for (const char of "hi") {
  console.log(char);
}
```

## for...in

Iterates over the enumerable property keys of an object.

```js
const user = { name: "Sam", age: 25 };

for (const key in user) {
  console.log(key, user[key]);
}
```

> Prefer `for...of` for arrays. `for...in` is meant for objects.

## forEach

An array method that runs a function for each element.

```js
[1, 2, 3].forEach((n, index) => {
  console.log(index, n);
});
```

## break

Exits the loop immediately.

```js
for (let i = 0; i < 10; i++) {
  if (i === 3) break;
  console.log(i); // 0, 1, 2
}
```

## continue

Skips the rest of the current iteration.

```js
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i); // 0, 1, 3, 4
}
```

## Nested Loops

```js
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(`${i} x ${j} = ${i * j}`);
  }
}
```

## Labels

A label lets `break` or `continue` target an outer loop.

```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer;
    console.log(i, j);
  }
}
```

## Infinite Loops

A loop whose condition never becomes `false` runs forever. Always make sure the condition changes.

```js
while (true) {
  // must contain a break to stop
  break;
}
```
