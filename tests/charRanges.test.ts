import {parseCharRanges, isCharAllowed} from '../src/utils';

describe("parseCharRanges", () => {
	it("parse string charset", () => {
		const parsed = parseCharRanges(['latin']);

		expect(parsed).toContainEqual([0, 0x0080]);
	});

	it("expect valid charset name", () => {
		expect(() => parseCharRanges(['lAtin'])).toThrowError();
	});

	it("parse charset range", () => {
		const parsed = parseCharRanges(["02F0", "035A"]);

		expect(parsed).toContainEqual([0x02F0, 0x035B]);
	});

	it("expect valid charset range", () => {
		expect(() => parseCharRanges(["02F0", "02E9"])).toThrowError();
	});

	it("expect valid hex number", () => {
		expect(() => parseCharRanges(['z222'])).toThrowError();
	});

	it("single number parameter is allowed", () => {
		const parsed = parseCharRanges(["02F0", "035A", "1111"]);

		expect(parsed).toContainEqual([0x02F0, 0x035B]);
		expect(parsed).toContainEqual([0x1111, 0x1112]);
	});

	it("expect skip subranges", () => {
		const parsed = parseCharRanges(["02F0", "035A", "0359"]);

		expect(parsed).toContainEqual([0x02F0, 0x035B]);
		expect(parsed).toHaveLength(1);
	});

	describe("rearrange range", () => {
		it("rearrage end", () => {
			const parsed = parseCharRanges(["02F0", "035A", "0300", "04f0"]);

			expect(parsed).toContainEqual([0x02F0, 0x04F1]);
			expect(parsed).toHaveLength(1);
		});

		it("same start", () => {
			const parsed = parseCharRanges(["0399", "03FF", "0399", "04f0"]);

			expect(parsed).toContainEqual([0x0399, 0x04F1]);
			expect(parsed).toHaveLength(1);
		});

		it("same end", () => {
			const parsed = parseCharRanges(["0399", "03FF", "0200", "03F0"]);

			expect(parsed).toContainEqual([0x0200, 0x0400]);
			expect(parsed).toHaveLength(1);
		});

		it("rearrange last", () => {
			const parsed = parseCharRanges(["0399", "03FF", "0451", "0492", "0300", "03F9", "0A11", "0BFF", "0999", "0A10", "0701"]);

			expect(parsed[0]).toEqual([0x0300, 0x0400]);
			expect(parsed[1]).toEqual([0x0451, 0x0493]);
			expect(parsed[3]).toEqual([0x0999, 0x0C00]);
			expect(parsed[2]).toEqual([0x0701, 0x0702]);
			expect(parsed).toHaveLength(4);
		});
	});

	it("combine ranges", () => {
		const parsed = parseCharRanges(["0100", "0200", "0201", "0400"]);

		expect(parsed).toContainEqual([0x0100, 0x0401]);
		expect(parsed).toHaveLength(1);
	});

	it("expect string charset and range", () => {
		const parsed = parseCharRanges(["0100", "0200", "cyrillic"]);

		expect(parsed).toContainEqual([0x0100, 0x0201]);
		expect(parsed).toContainEqual([0x0400, 0x052F + 1]);
		expect(parsed).toHaveLength(2);
	});
});

describe("isCharAllowed", () => {
	it ("simple case", () => {
		expect(isCharAllowed([[0x200, 0x300]], 0x250)).toBe(true);
	});

	it ("equal to start", () => {
		expect(isCharAllowed([[0x200, 0x300]], 0x200)).toBe(true);
	});

	it ("less than start", () => {
		expect(isCharAllowed([[0x200, 0x300]], 0x199)).toBe(false);
	});

	it ("less than end", () => {
		expect(isCharAllowed([[0x200, 0x300]], 0x299)).toBe(true);
	});

	it ("equal to end", () => {
		expect(isCharAllowed([[0x200, 0x300]], 0x300)).toBe(false);
	});

	it ("several ranges", () => {
		expect(isCharAllowed([[0x200, 0x300], [0x3F0, 0x40A]], 0x30F)).toBe(false);
	});

	it ("more examples", () => {
		expect(isCharAllowed([[0x200, 0x300], [0x3F0, 0x40A], [0x555, 0x5FF]], 0x400)).toBe(true);
	});
});
