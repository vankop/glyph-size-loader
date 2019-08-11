const SUPPORTED_CHARSETS: {[k: string]: [number, number]} = {
	latin: [0, 0x007F +1],
	"latin-extended": [0x0080, 0x024F +1],
	greek: [0x0370, 0x03FF + 1],
	coptic: [0x0370, 0x03FF + 1],
	cyrillic: [0x0400, 0x052F + 1],
	armenian: [0x0530, 0x058F + 1],
	hebrew: [0x0590, 0x05FF + 1],
	arabic: [0x0600, 0x077F + 1],
	currency: [0x20A0, 0x20CF + 1],
	math: [0x2200, 0x22FF + 1]
};

function insert(arr: Array<object>, el: object, index: number) {
	let current: object = el;

	for (let i = index; i < arr.length; i++) {
		let tmp = arr[i];
		arr[i] = current;
		current = tmp;
	}

	arr.push(current);
	return arr;
}

function addCharset(charset: [number, number], charsets: Array<[number, number]>): Array<[number, number]> {
	let i: number = 0;

	while (i < charsets.length && charsets[i][0] < charset[0]) i++;

	if (i - 1 > -1 && charset[0] <= charsets[i - 1][1]) {
		charsets[i - 1][0] = Math.min(charsets[i - 1][0], charset[0]);
		charsets[i - 1][1] = Math.max(charsets[i - 1][1], charset[1]);
		return charsets;
	}

	if (i === charsets.length) {
		charsets.push(charset);
		return charsets;
	}

	if (charsets[i][0] <= charset[1]) {
		charsets[i][0] = Math.min(charsets[i][0], charset[0]);
		charsets[i][1] = Math.max(charsets[i][1], charset[1]);
		return charsets;
	}

	insert(charsets, charset, i);
	return charsets;
}

export function parseCharsets(charsets: Array<string>): Array<[number, number]> {
	let i: number = 0;
	let startCharCode: number = -1;
	const result: Array<[number, number]> = [];

	while (i < charsets.length) {
		const current = charsets[i++];
		const isNumber = /\d/.test(current);

		if (isNumber) {
			const num = parseInt(current, 16);

			if (Number.isNaN(num)) {
				throw new Error(`Charset query param "${current}" is not valid hex number`);
			}

			if (startCharCode === -1) {
				startCharCode = num;
			} else {
				const charset: [number, number] = [startCharCode, num + 1];

				if (charset[1] <= charset[0]) {
					throw new Error(`charset range is invalid, got ${charset}`)
				}

				addCharset(charset, result);
				startCharCode = -1;
			}
		} else {
			const charset = SUPPORTED_CHARSETS[current];

			if (!Array.isArray(charset)) {
				throw new Error(`Charset name "${current}" does not supported`);
			}

			addCharset(charset, result);
		}
	}

	if (startCharCode !== -1) {
		const charset: [number, number] = [startCharCode, startCharCode + 1];

		addCharset(charset, result);
	}

	return result;
}

export function isAllowed(charsets: Array<[number, number]>, unicode: number) {
	let i = 0;

	while (i < charsets.length && (charsets[i][1] - 1) < unicode) i++;

	if (i === charsets.length) return false;

	return charsets[i][0] <= unicode;
}
