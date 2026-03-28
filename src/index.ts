import type { TimeTravel, TimeTravelOptions } from "./types";

export type { TimeTravel, TimeTravelOptions };

type History<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function timeTravel<T>(
  initialValue: T,
  options?: TimeTravelOptions,
): TimeTravel<T> {
  const limit = options?.limit ?? 10;
  const _initialValue = initialValue;
  let subscribers: Set<(state: T) => void> | null = null;

  const history: History<T> = {
    past: [],
    present: initialValue,
    future: [],
  };

  function notify(): void {
    if (subscribers) {
      for (const listener of subscribers) {
        listener(history.present);
      }
    }
  }

  function get(): T {
    return history.present;
  }

  function add(value: T): void {
    if (history.past.length >= limit) {
      history.past.shift();
    }
    history.past.push(history.present);
    history.present = value;
    history.future = [];
    notify();
  }

  function addMany(values: T[]): void {
    if (values.length === 0) return;
    const all = [history.present, ...values];
    history.present = all[all.length - 1];
    const newPast = [...history.past, ...all.slice(0, all.length - 1)];
    history.past =
      newPast.length > limit ? newPast.slice(newPast.length - limit) : newPast;
    history.future = [];
    notify();
  }

  function undo(): T | undefined {
    if (history.past.length === 0) return undefined;
    if (history.future.length >= limit) {
      history.future.shift();
    }
    history.future.push(history.present);
    history.present = history.past.pop()!;
    notify();
    return history.present;
  }

  function redo(): T | undefined {
    if (history.future.length === 0) return undefined;
    if (history.past.length >= limit) {
      history.past.shift();
    }
    history.past.push(history.present);
    history.present = history.future.pop()!;
    notify();
    return history.present;
  }

  function go(n: number): T | undefined {
    if (n === 0) return history.present;
    if (n < 0) {
      const steps = Math.abs(n);
      if (steps > history.past.length) return undefined;
      const moving = history.past.splice(history.past.length - steps);
      history.future.push(
        history.present,
        ...moving.slice(1).reverse(),
      );
      if (history.future.length > limit) {
        history.future = history.future.slice(history.future.length - limit);
      }
      history.present = moving[0];
      notify();
      return history.present;
    } else {
      if (n > history.future.length) return undefined;
      const moving = history.future.splice(history.future.length - n);
      history.past.push(history.present, ...moving.slice(1).reverse());
      if (history.past.length > limit) {
        history.past = history.past.slice(history.past.length - limit);
      }
      history.present = moving[0];
      notify();
      return history.present;
    }
  }

  function reset(): void {
    history.past = [];
    history.present = _initialValue;
    history.future = [];
    notify();
  }

  function getHistory(): Readonly<{ past: T[]; present: T; future: T[] }> {
    return {
      past: [...history.past],
      present: history.present,
      future: [...history.future],
    };
  }

  function subscribe(listener: (state: T) => void): () => void {
    if (!subscribers) {
      subscribers = new Set();
    }
    subscribers.add(listener);
    return () => {
      subscribers!.delete(listener);
      if (subscribers!.size === 0) {
        subscribers = null;
      }
    };
  }

  return {
    get,
    add,
    addMany,
    undo,
    redo,
    go,
    reset,
    get canUndo() {
      return history.past.length > 0;
    },
    get canRedo() {
      return history.future.length > 0;
    },
    get size() {
      return { past: history.past.length, future: history.future.length };
    },
    getHistory,
    subscribe,
  };
}
