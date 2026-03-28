export type TimeTravelOptions = {
  limit?: number;
};

export type TimeTravel<T> = {
  get(): T;
  add(value: T): void;
  addMany(values: T[]): void;
  undo(): T | undefined;
  redo(): T | undefined;
  go(n: number): T | undefined;
  reset(): void;

  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly size: { past: number; future: number };
  getHistory(): Readonly<{ past: T[]; present: T; future: T[] }>;

  subscribe(listener: (state: T) => void): () => void;
};
