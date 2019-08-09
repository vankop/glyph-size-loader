"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FixedWidthFont_1 = require("./templates/FixedWidthFont");
const CommonFont_1 = require("./templates/CommonFont");
const index_1 = require("./utils/index");
const opentype = require("opentype.js");
const FIXED_DECIMALS = 4;
const SAME_SIZE_PRECISION = 1 + `e-${FIXED_DECIMALS}` - 1;
module.exports = function glyphSizeLoader(content) {
    const font = opentype.parse(index_1.bufferToArrayBuffer(content));
    if (!font.supported) {
        throw new Error("Can't read font tables");
    }
    const upm = font.unitsPerEm;
    let sum = 0;
    let isFixedSize = true;
    let fixedSize = -1;
    const glyphs = Object.values(font.glyphs.glyphs).reduce((memo, { unicodes, advanceWidth }) => {
        let size = advanceWidth / upm;
        sum += size;
        size = index_1.decimalToFixed(size, FIXED_DECIMALS);
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
    }, {});
    return (isFixedSize
        ? FixedWidthFont_1.default(fixedSize)
        : CommonFont_1.default(glyphs, index_1.decimalToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS)));
};
module.exports.raw = true;
