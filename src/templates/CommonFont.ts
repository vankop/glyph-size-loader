export default function commonFontTemplate(glyphs: object, avg: number) {
	return `
	var SIZES = ${JSON.stringify(glyphs)};
	
	export default function (text, fontSize) {
		if (typeof text !== "string" || text.length === 0) return 0;
		
		var result = 0;
		var i = 0;
		while (i < text.length) {
			const ch = text.charCodeAt(i++);
			if (SIZES[ch] !== undefined) result += SIZES[ch] * fontSize;
			else result += ${avg} * fontSize;
		}
		
		return Math.ceil(result);
	}
	`;
};
