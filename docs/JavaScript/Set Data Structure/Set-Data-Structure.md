# Set Data Structure in JavaScript

A `Set` is a collection of unique values. A value can appear only once in a Set, and values can be of any type.

## Creating a Set

```js
const set = new Set();
const numbers = new Set([1, 2, 3, 3, 2]); // Set(3) { 1, 2, 3 }
const letters = new Set("hello");         // Set(4) { "h", "e", "l", "o" }
```

## Basic Methods

```js
const set = new Set();

set.add(1);
set.add(2);
set.add(2);        // ignored (already exists)

set.has(1);        // true
set.has(5);        // false

set.delete(1);     // true (removed)
set.size;          // 1

set.clear();       // remove all values
```

`add()` returns the Set, so calls can be chained.

```js
set.add("a").add("b").add("c");
```

## Uniqueness

Values are compared using the "same-value-zero" rule, similar to `===`, except that `NaN` equals `NaN`.

```js
const set = new Set([NaN, NaN, 0, -0]);
set.size; // 2 (NaN once, 0 once)
```

Objects are compared by reference.

```js
const s = new Set();
s.add({ a: 1 });
s.add({ a: 1 });
s.size; // 2 (two different objects)
```

## Iterating Over a Set

Values are iterated in insertion order.

```js
const set = new Set(["a", "b", "c"]);

for (const value of set) {
  console.log(value);
}

set.forEach((value) => console.log(value));

set.values();   // iterator of values
set.keys();     // same as values()
set.entries();  // iterator of [value, value] pairs
```

## Converting Between Set and Array

```js
const set = new Set([1, 2, 3]);

const arr1 = [...set];
const arr2 = Array.from(set);

const backToSet = new Set(arr1);
```

## Removing Duplicates from an Array

```js
const nums = [1, 2, 2, 3, 3, 3];

const unique = [...new Set(nums)]; // [1, 2, 3]
```

## Set Operations

### Union

```js
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);

const union = new Set([...a, ...b]); // Set { 1, 2, 3, 4, 5 }
```

### Intersection

```js
const intersection = new Set([...a].filter((x) => b.has(x))); // Set { 3 }
```

### Difference

```js
const difference = new Set([...a].filter((x) => !b.has(x))); // Set { 1, 2 }
```

### Symmetric Difference

```js
const symDiff = new Set(
  [...a].filter((x) => !b.has(x)).concat([...b].filter((x) => !a.has(x)))
); // Set { 1, 2, 4, 5 }
```

### Subset Check

```js
const isSubset = [...a].every((x) => b.has(x));
```

## Built-in Set Methods (Modern JavaScript)

Newer JavaScript engines include these methods directly.

```js
a.union(b);
a.intersection(b);
a.difference(b);
a.symmetricDifference(b);
a.isSubsetOf(b);
a.isSupersetOf(b);
a.isDisjointFrom(b);
```

## Set vs Array

| Feature | Set | Array |
| --- | --- | --- |
| Duplicates | Not allowed | Allowed |
| Access by index | No | Yes |
| Order | Insertion order | Index order |
| Check if value exists | `has()` (fast) | `includes()` (slower for large data) |
| Size | `size` | `length` |

## Common Use Cases

- Removing duplicate values
- Fast membership checks
- Tracking visited items
- Finding common or different items between collections

## WeakSet

A `WeakSet` holds only objects, keeps them weakly (they can be garbage collected), is not iterable, and has no `size`.

```js
const weak = new WeakSet();
const obj = {};

weak.add(obj);
weak.has(obj);    // true
weak.delete(obj);
```

## Key Points

- A Set stores unique values and preserves insertion order.
- Main methods: `add`, `has`, `delete`, `clear`, and the `size` property.
- `[...new Set(array)]` is the quickest way to remove duplicates.
- Use `has()` for fast lookups.
