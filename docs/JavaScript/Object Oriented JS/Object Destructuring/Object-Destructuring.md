# Object Destructuring in JavaScript

Object destructuring extracts properties from an object into separate variables using a concise syntax.

## Basic Syntax

```js
const user = { name: "Sam", age: 25, city: "Ahmedabad" };

const { name, age } = user;

console.log(name); // "Sam"
console.log(age);  // 25
```

Variable names must match the property names.

## Renaming Variables

```js
const { name: userName, age: userAge } = user;

console.log(userName); // "Sam"
console.log(userAge);  // 25
```

## Default Values

Used when the property is `undefined`.

```js
const { name, country = "India" } = user;

console.log(country); // "India"
```

## Renaming with Defaults

```js
const { country: userCountry = "India" } = user;
```

## Rest Operator

Collects the remaining properties into a new object.

```js
const { name, ...others } = user;

console.log(name);   // "Sam"
console.log(others); // { age: 25, city: "Ahmedabad" }
```

## Nested Destructuring

```js
const employee = {
  id: 1,
  profile: {
    firstName: "Sam",
    address: { city: "Ahmedabad", pin: "380001" },
  },
};

const {
  profile: {
    firstName,
    address: { city },
  },
} = employee;

console.log(firstName); // "Sam"
console.log(city);      // "Ahmedabad"
```

Note: `profile` and `address` themselves are not created as variables here.

## Destructuring in Function Parameters

```js
function greet({ name, age }) {
  return `${name} is ${age} years old`;
}

greet(user); // "Sam is 25 years old"
```

### With Defaults

```js
function createUser({ name = "Guest", role = "user" } = {}) {
  return { name, role };
}

createUser();                  // { name: "Guest", role: "user" }
createUser({ name: "Sam" });   // { name: "Sam", role: "user" }
```

## Computed Property Names

```js
const key = "name";
const { [key]: value } = user;

console.log(value); // "Sam"
```

## Assigning to Existing Variables

Wrap the statement in parentheses.

```js
let name, age;

({ name, age } = user);
```

## Destructuring in Loops

```js
const users = [
  { name: "Sam", age: 25 },
  { name: "Alex", age: 30 },
];

for (const { name, age } of users) {
  console.log(name, age);
}
```

## Swapping with Destructuring

```js
const obj = { a: 1, b: 2 };
let { a, b } = obj;
```

## Missing Properties

```js
const { phone } = user;

console.log(phone); // undefined
```

## Destructuring null or undefined

```js
const { name } = null; // TypeError
```

Use a fallback to avoid the error.

```js
const { name } = maybeUser ?? {};
```

## Key Points

- Syntax: `const { prop1, prop2 } = object`.
- Rename with `prop: newName` and set defaults with `prop = value`.
- Use `...rest` to collect the remaining properties.
- It cannot destructure `null` or `undefined`.
