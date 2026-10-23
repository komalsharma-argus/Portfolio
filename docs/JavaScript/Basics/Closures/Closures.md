# Closures in JavaScript

A closure is a function that remembers the variables from the scope where it was created, even after that outer scope has finished executing.

## Basic Example

```js
function outer() {
  const message = "Hello";

  function inner() {
    console.log(message);
  }

  return inner;
}

const fn = outer();
fn(); // "Hello"
```

`inner` still has access to `message` even though `outer` has already returned.

## Counter Example

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
counter(); // 3
```

Each call to `createCounter()` creates its own separate `count`.

```js
const a = createCounter();
const b = createCounter();

a(); // 1
a(); // 2
b(); // 1
```

## Data Privacy

Closures can hide variables so they cannot be accessed directly from outside.

```js
function createAccount(balance) {
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(100);
account.deposit(50);   // 150
account.getBalance();  // 150
account.balance;       // undefined
```

## Function Factories

```js
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

double(5); // 10
triple(5); // 15
```

## Closures in Loops

With `var`, all callbacks share the same variable.

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 3, 3, 3
```

With `let`, each iteration gets its own variable.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// 0, 1, 2
```

## Lexical Scope

A closure works because of lexical scoping: a function can access variables from the scope where it was written, not where it is called.

```js
const x = "global";

function show() {
  console.log(x);
}

function run() {
  const x = "local";
  show();
}

run(); // "global"
```

## Key Points

- Every function in JavaScript forms a closure over its surrounding scope.
- Closures keep variables alive as long as the function exists.
- Common uses: private variables, function factories, callbacks, and event handlers.
