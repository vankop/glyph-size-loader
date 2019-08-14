"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
function commonFontTemplate(glyphs, avg) {
    const sorted = Array.from(glyphs.values()).sort((a, b) => a[0] - b[0]);
    return `var SIZES = ${JSON.stringify(sorted)}, cache = {};

function getPercent(ch) {
	if (cache[ch]) return cache[ch];

	var i = 0, j = -1;
	for (; i < SIZES.length; i++) {
		if (SIZES[i][0] <= ch && SIZES[i][SIZES[i].length - 2] >= ch) {
			j = SIZES[i].indexOf(ch);
			if (j > -1) break;
		}
	}
	
	return (cache[ch] = j > -1 ?  SIZES[i][SIZES[i].length - 1] : ${avg});
}

function multiplier(text) {
	var result = 0, i = 0;
	
	for (; i < text.length; i++) {
		result += getPercent(text.charCodeAt(i));
	}
	
	return result;
}
` + Base_1.default();
}
exports.default = commonFontTemplate;
;
