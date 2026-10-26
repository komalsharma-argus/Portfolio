# React Hooks

Hooks let function components use state, side effects, refs, and shared data. This guide covers five essentials:

1. `useState`
2. `useEffect`
3. `useRef`
4. Context API (`useContext`)
5. Custom Hooks

---

#### 1. useState

Adds **state** to a function component. When state changes, the component re-renders.

```jsx
import { useState } from "react";

const [state, setState] = useState(initialValue);
```

##### Basic example

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

##### Functional updates

When the new value depends on the previous one, pass a function. It always receives the latest value.

```jsx
setCount((prev) => prev + 1);
```

##### Lazy initial state

If the initial value is expensive to compute, pass a function. It runs only on the first render.

```jsx
const [data, setData] = useState(() => JSON.parse(localStorage.getItem("data")) ?? []);
```

##### Objects and arrays: never mutate, always copy

```jsx
const [user, setUser] = useState({ name: "Asha", age: 24 });
setUser((prev) => ({ ...prev, age: 25 }));             // update object

const [items, setItems] = useState([]);
setItems((prev) => [...prev, "new"]);                  // add
setItems((prev) => prev.filter((i) => i !== "old"));   // remove
setItems((prev) => prev.map((i) => (i.id === 1 ? { ...i, done: true } : i))); // update
```

##### Key points

- The setter **replaces** state. For objects, spread the old values yourself.
- Updates are **batched and asynchronous**: the variable keeps its old value until the next render.
- Calling the setter with the **same value** skips the re-render.
- Call `useState` at the **top level** of a component, never inside loops or conditions.

---

#### 2. useEffect

Runs **side effects** after render: data fetching, subscriptions, timers, DOM updates, and syncing with external systems.

```jsx
import { useEffect } from "react";

useEffect(() => {
  // effect code

  return () => {
    // optional cleanup
  };
}, [dependencies]);
```

##### The dependency array

| Dependency array | When the effect runs |
|---|---|
| Omitted | After **every** render |
| `[]` | Once, after the **first** render (mount) |
| `[a, b]` | After the first render and whenever `a` or `b` **changes** |

```jsx
useEffect(() => { document.title = `Count: ${count}`; });          // every render
useEffect(() => { console.log("Mounted"); }, []);                  // mount only
useEffect(() => { document.title = `Count: ${count}`; }, [count]); // when count changes
```

##### Cleanup

The returned function runs **before the next effect** and when the component **unmounts**. Use it to avoid leaks.

```jsx
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id); // cleanup
  }, []);

  return <p>{time.toLocaleTimeString()}</p>;
}
```

Event listeners follow the same pattern:

```jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

##### Fetching data

```jsx
function User({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/users/${id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(setUser)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // cancel stale request
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <h2>{user.name}</h2>;
}
```

> The effect callback cannot be `async` directly. Define an async function inside it, or use promises as above.

##### Key points

- Include **every reactive value** (props, state, functions) used inside the effect in the dependency array.
- Missing dependencies cause **stale values**. Unstable dependencies (new objects/functions each render) cause **infinite loops**.
- Don't use effects for things you can calculate during render or handle in an event handler.
- In development with Strict Mode, effects run **twice** on mount to help you catch missing cleanup. This does not happen in production.

##### Common mistake: infinite loop

```jsx
useEffect(() => {
  setCount(count + 1);   // changes state → re-render → effect runs again → ...
});                      // ❌ no dependency array
```

---

#### 3. useRef

Returns a **mutable object** `{ current: value }` that persists across renders. **Changing it does not trigger a re-render.**

```jsx
import { useRef } from "react";

const ref = useRef(initialValue);
ref.current; // read or write
```

##### Use case 1: Access a DOM element

```jsx
function SearchBox() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

Auto-focus on mount:

```jsx
useEffect(() => {
  inputRef.current.focus();
}, []);
```

##### Use case 2: Store a mutable value without re-rendering

Timers, previous values, counters, and flags are good candidates.

```jsx
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

##### Use case 3: Track the previous value

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current; // value from the previous render
}
```

##### useState vs useRef

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render on change | ✅ Yes | ❌ No |
| Persists across renders | ✅ | ✅ |
| Use for | Data shown in the UI | DOM access, timers, values the UI doesn't display |
| Update style | Via setter | Mutate `ref.current` directly |

##### Key points

- Don't read or write `ref.current` **during rendering** (except for initial setup). Do it in event handlers or effects.
- `ref.current` is `null` until the element mounts.
- If the UI needs to show the value, use **state**, not a ref.

---

#### 4. Context API (useContext)

Shares data across the component tree **without passing props through every level** (avoids "prop drilling").

##### The three steps

**1. Create the context**

```jsx
import { createContext } from "react";

export const ThemeContext = createContext("light"); // default value
```

**2. Provide a value**

```jsx
import { useState } from "react";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**3. Consume it with `useContext`**

```jsx
import { useContext } from "react";

function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Current: {theme}. Click to switch.
    </button>
  );
}
```

**Wrap your app:**

```jsx
function App() {
  return (
    <ThemeProvider>
      <Header />
      <ThemeButton />
    </ThemeProvider>
  );
}
```

##### Recommended pattern: wrap in a custom hook

Cleaner imports and a helpful error when used outside the provider.

```jsx
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Usage
const { theme, toggleTheme } = useTheme();
```

> For this to work, create the context with `createContext(undefined)`.

##### Key points

- Every component that calls `useContext(X)` **re-renders whenever the context value changes**.
- Passing a new object to `value` on every render (`value={{ a, b }}`) re-renders all consumers each time. Keep the value stable (for example with `useMemo`) in performance-sensitive trees.
- A component uses the value from the **nearest Provider above it**. If there is none, it gets the default value.
- Good for: theme, authenticated user, language/locale. Not ideal for rapidly changing data.

---

#### 5. Custom Hooks

A **custom hook** is a JavaScript function whose name starts with `use` and that calls other hooks. It lets you **extract and reuse stateful logic** across components.

> Components share **logic**, not **state**: each component that calls a custom hook gets its own independent state.

##### Rules

- Name must start with **`use`** (`useFetch`, `useToggle`).
- Call hooks only at the **top level**, never in loops, conditions, or nested functions.
- Call hooks only from **components or other hooks**.

##### Example 1: `useToggle`

```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

// Usage
function Modal() {
  const [isOpen, toggleOpen] = useToggle();
  return (
    <>
      <button onClick={toggleOpen}>Toggle</button>
      {isOpen && <p>I'm open!</p>}
    </>
  );
}
```

##### Example 2: `useFetch`

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage
function Posts() {
  const { data, loading, error } = useFetch("/api/posts");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

##### Example 3: `useLocalStorage`

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [name, setName] = useLocalStorage("name", "");
```

##### Example 4: `useDebounce`

Delays updating a value until the user stops changing it (great for search inputs).

```jsx
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Usage
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 400);

useEffect(() => {
  if (debouncedQuery) search(debouncedQuery);
}, [debouncedQuery]);
```

##### Key points

- Return whatever is most convenient: an array (like `useState`) for 2 values, or an object for many.
- Keep each hook focused on **one job**.
- Custom hooks can combine all the hooks above: `useState`, `useEffect`, `useRef`, and `useContext`.
#### Quick Reference

| Hook | Purpose | Re-renders on change? | Typical use |
|---|---|---|---|
| `useState` | Store data that affects the UI | ✅ Yes | Counters, form inputs, toggles |
| `useEffect` | Run side effects after render | n/a | Fetching, subscriptions, timers |
| `useRef` | Hold a mutable value or DOM node | ❌ No | Focus input, store timer ID, previous value |
| `useContext` | Read shared data from a Provider | ✅ Yes (on context change) | Theme, auth, language |
| Custom Hook | Reuse stateful logic | Depends on hooks inside | `useFetch`, `useToggle`, `useDebounce` |

##### Common mistakes checklist
- [ ] Mutating state directly instead of using the setter
- [ ] Missing or incorrect `useEffect` dependencies
- [ ] Forgetting cleanup for timers, listeners, and subscriptions
- [ ] Making the `useEffect` callback `async`
- [ ] Expecting a `useRef` change to update the UI
- [ ] Reading `ref.current` during render
- [ ] Creating a new object for the Provider `value` on every render
- [ ] Calling hooks inside conditions or loops
- [ ] Naming a custom hook without the `use` prefix