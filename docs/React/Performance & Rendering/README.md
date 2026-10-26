# Performance & Rendering

This guide covers four topics:

1. Virtual DOM & Reconciliation
2. Re-render Triggers
3. Memoization Hooks
4. Code Splitting & Lazy Loading

---

#### 1. Virtual DOM & Reconciliation

##### Virtual DOM

The **Virtual DOM (VDOM)** is a lightweight JavaScript representation of the real DOM: a tree of plain objects describing what the UI should look like. Updating real DOM nodes is relatively expensive, so React does its work on this cheap in-memory tree first and only touches the real DOM when necessary.

```jsx
// This JSX...
<div className="card"><h1>Hello</h1></div>

// ...becomes an object tree (simplified):
{
  type: "div",
  props: {
    className: "card",
    children: { type: "h1", props: { children: "Hello" } }
  }
}
```

##### How an update works

```
1. State or props change
2. React calls your component → produces a NEW virtual tree     (Render phase)
3. React compares the new tree with the previous one (diffing)   (Reconciliation)
4. React applies only the minimal changes to the real DOM        (Commit phase)
```

| Phase | What happens | Pure? |
|---|---|---|
| **Render** | Components run and return JSX. React builds the new virtual tree. | ✅ Must be pure (no side effects) |
| **Reconciliation** | React diffs old vs new trees to find what changed. | Internal |
| **Commit** | Real DOM is updated; refs are set; effects run. | Side effects allowed (`useEffect`) |

> "Rendering" means React **calling your component function**. It does not necessarily mean the browser repaints or the DOM changes.

##### Reconciliation

**Reconciliation** is the algorithm React uses to diff two trees. A fully general tree diff is O(n³), so React uses two heuristics to make it O(n):

1. **Elements of different types produce different trees.**
2. **Keys** hint which child elements are stable across renders.

##### Diffing rules

**Rule 1: Different element type → destroy and rebuild**

```jsx
// Before                // After
<div><Counter /></div>   <span><Counter /></span>
```

`div` → `span`: the old subtree is **unmounted** (state lost) and a new one **mounted**. The same applies to components: `<A />` → `<B />` at the same position resets everything beneath.

**Rule 2: Same element type → update in place**

```jsx
<div className="a" title="x" />   →   <div className="b" title="x" />
```

React keeps the DOM node and changes only `className`. For components of the same type, the instance and its **state are preserved**; React just passes new props.

**Rule 3: Lists are matched by `key`**

Without keys, React compares children by position. Inserting at the front makes every item look changed:

```jsx
// Without keys: React sees every <li> as modified
<ul>                       <ul>
  <li>Duarte</li>            <li>Villanueva</li>   ← "changed"
  <li>Villanueva</li>        <li>Duarte</li>       ← "changed"
</ul>                        <li>Villanueva</li>   ← "added"
                           </ul>

// With keys: React sees one insertion and moves nothing else
<li key="duarte">…</li>
```

```jsx
{users.map((user) => <UserRow key={user.id} user={user} />)}  // ✅ stable ID
```

##### Keys and state

State is tied to a component's **position in the tree plus its key**. Changing a key resets that component's state. This is a useful trick:

```jsx
// Switching userId gives <Profile> a fresh instance with fresh state
<Profile key={userId} userId={userId} />
```

##### Common pitfalls

| Mistake | Consequence |
|---|---|
| Index as `key` in a dynamic list | State attaches to the wrong items after reorder, insert, or delete |
| `Math.random()` as `key` | New key every render → remount every time, lost state, poor performance |
| Defining a component inside another component | New component type every render → full unmount/remount each time |
| Changing the wrapper element type conditionally | Resets all state beneath it |

```jsx
// ❌ Component defined inside another: remounts on every parent render
function Parent() {
  function Child() { return <input />; }
  return <Child />;
}

// ✅ Define at module level
function Child() { return <input />; }
function Parent() { return <Child />; }
```

---

#### 2. Re-render Triggers

A component re-renders when React needs to call it again to figure out the new UI. There are only a few causes.

