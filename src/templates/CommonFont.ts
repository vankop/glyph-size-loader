export default function commonFontTemplate(glyphs: Map<number, Array<number>>, avg: number) {
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

export default function (text, fontSize) {
	if (typeof text !== "string") return 0;
	
	var result = 0, i = 0;
	for (; i < text.length; i++) {
		result += getPercent(text.charCodeAt(i)) * fontSize;
	}
	
	return Math.ceil(result);
}`;
};
