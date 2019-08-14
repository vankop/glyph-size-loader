"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function insertCharCode(sizesEntry, code) {
    let i = sizesEntry.length - 2;
    while (i > -1 && sizesEntry[i] > code)
        i--;
    utils_1.insertToArray(sizesEntry, code, i + 1);
}
function computeGlyphSizes({ glyphs, charRanges, upm }) {
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
        size = utils_1.decimalPlacesToFixed(size, utils_1.FIXED_DECIMALS_PLACES);
        if (isFixedSize) {
            if (fixedSize === -1) {
                fixedSize = size;
            }
            if (fixedSize && Math.abs(fixedSize - size) > utils_1.SAME_SIZE_PRECISION) {
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
    return {
        sizes,
        isFixedSize,
        fixedSize,
        avg: utils_1.decimalPlacesToFixed(sum / glyphs.length, utils_1.FIXED_DECIMALS_PLACES)
    };
}
exports.default = computeGlyphSizes;
