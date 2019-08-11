import parseCharsets from '../utils/charsets';

it("parse string charset", () => {
	const parsed = parseCharsets(['latin']);

	expect(parsed).toContainEqual([0, 0x0250]);
});

it("expect valid charset name", () => {
	expect(() => parseCharsets(['lAtin'])).toThrowError();
});

it("parse charset range", () => {
	const parsed = parseCharsets(["02F0", "035A"]);

	expect(parsed).toContainEqual([0x02F0, 0x035B]);
});

it("expect valid charset range", () => {
	expect(() => parseCharsets(["02F0", "02E9"])).toThrowError();
});

it("expect valid hex number", () => {
	expect(() => parseCharsets(['z222'])).toThrowError();
});

it("single number parameter is allowed", () => {
	const parsed = parseCharsets(["02F0", "035A", "1111"]);

	expect(parsed).toContainEqual([0x02F0, 0x035B]);
	expect(parsed).toContainEqual([0x1111, 0x1112]);
});

it("expect skip subranges", () => {
	const parsed = parseCharsets(["02F0", "035A", "0359"]);

	expect(parsed).toContainEqual([0x02F0, 0x035B]);
	expect(parsed).toHaveLength(1);
});

describe("rearrange range", () => {
	it("rearrage end", () => {
		const parsed = parseCharsets(["02F0", "035A", "0300", "04f0"]);

		expect(parsed).toContainEqual([0x02F0, 0x04F1]);
		expect(parsed).toHaveLength(1);
	});

	it("same start", () => {
		const parsed = parseCharsets(["0399", "03FF", "0399", "04f0"]);

		expect(parsed).toContainEqual([0x0399, 0x04F1]);
		expect(parsed).toHaveLength(1);
	});

	it("same end", () => {
		const parsed = parseCharsets(["0399", "03FF", "0200", "03F0"]);

		expect(parsed).toContainEqual([0x0200, 0x0400]);
		expect(parsed).toHaveLength(1);
	});

	it("rearrange last", () => {
		const parsed = parseCharsets(["0399", "03FF", "0451", "0492", "0300", "03F9", "0A11", "0BFF", "0999", "0A10", "0701"]);

		expect(parsed[0]).toEqual([0x0300, 0x0400]);
		expect(parsed[1]).toEqual([0x0451, 0x0493]);
		expect(parsed[3]).toEqual([0x0999, 0x0C00]);
		expect(parsed[2]).toEqual([0x0701, 0x0702]);
		expect(parsed).toHaveLength(4);
	});
});

it("combine ranges", () => {
	const parsed = parseCharsets(["0100", "0200", "0201", "0400"]);

	expect(parsed).toContainEqual([0x0100, 0x0401]);
	expect(parsed).toHaveLength(1);
});

it("expect string charset and range", () => {
	const parsed = parseCharsets(["0100", "0200", "cyrillic"]);

	expect(parsed).toContainEqual([0x0100, 0x0201]);
	expect(parsed).toContainEqual([0x0400, 0x052F + 1]);
	expect(parsed).toHaveLength(2);
});