##### What triggers a re-render

| Trigger | Details |
|---|---|
| **1. State change** | Calling a `useState` or `useReducer` setter with a **new** value (compared with `Object.is`) |
| **2. Parent re-renders** | By default, **all children re-render** when the parent does, even if their props didn't change |
| **3. Context change** | Every component that reads the context via `useContext` re-renders when the Provider's `value` changes |
| **4. Force update / key change** | A changed `key` remounts the component |

> **Props changing is not a separate trigger.** Props only change because a parent re-rendered. The parent re-rendering is the real cause.

##### What does NOT trigger a re-render

- Changing a `useRef` value (`ref.current = ...`)
- Mutating a variable declared outside the component
- Directly mutating state (`state.push(x)`): React never sees it
- Calling a setter with the **same** value (React bails out, though the component function may run once more before it stops)

##### Trigger 1: State changes

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  console.log("Counter rendered");

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Objects and arrays need a new reference:**

```jsx
const [user, setUser] = useState({ name: "Asha" });

user.name = "Ravi";          // ❌ same reference → no re-render
setUser(user);               // ❌ same reference → no re-render
setUser({ ...user, name: "Ravi" });  // ✅ new reference → re-render
```

##### Trigger 2: Parent re-renders (cascade)

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Clicked {count}</button>
      <Child />   {/* re-renders on every click, though it takes no props */}
    </>
  );
}

function Child() {
  console.log("Child rendered");
  return <p>I'm a child</p>;
}
```

Re-renders cascade **downward** through the whole subtree, never upward to parents or sideways to siblings.

**Fix: move state down** so fewer components are affected:

```jsx
function Parent() {
  return (
    <>
      <CounterButton />   {/* owns the state; re-renders alone */}
      <Child />           {/* untouched */}
    </>
  );
}
```

**Fix: pass components as `children`.** Elements created by a *higher* component aren't re-created when the lower one re-renders.

```jsx
function Wrapper({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div onMouseMove={() => setCount((c) => c + 1)}>
      {children}   {/* same element reference → React skips re-rendering it */}
    </div>
  );
}

<Wrapper><ExpensiveTree /></Wrapper>
```

##### Trigger 3: Context changes

```jsx
const ThemeContext = createContext();

function Provider({ children }) {
  const [theme, setTheme] = useState("light");
  // ❌ new object every render → all consumers re-render each time
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
```

Stabilize the value:

```jsx
const value = useMemo(() => ({ theme, setTheme }), [theme]);   // ✅
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

##### Is a re-render bad?

Not necessarily. Re-rendering is **cheap** for most components, and React only updates the DOM if the output changed. Optimize only when you can **measure** a problem (slow typing, laggy interactions, large lists).

##### Reducing unnecessary re-renders

| Technique | When to use |
|---|---|
| Move state closer to where it's used | First choice; costs nothing |
| Pass expensive subtrees as `children` | Wrapper holds frequently changing state |
| Split contexts by concern | Avoid one big context everyone consumes |
| Memoization (`React.memo`, `useMemo`, `useCallback`) | Measured, repeated, expensive work |

---

#### 3. Memoization Hooks

**Memoization** caches the result of a computation and reuses it until its inputs change. React offers `useMemo` and `useCallback` for hooks, plus `React.memo` for components. They only skip work when dependencies are **unchanged**.

##### useMemo: cache a calculated value

```jsx
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);
```

```jsx
function ProductList({ products, filter }) {
  const filtered = useMemo(
    () => products.filter((p) => p.category === filter),
    [products, filter]
  );

  return filtered.map((p) => <Product key={p.id} product={p} />);
}
```

React recomputes only when `products` or `filter` changes. Other re-renders reuse the cached array.

**Use it for:**
- Genuinely expensive calculations (filtering/sorting large lists, heavy math)
- Keeping an **object or array reference stable** when passing it to a memoized child or as a hook dependency

##### useCallback: cache a function

```jsx
const memoizedFn = useCallback(() => doSomething(a, b), [a, b]);
```

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. It returns the **same function reference** between renders until a dependency changes.

**Why does this matter?** Functions are recreated on every render, so each render produces a new reference. That breaks memoized children:

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => console.log("clicked");   // new function every render

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child onClick={handleClick} />
    </>
  );
}
```

Even if `Child` is wrapped in `React.memo`, the new `handleClick` prop makes it re-render. Fix with `useCallback`:

```jsx
const handleClick = useCallback(() => console.log("clicked"), []);
```

##### React.memo: skip re-rendering a component

Wraps a component so it re-renders **only if its props changed** (shallow comparison).

```jsx
const Child = React.memo(function Child({ onClick, label }) {
  console.log("Child rendered");
  return <button onClick={onClick}>{label}</button>;
});
```

**The three work together:**

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleSave = useCallback(() => save(text), [text]);   // stable function
  const config = useMemo(() => ({ mode: "dark", text }), [text]); // stable object

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <Child onSave={handleSave} config={config} />   {/* skips render when count changes */}
    </>
  );
}

const Child = React.memo(function Child({ onSave, config }) { /* ... */ });
```

