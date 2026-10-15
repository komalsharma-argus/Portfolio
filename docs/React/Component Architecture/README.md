# React Component Design

This guide covers three topics:

1. Controlled vs Uncontrolled Components
2. Lifting State Up
3. Component Modularity & Composition

---

## 1. Controlled vs Uncontrolled Components

Form elements (`<input>`, `<textarea>`, `<select>`) naturally keep their own value in the DOM. React gives you two ways to handle that value.

| | **Controlled** | **Uncontrolled** |
|---|---|---|
| Source of truth | React state | The DOM |
| Reading the value | From state, at any time | From a ref, when needed (usually on submit) |
| Updating | `onChange` → `setState` | The browser handles it |
| Re-renders per keystroke | Yes | No |
| Initial value | `value` | `defaultValue` |

### Controlled components

The input's value is **driven by React state**. Every change goes through a handler, so React always knows the current value.

```jsx
import { useState } from "react";

function SignupForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}                              // value comes from state
        onChange={(e) => setEmail(e.target.value)} // state updates on every change
      />
      <button type="submit">Sign up</button>
    </form>
  );
}
```

**Multiple fields with one handler:**

```jsx
function ProfileForm() {
  const [form, setForm] = useState({ name: "", email: "", role: "dev" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="dev">Developer</option>
        <option value="design">Designer</option>
      </select>
    </form>
  );
}
```

**Checkboxes use `checked`, not `value`:**

```jsx
<input
  type="checkbox"
  checked={isSubscribed}
  onChange={(e) => setIsSubscribed(e.target.checked)}
/>
```

**Why choose controlled:**
- Instant validation and formatting as the user types
- Enable or disable buttons based on input
- Reset or prefill the form by setting state
- Keep multiple inputs in sync
- One predictable source of truth

**Trade-offs:** more boilerplate, and a re-render on each keystroke (rarely a problem unless the form is very large).

### Uncontrolled components

The **DOM holds the value**. You read it with a `ref` when you need it.

```jsx
import { useRef } from "react";

function SearchForm() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching:", inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Search</button>
    </form>
  );
}
```

**Reading all fields with `FormData`:**

```jsx
function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data); // { name: "...", message: "..." }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue="" />
      <textarea name="message" defaultValue="" />
      <button type="submit">Send</button>
    </form>
  );
}
```

**File inputs are always uncontrolled**, because their value is read-only:

```jsx
<input type="file" ref={fileRef} />
// fileRef.current.files[0]
```

**Why choose uncontrolled:**
- Simple forms where you only need values on submit
- Less code and no re-render per keystroke
- File inputs
- Integrating with non-React code

**Trade-offs:** you can't easily validate live, transform input as it's typed, or drive other UI from the value.

### Rules and pitfalls

- Use `value` **with** `onChange` (controlled) or `defaultValue` (uncontrolled). Never mix them on the same input.
- `value` without `onChange` makes the input **read-only** and React will warn you.
- Never switch an input between controlled and uncontrolled during its life. Initialize state with `""`, not `undefined`:

```jsx
const [name, setName] = useState();   // ❌ undefined → uncontrolled, then controlled
const [name, setName] = useState(""); // ✅ always controlled
```

### Which should I use?

| Scenario | Choice |
|---|---|
| Live validation, formatting, or conditional UI | Controlled |
| Form values used by other components | Controlled |
| Simple submit-only form | Uncontrolled |
| File upload | Uncontrolled |
| Default recommendation | **Controlled** |

---

## 2. Lifting State Up

When **two or more components need the same data**, move the state to their **closest common parent** and pass it down through props. The parent becomes the single source of truth, and children communicate changes back through callback props.

```
        Parent  (owns state)
        /    \
  value ↓    ↓ value
   ChildA    ChildB
      ↑ onChange (callback)
```

### The problem

Sibling components can't share state directly. Each keeps its own copy, so they drift out of sync.

```jsx
function CelsiusInput() {
  const [temp, setTemp] = useState("");     // local to this component
  return <input value={temp} onChange={(e) => setTemp(e.target.value)} />;
}

function FahrenheitInput() {
  const [temp, setTemp] = useState("");     // a separate copy: not synced!
  return <input value={temp} onChange={(e) => setTemp(e.target.value)} />;
}
```

### The solution: lift the state

**Step 1: Make the children controlled by props.** Remove their local state.
**Step 2: Move the state to the parent.**
**Step 3: Pass the value and a change handler down.**

```jsx
function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

const toFahrenheit = (c) => (c * 9) / 5 + 32;
const toCelsius = (f) => ((f - 32) * 5) / 9;

function Converter() {
  // Single source of truth: store only Celsius
  const [celsius, setCelsius] = useState("");

  const fahrenheit = celsius === "" ? "" : toFahrenheit(Number(celsius)).toFixed(1);

  const handleFahrenheitChange = (f) =>
    setCelsius(f === "" ? "" : toCelsius(Number(f)).toFixed(1));

  return (
    <>
      <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
      <TemperatureInput label="Fahrenheit" value={fahrenheit} onChange={handleFahrenheitChange} />
    </>
  );
}
```

Both inputs always agree because they read from one state. Note that `fahrenheit` is **derived** during render, not stored separately.

### Example: child-to-parent communication

A child can't change the parent's state directly. It calls a function the parent passed down.

```jsx
function Product({ product, onAddToCart }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product)}>Add to cart</button>
    </div>
  );
}

function Shop() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => setCart((prev) => [...prev, product]);

  return (
    <>
      <ProductList onAddToCart={addToCart} />
      <CartSummary items={cart} />      {/* sibling reads the same state */}
    </>
  );
}
```

### Guidelines

