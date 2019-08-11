import * as webpack from 'webpack';
import * as loaderUtils from 'loader-utils';
import fixedWidthFontTemplate from './templates/FixedWidthFont';
import commonFontTemplate from './templates/CommonFont';
import {
	bufferToArrayBuffer,
	decimalToFixed,
	parseCharsets
} from './utils/index';
import * as opentype from 'opentype.js';
import {isAllowed} from "./utils/charsets";

const FIXED_DECIMALS: number = 4;
const SAME_SIZE_PRECISION: number = 1 + `e-${FIXED_DECIMALS}` as any - 1;

interface LoaderOptions {
	charset?: Array<string>
}

module.exports = function glyphSizeLoader(this: webpack.loader.LoaderContext, content: Buffer) {
	const font: opentype.Font = opentype.parse(bufferToArrayBuffer(content));
	const options: LoaderOptions = loaderUtils.getOptions<LoaderOptions>(this);

	if (!font.supported) {
		throw new Error("Can't read font tables");
	}

	const charsets: Array<[number, number]> = options.charset ? parseCharsets(options.charset) : [[0, 0x100000]];
	const upm: number = font.unitsPerEm;
	let sum: number = 0;
	let isFixedSize: boolean = true;
	let fixedSize: number = -1;

	const glyphs: {[k: number]: number} = Object.values(font.glyphs.glyphs).reduce((memo, {unicodes, advanceWidth}: opentype.Glyph) => {
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
			unicodes.forEach(ch => memo[ch] = size);
		}

		return memo;
	}, {} as {[k: number]: number});

	return (
		isFixedSize
			? fixedWidthFontTemplate(fixedSize)
			: commonFontTemplate(glyphs, decimalToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS))
	);
};
module.exports.raw = true;
