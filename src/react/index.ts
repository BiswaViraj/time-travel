import { useRef, useSyncExternalStore } from "react";
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
	type Mutable = TimeTravel<T> & { state: T };

	const resultRef = useRef<Mutable>(undefined);
	if (!resultRef.current) {
		const tt = timeTravel(initialValue, options);
		resultRef.current = Object.assign(Object.create(tt), {
			state: tt.get(),
		});
	}

	resultRef.current.state = useSyncExternalStore(
		resultRef.current.subscribe,
		resultRef.current.get,
		resultRef.current.get,
	);

	return resultRef.current;
}
