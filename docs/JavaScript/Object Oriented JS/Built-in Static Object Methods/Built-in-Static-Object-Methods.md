# Built-in Static Object Methods in JavaScript

Static methods are called directly on the `Object` constructor, for example `Object.keys(obj)`.

## Object.keys()

Returns an array of an object's own enumerable property names.

```js
const user = { name: "Sam", age: 25 };

Object.keys(user); // ["name", "age"]
```

## Object.values()

```js
Object.values(user); // ["Sam", 25]
```

## Object.entries()

Returns an array of `[key, value]` pairs.

```js
Object.entries(user); // [["name", "Sam"], ["age", 25]]

for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

## Object.fromEntries()

Converts key-value pairs back into an object.

```js
Object.fromEntries([["a", 1], ["b", 2]]); // { a: 1, b: 2 }

const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2 }).map(([k, v]) => [k, v * 2])
);
// { a: 2, b: 4 }
```

## Object.assign()

Copies own enumerable properties from source objects to a target object and returns the target.

```js
const target = { a: 1 };
const result = Object.assign(target, { b: 2 }, { c: 3 });

console.log(result); // { a: 1, b: 2, c: 3 }

const copy = Object.assign({}, user); // shallow copy
```

## Object.freeze() and Object.isFrozen()

Makes an object immutable: properties cannot be added, removed, or changed.

```js
const config = Object.freeze({ debug: true });

config.debug = false;  // ignored (throws in strict mode)
config.newProp = 1;    // ignored

Object.isFrozen(config); // true
```

`freeze` is shallow; nested objects can still be changed.

## Object.seal() and Object.isSealed()

Prevents adding or removing properties, but existing properties can still be changed.

```js
const settings = Object.seal({ theme: "dark" });

settings.theme = "light";  // allowed
settings.language = "en";  // ignored
delete settings.theme;     // ignored

Object.isSealed(settings); // true
```

## Object.preventExtensions() and Object.isExtensible()

Prevents adding new properties only.

```js
const obj = Object.preventExtensions({ a: 1 });

obj.b = 2;               // ignored
Object.isExtensible(obj); // false
```

## Comparison of freeze, seal, preventExtensions

| Method | Add | Delete | Modify |
| --- | --- | --- | --- |
| `preventExtensions` | No | Yes | Yes |
| `seal` | No | No | Yes |
| `freeze` | No | No | No |

## Object.create()

Creates a new object with a specified prototype.

```js
const proto = { greet() { return "Hello"; } };
const obj = Object.create(proto);

obj.greet(); // "Hello"
```

## Object.getPrototypeOf() and Object.setPrototypeOf()

```js
Object.getPrototypeOf(obj) === proto; // true
Object.setPrototypeOf(obj, {});
```

## Object.defineProperty()

Defines or changes a property with fine-grained control.

```js
const person = {};

Object.defineProperty(person, "id", {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false,
});

person.id = 2;
console.log(person.id); // 1
```

| Descriptor | Meaning |
| --- | --- |
| `value` | The property's value |
| `writable` | Whether the value can be changed |
| `enumerable` | Whether it appears in loops and `Object.keys` |
| `configurable` | Whether it can be deleted or redefined |
| `get` / `set` | Getter and setter functions |

## Object.defineProperties()

```js
Object.defineProperties(person, {
  name: { value: "Sam", enumerable: true },
  age: { value: 25, enumerable: true },
});
```

## Object.getOwnPropertyNames()

Returns all own property names, including non-enumerable ones.

```js
Object.getOwnPropertyNames([1, 2]); // ["0", "1", "length"]
```

## Object.getOwnPropertyDescriptor() and Object.getOwnPropertyDescriptors()

```js
Object.getOwnPropertyDescriptor(person, "id");
// { value: 1, writable: false, enumerable: true, configurable: false }

Object.getOwnPropertyDescriptors(person);
```

## Object.getOwnPropertySymbols()

```js
const sym = Symbol("id");
const obj2 = { [sym]: 1 };

Object.getOwnPropertySymbols(obj2); // [Symbol(id)]
```

## Object.is()

Compares two values using the same-value algorithm.

```js
Object.is(NaN, NaN); // true  (NaN === NaN is false)
Object.is(0, -0);    // false (0 === -0 is true)
Object.is("a", "a"); // true
```

## Object.hasOwn()

Checks whether an object has its own property.

```js
Object.hasOwn(user, "name");     // true
Object.hasOwn(user, "toString"); // false
```

## Object.groupBy()

Groups items by the key returned from a callback.

```js
const people = [
  { name: "Sam", age: 25 },
  { name: "Alex", age: 30 },
  { name: "Kim", age: 25 },
];

Object.groupBy(people, (p) => p.age);
// { 25: [Sam, Kim], 30: [Alex] }
```

## Key Points

- `keys`, `values`, and `entries` list an object's own enumerable data.
- `freeze`, `seal`, and `preventExtensions` limit changes to an object.
- `defineProperty` controls property behavior in detail.
- `Object.hasOwn` is the modern replacement for `hasOwnProperty`.
