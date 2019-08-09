export default function fixedWidthFontTemplate(percent: number) {
	return `
	export default function (text, fontSize) {
		if (typeof text !== "string") return 0;
		return Math.ceil(text.length * ${percent} * fontSize);
	}
	`;
};
