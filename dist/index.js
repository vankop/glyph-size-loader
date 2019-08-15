"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("loader-utils");
const opentype_js_1 = require("opentype.js");
const schema_utils_1 = __importDefault(require("schema-utils"));
const FixedWidthFont_1 = __importDefault(require("./templates/FixedWidthFont"));
const CommonFont_1 = __importDefault(require("./templates/CommonFont"));
const processOptions_1 = __importDefault(require("./processOptions"));
const computeSizes_1 = __importDefault(require("./computeSizes"));
const utils_1 = require("./utils");
module.exports = function glyphSizeLoader(content) {
    const rawOptions = loader_utils_1.getOptions(this);
    if (rawOptions) {
        schema_utils_1.default(utils_1.SCHEMA, rawOptions);
    }
    const processedOptions = processOptions_1.default(rawOptions);
    const font = opentype_js_1.parse(utils_1.bufferToArrayBuffer(content));
    if (!font.supported) {
        throw new Error('Can\'t read font tables');
    }
    const charRanges = utils_1.parseCharRanges(processedOptions.ranges);
    const upm = font.unitsPerEm;
    const glyphs = Object.values(font.glyphs.glyphs);
    const { sizes, isFixedSize, avg, fixedSize, } = computeSizes_1.default({
        glyphs,
        charRanges,
        upm,
    });
    return (isFixedSize
        ? FixedWidthFont_1.default(fixedSize)
        : CommonFont_1.default(sizes, avg));
};
module.exports.raw = true;
