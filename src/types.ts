export type TimeTravelOptions = {
  limit?: number;
};

export type TimeTravel<T> = {
  // Core
  get(): T;
  add(value: T): void;
  addMany(values: T[]): void;
  undo(): T | undefined;
  redo(): T | undefined;

  // Navigation
  go(n: number): T | undefined;
  reset(): void;

  // Introspection (getters)
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly size: { past: number; future: number };
  getHistory(): Readonly<{ past: T[]; present: T; future: T[] }>;

  // Reactivity (opt-in)
  subscribe(listener: (state: T) => void): () => void;
};
