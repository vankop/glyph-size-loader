const fontsRequire = require.context('!../../../../dist/index.js?ranges[]=cyrillic,ranges[]=0-00A0!../fonts', false, /\.(ttf|woff|woff2)$/);
const keys = fontsRequire.keys();
const requires = keys.map(key => fontsRequire(key));

export const fonts = keys.map(key => /\/(.*)\.(ttf|woff|woff2)$/.exec(key)[1]);

export function fontStringFactory(fontName) {
	const fontIndex = fonts.indexOf(fontName);

	if (fontIndex < 0) {
		throw new Error("Font not found");
	}

	return requires[fontIndex];
}
