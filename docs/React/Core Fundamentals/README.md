# React Fundamentals

A concise guide to the five core building blocks of React: **JSX**, **Functional Components**, **Props & State**, **Conditional Rendering**, and **Lists & Keys**.

> Examples use modern React (18+) with function components and Hooks.

---

## Table of Contents

1. [JSX](#1-jsx)
2. [Functional Components](#2-functional-components)
3. [Props & State](#3-props--state)
4. [Conditional Rendering](#4-conditional-rendering)
5. [Lists & Keys](#5-lists--keys)
6. [Putting It All Together](#6-putting-it-all-together)
7. [Quick Reference](#7-quick-reference)

---

## 1. JSX

**JSX** (JavaScript XML) is a syntax extension that lets you write HTML-like markup inside JavaScript. It is not required by React, but it is the standard way to describe UI. Build tools (Babel, Vite, etc.) compile it into plain JavaScript calls.

```jsx
const element = <h1>Hello, React!</h1>;

// Compiles to roughly:
const element = React.createElement("h1", null, "Hello, React!");
```

### Embedding JavaScript with `{}`

Any valid JavaScript **expression** can go inside curly braces.

```jsx
const name = "Asha";
const price = 499;

const card = (
  <div>
    <h2>Hello, {name.toUpperCase()}!</h2>
    <p>Total: ₹{price * 2}</p>
    <p>{new Date().getFullYear()}</p>
  </div>
);
```

> Only expressions work inside `{}`. Statements like `if`, `for`, and `switch` do not.

### JSX Rules

| Rule | Example |
|---|---|
| Return a **single root element** | Wrap siblings in `<div>` or a Fragment `<>...</>` |
| **Close all tags** | `<img />`, `<input />`, `<br />` |
| Use **camelCase** for attributes | `onClick`, `tabIndex`, `maxLength` |
| Use `className` instead of `class` | `<div className="box">` |
| Use `htmlFor` instead of `for` | `<label htmlFor="email">` |
| Styles are **objects** | `style={{ color: "red", fontSize: 16 }}` |
| Comments go in braces | `{/* a comment */}` |

```jsx
function Profile() {
  return (
    <>
      <img src="/avatar.png" alt="Avatar" className="avatar" />
      <label htmlFor="bio">Bio</label>
      <input id="bio" type="text" style={{ border: "1px solid gray" }} />
    </>
  );
}
```

### Good to know

- JSX **escapes** values by default, which protects against XSS attacks.
- Components must start with an **uppercase letter** (`<Button />`). Lowercase tags are treated as HTML elements.
- `false`, `null`, `undefined`, and `true` render **nothing**. The number `0` does render.

---

## 2. Functional Components

A **component** is a reusable, self-contained piece of UI. A **functional component** is simply a JavaScript function that returns JSX.

```jsx
function Greeting() {
  return <h1>Welcome to React!</h1>;
}

// Arrow function version
const Greeting = () => <h1>Welcome to React!</h1>;
```

### Using a component

```jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}
```

### Exporting and importing

```jsx
// Button.jsx
export default function Button() {
  return <button>Click me</button>;
}

// App.jsx
import Button from "./Button";
```

### Composition

Build complex UIs by combining small components. Use the special `children` prop to nest content.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function App() {
  return (
    <Card>
      <h2>Title</h2>
      <p>Anything can go in here.</p>
    </Card>
  );
}
```

### Rules of components

- Name them in **PascalCase** (`UserCard`, not `userCard`).
- Keep them **pure**: given the same props and state, return the same JSX. Don't mutate props or external variables while rendering.
- **Never define a component inside another component.** It is re-created on every render and loses its state.
- Prefer **small, single-purpose** components.

---

## 3. Props & State

| | **Props** | **State** |
|---|---|---|
| Meaning | Inputs passed **into** a component | Data **owned and managed by** a component |
| Who changes it | The parent (read-only for the child) | The component itself, via a setter |
| Triggers re-render | When the parent passes new values | When the setter is called |
| Analogy | Function arguments | Variables remembered between renders |

### Props

Props flow **one way**: parent → child.

```jsx
function UserCard({ name, age, isAdmin = false }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      {isAdmin && <span>Admin</span>}
    </div>
  );
}

function App() {
  return <UserCard name="Ravi" age={25} isAdmin />;
}
```

- Strings can be passed in quotes. Everything else (numbers, booleans, arrays, objects, functions) goes in `{}`.
- Destructure props in the parameter list and set **default values** inline.
- Props are **read-only**. Never modify them.
- Pass **functions as props** to let children communicate back up to the parent.

```jsx
function Child({ onSave }) {
  return <button onClick={() => onSave("data")}>Save</button>;
}

function Parent() {
  const handleSave = (value) => console.log("Saved:", value);
  return <Child onSave={handleSave} />;
}
```

### State with `useState`

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // [value, setter] = useState(initialValue)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### State rules

**1. Never mutate state directly. Always use the setter.**

```jsx
count = count + 1;          // ❌ won't trigger a re-render
setCount(count + 1);        // ✅
```

**2. Updating from the previous value? Use the functional form.**

```jsx
setCount((prev) => prev + 1);   // ✅ always uses the latest value
```

**3. Treat objects and arrays as immutable. Create new copies.**

```jsx
const [user, setUser] = useState({ name: "Asha", age: 24 });
setUser({ ...user, age: 25 });                    // ✅ object

const [items, setItems] = useState([1, 2]);
setItems([...items, 3]);                          // ✅ add
setItems(items.filter((i) => i !== 2));           // ✅ remove
setItems(items.map((i) => (i === 1 ? 10 : i)));   // ✅ update
```

**4. State updates are asynchronous (batched).** The state variable doesn't change until the next render.

```jsx
setCount(count + 1);
console.log(count); // still the OLD value
```

**5. Keep state minimal.** If a value can be computed from existing state or props, compute it during render instead of storing it.

### Handling input (controlled components)

```jsx
function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Your name"
    />
  );
}
```

### Lifting state up

When two sibling components need the same data, move the state to their **closest common parent** and pass it down as props.

```jsx
function Parent() {
  const [temp, setTemp] = useState(20);
  return (
    <>
      <Input value={temp} onChange={setTemp} />
      <Display value={temp} />
    </>
  );
}
```

---

## 4. Conditional Rendering

React has no special syntax for conditionals. You use plain JavaScript.

### Pattern 1: `if` / early return

Best for switching between entirely different outputs.

```jsx
function Dashboard({ isLoggedIn }) {
  if (!isLoggedIn) {
    return <p>Please log in.</p>;
  }
  return <h1>Welcome back!</h1>;
}
```

### Pattern 2: Ternary operator `? :`

Best for **either/or** inside JSX.

```jsx
<p>{isOnline ? "🟢 Online" : "⚪ Offline"}</p>
```

### Pattern 3: Logical AND `&&`

Best for **show or nothing**.

```jsx
{hasNotifications && <Badge count={5} />}
```

> ⚠️ **Gotcha:** with numbers, `0` is falsy but still **renders**.
> ```jsx
> {items.length && <List />}        // ❌ renders "0" when empty
> {items.length > 0 && <List />}    // ✅ use a boolean
> ```

### Pattern 4: Variable assignment

Best for multiple branches.

```jsx
function Status({ status }) {
  let content;
  if (status === "loading") content = <Spinner />;
  else if (status === "error") content = <ErrorMessage />;
  else content = <Data />;

  return <div>{content}</div>;
}
```

### Pattern 5: Return `null`

Render nothing at all.

```jsx
function Warning({ show }) {
  if (!show) return null;
  return <div className="warning">Careful!</div>;
}
```

### Pattern 6: Lookup object

Cleaner than a long `if/else` or `switch` chain.

```jsx
const views = {
  loading: <Spinner />,
  error: <ErrorMessage />,
  success: <Data />,
};

return <div>{views[status]}</div>;
```

### Which one to use?

| Scenario | Pattern |
|---|---|
| Two options | Ternary `? :` |
| Show or hide | `&&` |
| Whole component swaps | `if` + early return |
| Many branches | Variable or lookup object |
| Hide the component entirely | `return null` |

---

## 5. Lists & Keys

### Rendering lists with `.map()`

Transform an array of data into an array of JSX elements.

```jsx
const fruits = ["Apple", "Banana", "Mango"];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

### Lists of objects

```jsx
const users = [
  { id: 1, name: "Asha", role: "Developer" },
  { id: 2, name: "Ravi", role: "Designer" },
  { id: 3, name: "Meera", role: "Manager" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <UserItem key={user.id} name={user.name} role={user.role} />
      ))}
    </ul>
  );
}
```

### What are keys?

A **key** is a special string or number prop that helps React identify **which items changed, were added, or were removed** between renders. This makes updates efficient and keeps component state attached to the correct item.

### Key rules

| Rule | Detail |
|---|---|
| **Unique among siblings** | Needs to be unique within the same list, not globally |
| **Stable** | Must not change between renders |
| **Not random** | Never use `Math.random()` or generate keys during render |
| **Placed on the outermost element** returned by `map` | Not on a nested child |
| **Not passed as a prop** | `key` is not readable inside the component. Pass the value under a different name if needed |

### Choosing a key

```jsx
// ✅ Best: a stable unique ID from your data (database ID, UUID, slug)
{todos.map((todo) => <Todo key={todo.id} {...todo} />)}

// ⚠️ Acceptable ONLY for static lists that never reorder, filter, or change
{items.map((item, index) => <li key={index}>{item}</li>)}

// ❌ Bad: unstable, causes bugs and wasted re-renders
{items.map((item) => <li key={Math.random()}>{item}</li>)}
```

> **Why avoid index keys?** If the list is reordered, filtered, or has items inserted, indexes shift. React then mismatches items with their state, causing wrong inputs, stale values, and subtle bugs.

### Fragments with keys

When mapping to multiple sibling elements, use the explicit `Fragment` so you can attach a key.

```jsx
import { Fragment } from "react";

{items.map((item) => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}
```

### Filtering, sorting, and empty states

```jsx
function TaskList({ tasks }) {
  const pending = tasks.filter((t) => !t.done);

  if (pending.length === 0) return <p>All caught up! 🎉</p>;

  return (
    <ul>
      {pending
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
    </ul>
  );
}
```

> `.sort()` mutates the original array. In real code, copy first: `[...pending].sort(...)`.

---

## 6. Putting It All Together

A small to-do app using all five concepts.

```jsx
import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <span
        onClick={() => onToggle(todo.id)}
        style={{ textDecoration: todo.done ? "line-through" : "none", cursor: "pointer" }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>✕</button>
    </li>
  );
}

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn JSX", done: true },
    { id: 2, text: "Understand props & state", done: false },
  ]);
  const [text, setText] = useState("");

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setText("");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  return (
    <div>
      <h1>My Todos ({todos.filter((t) => !t.done).length} left)</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
      />
      <button onClick={addTodo}>Add</button>

      {todos.length === 0 ? (
        <p>Nothing to do!</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
```

| Concept | Where it appears |
|---|---|
| **JSX** | All the markup, `{}` expressions, `style={{}}` |
| **Functional components** | `TodoApp`, `TodoItem` |
| **Props** | `todo`, `onToggle`, `onDelete` passed to `TodoItem` |
| **State** | `todos`, `text` via `useState` (immutable updates) |
| **Conditional rendering** | Ternary for the empty state, ternary for strikethrough |
| **Lists & keys** | `todos.map(...)` with `key={todo.id}` |

---

## 7. Quick Reference

```jsx
// JSX expression
<p>{user.name}</p>

// Component + props
function Card({ title, children }) { return <div><h2>{title}</h2>{children}</div>; }
<Card title="Hello">Content</Card>

// State
const [value, setValue] = useState(initial);
setValue(newValue);
setValue((prev) => prev + 1);

// Conditional rendering
{isTrue ? <A /> : <B />}
{isTrue && <A />}
if (!data) return null;

// Lists
{items.map((item) => <Item key={item.id} {...item} />)}
```

### Common mistakes checklist

- [ ] Returning multiple root elements without a wrapper or Fragment
- [ ] Using `class` instead of `className`
- [ ] Forgetting to close tags like `<img />`
- [ ] Mutating state or props directly
- [ ] Defining components inside other components
- [ ] Using `array.length && ...` (renders `0`)
- [ ] Missing, duplicate, or random `key` values
- [ ] Using array index as `key` in dynamic lists
- [ ] Lowercase component names (`<card />` is treated as HTML)

---

## Further Learning

- [React Docs (react.dev)](https://react.dev): the official, interactive documentation
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Rules of Hooks](https://react.dev/reference/rules)
