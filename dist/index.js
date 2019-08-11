"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loaderUtils = require("loader-utils");
const FixedWidthFont_1 = require("./templates/FixedWidthFont");
const CommonFont_1 = require("./templates/CommonFont");
const index_1 = require("./utils/index");
const opentype = require("opentype.js");
const charsets_1 = require("./utils/charsets");
const FIXED_DECIMALS = 4;
const SAME_SIZE_PRECISION = 1 + `e-${FIXED_DECIMALS}` - 1;
module.exports = function glyphSizeLoader(content) {
    const font = opentype.parse(index_1.bufferToArrayBuffer(content));
    const options = loaderUtils.getOptions(this);
    if (!font.supported) {
        throw new Error("Can't read font tables");
    }
    const charsets = options && options.charset
        ? index_1.parseCharsets(options.charset)
        : [[0, 0x100000]];
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
        if (unicodes.every(code => charsets_1.isAllowed(charsets, code))) {
            unicodes.forEach(ch => memo[ch] = size);
        }
        return memo;
    }, {});
    return (isFixedSize
        ? FixedWidthFont_1.default(fixedSize)
        : CommonFont_1.default(glyphs, index_1.decimalToFixed(sum / Object.keys(font.glyphs.glyphs).length, FIXED_DECIMALS)));
};
module.exports.raw = true;
