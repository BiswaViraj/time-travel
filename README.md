# Time Travel

Simple and lightweight undo/redo state management for any JavaScript or TypeScript project.

[![npm version](https://img.shields.io/npm/v/@biswaviraj/time-travel)](https://www.npmjs.com/package/@biswaviraj/time-travel)
![Minified + Gzipped size](https://badgen.net/bundlephobia/minzip/@biswaviraj/time-travel)
![Minified size](https://badgen.net/bundlephobia/min/@biswaviraj/time-travel)

## Installation

```bash
npm install @biswaviraj/time-travel
# or
pnpm add @biswaviraj/time-travel
```

## Quick Start

```typescript
import { timeTravel } from "@biswaviraj/time-travel";

const tt = timeTravel<number>(0);

tt.add(1);
tt.add(2);
tt.add(3);

tt.get();    // 3
tt.undo();   // returns 2
tt.undo();   // returns 1
tt.redo();   // returns 2

tt.canUndo;  // true
tt.canRedo;  // true
tt.size;     // { past: 1, future: 1 }
```

## Features

- **Undo/Redo** with return values
- **History navigation** — jump N steps with `go(n)`
- **Batch operations** — add multiple states at once with `addMany()`
- **Introspection** — `canUndo`, `canRedo`, `size`, `getHistory()`
- **Opt-in reactivity** — `subscribe()` for state change notifications
- **Configurable history limit** to control memory usage
- **Zero dependencies**, fully typed

## Usage

### Basic

```typescript
import { timeTravel } from "@biswaviraj/time-travel";

const tt = timeTravel<string>("hello", { limit: 20 });

tt.add("world");
tt.get(); // "world"

tt.undo(); // returns "hello"
tt.redo(); // returns "world"
```

### With Arrays as State

```typescript
const tt = timeTravel<number[]>([1, 2, 3]);

tt.add([4, 5, 6]);
tt.get(); // [4, 5, 6]

tt.undo();
tt.get(); // [1, 2, 3]
```

### With Objects

```typescript
type User = { id: number; name: string };

const tt = timeTravel<User>({ id: 1, name: "Alice" });

tt.add({ id: 2, name: "Bob" });
tt.add({ id: 3, name: "Charlie" });

tt.get(); // { id: 3, name: "Charlie" }
tt.undo(); // returns { id: 2, name: "Bob" }
```

### Batch Add

```typescript
const tt = timeTravel<number>(0);

tt.addMany([1, 2, 3, 4, 5]);
tt.get(); // 5
tt.size;  // { past: 5, future: 0 }
```

### History Navigation

```typescript
const tt = timeTravel<string>("a");
tt.add("b");
tt.add("c");
tt.add("d");

tt.go(-2); // returns "b" (jumped back 2 steps)
tt.go(1);  // returns "c" (jumped forward 1 step)
tt.go(-99); // returns undefined (out of bounds, state unchanged)
```

### Reset

```typescript
const tt = timeTravel<number>(0);
tt.add(1);
tt.add(2);

tt.reset();
tt.get();    // 0
tt.canUndo;  // false
tt.canRedo;  // false
```

### Inspecting History

```typescript
const tt = timeTravel<number>(0);
tt.add(1);
tt.add(2);
tt.undo();

tt.getHistory();
// { past: [0], present: 1, future: [2] }
```

### Subscribe to Changes

```typescript
const tt = timeTravel<number>(0);

const unsubscribe = tt.subscribe((state) => {
  console.log("State changed:", state);
});

tt.add(1);   // logs "State changed: 1"
tt.undo();   // logs "State changed: 0"

unsubscribe();
tt.add(2);   // no log
```

## API

### `timeTravel<T>(initialValue: T, options?: { limit?: number })`

Creates a time travel instance.

- `initialValue` — the initial state
- `options.limit` — max number of past/future states to keep (default: `10`)

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get()` | `T` | Get current value |
| `add(value)` | `void` | Add a new state |
| `addMany(values)` | `void` | Batch add states (last becomes current) |
| `undo()` | `T \| undefined` | Go back one step, returns new value |
| `redo()` | `T \| undefined` | Go forward one step, returns new value |
| `go(n)` | `T \| undefined` | Jump N steps (negative = back, positive = forward) |
| `reset()` | `void` | Return to initial value, clear history |
| `getHistory()` | `Readonly<History>` | Read-only snapshot of `{ past, present, future }` |
| `subscribe(fn)` | `() => void` | Listen for changes, returns unsubscribe function |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `canUndo` | `boolean` | Whether undo is available |
| `canRedo` | `boolean` | Whether redo is available |
| `size` | `{ past, future }` | Number of steps in each direction |

## TypeScript

Written in TypeScript with full type definitions. Generic `T` gives you type safety for any state shape.

```typescript
// Type is inferred
const tt = timeTravel(0);         // TimeTravel<number>
const tt = timeTravel("hello");   // TimeTravel<string>

// Or explicit
const tt = timeTravel<User>({ id: 1, name: "Alice" });
```

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

For more information, visit the [GitHub repository](https://github.com/BiswaViraj/time-travel).

## License

ISC
