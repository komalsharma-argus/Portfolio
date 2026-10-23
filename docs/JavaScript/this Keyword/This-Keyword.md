# The this Keyword in JavaScript

`this` refers to the object that is executing the current code. Its value is determined by how a function is called, not where it is defined (except for arrow functions).

## Global Scope

```js
console.log(this);
```

- Browser script: `window` (the global object).
- ES module: `undefined`.
- Node.js CommonJS module: `module.exports` (an empty object `{}` by default).

## Regular Function (Non-Strict Mode)

```js
function show() {
  console.log(this);
}

show(); // window (browser) / globalThis (Node.js)
```

## Regular Function (Strict Mode)

```js
"use strict";

function show() {
  console.log(this);
}

show(); // undefined
```

## Object Method

When a function is called as a method, `this` is the object before the dot.

```js
const user = {
  name: "Sam",
  greet() {
    console.log(this.name);
  },
};

user.greet(); // "Sam"
```

## Losing this

Extracting a method from its object loses `this`.

```js
const greet = user.greet;
greet(); // undefined (or error in strict mode)

setTimeout(user.greet, 1000); // `this` is not `user`
```

Fixes:

```js
setTimeout(user.greet.bind(user), 1000);
setTimeout(() => user.greet(), 1000);
```

## Arrow Functions

Arrow functions do not have their own `this`. They use `this` from the surrounding scope at the time they are defined.

```js
const user = {
  name: "Sam",
  regular() {
    return this.name;
  },
  arrow: () => {
    return this.name; // `this` is the outer scope, not `user`
  },
};

user.regular(); // "Sam"
user.arrow();   // undefined
```

### Arrow Function Inside a Method

```js
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // `this` is `timer`
    }, 1000);
  },
};
```

## Nested Regular Function

```js
const user = {
  name: "Sam",
  greet() {
    function inner() {
      console.log(this.name); // `this` is not `user`
    }
    inner();
  },
};

user.greet(); // undefined
```

## Constructor Function

With `new`, `this` is the newly created object.

```js
function User(name) {
  this.name = name;
}

const user = new User("Sam");
user.name; // "Sam"
```

## Class

```js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return this.name;
  }
}

const user = new User("Sam");
user.greet(); // "Sam"

const fn = user.greet;
fn(); // TypeError: Cannot read properties of undefined (class code is strict)
```

## Explicit Binding: call, apply, bind

```js
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}

const person = { name: "Sam" };

greet.call(person, "Hello");    // "Hello, Sam"
greet.apply(person, ["Hello"]); // "Hello, Sam"

const bound = greet.bind(person);
bound("Hello");                 // "Hello, Sam"
```

## DOM Event Handlers

```js
button.addEventListener("click", function () {
  console.log(this); // the button (event.currentTarget)
});

button.addEventListener("click", () => {
  console.log(this); // `this` of the surrounding scope, not the button
});
```

## Inline HTML Handler

```html
<button onclick="console.log(this)">Click</button>
<!-- `this` is the button element -->
```

## Callbacks

```js
[1, 2, 3].forEach(function () {
  console.log(this); // window / undefined in strict mode
});

[1, 2, 3].forEach(function () {
  console.log(this); // { a: 1 }
}, { a: 1 }); // optional thisArg
```

## Summary Table

| Context | Value of this |
| --- | --- |
| Global (browser script) | `window` |
| Regular function (non-strict) | Global object |
| Regular function (strict) | `undefined` |
| Object method | The object before the dot |
| Arrow function | `this` of the enclosing scope |
| Constructor with `new` | The new object |
| `call` / `apply` / `bind` | The object passed in |
| DOM event handler (regular function) | The element |
| Class method | The instance, if called on it |

## Key Points

- `this` depends on how a function is called.
- Arrow functions inherit `this` from where they are defined.
- `call`, `apply`, and `bind` set `this` explicitly.
- Passing a method as a callback can lose its `this`.
