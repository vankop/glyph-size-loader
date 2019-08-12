"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
function fixedWidthFontTemplate(percent) {
    return `function multiplier(text) { return text.length * ${percent}; }
` + Base_1.default();
}
exports.default = fixedWidthFontTemplate;
;
