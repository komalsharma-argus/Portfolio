# Regular Expressions in JavaScript

A regular expression (regex) is a pattern used to match character combinations in strings.

## Creating a Regex

```js
const regex1 = /hello/;              // literal
const regex2 = new RegExp("hello");  // constructor

const withFlags = /hello/gi;
const dynamic = new RegExp(`${word}`, "g"); // useful for dynamic patterns
```

## Flags

| Flag | Meaning |
| --- | --- |
| `g` | Global: find all matches |
| `i` | Case-insensitive |
| `m` | Multiline: `^` and `$` match each line |
| `s` | Dot matches newlines |
| `u` | Unicode support |
| `y` | Sticky: match from `lastIndex` only |
| `d` | Include match indices |

## Methods

### test()

Returns `true` or `false`.

```js
/hello/.test("hello world"); // true
/hello/.test("Hi");          // false
```

### exec()

Returns match details or `null`.

```js
const result = /(\d+)-(\d+)/.exec("Call 123-456");

result[0]; // "123-456"
result[1]; // "123"
result[2]; // "456"
result.index; // 5
```

### String match()

```js
"a1b2c3".match(/\d/);  // ["1", index: 1, ...]
"a1b2c3".match(/\d/g); // ["1", "2", "3"]
```

### String matchAll()

Returns an iterator of all matches, including groups. Requires the `g` flag.

```js
const matches = "a1b2".matchAll(/([a-z])(\d)/g);

for (const m of matches) {
  console.log(m[0], m[1], m[2]); // "a1" "a" "1", then "b2" "b" "2"
}
```

### String replace() and replaceAll()

```js
"a-b-c".replace(/-/g, "+");     // "a+b+c"
"John Smith".replace(/(\w+) (\w+)/, "$2 $1"); // "Smith John"
"a-b-c".replaceAll(/-/g, "+");  // "a+b+c"

"abc".replace(/b/, (match) => match.toUpperCase()); // "aBc"
```

### String search() and split()

```js
"hello world".search(/world/); // 6
"a1b2c3".split(/\d/);          // ["a", "b", "c", ""]
```

## Character Classes

| Pattern | Matches |
| --- | --- |
| `.` | Any character except newline |
| `\d` | Digit (0-9) |
| `\D` | Non-digit |
| `\w` | Letter, digit, or underscore |
| `\W` | Not a word character |
| `\s` | Whitespace |
| `\S` | Non-whitespace |
| `[abc]` | Any of a, b, or c |
| `[^abc]` | Anything except a, b, or c |
| `[a-z]` | Any lowercase letter |

## Anchors and Boundaries

| Pattern | Matches |
| --- | --- |
| `^` | Start of string (or line with `m`) |
| `$` | End of string (or line with `m`) |
| `\b` | Word boundary |
| `\B` | Not a word boundary |

```js
/^hello/.test("hello world"); // true
/world$/.test("hello world"); // true
/\bcat\b/.test("a cat sat");  // true
```

## Quantifiers

| Pattern | Matches |
| --- | --- |
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 |
| `{3}` | Exactly 3 |
| `{2,}` | 2 or more |
| `{2,4}` | Between 2 and 4 |

```js
/a+/.exec("caaat")[0];   // "aaa"
/\d{3}/.test("123");     // true
```

## Greedy vs Lazy

Quantifiers are greedy by default. Add `?` to make them lazy.

```js
"<b>bold</b><i>italic</i>".match(/<.+>/)[0];  // "<b>bold</b><i>italic</i>"
"<b>bold</b><i>italic</i>".match(/<.+?>/)[0]; // "<b>"
```

## Groups

```js
const match = "2025-10-15".match(/(\d{4})-(\d{2})-(\d{2})/);

match[1]; // "2025"
match[2]; // "10"
match[3]; // "15"
```

### Non-Capturing Groups

```js
/(?:ab)+/.test("ababab"); // true, without creating a capture group
```

### Named Groups

```js
const m = "2025-10-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);

m.groups.year;  // "2025"
m.groups.month; // "10"
```

### Backreferences

```js
/(\w)\1/.test("hello"); // true ("ll")
```

## Alternation

```js
/cat|dog/.test("I have a dog"); // true
```

## Lookahead and Lookbehind

```js
/\d+(?= dollars)/.exec("100 dollars")[0]; // "100"   (positive lookahead)
/\d+(?! dollars)/.exec("100 euros")[0];   // "100"   (negative lookahead)
/(?<=\$)\d+/.exec("$50")[0];              // "50"    (positive lookbehind)
/(?<!\$)\b\d+/.exec("USD 50")[0];         // "50"    (negative lookbehind)
```

## Escaping Special Characters

Special characters: `. * + ? ^ $ { } ( ) | [ ] \`

```js
/\./.test("a.b");     // matches a literal dot
/\$\d+/.test("$50");  // matches a literal $
```

## The Global Flag and lastIndex

With `g` or `y`, `test()` and `exec()` remember their position.

```js
const re = /a/g;

re.test("aa"); // true (lastIndex = 1)
re.test("aa"); // true (lastIndex = 2)
re.test("aa"); // false (lastIndex reset to 0)
```

## Common Examples

```js
/^\d{10}$/.test("9876543210");                      // 10-digit number
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test("a@b.com");        // simple email check
/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.test("#ff00aa");   // hex color
/^\s+|\s+$/g;                                       // leading/trailing whitespace
/^(?=.*[A-Z])(?=.*\d).{8,}$/.test("Passw0rdX");     // 8+ chars, 1 uppercase, 1 digit
```

## Key Points

- Create with `/pattern/flags` or `new RegExp()`.
- Use `test()` to check a match and `match()` / `matchAll()` to extract matches.
- Use groups to capture parts and `replace()` to transform text.
- Quantifiers are greedy by default; add `?` for lazy matching.