> `useCallback` and `useMemo` on their own **don't prevent child re-renders**. They only help when the child is wrapped in `React.memo` (or receives the value as a hook dependency).

##### Comparison

| | `useMemo` | `useCallback` | `React.memo` |
|---|---|---|---|
| Caches | A **value** | A **function** | A **component's output** |
| Returns | Result of calling the function | The function itself | A memoized component |
| Re-computes when | Dependencies change | Dependencies change | Props change (shallow) |
| Typical use | Expensive calculations, stable objects | Stable handlers passed to children | Prevent child re-renders |

##### Dependency rules

- List **every reactive value** the function reads in the dependency array.
- Missing dependencies cause **stale values** (the function sees old state).
- Passing `[]` means "create once", so be sure nothing inside changes.
- Dependencies are compared with `Object.is`, so a new object or array each render invalidates the cache.

```jsx
const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
```

Avoid stale closures with functional updates:

```jsx
const increment = useCallback(() => setCount((c) => c + 1), []);   // no `count` dependency needed
```

##### When NOT to memoize

Memoization isn't free: it adds code, uses memory, and the dependency comparison itself costs time.

- ❌ Cheap calculations (simple math, small arrays)
- ❌ Components that almost always receive new props anyway
- ❌ Everywhere "just in case"
- ✅ Measured slowness (verify with the React DevTools Profiler)
- ✅ Large lists, heavy computations, memoized children that receive callbacks or objects
- ✅ Stabilizing values used as dependencies of other hooks (`useEffect`, `useMemo`)

**Order of attack:** fix structure first (move state down, composition), then memoize if a measured problem remains.

---

#### 4. Code Splitting & Lazy Loading

By default, bundlers combine your whole app into one JavaScript file. Users download code for pages and features they may never visit. **Code splitting** breaks the bundle into smaller **chunks**, and **lazy loading** fetches those chunks only when they're needed. The result is a smaller initial download and a faster first load.

```
Without splitting:  [ one big bundle: Home + Dashboard + Settings + Charts + Editor ]
With splitting:     [ main: Home ]  → loads [ Dashboard ] / [ Settings ] / [ Charts ] on demand
```

##### Dynamic `import()`

The standard JavaScript mechanism. It returns a **Promise** and tells the bundler to create a separate chunk.

```jsx
// Static import: always in the main bundle
import { heavyFunction } from "./heavy";

// Dynamic import: separate chunk, loaded on demand
const module = await import("./heavy");
module.heavyFunction();
```

##### `React.lazy` + `Suspense`

`React.lazy` renders a dynamically imported component as a regular component. `Suspense` shows a **fallback** while the chunk loads.

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

**Requirements:**
- The lazy module must have a **default export**.
- A lazy component must render inside a `<Suspense>` boundary.
- Call `lazy()` at the **module top level**, never inside a component (it would reset on every render).

**Named exports:** re-map them to `default`.

