# Object Prototype in JavaScript

Every JavaScript object has an internal link to another object called its prototype. When a property is not found on an object, JavaScript looks for it on the object's prototype, and then on that prototype's prototype, and so on.

## [[Prototype]], __proto__, and prototype

| Term | Meaning |
| --- | --- |
| `[[Prototype]]` | The internal link from an object to its prototype |
| `__proto__` | Accessor for an object's `[[Prototype]]` (legacy) |
| `Object.getPrototypeOf(obj)` | The recommended way to read `[[Prototype]]` |
| `Function.prototype` / `prototype` | A property on constructor functions, used as the `[[Prototype]]` of objects created with `new` |

## Prototype Chain

```js
const arr = [1, 2, 3];

arr.push(4);         // found on Array.prototype
arr.hasOwnProperty;  // found on Object.prototype
```

```js
Object.getPrototypeOf(arr) === Array.prototype;            // true
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);                   // null (end of chain)
```

The chain is: `arr` → `Array.prototype` → `Object.prototype` → `null`.

## Property Lookup

```js
const animal = { eats: true };
const dog = Object.create(animal);
dog.barks = true;

dog.barks; // true (own property)
dog.eats;  // true (found on prototype)
dog.flies; // undefined (not found anywhere in the chain)
```

## Own vs Inherited Properties

```js
Object.hasOwn(dog, "barks"); // true
Object.hasOwn(dog, "eats");  // false
"eats" in dog;               // true (checks the whole chain)
```

## Constructor Functions and prototype

Methods placed on the constructor's `prototype` are shared by all instances instead of being copied.

```js
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};

const user1 = new User("Sam");
const user2 = new User("Alex");

user1.greet();                       // "Hi, I'm Sam"
user1.greet === user2.greet;         // true (same function)
Object.getPrototypeOf(user1) === User.prototype; // true
```

## The constructor Property

```js
User.prototype.constructor === User; // true
user1.constructor === User;          // true
```

## Adding Methods to Built-in Prototypes

```js
Array.prototype.last = function () {
  return this[this.length - 1];
};

[1, 2, 3].last(); // 3
```

Modifying built-in prototypes is discouraged because it can cause conflicts.

## Creating Objects with a Chosen Prototype

```js
const proto = {
  hello() {
    return "Hello";
  },
};

const obj = Object.create(proto);
obj.hello(); // "Hello"

const noProto = Object.create(null); // object with no prototype
```

## Getting and Setting Prototypes

```js
Object.getPrototypeOf(obj);
Object.setPrototypeOf(obj, newProto); // works, but can hurt performance
```

## Shadowing

An own property with the same name hides the prototype's property.

```js
const base = { greet() { return "base"; } };
const child = Object.create(base);

child.greet = function () { return "child"; };

child.greet(); // "child"
```

## Key Points

- Every object has a prototype (except objects created with `Object.create(null)`).
- Property lookup walks up the prototype chain until `null`.
- Methods on `Constructor.prototype` are shared across all instances.
- Use `Object.getPrototypeOf` instead of `__proto__` in new code.
