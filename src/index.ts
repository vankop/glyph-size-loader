import * as webpack from 'webpack';
import * as loaderUtils from 'loader-utils';
import fixedWidthFontTemplate from './templates/FixedWidthFont';
import commonFontTemplate from './templates/CommonFont';
import {
	bufferToArrayBuffer,
	decimalToFixed,
	parseCharsets,
	insertToArray
} from './utils/index';
import * as opentype from 'opentype.js';
import {isAllowed} from "./utils/charsets";

const FIXED_DECIMALS: number = 4;
const SAME_SIZE_PRECISION: number = 1 + `e-${FIXED_DECIMALS}` as any - 1;

interface LoaderOptions {
	charset?: Array<string>
}

function insertCharCode(sizesEntry: Array<number>, code: number) {
	let i = sizesEntry.length - 2;

	while (i > -1 && sizesEntry[i] > code) i--;
	insertToArray(sizesEntry, code, i + 1);
}

module.exports = function glyphSizeLoader(this: webpack.loader.LoaderContext, content: Buffer) {
	const font: opentype.Font = opentype.parse(bufferToArrayBuffer(content));
	const options: LoaderOptions | null = loaderUtils.getOptions<LoaderOptions>(this);

	if (!font.supported) {
		throw new Error("Can't read font tables");
	}

	const charsets: Array<[number, number]> = options && options.charset
		? parseCharsets(options.charset)
		: [[0, 0x100000]];
	const upm: number = font.unitsPerEm;
	const glyphs: Array<opentype.Glyph> = Object.values(font.glyphs.glyphs);
	const sizes: Map<number, Array<number>> = new Map();
	let sum: number = 0;
	let isFixedSize: boolean = true;
	let fixedSize: number = -1;
	let i = 0;

	while (i < glyphs.length) {
		const {unicodes, advanceWidth} = glyphs[i++];

		if (unicodes.length === 0) {
			continue;
		}

		let size: number = advanceWidth / upm;
		sum += size;
		size = decimalToFixed(size, FIXED_DECIMALS);

		if (isFixedSize) {
			if (fixedSize === -1) {
				fixedSize = size;
			}

			if (fixedSize && Math.abs(fixedSize - size) > SAME_SIZE_PRECISION) {
				isFixedSize = false;
			}
		}

		if (unicodes.every(code => isAllowed(charsets, code))) {
			if (sizes.has(size)) {
				const current = sizes.get(size) as Array<number>;

				unicodes.forEach(ch => typeof ch === "number" && insertCharCode(current, ch));
			} else {
				const sorted = unicodes.filter(a => typeof a === "number").sort();

				sorted.push(size);
				sizes.set(size, sorted);
			}
		}
	}

	return (
		isFixedSize
			? fixedWidthFontTemplate(fixedSize)
			: commonFontTemplate(sizes, decimalToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS))
	);
};
module.exports.raw = true;
