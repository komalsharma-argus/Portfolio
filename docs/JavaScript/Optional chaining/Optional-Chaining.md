# Optional Chaining in JavaScript

Optional chaining (`?.`) lets you safely access deeply nested properties, methods, or array items. If a value in the chain is `null` or `undefined`, the expression short-circuits and returns `undefined` instead of throwing an error.

## The Problem

```js
const user = {};

user.address.city; // TypeError: Cannot read properties of undefined
```

## Property Access

```js
const user = { name: "Sam", address: { city: "Ahmedabad" } };

user?.address?.city;    // "Ahmedabad"
user?.contact?.phone;   // undefined (no error)
```

## Method Calls

```js
const user = {
  greet() {
    return "Hello";
  },
};

user.greet?.();    // "Hello"
user.sayBye?.();   // undefined (no error)
```

## Array Items

```js
const users = [{ name: "Sam" }];

users?.[0]?.name;   // "Sam"
users?.[5]?.name;   // undefined
```

## Dynamic Keys

```js
const key = "name";
user?.[key]; // "Sam"
```

## Short-Circuiting

When the left side is `null` or `undefined`, the rest of the chain is not evaluated.

```js
let count = 0;
const user = null;

user?.update(count++);
console.log(count); // 0
```

## With Default Values

```js
const city = user?.address?.city || "Unknown";
```

## Only for null and undefined

Optional chaining checks only for `null` and `undefined`, not other falsy values.

```js
const obj = { count: 0, name: "" };

obj?.count; // 0
obj?.name;  // ""
```

## Limitations

```js
// Cannot be used on the left side of an assignment
user?.name = "Sam"; // SyntaxError
```

## Key Points

- `?.` returns `undefined` if the value before it is `null` or `undefined`.
- Works with properties (`?.`), methods (`?.()`), and brackets (`?.[]`).
- Prevents `TypeError` when accessing nested data.
