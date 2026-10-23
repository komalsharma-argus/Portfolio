# Local Storage & Session Storage in JavaScript

`localStorage` and `sessionStorage` are Web Storage APIs that store key-value pairs in the browser. Keys and values are always stored as strings.

## Differences

| Feature | localStorage | sessionStorage |
| --- | --- | --- |
| Lifetime | Stays until manually cleared | Cleared when the tab is closed |
| Scope | Shared across all tabs of the same origin | Limited to a single tab |
| Capacity | About 5 MB | About 5 MB |
| Sent to server | No | No |

## Methods

Both share the same API.

```js
localStorage.setItem("name", "Sam");     // save
localStorage.getItem("name");            // "Sam"
localStorage.removeItem("name");         // remove one item
localStorage.clear();                    // remove everything
localStorage.length;                     // number of items
localStorage.key(0);                     // key at index 0
```

```js
sessionStorage.setItem("token", "abc123");
sessionStorage.getItem("token"); // "abc123"
```

## Shorthand Access

```js
localStorage.theme = "dark";
console.log(localStorage.theme); // "dark"
```

## Missing Keys

```js
localStorage.getItem("unknown"); // null
```

## Storing Objects and Arrays

Values are converted to strings, so use `JSON.stringify` and `JSON.parse`.

```js
const user = { name: "Sam", age: 25 };

localStorage.setItem("user", JSON.stringify(user));

const saved = JSON.parse(localStorage.getItem("user"));
console.log(saved.name); // "Sam"
```

Without `JSON.stringify`:

```js
localStorage.setItem("user", user);
localStorage.getItem("user"); // "[object Object]"
```

## Looping Through Items

```js
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

## Storage Event

Fires in other tabs of the same origin when `localStorage` changes.

```js
window.addEventListener("storage", (event) => {
  console.log(event.key, event.oldValue, event.newValue);
});
```

## Common Use Cases

- localStorage: theme preference, saved settings, cached data.
- sessionStorage: form data for the current tab, temporary state.

## Key Points

- Data is stored as strings only.
- Data is scoped to the origin (protocol, domain, and port).
- Do not store sensitive data such as passwords, since the storage is readable by any script on the page.