```jsx
const Chart = lazy(() =>
  import("./Charts").then((module) => ({ default: module.LineChart }))
);
```

##### Strategy 1: Route-based splitting (most common)

Each page becomes its own chunk. This is usually the **best first step** because users only need one page at a time.

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

##### Strategy 2: Component-based splitting

Defer heavy components that aren't visible right away: modals, charts, rich-text editors, maps.

```jsx
const HeavyChart = lazy(() => import("./HeavyChart"));

function Report() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>Show chart</button>
      {show && (
        <Suspense fallback={<p>Loading chart...</p>}>
          <HeavyChart />
        </Suspense>
      )}
    </>
  );
}
```

The chart's code is downloaded only when the button is clicked.

##### Strategy 3: Library-based splitting

Load large libraries only at the moment you use them.

```jsx
async function exportToPdf(data) {
  const { jsPDF } = await import("jspdf");   // fetched on demand
  const doc = new jsPDF();
  doc.text(JSON.stringify(data), 10, 10);
  doc.save("report.pdf");
}
```

##### Suspense boundaries

Place boundaries thoughtfully. Where you put them determines what shows a fallback.

```jsx
// One boundary: whole section shows a single spinner
<Suspense fallback={<Spinner />}>
  <Sidebar />
  <Content />
</Suspense>

// Separate boundaries: each part loads independently
<Suspense fallback={<SidebarSkeleton />}><Sidebar /></Suspense>
<Suspense fallback={<ContentSkeleton />}><Content /></Suspense>
```

- Use **skeleton/placeholder fallbacks** matching the final layout to reduce layout shift.
- Nest boundaries so a slow chunk doesn't blank the entire page.

##### Handling load failures

Network issues can make a chunk fail to load. Wrap lazy components in an **Error Boundary** so the app doesn't crash.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) return <p>Something went wrong. Please retry.</p>;
    return this.props.children;
  }
}

<ErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <Dashboard />
  </Suspense>
</ErrorBoundary>
```

##### Preloading to hide load time

Start fetching a chunk **before** the user needs it, for example on hover.

```jsx
const loadSettings = () => import("./pages/Settings");
const Settings = lazy(loadSettings);

<Link to="/settings" onMouseEnter={loadSettings}>Settings</Link>
```

##### Best practices

- Start with **route-level** splitting, then split heavy components as needed.
- Don't split tiny components: each chunk costs an extra network request.
- Keep above-the-fold, critical UI in the main bundle.
- Always provide a meaningful `fallback` and an Error Boundary.
- Inspect bundle size with a bundle analyzer to find what's worth splitting.
- Test on a throttled network to feel the loading experience.

---

#### Quick Reference

| Topic | Key idea | Remember |
|---|---|---|
| **Virtual DOM** | In-memory tree of the UI | Cheap to build; React updates the real DOM only where needed |
| **Reconciliation** | Diffing old vs new tree | Different type → rebuild; same type → update; `key` identifies list items |
| **Re-render triggers** | State change, parent re-render, context change | Props alone don't trigger; ref changes don't trigger; re-renders cascade downward |
| **`useMemo`** | Caches a value | For expensive calculations or stable object references |
| **`useCallback`** | Caches a function | Only useful with `React.memo` children or as a hook dependency |
| **`React.memo`** | Skips re-render if props are unchanged | Shallow comparison |
| **Code splitting** | Break the bundle into chunks | Route-based first |
| **`lazy` + `Suspense`** | Load components on demand | Default export required; always add a fallback |

##### Common mistakes checklist

- [ ] Using array index or random values as list keys
- [ ] Defining components inside other components
- [ ] Mutating state instead of creating new references
- [ ] Creating a new object for context `value` on every render
- [ ] Using `useCallback` or `useMemo` without a memoized consumer or measured need
- [ ] Missing or incorrect dependency arrays
- [ ] Calling `lazy()` inside a component
- [ ] Lazy component without a `Suspense` boundary or error handling
- [ ] Splitting tiny components and creating needless network requests