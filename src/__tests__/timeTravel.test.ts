import { describe, expect, it, vi } from "vitest";
import { timeTravel } from "../index";

describe("timeTravel", () => {
	it("should create with initial value", () => {
		const tt = timeTravel(0);
		expect(tt.get()).toBe(0);
	});
});

describe("add and get", () => {
	it("should add a single value and get it", () => {
		const tt = timeTravel(0);
		tt.add(1);
		expect(tt.get()).toBe(1);
	});

	it("should handle multiple sequential adds", () => {
		const tt = timeTravel("a");
		tt.add("b");
		tt.add("c");
		expect(tt.get()).toBe("c");
	});

	it("should enforce history limit on past", () => {
		const tt = timeTravel(0, { limit: 3 });
		tt.add(1);
		tt.add(2);
		tt.add(3);
		tt.add(4);
		const hist = tt.getHistory();
		expect(hist.past.length).toBeLessThanOrEqual(3);
	});

	it("should clear future on add", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		tt.undo();
		tt.add(3);
		expect(tt.canRedo).toBe(false);
		expect(tt.get()).toBe(3);
	});

	it("should work with array as state type", () => {
		const tt = timeTravel<number[]>([1, 2]);
		tt.add([3, 4]);
		expect(tt.get()).toEqual([3, 4]);
		tt.undo();
		expect(tt.get()).toEqual([1, 2]);
	});

	it("should work with object as state type", () => {
		const tt = timeTravel({ name: "alice" });
		tt.add({ name: "bob" });
		expect(tt.get()).toEqual({ name: "bob" });
	});

	it("should use default limit of 10", () => {
		const tt = timeTravel(0);
		for (let i = 1; i <= 15; i++) {
			tt.add(i);
		}
		expect(tt.size.past).toBe(10);
	});
});

describe("undo and redo", () => {
	it("should undo and return previous value", () => {
		const tt = timeTravel(0);
		tt.add(1);
		const result = tt.undo();
		expect(result).toBe(0);
		expect(tt.get()).toBe(0);
	});

	it("should return undefined when nothing to undo", () => {
		const tt = timeTravel(0);
		expect(tt.undo()).toBeUndefined();
		expect(tt.get()).toBe(0);
	});

	it("should redo and return next value", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.undo();
		const result = tt.redo();
		expect(result).toBe(1);
		expect(tt.get()).toBe(1);
	});

	it("should return undefined when nothing to redo", () => {
		const tt = timeTravel(0);
		expect(tt.redo()).toBeUndefined();
		expect(tt.get()).toBe(0);
	});

	it("should handle undo/redo chain", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		tt.add(3);
		expect(tt.undo()).toBe(2);
		expect(tt.undo()).toBe(1);
		expect(tt.redo()).toBe(2);
		expect(tt.get()).toBe(2);
	});

	it("should enforce limit on future during undo", () => {
		const tt = timeTravel(0, { limit: 3 });
		tt.add(1);
		tt.add(2);
		tt.add(3);
		tt.add(4);
		tt.undo();
		tt.undo();
		tt.undo();
		tt.undo();
		expect(tt.size.future).toBeLessThanOrEqual(3);
	});

	it("should enforce limit on past during redo", () => {
		const tt = timeTravel(0, { limit: 3 });
		tt.add(1);
		tt.add(2);
		tt.add(3);
		tt.add(4);
		tt.undo();
		tt.undo();
		tt.undo();
		tt.undo();
		tt.redo();
		tt.redo();
		tt.redo();
		tt.redo();
		expect(tt.size.past).toBeLessThanOrEqual(3);
	});
});

describe("addMany", () => {
	it("should add multiple values with last as present", () => {
		const tt = timeTravel(0);
		tt.addMany([1, 2, 3]);
		expect(tt.get()).toBe(3);
		expect(tt.size.past).toBe(3);
	});

	it("should be a no-op for empty array", () => {
		const tt = timeTravel(0);
		tt.addMany([]);
		expect(tt.get()).toBe(0);
		expect(tt.size.past).toBe(0);
	});

	it("should behave like add() for single-element array", () => {
		const tt = timeTravel(0);
		tt.addMany([5]);
		expect(tt.get()).toBe(5);
		expect(tt.size.past).toBe(1);
	});

	it("should clear future", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.undo();
		tt.addMany([2, 3]);
		expect(tt.canRedo).toBe(false);
	});

	it("should enforce limit", () => {
		const tt = timeTravel(0, { limit: 3 });
		tt.addMany([1, 2, 3, 4, 5]);
		expect(tt.size.past).toBeLessThanOrEqual(3);
		expect(tt.get()).toBe(5);
	});
});

