# Arrays in JavaScript

An array is an ordered collection of values stored under numeric indexes, starting at `0`. Arrays can hold values of any type, including other arrays and objects.

## Creating Arrays

```js
const fruits = ["apple", "banana", "mango"];
const empty = [];
const mixed = [1, "two", true, null, { a: 1 }];
const fromConstructor = new Array(3); // [ <3 empty items> ]
const filled = Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
```

## Accessing and Updating

```js
fruits[0];            // "apple"
fruits[fruits.length - 1]; // "mango"
fruits.at(-1);        // "mango"
fruits[1] = "grape";  // update
fruits.length;        // 3
```

## Adding and Removing Elements

| Method | Action |
| --- | --- |
| `push(x)` | Add to the end |
| `pop()` | Remove from the end |
| `unshift(x)` | Add to the start |
| `shift()` | Remove from the start |
| `splice(i, n, ...items)` | Remove/insert at an index |

```js
const nums = [1, 2, 3];
nums.push(4);       // [1, 2, 3, 4]
nums.pop();         // [1, 2, 3]
nums.unshift(0);    // [0, 1, 2, 3]
nums.shift();       // [1, 2, 3]
nums.splice(1, 1);  // removes 2 -> [1, 3]
nums.splice(1, 0, 2); // inserts 2 -> [1, 2, 3]
```

## Searching

```js
const nums = [10, 20, 30, 20];
nums.indexOf(20);       // 1
nums.lastIndexOf(20);   // 3
nums.includes(30);      // true
nums.find(n => n > 15); // 20
nums.findIndex(n => n > 15); // 1
```

## Iterating

```js
const nums = [1, 2, 3];
nums.forEach(n => console.log(n));
for (const n of nums) console.log(n);
```

## Transforming

```js
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);              // [2, 4, 6, 8, 10]
nums.filter(n => n % 2 === 0);     // [2, 4]
nums.reduce((sum, n) => sum + n, 0); // 15
nums.some(n => n > 4);             // true
nums.every(n => n > 0);            // true
```

## Slicing, Joining, and Sorting

```js
const nums = [3, 1, 2];

nums.slice(0, 2);          // [3, 1] (does not modify original)
nums.concat([4, 5]);       // [3, 1, 2, 4, 5]
[...nums, 4, 5];           // spread alternative
nums.join("-");            // "3-1-2"
nums.reverse();            // [2, 1, 3] (modifies original)
nums.sort((a, b) => a - b); // [1, 2, 3] (modifies original)
```

> `sort()` without a compare function sorts values as strings.

## Destructuring and Spread

```js
const [first, second, ...rest] = [1, 2, 3, 4];
// first = 1, second = 2, rest = [3, 4]

const copy = [...rest];
```

## Checking for an Array

```js
Array.isArray([1, 2]); // true
Array.isArray("abc");  // false
```

## Flattening

```js
[1, [2, [3]]].flat();         // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]
```
