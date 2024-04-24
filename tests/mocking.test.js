
import { vi,  it, expect, describe, beforeAll, beforeEach } from 'vitest'
import { getPriceInCurrency, getShippingInfo, login, renderPage, signUp, submitOrder } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

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


vi.mock("../src/libs/analytics")
describe('renderPage', () => {
    it("should return correct content", async () => {
        const result = await renderPage();

        expect(result).toMatch(/content/i);
    })

    it("should call analytics", async () => {
        const result = await renderPage();

        expect(trackPageView).toHaveBeenCalledWith("/home");
    })
})


vi.mock("../src/libs/payment")
describe('submitOrder', () => {
    const order = { totalAmount: 10 };
    const creditCard = { creditCardNumber: "1234" };

    it("should charge the customer", async () => {
        vi.mocked(charge).mockResolvedValue({ status: "success"});

        await submitOrder(order, creditCard);

        expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
    });

    it("should return success when payment is successfull", async () => {
        vi.mocked(charge).mockResolvedValue({ status: "success"});
        
        const result = await submitOrder(order, creditCard);

        expect(result).toEqual({ success: true })
    })

    it("should return failed when payment fails", async () => {
        vi.mocked(charge).mockResolvedValue({ status: "failed"});
        
        const result = await submitOrder(order, creditCard);

        expect(result).toEqual({ success: false, error: "payment_error" });
    })
})


vi.mock("../src/libs/email", async (importOriginal) => {
    const originalModule = await importOriginal();
    return {
        ...originalModule,
        sendEmail: vi.fn()
    }
})//default behavior is to set everything to vi.fn()
describe('signUp', () => {
    const validEmail = "name@domain.com"

    it("should return false if email is not valid", async () => {
        const result = await signUp("a");

        expect(result).toBe(false);
    })

    it("should return true if email is valid", async () => {
        const result = await signUp(validEmail);

        expect(result).toBe(true);
    })

    it("should send the welcome email if email is valid", async () => {
        const result = await signUp(validEmail);

        expect(sendEmail).toHaveBeenCalled();
        //expect(sendEmail).toHaveBeenCalledWith(validEmail, /welcomecici/i); doesn't work with regular exp
        const args = vi.mocked(sendEmail).mock.calls[0]
        expect(args[0]).toBe(validEmail);
        expect(args[1]).toMatch(/welcome/i);
    })
})

describe('login', () => {
    it("should email the one-time login code", async () => {
        const email = "name@domain.com";
        const spy = vi.spyOn(security, "generateCode");
        
        await login(email);

        const securityCode = spy.mock.results[0].value.toString();
        expect(sendEmail).toHaveBeenLastCalledWith(email, securityCode);
    })
})

//mockClear() -> just clears all information about the calls
//mockReset() -> resets to empty implementation
//mockRestore() ->restores to original implementation --> only makes sense with spies

describe('signUp2', () => {
    const validEmail = "name@domain.com"

    beforeAll(() => {
        vi.mocked(sendEmail).mockClear();
        vi.clearAllMocks();
    })

    beforeEach(() => {
        vi.mocked(sendEmail).mockClear();
        vi.clearAllMocks(); //Or configure vitest to clearAllMocks so we don't have to
    })

    it("should return false if email is not valid", async () => {
        const result = await signUp("a");

        expect(result).toBe(false);
    })

    it("should return true if email is valid", async () => {
        const result = await signUp(validEmail);

        expect(result).toBe(true);
    })

    it("should send the welcome email if email is valid", async () => {
        const result = await signUp(validEmail);

        expect(sendEmail).toHaveBeenCalledOnce();
        //expect(sendEmail).toHaveBeenCalledWith(validEmail, /welcomecici/i); doesn't work with regular exp
        const args = vi.mocked(sendEmail).mock.calls[0]
        expect(args[0]).toBe(validEmail);
        expect(args[1]).toMatch(/welcome/i);
    })
})
