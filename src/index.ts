import {loader} from 'webpack';
import {getOptions} from 'loader-utils';
import {parse, Font, Glyph} from 'opentype.js';
const validateOptions = require('schema-utils');
import fixedWidthFontTemplate from './templates/FixedWidthFont';
import commonFontTemplate from './templates/CommonFont';
import {
	bufferToArrayBuffer,
	decimalPlacesToFixed,
	parseCharRanges,
	isCharAllowed,
	SCHEMA,
	insertToArray
} from './utils';

const FIXED_DECIMALS_PLACES: number = 3;
const SAME_SIZE_PRECISION: number = 1 + `e-${FIXED_DECIMALS_PLACES}` as any - 1;

interface LoaderOptions {
	charset?: Array<string>
}

function insertCharCode(sizesEntry: Array<number>, code: number) {
	let i = sizesEntry.length - 2;

	while (i > -1 && sizesEntry[i] > code) i--;
	insertToArray(sizesEntry, code, i + 1);
}

module.exports = function glyphSizeLoader(this: loader.LoaderContext, content: Buffer) {
	const font: Font = parse(bufferToArrayBuffer(content));
	const options: LoaderOptions | null = getOptions<LoaderOptions>(this);

	if (options) {
		validateOptions(SCHEMA, options);
	}

	if (!font.supported) {
		throw new Error('Can\'t read font tables');
	}

	const charRanges: Array<[number, number]> = options && options.charset
		? parseCharRanges(options.charset)
		: [[0, 0x100000]];
	const upm: number = font.unitsPerEm;
	const glyphs: Array<Glyph> = Object.values(font.glyphs.glyphs);
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
		size = decimalPlacesToFixed(size, FIXED_DECIMALS_PLACES);

		if (isFixedSize) {
			if (fixedSize === -1) {
				fixedSize = size;
			}

			if (fixedSize && Math.abs(fixedSize - size) > SAME_SIZE_PRECISION) {
				isFixedSize = false;
			}
		}

		if (unicodes.every(code => isCharAllowed(charRanges, code))) {
			if (sizes.has(size)) {
				const current = sizes.get(size) as Array<number>;

				unicodes.forEach(ch => typeof ch === 'number' && insertCharCode(current, ch));
			} else {
				const sorted = unicodes.filter(a => typeof a === 'number').sort();

				sorted.push(size);
				sizes.set(size, sorted);
			}
		}
	}

	return (
		isFixedSize
			? fixedWidthFontTemplate(fixedSize)
			: commonFontTemplate(sizes, decimalPlacesToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS_PLACES))
	);
};
module.exports.raw = true;
