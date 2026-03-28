import { describe, it, expect } from "vitest";
import { timeTravel } from "../index";

describe("timeTravel", () => {
  it("should create with initial value", () => {
    const tt = timeTravel(0);
    expect(tt.get()).toBe(0);
  });
});
