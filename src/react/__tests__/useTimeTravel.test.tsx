import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTimeTravel } from "../index";

describe("useTimeTravel", () => {
	it("should return initial state", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		expect(result.current.state).toBe(0);
	});

	it("should re-render on add", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		act(() => {
			result.current.add(1);
		});
		expect(result.current.state).toBe(1);
	});

	it("should re-render on undo", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		act(() => {
			result.current.add(1);
		});
		act(() => {
			result.current.undo();
		});
		expect(result.current.state).toBe(0);
	});

	it("should re-render on redo", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		act(() => {
			result.current.add(1);
		});
		act(() => {
			result.current.undo();
		});
		act(() => {
			result.current.redo();
		});
		expect(result.current.state).toBe(1);
	});

	it("should re-render on go", () => {
		const { result } = renderHook(() => useTimeTravel("a"));
		act(() => {
			result.current.add("b");
			result.current.add("c");
			result.current.add("d");
		});
		act(() => {
			result.current.go(-2);
		});
		expect(result.current.state).toBe("b");
	});

	it("should re-render on reset", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		act(() => {
			result.current.add(1);
			result.current.add(2);
		});
		act(() => {
			result.current.reset();
		});
		expect(result.current.state).toBe(0);
	});

	it("should update canUndo and canRedo", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(false);

		act(() => {
			result.current.add(1);
		});
		expect(result.current.canUndo).toBe(true);
		expect(result.current.canRedo).toBe(false);

		act(() => {
			result.current.undo();
		});
		expect(result.current.canUndo).toBe(false);
		expect(result.current.canRedo).toBe(true);
	});

	it("should update size", () => {
		const { result } = renderHook(() => useTimeTravel(0));
		expect(result.current.size).toEqual({ future: 0, past: 0 });

		act(() => {
			result.current.add(1);
			result.current.add(2);
		});
		expect(result.current.size).toEqual({ future: 0, past: 2 });

		act(() => {
			result.current.undo();
		});
		expect(result.current.size).toEqual({ future: 1, past: 1 });
	});

	it("should have stable action references across re-renders", () => {
		const { result, rerender } = renderHook(() => useTimeTravel(0));
		const firstAdd = result.current.add;
		const firstUndo = result.current.undo;
		const firstRedo = result.current.redo;
		const firstGo = result.current.go;
		const firstReset = result.current.reset;

		rerender();

		expect(result.current.add).toBe(firstAdd);
		expect(result.current.undo).toBe(firstUndo);
		expect(result.current.redo).toBe(firstRedo);
		expect(result.current.go).toBe(firstGo);
		expect(result.current.reset).toBe(firstReset);
	});

	it("should respect limit option", () => {
		const { result } = renderHook(() => useTimeTravel(0, { limit: 3 }));
		act(() => {
			for (let i = 1; i <= 10; i++) {
				result.current.add(i);
			}
		});
		expect(result.current.size.past).toBeLessThanOrEqual(3);
	});

	it("should not interfere between multiple instances", () => {
		const { result: result1 } = renderHook(() => useTimeTravel(0));
		const { result: result2 } = renderHook(() => useTimeTravel("hello"));

		act(() => {
			result1.current.add(1);
		});

		expect(result1.current.state).toBe(1);
		expect(result2.current.state).toBe("hello");
	});
});
