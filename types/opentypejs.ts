declare module 'opentype.js' {
	export interface Glyph {
		unicodes: Array<number>,
		advanceWidth: number
	}

	export interface Font {
		supported: boolean,
		unitsPerEm: number,
		glyphs: {
			glyphs: {
				[k: string]: Glyph
			}
		}
	}

	export function parse(buf: ArrayBuffer): Font;
}
