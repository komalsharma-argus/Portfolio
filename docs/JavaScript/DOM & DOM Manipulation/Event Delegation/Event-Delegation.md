# Event Delegation in JavaScript

Event delegation is a technique where a single event listener is attached to a parent element to handle events for all of its children, including children added later. It works because of event bubbling.

## The Problem: One Listener per Element

```js
const items = document.querySelectorAll("#list li");

items.forEach((item) => {
  item.addEventListener("click", () => {
    console.log(item.textContent);
  });
});
```

This creates many listeners and does not work for items added later.

## The Solution: Delegation

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```js
const list = document.querySelector("#list");

list.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log(event.target.textContent);
  }
});
```

One listener handles clicks for every `li`, including ones added dynamically.

```js
const newItem = document.createElement("li");
newItem.textContent = "Item 4";
list.appendChild(newItem); // clicking it works automatically
```

## Using closest()

If the clickable element contains child elements, `event.target` may be an inner element. Use `closest()` to find the intended element.

```html
<ul id="list">
  <li data-id="1"><span>Item 1</span> <button>Delete</button></li>
  <li data-id="2"><span>Item 2</span> <button>Delete</button></li>
</ul>
```

```js
list.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !list.contains(button)) return;

  const li = button.closest("li");
  console.log("Deleting item", li.dataset.id);
  li.remove();
});
```

## Using matches()

```js
list.addEventListener("click", (event) => {
  if (event.target.matches("li.active")) {
    console.log("Active item clicked");
  }
});
```

## Handling Multiple Actions

```html
<div id="toolbar">
  <button data-action="save">Save</button>
  <button data-action="edit">Edit</button>
  <button data-action="delete">Delete</button>
</div>
```

```js
const actions = {
  save() { console.log("Saving"); },
  edit() { console.log("Editing"); },
  delete() { console.log("Deleting"); },
};

document.querySelector("#toolbar").addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  if (action && actions[action]) {
    actions[action]();
  }
});
```

## Benefits

- Fewer event listeners, so less memory use.
- Works for elements added or removed dynamically.
- Less code to set up and clean up.

## Limitations

- Only works for events that bubble (not `focus`, `blur`, etc.; use `focusin` and `focusout` instead).
- If a child calls `event.stopPropagation()`, the parent listener will not run.
- Very generic listeners high in the tree, such as on `document`, can add unnecessary work.

## Key Points

- Attach the listener to a common parent.
- Use `event.target` to find which child triggered the event.
- Use `closest()` when the target may be a nested element.
