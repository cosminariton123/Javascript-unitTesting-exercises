
import { vi,  it, expect, describe } from 'vitest'
import { getPriceInCurrency, getShippingInfo } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';

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

// Hoisting (This line of code is pushed to the top of the file, regardless)
vi.mock("../src/libs/currency");
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
});


vi.mock("../src/libs/shipping")
describe('getShippingInfo', () => {
    it("should return shipping unavailable if quoute cannot be fetched", () => {
        vi.mocked(getShippingQuote).mockReturnValue(null);
        const result = getShippingInfo("London");

        expect(result).toMatch(/unavailable/i);
    });

    it("should return shipping info if quote can be fetched", () => {
        vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 })

        const result = getShippingInfo("London");

        expect(result).toMatch("$10");
        expect(result).toMatch(/2 days/i);
        
        //Or
        expect(result).toMatch(/shipping cost: \$10 \(2 days\)/i)
    })
});
