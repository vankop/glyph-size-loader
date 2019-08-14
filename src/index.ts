import {loader} from 'webpack';
import {getOptions} from 'loader-utils';
import {parse, Font, Glyph} from 'opentype.js';
import validateOptions from 'schema-utils';
import fixedWidthFontTemplate from './templates/FixedWidthFont';
import commonFontTemplate from './templates/CommonFont';
import processOptions from './processOptions';
import computeSizes from './computeSizes';
import {LoaderOptions, Ranges} from './types';
import {
	bufferToArrayBuffer,
	parseCharRanges,
	SCHEMA
} from './utils';

module.exports = function glyphSizeLoader(this: loader.LoaderContext, content: Buffer) {
	const rawOptions: Partial<LoaderOptions> | null = getOptions<Partial<LoaderOptions>>(this);

	if (rawOptions) {
		validateOptions(SCHEMA, rawOptions);
	}

	const processedOptions = processOptions(rawOptions);
	const font: Font = parse(bufferToArrayBuffer(content));

	if (!font.supported) {
		throw new Error('Can\'t read font tables');
	}

	const charRanges: Ranges = parseCharRanges(processedOptions.ranges);
	const upm: number = font.unitsPerEm;
	const glyphs: Array<Glyph> = Object.values(font.glyphs.glyphs);
	const {
		sizes,
		isFixedSize,
		avg,
		fixedSize
	} = computeSizes({
		glyphs,
		charRanges,
		upm
	});

	return (
		isFixedSize
			? fixedWidthFontTemplate(fixedSize)
			: commonFontTemplate(sizes, avg)
	);
};
module.exports.raw = true;
