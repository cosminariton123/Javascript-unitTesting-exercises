import { describe, test, it, expect } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro";

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
  });
});

describe("fizzBuzz", () => {
  test("should return FizzBuzz if arg divisible both by 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  test("should return Fizz if arg divisible only by 3", () => {
    expect(fizzBuzz(6)).toBe("Fizz");
  });

  test("should return Buzz if arg divisible only by 5", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });

  test("should return the arg as a string if arg not divisible by 3 or 5", () => {
    expect(fizzBuzz(7)).toBe("7");
  });
});

describe("calculateAverage", () => {
  test("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  test("should calculate the average of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  test("should calculate the average of an array with 2 elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  test("should calculate the average of an array with 3 elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  test("should return 1 if arg is 0", () => {
    expect(factorial(0)).toBe(1);
  });

  test("should be 1 if arg is 1", () => {
    expect(factorial(1)).toBe(1);
  });

  test("should be 2 if arg is 2", () => {
    expect(factorial(2)).toBe(2);
  });

  test("should be 6 if arg is 3", () => {
    expect(factorial(3)).toBe(6);
  });

  test("should be 4 if arg is 24", () => {
    expect(factorial(4)).toBe(24);
  });

  test("should return undefined if arg is negative", () => {
    expect(factorial(-1)).toBeUndefined();
  });
});
