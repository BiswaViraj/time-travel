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
	const rawLimit = options?.limit ?? 10;
	const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : 10;
	let subscribers: Set<(state: T) => void> | null = null;

	const history: History<T> = {
		future: [],
		past: [],
		present: initialValue,
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
		history.past.push(history.present, ...values.slice(0, -1));
		history.present = values[values.length - 1];
		if (history.past.length > limit) {
			history.past.splice(0, history.past.length - limit);
		}
		history.future = [];
		notify();
	}

	function undo(): T | undefined {
		if (history.past.length === 0) return undefined;
		if (history.future.length >= limit) {
			history.future.shift();
		}
		history.future.push(history.present);
		const previous = history.past.pop();
		if (previous === undefined) return undefined;
		history.present = previous;
		notify();
		return history.present;
	}

	function redo(): T | undefined {
		if (history.future.length === 0) return undefined;
		if (history.past.length >= limit) {
			history.past.shift();
		}
		history.past.push(history.present);
		const next = history.future.pop();
		if (next === undefined) return undefined;
		history.present = next;
		notify();
		return history.present;
	}

	function go(n: number): T | undefined {
		if (n === 0) return history.present;
		if (n < 0) {
			const steps = Math.abs(n);
			if (steps > history.past.length) return undefined;
			const moving = history.past.splice(history.past.length - steps);
			history.future.push(history.present, ...moving.slice(1).reverse());
			if (history.future.length > limit) {
				history.future.splice(0, history.future.length - limit);
			}
			history.present = moving[0];
			notify();
			return history.present;
		} else {
			if (n > history.future.length) return undefined;
			const moving = history.future.splice(history.future.length - n);
			history.past.push(history.present, ...moving.slice(1).reverse());
			if (history.past.length > limit) {
				history.past.splice(0, history.past.length - limit);
			}
			history.present = moving[0];
			notify();
			return history.present;
		}
	}

	function reset(): void {
		history.past = [];
		history.present = initialValue;
		history.future = [];
		notify();
	}

	function getHistory(): Readonly<{ past: T[]; present: T; future: T[] }> {
		return {
			future: [...history.future],
			past: [...history.past],
			present: history.present,
		};
	}

	function subscribe(listener: (state: T) => void): () => void {
		if (!subscribers) {
			subscribers = new Set();
		}
		subscribers.add(listener);
		return () => {
			if (!subscribers) return;
			subscribers.delete(listener);
			if (subscribers.size === 0) {
				subscribers = null;
			}
		};
	}

	return {
		add,
		addMany,
		get canRedo() {
			return history.future.length > 0;
		},
		get canUndo() {
			return history.past.length > 0;
		},
		get,
		getHistory,
		go,
		redo,
		reset,
		get size() {
			return { future: history.future.length, past: history.past.length };
		},
		subscribe,
		undo,
	};
}
