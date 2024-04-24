import { it, test, expect, describe, beforeEach, beforeAll, afterEach, afterAll} from "vitest"
import { Stack, calculateDiscount, canDrive, fetchData, getCoupons, isPriceInRange, isValidUsername, validateUserInput } from "../src/core";


describe("test suite", () => {
    it("test case strings", () => {
        const result = "The requested file was not found.";
        
        // Loose (too general), it just needs to be something, even if garbage string is provided, test passes
        expect(result).toBeDefined();

        // Tight (too specific)
        expect(result).toBe("The requested file was not found.")

        //Better assertion
        expect(result).toMatch("not found")

        //With regex
        expect(result).toMatch(/not found/i) //i for case insensitive
    })

    it("test case arrays", () => {
        const result = [1, 2, 3];

        // Loose --> empty array passes
        expect(result).toBeDefined();

        // Tight --> fails if result = [2, 3, 1] and we assume that order does not matter
        expect(result).toEqual([1, 2, 3]);

        expect(result).toEqual(expect.arrayContaining([2, 1, 3]));

        expect(result).toHaveLength(3);

        expect(result.length).toBeGreaterThan(0);
    })

    it("test case objects", () => {
        const result = { name: "Cosmin" };

        // Fails if { name: "Cosmin", id: 1 }
        expect(result).toEqual({ name: "Cosmin" })

        expect(result).toMatchObject({ name: "Cosmin" })

        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("name", "Cosmin");
        expect(typeof result.name).toBe("string")
    })
})


describe("coupon suite", () => {
    it("should return an array", () => {
        expect(Array.isArray(getCoupons())).toBe(true); //unnecessary in typescript
    })

    it("should return an array that is not empty", () => {
        expect(getCoupons().length).toBeGreaterThan(0);
    })

    it("should return an array with valid coupons codes", () => {
        const coupons = getCoupons();
        coupons.forEach(coupon => {
            expect(coupon).toHaveProperty("code");
            expect(typeof coupon.code).toBe("string"); //unnecessary in typescript
            expect(coupon.code).toBeTruthy(); //Not empty string
        })
    })

    it("should return an array with valid discounts", () => {
        const coupons = getCoupons();
        coupons.forEach(coupon => {
            expect(coupon).toHaveProperty("discount");
            expect(typeof coupon.discount).toBe("number");
            expect(coupon.discount).toBeGreaterThan(0);
            expect(coupon.discount).toBeLessThan(1);
        })
    })
})


describe('calculateDiscount', () => {
    it("should return discounted price if given valid code", () => {
        expect(calculateDiscount(10, "SAVE10")).toBe(9);
        expect(calculateDiscount(10, "SAVE20")).toBe(8);
    })

    it("should handle non-numeric price", () => {
        expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i)
    })

    it("should handle negative price", () => {
        expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i)
    })

    it("should handle non-string discount code", () => {
        expect(calculateDiscount(10, 10)).toMatch(/invalid/i)
    })

    it("should handle invalid discount code", () => {
        expect(calculateDiscount(10, "INVALID")).toBe(10);
    })
})


describe('validate user input', () => {
    it("should return succes if given valid input", () => {
        expect(validateUserInput("Cosmin", 25)).toMatch(/success/i)
    })

    it("should return an error if username is not a string", () => {
        expect(validateUserInput(1, 25)).toMatch(/invalid/i)
    })

    it("should return an error if username is less than 3 characters", () => {
        expect(validateUserInput("Co", 25)).toMatch(/invalid/i)
    })

    it("should return an error if username is longer than 255 characters", () => {
        expect(validateUserInput("A".repeat(256), 25)).toMatch(/invalid/i)
    })

    it("should return an error if age is not a number", () => {
        expect(validateUserInput("Cosmin", "25")).toMatch(/invalid/i)
    })

    it("should return an error if age is less than 18", () => {
        expect(validateUserInput("Cosmin", 17)).toMatch(/invalid/i)
    })

    it("should return an error if age is greater than 100", () => {
        expect(validateUserInput("Cosmin", 101)).toMatch(/invalid/i)
    })

    it("should return an error if both username and age are invalid", () => {
        expect(validateUserInput("", 0)).toMatch(/invalid username/i)
        expect(validateUserInput("", 0)).toMatch(/invalid age/i)
    })
})

describe("isPriceInRange", () => {
    it("should return false when the price is outside the range", () => {
        expect(isPriceInRange(-10, 0, 100)).toBe(false);
        expect(isPriceInRange(200, 0, 100)).toBe(false);
    })

    it("should return true when the price is equal to the min or to the max", () => {
        expect(isPriceInRange(0, 0, 100)).toBe(true);
        expect(isPriceInRange(100, 0, 100)).toBe(true);
    })

    it("should return true when the price is within the range", () => {
        expect(isPriceInRange(50, 0, 100)).toBe(true);
    })
})

