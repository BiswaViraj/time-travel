# Time Travel

It is a simple TypeScript library for managing undo/redo functionality with a time-travel mechanism. It's designed to keep track of changes in state, allowing you to navigate back and forth through history with ease.

## Installation

```bash
npm install @biswaviraj/time-travel
```

## Features

- **Undo/Redo Functionality**: Easily navigate through past states and reapply changes.
- **History Management**: Manage a configurable history limit to control memory usage.
- **Simple API**: Intuitive methods for interacting with the history and state.

## Usage

Here's how you can use the time travel package in your TypeScript project:

#### Basic Example

```typescript
import { timeTravel } from "time-travel";

// Create a time travel instance with an initial value
const history = timeTravel<number>(0, { limit: 5 });

// Add new values
history.add(1);
history.add(2);
history.add(3);

// Get the current value
console.log(history.get()); // Output: 3

// Undo the last change
history.undo();
console.log(history.get()); // Output: 2

// Redo the undone change
history.redo();
console.log(history.get()); // Output: 3
```

#### Example with Arrays

```typescript
import { timeTravel } from "time-travel";

// Create a time travel instance with an initial array value
const history = timeTravel<number[]>([1, 2, 3], { limit: 5 });

// Add new array values
history.add([4, 5]);
history.add([6, 7]);

// Get the current value
console.log(history.get()); // Output: 7

// Undo the last change
history.undo();
console.log(history.get()); // Output: 5

// Redo the undone change
history.redo();
console.log(history.get()); // Output: 7
```

#### Example with Array of Objects

```typescript
import { timeTravel } from "time-travel";

// Define a type for our objects
type Item = { id: number; name: string };

// Create a time travel instance with an initial array of objects
const history = timeTravel<Item[]>(
  [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ],
  { limit: 5 }
);

// Add new array of objects
history.add([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
]);

history.add([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
]);

// Get the current state
console.log(history.get());
// Output: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }, { id: 3, name: 'Item 3' }, { id: 4, name: 'Item 4' }]

// Undo the last change
history.undo();
console.log(history.get());
// Output: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }, { id: 3, name: 'Item 3' }]

// Redo the undone change
history.redo();
console.log(history.get());
// Output: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }, { id: 3, name: 'Item 3' }, { id: 4, name: 'Item 4' }]
```

## API

`timeTravel<T>(initialValue: T | T[], options?: { limit?: number })`
Creates a time travel instance.

- initialValue: The initial state, which can be a single value or an array of values.
- options: Optional configuration object.
  - limit: The maximum number of past and future states to keep. Defaults to 10.

The time travel library provides the following methods for managing history:

- `add(value: T): void`: Add a new value to the history.

- `get(): T`: Get the current value from the history.

- `undo(): void`: Undo the last change and move back in history.

- `redo(): void`: Redo the last undone change and move forward in history.

## TypeScript Support

The library is written in TypeScript and provides type definitions out of the box. This ensures you get proper type checking and autocompletion when using the library in your TypeScript projects.

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Please follow the standard GitHub workflow for contributions.

For more information or to report issues, please visit the [GitHub repository](https://github.com/biswaviraj/time-travel).