- Lift state to the **closest** common ancestor, no higher than necessary.
- Keep **one source of truth** per piece of data. Don't duplicate it in multiple places.
- **Derive** values instead of storing them when they can be computed from existing state or props.
- Name callback props with `on...` (`onChange`, `onSubmit`) and handlers with `handle...`.
- Data flows **down** (props), events flow **up** (callbacks). This is React's one-way data flow.

### Warning signs

| Symptom | Likely cause |
|---|---|
| Two components show inconsistent data | Duplicated state, so lift it up |
| Props passed through many layers that don't use them | Prop drilling: restructure with composition (see section 3) |
| A parent re-renders and slows down | State lifted higher than needed; move it closer to where it's used |

---

## 3. Component Modularity & Composition

**Modularity** means splitting the UI into small, focused, reusable components. **Composition** means combining those components to build larger ones. React favors composition over inheritance.

### Principles of good components

| Principle | Meaning |
|---|---|
| **Single responsibility** | Each component does one thing well |
| **Reusable** | Configured through props, not hard-coded values |
| **Small** | If it's hard to name or describe, split it |
| **Predictable** | Same props and state produce the same output |
| **Loosely coupled** | Components know as little as possible about each other |

### When to split a component

- It has grown past ~100-150 lines or does multiple jobs
- A piece of markup repeats in several places
- Part of it has its own state or logic
- It's hard to name or test

### Example: from monolith to modular

**Before: one large component**

```jsx
function ProfilePage({ user }) {
  return (
    <div>
      <div className="header">
        <img src={user.avatar} alt={user.name} />
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
      </div>
      <ul>
        {user.posts.map((p) => (
          <li key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**After: small, focused components**

```jsx
function Avatar({ src, name }) {
  return <img src={src} alt={name} />;
}

function ProfileHeader({ user }) {
  return (
    <header>
      <Avatar src={user.avatar} name={user.name} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </header>
  );
}

function PostItem({ post }) {
  return (
    <li>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </li>
  );
}

function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
}

function ProfilePage({ user }) {
  return (
    <div>
      <ProfileHeader user={user} />
      <PostList posts={user.posts} />
    </div>
  );
}
```

### Composition techniques

#### 1. Containment with `children`

For generic "boxes" that don't know their content in advance.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Any content works here.</p>
</Card>
```

#### 2. Slots (multiple named children via props)

When a component has several distinct areas to fill.

```jsx
function Layout({ header, sidebar, children }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

<Layout header={<NavBar />} sidebar={<Menu />}>
  <Dashboard />
</Layout>
```

#### 3. Specialization

A specific component is a configured version of a generic one.

```jsx
function Button({ variant = "primary", children, ...rest }) {
  return <button className={`btn btn-${variant}`} {...rest}>{children}</button>;
}

function DeleteButton(props) {
  return <Button variant="danger" {...props}>Delete</Button>;
}
```

#### 4. Compound components

Related components that work together and share implicit state.

```jsx
import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

function Tabs({ defaultTab, children }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(id)}
      style={{ fontWeight: active === id ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext);
  return active === id ? <div>{children}</div> : null;
}

// Usage reads like HTML
<Tabs defaultTab="one">
  <Tab id="one">One</Tab>
  <Tab id="two">Two</Tab>
  <TabPanel id="one">First content</TabPanel>
  <TabPanel id="two">Second content</TabPanel>
</Tabs>
```

#### 5. Render props

Pass a function that tells a component *what to render*, while it handles the logic.

```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
```

### Avoiding prop drilling with composition

Instead of passing props through layers that don't use them, pass the **finished element** down.

```jsx
// ❌ Prop drilling: Page and Header only forward `user`
<Page user={user} />   // → <Header user={user} /> → <Avatar user={user} />

// ✅ Composition: build the element at the top and pass it in
function App() {
  const user = useUser();
  return <Page header={<Header avatar={<Avatar user={user} />} />} />;
}
```

Intermediate components stay simple and no longer need to know about `user`.

### Folder organization (example)

```
src/
├── components/
│   ├── ui/              # Generic, reusable: Button, Card, Modal, Input
│   ├── layout/          # Layout, Header, Sidebar, Footer
│   └── features/
│       ├── profile/     # ProfileHeader, PostList, PostItem
│       └── cart/        # CartSummary, CartItem
├── hooks/               # Reusable logic
└── pages/               # Route-level components that assemble the rest
```

### Best practices

- Prefer **props and composition** over deep conditionals and giant components.
- Keep components **presentational** (UI only) where possible, and place data fetching and logic in parents or hooks.
- Give props **clear, descriptive names**, and set sensible defaults.
- Spread extra props (`...rest`) onto the root element so consumers can customize.
- Avoid over-abstraction: don't create a reusable component until you actually reuse it (roughly the "rule of three").
- Colocate files (component, styles, tests) that change together.

### Component design checklist

- [ ] Does it do one job?
- [ ] Is it configurable through props?
- [ ] Can I name it clearly?
- [ ] Is the state as low in the tree as it can be (but high enough to be shared)?
- [ ] Are props being drilled through components that don't use them?
- [ ] Could `children` or a slot make it more flexible?

---

## Quick Reference

| Topic | Core idea | Remember |
|---|---|---|
| **Controlled** | React state drives the input (`value` + `onChange`) | Best default; enables validation and sync |
| **Uncontrolled** | The DOM holds the value, read via `ref` or `FormData` | Good for simple forms and file inputs |
| **Lifting state up** | Move shared state to the closest common parent | Data down via props, events up via callbacks |
| **Modularity** | Small, single-purpose components | Split when a component does too much |
| **Composition** | Build UIs by combining components (`children`, slots, compound components) | Prefer it over prop drilling and inheritance |
