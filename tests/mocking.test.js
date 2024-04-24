import { vi,  it, expect, describe } from 'vitest'

describe('test suite', () => {
    it("test case", () => {
        const greet = vi.fn();
        greet.mockReturnValue("Hello");
        
        const result = greet();
        console.log(result);
    })

    it("test case promise", () => {
        const greet = vi.fn();
        greet.mockResolvedValue("Hello");
        
        greet().then(result => expect(result).toBe("Hello"));
    })

    it("test case promise", () => {
        const greet = vi.fn();
        greet.mockImplementation(name => "Hello " + name);
        
        expect(greet("Cosmin")).toBe("Hello Cosmin");
    })

    it("test case promise", () => {
        const greet = vi.fn();
        greet.mockImplementation(name => "Hello " + name);

        const result = greet("Cosmin");
        
        expect(greet).toHaveBeenCalled();
    })

    it("test case promise", () => {
        const greet = vi.fn();
        greet.mockImplementation(name => "Hello " + name);

        const result = greet("Cosmin");
        
        expect(greet).toHaveBeenCalledWith("Cosmin");
    })

    it("test case promise", () => {
        const greet = vi.fn();
        greet.mockImplementation(name => "Hello " + name);

        const result = greet("Cosmin");
        
        expect(greet).toHaveBeenCalledOnce();
    })
})
