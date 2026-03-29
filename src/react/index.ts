import { useMemo, useRef, useSyncExternalStore } from "react";
import { timeTravel } from "../index";
import type { TimeTravel, TimeTravelOptions } from "../types";

export type { TimeTravel, TimeTravelOptions };

export type UseTimeTravel<T> = TimeTravel<T> & {
	/** Reactive current value. Triggers re-render on change. */
	readonly state: T;
};

export function useTimeTravel<T>(
	initialValue: T,
	options?: TimeTravelOptions,
): UseTimeTravel<T> {
	const ref = useRef<TimeTravel<T> | null>(null);
	if (!ref.current) {
		ref.current = timeTravel(initialValue, options);
	}
	const tt = ref.current;

	const state = useSyncExternalStore(tt.subscribe, tt.get, tt.get);

	return useMemo(() => ({ ...tt, state }), [tt, state]);
}
