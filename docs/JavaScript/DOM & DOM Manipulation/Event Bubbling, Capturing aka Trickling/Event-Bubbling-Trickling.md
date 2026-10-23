# Event Bubbling & Trickling (Capturing) in JavaScript

When an event happens on an element, it travels through the DOM tree in phases. Understanding these phases explains why a click on a child can trigger handlers on its parents.

## Event Propagation Phases

1. **Capturing (trickling) phase**: the event travels down from `window` to the target element.
2. **Target phase**: the event reaches the target element.
3. **Bubbling phase**: the event travels back up from the target to `window`.

```html
<div id="grandparent">
  <div id="parent">
    <button id="child">Click</button>
  </div>
</div>
```

## Event Bubbling (Default)

By default, event listeners run in the bubbling phase. The innermost element's handler runs first, then its parents'.

```js
document.getElementById("grandparent").addEventListener("click", () => {
  console.log("grandparent");
});

document.getElementById("parent").addEventListener("click", () => {
  console.log("parent");
});

document.getElementById("child").addEventListener("click", () => {
  console.log("child");
});

// Clicking the button logs:
// child
// parent
// grandparent
```

## Event Trickling (Capturing)

Pass `true` (or `{ capture: true }`) as the third argument to listen during the capturing phase. Outer elements run first.

```js
document.getElementById("grandparent").addEventListener("click", () => {
  console.log("grandparent");
}, true);

document.getElementById("parent").addEventListener("click", () => {
  console.log("parent");
}, true);

document.getElementById("child").addEventListener("click", () => {
  console.log("child");
}, true);

// Clicking the button logs:
// grandparent
// parent
// child
```

## Capturing and Bubbling Together

Capturing listeners always run before bubbling listeners for the same event.

```js
parent.addEventListener("click", () => console.log("parent capture"), true);
parent.addEventListener("click", () => console.log("parent bubble"), false);
child.addEventListener("click", () => console.log("child"));

// Clicking the child logs:
// parent capture
// child
// parent bubble
```

## event.target vs event.currentTarget

```js
parent.addEventListener("click", (event) => {
  console.log(event.target);        // the element that was actually clicked
  console.log(event.currentTarget); // the element the listener is attached to
});
```

## Stopping Propagation

```js
child.addEventListener("click", (event) => {
  event.stopPropagation(); // stops the event from reaching parents
  console.log("child only");
});
```

`stopImmediatePropagation()` also prevents other listeners on the same element from running.

```js
child.addEventListener("click", (event) => {
  event.stopImmediatePropagation();
});
```

## preventDefault vs stopPropagation

```js
link.addEventListener("click", (event) => {
  event.preventDefault();   // stops the default action (e.g. following the link)
  event.stopPropagation();  // stops the event from moving to other elements
});
```

These two are independent of each other.

## Events That Do Not Bubble

Some events do not bubble, such as `focus`, `blur`, `mouseenter`, and `mouseleave`. The bubbling alternatives are `focusin`, `focusout`, `mouseover`, and `mouseout`.

## The once Option

```js
button.addEventListener("click", handler, { once: true });
```

## Key Points

- Order of propagation: capturing (down) → target → bubbling (up).
- Listeners use bubbling by default; pass `true` to use capturing.
- `event.target` is the origin of the event; `event.currentTarget` is where the listener is attached.
- `stopPropagation()` stops the event from traveling further.
