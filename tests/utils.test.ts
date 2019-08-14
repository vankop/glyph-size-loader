import {
	decimalPlacesToFixed,
	insertToArray
} from '../src/utils';

describe("decimalToFixed", () => {
	it("rounding decimal", () => {
		expect(decimalPlacesToFixed(4.235, 2)).toBe(4.24);
	});

	it("works fine with integers", () => {
		expect(decimalPlacesToFixed(10, 2)).toBe(10);
	});
});

describe("insertToArray", () => {
	const arr = [0, 2, "adsa"];

	it("insert to start", () => {
		const testcase = arr.slice();

		insertToArray(testcase, "B", 0);
		expect(testcase[0]).toBe("B");
		expect(testcase[1]).toBe(arr[0]);
		expect(testcase[2]).toBe(arr[1]);
		expect(testcase[3]).toBe(arr[2]);
	});

	it("insert to end", () => {
		const testcase = arr.slice();

		insertToArray(testcase, "B", arr.length);
		expect(testcase[0]).toBe(arr[0]);
		expect(testcase[1]).toBe(arr[1]);
		expect(testcase[2]).toBe(arr[2]);
		expect(testcase[arr.length]).toBe("B");
	});

	it("throws error, if index is out of range", () => {
		const testcase = arr.slice();

		expect(() => insertToArray(testcase, "B", arr.length + 1)).toThrowError();
		expect(() => insertToArray(testcase, "B", -1)).toThrowError();
	});
});
