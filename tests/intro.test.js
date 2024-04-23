import { describe, test, it, expect } from "vitest";
import { max } from "../src/intro";

//it === test

describe("max", () => {
    test("should return the first argument if it is greater", () => {
        // AAA pattern

        // Arrange: Turn on the TV
        const a = 2;
        const b = 1;

        // Act: Press the power button
        const result = max(a, b);
        
        // Assert: Verify TV is off
        expect(result).toBe(2);

        //Or oneline
        expect(max(2, 1)).toBe(2);
    });

    test("should return the second argument if it is greater", () => {
        expect(max(1, 2)).toBe(2);
    });

    test("should return the first argument if arguments are equal", () => {
        expect(max(2, 2)).toBe(2);
    })
})
