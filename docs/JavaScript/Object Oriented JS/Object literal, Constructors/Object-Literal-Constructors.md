# Object Literals & Constructors in JavaScript

An object is a collection of key-value pairs. Keys are strings (or symbols) and values can be any type, including functions.

## Object Literal

The simplest way to create an object.

```js
const user = {
  name: "Sam",
  age: 25,
  isAdmin: false,
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};
```

## Accessing Properties

```js
user.name;        // dot notation
user["age"];      // bracket notation

const key = "name";
user[key];        // dynamic key
```

## Adding, Updating, and Deleting

```js
user.email = "sam@example.com";   // add
user.age = 26;                    // update
delete user.isAdmin;              // delete
```

## Checking for Properties

```js
"name" in user;                  // true
user.hasOwnProperty("name");     // true
Object.hasOwn(user, "name");     // true
```

## Shorthand and Computed Properties

```js
const name = "Sam";
const age = 25;

const person = { name, age };    // { name: "Sam", age: 25 }

const field = "city";
const address = { [field]: "Ahmedabad" }; // { city: "Ahmedabad" }
```

## Getters and Setters

```js
const account = {
  _balance: 100,
  get balance() {
    return this._balance;
  },
  set balance(value) {
    if (value < 0) throw new Error("Invalid balance");
    this._balance = value;
  },
};

account.balance;        // 100
account.balance = 200;
```

## Looping Through Objects

```js
for (const key in user) {
  console.log(key, user[key]);
}

Object.keys(user);
Object.values(user);
Object.entries(user);
```

## The Problem with Literals

Creating many similar objects with literals means repeating code.

```js
const user1 = { name: "Sam", age: 25 };
const user2 = { name: "Alex", age: 30 };
```

## Constructor Functions

A constructor function is a regular function used with the `new` keyword to create multiple objects with the same structure. By convention, its name starts with a capital letter.

```js
function User(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    return `Hi, I'm ${this.name}`;
  };
}

const user1 = new User("Sam", 25);
const user2 = new User("Alex", 30);

user1.greet(); // "Hi, I'm Sam"
```

## What new Does

1. Creates a new empty object.
2. Sets the object's prototype to the constructor's `prototype`.
3. Runs the constructor with `this` bound to the new object.
4. Returns the object (unless the constructor returns another object).

## Forgetting new

```js
const broken = User("Sam", 25); // `this` is not a new object; broken is undefined
```

A safeguard:

```js
function User(name) {
  if (!new.target) {
    return new User(name);
  }
  this.name = name;
}
```

## Checking the Constructor

```js
user1 instanceof User;       // true
user1.constructor === User;  // true
```

## Built-in Constructors

```js
const obj = new Object();
const arr = new Array(3);
const date = new Date();
const regex = new RegExp("abc");
```

Literals (`{}`, `[]`, `/abc/`) are preferred over these.

## Other Ways to Create Objects

```js
const obj = Object.create({ type: "base" });

const copy = Object.assign({}, user);
const spreadCopy = { ...user };
```

## Key Points

- Use object literals for single objects.
- Use constructor functions (with `new`) to create many objects of the same shape.
- Methods defined inside a constructor are duplicated for every object.