describe('isValidUsername', () => {
    const minLength = 5;
    const maxLength = 15;

    it("should return false when the username is less than 5 characters", () => {
        expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
    })

    it("should return false when the username is less greater than 15 characters", () => {
        expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
    })

    it("should return true if username is at the min or max length", () => {
        expect(isValidUsername("a".repeat(minLength))).toBe(true);
        expect(isValidUsername("a".repeat(maxLength))).toBe(true);
    })

    it("should return true when the username is within the length constraint", () => {
        expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
        expect(isValidUsername("a".repeat(maxLength - 1))).toBe(true);
    })

    it("should return false for invalid input types", () => {
        expect(isValidUsername(null)).toBe(false);
        expect(isValidUsername(undefined)).toBe(false);
        expect(isValidUsername(1)).toBe(false);
    })
})
 

describe('canDrive', () => {
    it("should return error for invalid country code", () => {
        expect(canDrive(20, "FR")).toMatch(/invalid/i);
    })

    it("should return false for underage in the US", () => {
        expect(canDrive(15, "US")).toBe(false);
    })

    it("should return true for min age in the US", () => {
        expect(canDrive(16, "US")).toBe(true);
    })

    it("should return true for eligible age in the US", () => {
        expect(canDrive(17, "US")).toBe(true);
    })

    it("should return false for underage in the UK", () => {
        expect(canDrive(16, "UK")).toBe(false);
    })

    it("should return true for min age in the UK", () => {
        expect(canDrive(17, "UK")).toBe(true);
    })

    it("should return true for eligible age in the UK", () => {
        expect(canDrive(18, "UK")).toBe(true);
    })
})

describe('canDriveWithParameterizedTests', () => {
    it("should return error for invalid country code", () => {
        expect(canDrive(20, "FR")).toMatch(/invalid/i);
    })

    it.each([
        { age: 15, country: "US", result: false },
        { age: 16, country: "US", result: true },
        { age: 17, country: "US", result: true },
        { age: 16, country: "UK", result: false },
        { age: 17, country: "UK", result: true },
        { age: 18, country: "UK", result: true },
    ])("should return $result for $age, $country", ( { age, country, result } ) => {
        expect(canDrive(age, country)).toBe(result);
    })
})

describe("isPriceInRangeWithParameterizedTests", () => {
    it.each([
        { scenario: "price < min", price: -10, result: false},
        { scenario: "price = min", price: 0, result: true},
        { scenario: "price between min and max", price: 50, result: true},
        { scenario: "price = max", price: 100, result: true},
        { scenario: "price > max", price: 200, result: false},
    ])("should return $result when $scenario", ({ price, result }) => {
        expect(isPriceInRange(price, 0, 100)).toBe(result);
    })
})

describe('fetchData', () => {
    it("should return a promise that will resolve to an array of numbers", () => {
        fetchData().then((result) => {
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    })

    it("should return a promise that will resolve to an array of numbers async variant", async () => {
        const result = await fetchData();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    })

    it("should return a promise that will resolve to an array of numbers with try catch on rejection", () => {
        fetchData().then((result) => {
        }).catch((error) => {
            expect(error).toHaveProperty("reason");
            expect(error.reason).toMatch(/fail/i)
        });
    })

    it("should return a promise that will resolve to an array of numbers async variant with try catch on rejection", async () => {
        try{
            const result = await fetchData();
        } catch (error) {
            expect(error).toHaveProperty("reason");
            expect(error.reason).toMatch(/fail/i)
        }
        
    })
})

describe('test suite setup and teardown', () => {
    beforeAll(() => {
        console.log("beforeAll called")
    })

    beforeEach(() => {
        console.log("beforeEach called")
    })

    afterEach(() => {
        console.log("afterEach called")
    })

    afterAll(() => {
        console.log("afterAll called")
    })

    it("test case 1", () => {
        
    })

    it("test case 2", () => {
        
    })
})

describe('Stack', () => {
    let stack;

    beforeEach(() => {
        stack = new Stack();
    })

    it("push should add an item to the stack", () => {
        stack.push(1)

        expect(stack.size()).toBe(1);
    })

    it("pop should remove and return the top item from the stack", () => {
        stack.push(1);
        stack.push(2);

        const poppedItem = stack.pop();

        expect(poppedItem).toBe(2);
        expect(stack.size()).toBe(1);
    })

    it("pop should throw an error if stack is empty", () => {
        expect(() => stack.pop()).toThrow(/empty/i)
    })

    it("peek should return the top item from the stack without removing it", () => {
        stack.push(1);
        stack.push(2);

        const peekedItem = stack.peek();

        expect(peekedItem).toBe(2);
        expect(stack.size()).toBe(2);
    })

    it("peek should throw an error if stack is empty", () => {
        expect(() => stack.peek()).toThrow(/empty/i)
    })

    it("isEmpty should retun true if stack is empty", () => {
        expect(stack.isEmpty()).toBe(true);
    })

    it("isEmpty should retun false if stack is not empty", () => {
        stack.push(1);
        
        expect(stack.isEmpty()).toBe(false);
    })

    it("size should retun the number of items in the stack", () => {
        stack.push(1);
        stack.push(2);

        expect(stack.size()).toBe(2);
    })

    it("clear should remove all items from the stack", () => {
        stack.push(1);
        stack.push(2);

        stack.clear();

        expect(stack.size()).toBe(0);
    })
})
