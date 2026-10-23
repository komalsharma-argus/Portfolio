# Accessing & Modifying DOM Elements in JavaScript

The DOM (Document Object Model) represents an HTML page as a tree of objects. JavaScript can use it to select, read, and change elements on the page.

## Selecting Elements

```js
document.getElementById("title");             // single element by id
document.getElementsByClassName("item");      // live HTMLCollection
document.getElementsByTagName("p");           // live HTMLCollection
document.querySelector(".item");              // first match (CSS selector)
document.querySelectorAll(".item");           // static NodeList of all matches
```

`querySelector` and `querySelectorAll` accept any CSS selector.

```js
document.querySelector("#menu > li.active");
document.querySelectorAll("input[type='text']");
```

## Navigating the DOM

```js
const el = document.querySelector("#item");

el.parentElement;
el.children;
el.firstElementChild;
el.lastElementChild;
el.nextElementSibling;
el.previousElementSibling;
```

## Changing Content

```js
const title = document.querySelector("#title");

title.textContent = "New text";       // plain text (safe)
title.innerText = "New text";         // text as rendered (respects CSS)
title.innerHTML = "<b>Bold</b> text"; // parses HTML (avoid with untrusted input)
```

## Changing Attributes

```js
const link = document.querySelector("a");

link.getAttribute("href");
link.setAttribute("href", "https://example.com");
link.hasAttribute("target");
link.removeAttribute("target");

link.href = "https://example.com"; // property access
```

### data-* Attributes

```html
<div id="card" data-user-id="42"></div>
```

```js
const card = document.querySelector("#card");
card.dataset.userId;        // "42"
card.dataset.role = "admin"; // adds data-role="admin"
```

## Changing Styles

```js
const box = document.querySelector(".box");

box.style.color = "red";
box.style.backgroundColor = "yellow";   // camelCase for CSS properties
box.style.cssText = "color: red; font-size: 20px;";
```

## Working with Classes

```js
box.classList.add("active");
box.classList.remove("active");
box.classList.toggle("active");
box.classList.contains("active"); // true or false
box.classList.replace("old", "new");
```

## Creating and Adding Elements

```js
const li = document.createElement("li");
li.textContent = "New item";

const list = document.querySelector("ul");

list.appendChild(li);        // add at the end
list.append("text", li);     // add nodes or strings at the end
list.prepend(li);            // add at the start
list.insertBefore(li, list.firstElementChild);
```

### insertAdjacentHTML / insertAdjacentElement

```js
list.insertAdjacentHTML("beforeend", "<li>Another item</li>");
// positions: "beforebegin", "afterbegin", "beforeend", "afterend"
```

## Removing and Replacing Elements

```js
li.remove();                      // remove the element
list.removeChild(li);             // remove a child
list.replaceChild(newLi, oldLi);  // replace a child
oldLi.replaceWith(newLi);
```

## Cloning Elements

```js
const copy = li.cloneNode(true);  // true = deep clone (with children)
```

## Reading Form Values

```js
const input = document.querySelector("#name");

input.value;
input.value = "Sam";

const checkbox = document.querySelector("#agree");
checkbox.checked; // true or false
```

## Key Points

- `querySelector` / `querySelectorAll` are the most flexible selection methods.
- Use `textContent` instead of `innerHTML` when inserting plain text.
- Use `classList` to change styling through CSS classes.
- Use `createElement` and `append` to add new elements.
