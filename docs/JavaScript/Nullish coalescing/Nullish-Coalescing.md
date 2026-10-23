# Nullish Coalescing in JavaScript

The nullish coalescing operator (`??`) returns the right-hand value only when the left-hand value is `null` or `undefined`. Otherwise, it returns the left-hand value.

## Syntax

```js
const result = value ?? defaultValue;
```

## Basic Example

```js
null ?? "default";       // "default"
undefined ?? "default";  // "default"
"hello" ?? "default";    // "hello"
```

## Difference from ||

The `||` operator falls back for any falsy value. The `??` operator falls back only for `null` and `undefined`.

```js
0 || 10;      // 10
0 ?? 10;      // 0

"" || "text"; // "text"
"" ?? "text"; // ""

false || true; // true
false ?? true; // false

NaN || 5;     // 5
NaN ?? 5;     // NaN
```

## Practical Example

```js
function setVolume(volume) {
  const level = volume ?? 50;
  console.log(level);
}

setVolume(0);         // 0
setVolume(undefined); // 50
setVolume(null);      // 50
```

## Nullish Assignment (??=)

Assigns a value only if the variable is `null` or `undefined`.

```js
let user = { name: "Sam", age: null };

user.age ??= 18;
user.name ??= "Guest";

console.log(user); // { name: "Sam", age: 18 }
```

## Chaining

```js
const name = null ?? undefined ?? "Guest"; // "Guest"
```

## Mixing with || and &&

`??` cannot be combined directly with `||` or `&&` without parentheses.

```js
const a = null || undefined ?? "x";   // SyntaxError
const b = (null || undefined) ?? "x"; // "x"
```

## Key Points

- `??` treats only `null` and `undefined` as missing values.
- Use it when `0`, `""`, and `false` are valid values.
- `??=` assigns a default only when the value is `null` or `undefined`.
