# Async & Await in JavaScript

`async` and `await` provide a cleaner way to work with Promises, letting asynchronous code be written in a synchronous style.

## async Function

An `async` function always returns a Promise.

```js
async function greet() {
  return "Hello";
}

greet().then(console.log); // "Hello"
```

Returning a value wraps it in a resolved Promise. Throwing an error returns a rejected Promise.

## await

`await` pauses the execution of an `async` function until the Promise settles, then returns its resolved value.

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Start");
  await delay(1000);
  console.log("After 1 second");
}

run();
```

`await` can only be used inside an `async` function (or at the top level of an ES module).

## Fetching Data

```js
async function getUser() {
  const response = await fetch("https://api.example.com/user");
  const data = await response.json();
  return data;
}
```

## Error Handling with try...catch

```js
async function getUser() {
  try {
    const response = await fetch("https://api.example.com/user");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    console.log("Done");
  }
}
```

## Sequential Execution

Each `await` waits for the previous one to finish.

```js
async function sequential() {
  const a = await taskA(); // waits
  const b = await taskB(); // then runs
  return [a, b];
}
```

## Parallel Execution

Start the tasks first, then await them together.

```js
async function parallel() {
  const [a, b] = await Promise.all([taskA(), taskB()]);
  return [a, b];
}
```

## async Arrow Functions

```js
const fetchData = async () => {
  const response = await fetch("https://api.example.com/data");
  return response.json();
};
```

## await in Loops

```js
async function processItems(items) {
  for (const item of items) {
    await process(item); // one at a time
  }
}
```

## Key Points

- `async` makes a function return a Promise.
- `await` waits for a Promise without blocking the rest of the program.
- Use `try...catch` to handle rejected Promises.
- Use `Promise.all` to run independent tasks in parallel.
