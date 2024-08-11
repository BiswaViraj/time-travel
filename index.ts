export type TimeTravel<T> = {
  get: () => T;
  add: (newValue: T) => void;
  undo: () => void;
  redo: () => void;
};

type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function timeTravel<T>(
  initialValue: T | T[],
  { limit = 10 }: { limit?: number }
): TimeTravel<T> {
  const isArrayState = isArray(initialValue);

  const history: History<T> = {
    past: isArrayState ? initialValue.slice(0, initialValue.length - 1) : [],
    present: isArrayState
      ? initialValue[initialValue.length - 1]
      : initialValue,
    future: [],
  };

  /**
   *
   * @returns the current value
   */
  function get(): T {
    return history.present;
  }

  /**
   * Add a new value to the history
   * @param newValue
   * @returns void
   * @example
   * add(1)
   * add([1, 2, 3])
   */
  function add(newValue: T | T[]): void {
    const currentVal = history.present;

    if (history.past.length >= limit) {
      history.past.shift();
    }

    const isArrayState = isArray(newValue);

    const pastValue = isArrayState
      ? newValue.slice(0, newValue.length - 1)
      : [];
    history.past.push(...[currentVal, ...pastValue]);

    const finalValue = isArrayState ? newValue[newValue.length - 1] : newValue;
    history.present = finalValue;
  }

  /**
   * Undo the last change
   * @returns void
   */
  function undo(): void {
    if (!history.past.length) return;
    if (history.future.length >= limit) {
      history.future.shift();
    }
    history.future.push(history.present);
    history.present = history.past.pop();
  }

  /**
   * Redo the last change
   * @returns void
   */
  function redo(): void {
    if (!history.future.length) return;
    if (history.past.length >= limit) {
      history.past.shift();
    }
    history.past.push(history.present);
    history.present = history.future.pop();
  }

  function isArray(value: T | T[]): value is T[] {
    return Array.isArray(value);
  }

  return {
    get,
    add,
    undo,
    redo,
  };
}