describe("go", () => {
	it("should go back n steps", () => {
		const tt = timeTravel("a");
		tt.add("b");
		tt.add("c");
		tt.add("d");
		expect(tt.go(-2)).toBe("b");
		expect(tt.get()).toBe("b");
	});

	it("should go forward n steps", () => {
		const tt = timeTravel("a");
		tt.add("b");
		tt.add("c");
		tt.add("d");
		tt.go(-3);
		expect(tt.go(2)).toBe("c");
		expect(tt.get()).toBe("c");
	});

	it("should return current value for go(0)", () => {
		const tt = timeTravel(42);
		expect(tt.go(0)).toBe(42);
	});

	it("should return undefined for out-of-bounds negative", () => {
		const tt = timeTravel(0);
		tt.add(1);
		expect(tt.go(-5)).toBeUndefined();
		expect(tt.get()).toBe(1);
	});

	it("should return undefined for out-of-bounds positive", () => {
		const tt = timeTravel(0);
		expect(tt.go(5)).toBeUndefined();
		expect(tt.get()).toBe(0);
	});

	it("should maintain correct history after go", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		tt.add(3);
		tt.go(-2);
		expect(tt.canUndo).toBe(true);
		expect(tt.canRedo).toBe(true);
	});
});

describe("reset", () => {
	it("should return to initial value", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		tt.reset();
		expect(tt.get()).toBe(0);
	});

	it("should clear all history", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		tt.undo();
		tt.reset();
		expect(tt.canUndo).toBe(false);
		expect(tt.canRedo).toBe(false);
		expect(tt.size).toEqual({ past: 0, future: 0 });
	});

	it("should work with object initial value", () => {
		const initial = { x: 1 };
		const tt = timeTravel(initial);
		tt.add({ x: 2 });
		tt.reset();
		expect(tt.get()).toBe(initial);
	});
});

describe("introspection", () => {
	it("canUndo should be false initially", () => {
		const tt = timeTravel(0);
		expect(tt.canUndo).toBe(false);
	});

	it("canUndo should be true after add", () => {
		const tt = timeTravel(0);
		tt.add(1);
		expect(tt.canUndo).toBe(true);
	});

	it("canRedo should be false initially", () => {
		const tt = timeTravel(0);
		expect(tt.canRedo).toBe(false);
	});

	it("canRedo should be true after undo", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.undo();
		expect(tt.canRedo).toBe(true);
	});

	it("size should reflect past and future counts", () => {
		const tt = timeTravel(0);
		expect(tt.size).toEqual({ past: 0, future: 0 });
		tt.add(1);
		tt.add(2);
		expect(tt.size).toEqual({ past: 2, future: 0 });
		tt.undo();
		expect(tt.size).toEqual({ past: 1, future: 1 });
	});

	it("getHistory should return correct snapshot", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		tt.undo();
		expect(tt.getHistory()).toEqual({
			past: [0],
			present: 1,
			future: [2],
		});
	});

	it("getHistory should return a copy, not a reference", () => {
		const tt = timeTravel(0);
		tt.add(1);
		const hist = tt.getHistory();
		hist.past.push(99);
		expect(tt.getHistory().past).toEqual([0]);
	});
});

describe("subscribe", () => {
	it("should fire listener on add", () => {
		const tt = timeTravel(0);
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.add(1);
		expect(listener).toHaveBeenCalledWith(1);
	});

	it("should fire listener on undo", () => {
		const tt = timeTravel(0);
		tt.add(1);
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.undo();
		expect(listener).toHaveBeenCalledWith(0);
	});

	it("should fire listener on redo", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.undo();
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.redo();
		expect(listener).toHaveBeenCalledWith(1);
	});

	it("should fire listener on addMany", () => {
		const tt = timeTravel(0);
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.addMany([1, 2, 3]);
		expect(listener).toHaveBeenCalledOnce();
		expect(listener).toHaveBeenCalledWith(3);
	});

	it("should fire listener on go", () => {
		const tt = timeTravel(0);
		tt.add(1);
		tt.add(2);
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.go(-1);
		expect(listener).toHaveBeenCalledWith(1);
	});

	it("should fire listener on reset", () => {
		const tt = timeTravel(0);
		tt.add(1);
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.reset();
		expect(listener).toHaveBeenCalledWith(0);
	});

	it("should not fire after unsubscribe", () => {
		const tt = timeTravel(0);
		const listener = vi.fn();
		const unsub = tt.subscribe(listener);
		unsub();
		tt.add(1);
		expect(listener).not.toHaveBeenCalled();
	});

	it("should support multiple subscribers", () => {
		const tt = timeTravel(0);
		const listener1 = vi.fn();
		const listener2 = vi.fn();
		tt.subscribe(listener1);
		tt.subscribe(listener2);
		tt.add(1);
		expect(listener1).toHaveBeenCalledWith(1);
		expect(listener2).toHaveBeenCalledWith(1);
	});

	it("should not fire on no-op operations", () => {
		const tt = timeTravel(0);
		const listener = vi.fn();
		tt.subscribe(listener);
		tt.undo();
		tt.redo();
		tt.go(-5);
		tt.addMany([]);
		expect(listener).not.toHaveBeenCalled();
	});
});
