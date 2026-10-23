# Strings in JavaScript

A string is a sequence of characters used to represent text. Strings are immutable: methods return a new string instead of changing the original.

## Creating Strings

```js
const single = 'Hello';
const double = "Hello";
const template = `Hello`;
const fromConstructor = String(123); // "123"
```

## Template Literals

```js
const name = "Sam";
const age = 25;

`My name is ${name} and I am ${age}.`;

`Line one
Line two`; // multi-line
```

## Length and Character Access

```js
const str = "JavaScript";

str.length;     // 10
str[0];         // "J"
str.charAt(4);  // "S"
str.at(-1);     // "t"
```

## Changing Case

```js
"hello".toUpperCase(); // "HELLO"
"HELLO".toLowerCase(); // "hello"
```

## Searching

```js
const str = "Hello, World";

str.indexOf("o");        // 4
str.lastIndexOf("o");    // 8
str.includes("World");   // true
str.startsWith("Hello"); // true
str.endsWith("World");   // true
str.search(/W/);         // 7
```

## Extracting Parts

```js
const str = "JavaScript";

str.slice(0, 4);    // "Java"
str.slice(-6);      // "Script"
str.substring(4, 10); // "Script"
```

## Replacing

```js
"a-b-c".replace("-", "+");    // "a+b-c"
"a-b-c".replaceAll("-", "+"); // "a+b+c"
"a1b2".replace(/\d/g, "#");   // "a#b#"
```

## Trimming and Padding

```js
"  hi  ".trim();      // "hi"
"  hi  ".trimStart(); // "hi  "
"  hi  ".trimEnd();   // "  hi"
"5".padStart(3, "0"); // "005"
"5".padEnd(3, "0");   // "500"
```

## Splitting and Joining

```js
"a,b,c".split(",");        // ["a", "b", "c"]
"hello".split("");         // ["h", "e", "l", "l", "o"]
["a", "b", "c"].join("-"); // "a-b-c"
```

## Repeating and Concatenating

```js
"ab".repeat(3);        // "ababab"
"Hello" + " " + "World"; // "Hello World"
"Hello".concat(" World"); // "Hello World"
```

## Comparing

```js
"a" === "a";           // true
"apple" < "banana";    // true
"a".localeCompare("b"); // -1
```

## Escape Characters

| Sequence | Meaning |
| --- | --- |
| `\n` | New line |
| `\t` | Tab |
| `\\` | Backslash |
| `\'` | Single quote |
| `\"` | Double quote |

## Iterating Over a String

```js
for (const char of "abc") {
  console.log(char);
}
```
