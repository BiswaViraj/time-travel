export type TimeTravelOptions = {
  /** Max number of past/future states to keep. Defaults to `10`. */
  limit?: number;
};

export type TimeTravel<T> = {
  /** Returns the current value. */
  get(): T;

  /** Adds a new state. Clears the redo stack. */
  add(value: T): void;

  /** Adds multiple states at once. Last element becomes the current value. Empty array is a no-op. */
  addMany(values: T[]): void;

  /** Moves back one step. Returns the new value, or `undefined` if nothing to undo. */
  undo(): T | undefined;

  /** Moves forward one step. Returns the new value, or `undefined` if nothing to redo. */
  redo(): T | undefined;

  /** Jumps `n` steps through history. Negative = back, positive = forward. Returns `undefined` if out of bounds. */
  go(n: number): T | undefined;

  /** Returns to the initial value and clears all history. */
  reset(): void;

  /** Whether there are past states to undo to. */
  readonly canUndo: boolean;

  /** Whether there are future states to redo to. */
  readonly canRedo: boolean;

  /** Number of steps available in each direction. */
  readonly size: { past: number; future: number };

  /** Returns a read-only snapshot of the full history state. */
  getHistory(): Readonly<{ past: T[]; present: T; future: T[] }>;

  /** Registers a listener that fires on any state change. Returns an unsubscribe function. */
  subscribe(listener: (state: T) => void): () => void;
};
