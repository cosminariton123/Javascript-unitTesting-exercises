
import { vi,  it, expect, describe } from 'vitest'
import { getPriceInCurrency } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';

// Hoisting (This line of code is pushed to the top of the file, regardless)
vi.mock("../src/libs/currency");

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

describe('test suite Exercise: Working with Mock Functions', () => {
    it("test case", () => {
        const sendText = vi.fn();
        sendText.mockReturnValue("ok");

        const result = sendText("message");

        expect(sendText).toHaveBeenCalledWith("message");
        expect(result).toBe("ok");
    })
})

describe('getPriceInCurrency', () => {
    it("should return price in target currency", () => {
        vi.mocked(getExchangeRate).mockReturnValue(1.5);
        
        const price = getPriceInCurrency(10, "AUD");

        expect(price).toBe(15);
    })
})
