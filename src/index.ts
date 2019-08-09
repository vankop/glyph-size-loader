import * as webpack from 'webpack';
import fixedWidthFontTemplate from './templates/FixedWidthFont';
import commonFontTemplate from './templates/CommonFont';
import {
	bufferToArrayBuffer,
	decimalToFixed
} from './utils/index';
import * as opentype from 'opentype.js';

const FIXED_DECIMALS: number = 4;
const SAME_SIZE_PRECISION: number = 1 + `e-${FIXED_DECIMALS}` as any - 1;

module.exports = function glyphSizeLoader(this: webpack.loader.LoaderContext, content: Buffer) {
	const font: opentype.Font = opentype.parse(bufferToArrayBuffer(content));

	if (!font.supported) {
		throw new Error("Can't read font tables");
	}

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

		unicodes.forEach(ch => memo[ch] = size);

		return memo;
	}, {} as {[k: number]: number});

	return (
		isFixedSize
			? fixedWidthFontTemplate(fixedSize)
			: commonFontTemplate(glyphs, decimalToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS))
	);
};
module.exports.raw = true;
