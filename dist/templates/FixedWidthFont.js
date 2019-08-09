"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fixedWidthFontTemplate(percent) {
    return `
	export default function (text, fontSize) {
		if (typeof text !== "string") return 0;
		return Math.ceil(text.length * ${percent} * fontSize);
	}
	`;
}
exports.default = fixedWidthFontTemplate;
;
