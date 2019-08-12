import decimalToFixed from '../utils/decimalToFixed';

it("rounding decimal", () => {
	expect(decimalToFixed(4.235, 2)).toBe(4.24);
});

it("works fine with integers", () => {
	expect(decimalToFixed(10, 2)).toBe(10);
});
