"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("loader-utils");
const opentype_js_1 = require("opentype.js");
const validateOptions = require('schema-utils');
const FixedWidthFont_1 = require("./templates/FixedWidthFont");
const CommonFont_1 = require("./templates/CommonFont");
const processOptions_1 = require("./processOptions");
const utils_1 = require("./utils");
const FIXED_DECIMALS_PLACES = 3;
const SAME_SIZE_PRECISION = 1 + `e-${FIXED_DECIMALS_PLACES}` - 1;
function insertCharCode(sizesEntry, code) {
    let i = sizesEntry.length - 2;
    while (i > -1 && sizesEntry[i] > code)
        i--;
    utils_1.insertToArray(sizesEntry, code, i + 1);
}
module.exports = function glyphSizeLoader(content) {
    const font = opentype_js_1.parse(utils_1.bufferToArrayBuffer(content));
    const rawOptions = loader_utils_1.getOptions(this);
    if (rawOptions) {
        validateOptions(utils_1.SCHEMA, rawOptions);
    }
    const processedOptions = processOptions_1.default(rawOptions);
    if (!font.supported) {
        throw new Error('Can\'t read font tables');
    }
    const charRanges = utils_1.parseCharRanges(processedOptions.ranges);
    const upm = font.unitsPerEm;
    const glyphs = Object.values(font.glyphs.glyphs);
    const sizes = new Map();
    let sum = 0;
    let isFixedSize = true;
    let fixedSize = -1;
    let i = 0;
    while (i < glyphs.length) {
        const { unicodes, advanceWidth } = glyphs[i++];
        if (unicodes.length === 0) {
            continue;
        }
        let size = advanceWidth / upm;
        sum += size;
        size = utils_1.decimalPlacesToFixed(size, FIXED_DECIMALS_PLACES);
        if (isFixedSize) {
            if (fixedSize === -1) {
                fixedSize = size;
            }
            if (fixedSize && Math.abs(fixedSize - size) > SAME_SIZE_PRECISION) {
                isFixedSize = false;
            }
        }
        if (unicodes.every(code => utils_1.isCharAllowed(charRanges, code))) {
            if (sizes.has(size)) {
                const current = sizes.get(size);
                unicodes.forEach(ch => typeof ch === 'number' && insertCharCode(current, ch));
            }
            else {
                const sorted = unicodes.filter(a => typeof a === 'number').sort();
                sorted.push(size);
                sizes.set(size, sorted);
            }
        }
    }
    return (isFixedSize
        ? FixedWidthFont_1.default(fixedSize)
        : CommonFont_1.default(sizes, utils_1.decimalPlacesToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS_PLACES)));
};
module.exports.raw = true;
