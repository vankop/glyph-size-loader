const fontsRequire = require.context('!../../../../dist/index.js?charset[]=cyrillic,charset[]=latin!../fonts', false, /\.(ttf|woff|woff2)$/);
const keys = fontsRequire.keys();
const funcs = keys.map(key => fontsRequire(key).default);

export const fonts = keys.map(key => /\/(.*)\.(ttf|woff|woff2)$/.exec(key)[1]);

export function fontStringFactory(fontName) {
	const fontIndex = fonts.indexOf(fontName);

	if (fontIndex < 0) {
		throw new Error("Font not found");
	}

	return funcs[fontIndex];
}
