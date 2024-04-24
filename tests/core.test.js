import { it, test, expect, describe } from "vitest"
import { calculateDiscount, getCoupons } from "../src/core";


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


 
