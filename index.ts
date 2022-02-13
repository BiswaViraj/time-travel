export default function timeTravel<T>(initialState: T): {
  get: () => T;
  set: (newValue: T) => void;
  undo: () => void;
  redo: () => void;
} {
  const history = {
    past: [],
    present: initialState,
    future: [],
  };

  function get(): T {
    return history.present;
  }

  function set(newValue: T): void {
    const currentVal = history.present;
    history.past.push(currentVal);
    history.present = newValue;
  }
  function undo(): void {
    if (!history.past.length) return;
    history.future.push(history.present);
    history.present = history.past.pop();
  }

  function redo(): void {
    if (!history.future.length) return;
    history.past.push(history.present);
    history.present = history.future.pop();
  }

  return {
    get,
    set,
    undo,
    redo,
  };
}
