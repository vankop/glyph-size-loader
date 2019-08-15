"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function baseTemplate() {
    /* eslint-disable */
    return `
export function widthFor(text, fontSize) {
	if (typeof text !== "string") return 0;
	
	return Math.ceil(multiplier(text) * fontSize);
}

export function fitTo(text, width) {
	if (typeof text !== "string") return 0;
	
	return Math.floor(width / multiplier(text));
}`;
    /* eslint-enable */
}
exports.default = baseTemplate;
