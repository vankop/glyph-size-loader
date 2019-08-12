import baseTemplate from "./Base";

export default function fixedWidthFontTemplate(percent: number): string {
	return `function multiplier(text) { return text.length * ${percent}; }
` + baseTemplate();
};
