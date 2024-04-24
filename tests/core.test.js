import { it, test, expect, describe } from "vitest"


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


 
