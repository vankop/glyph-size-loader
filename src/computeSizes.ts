import { Glyph } from 'opentype.js';
import {
  decimalPlacesToFixed,
  FIXED_DECIMALS_PLACES,
  SAME_SIZE_PRECISION,
  insertToArray,
  isCharAllowed,
} from './utils';
import { Ranges } from './types';

type InputParameters = {
  glyphs: Array<Glyph>;
  charRanges: Ranges;
  upm: number;
};

type OutputResult = {
  isFixedSize: boolean;
  fixedSize: number;
  avg: number;
  sizes: Map<number, Array<number>>;
};

function insertCharCode(sizesEntry: Array<number>, code: number): void {
  let i = sizesEntry.length - 2;

  while (i > -1 && sizesEntry[i] > code) i--;
  insertToArray(sizesEntry, code, i + 1);
}

export default function computeGlyphSizes({ glyphs, charRanges, upm }: InputParameters): OutputResult {
  const sizes: Map<number, Array<number>> = new Map();
  let sum = 0;
  let isFixedSize = true;
  let fixedSize = -1;
  let i = 0;

  while (i < glyphs.length) {
    const { unicodes, advanceWidth } = glyphs[i++];

    if (unicodes.length === 0) {
      continue;
    }

    let size: number = advanceWidth / upm;
    sum += size;
    size = decimalPlacesToFixed(size, FIXED_DECIMALS_PLACES);

    if (isFixedSize) {
      if (fixedSize === -1) {
        fixedSize = size;
      }

      if (fixedSize && Math.abs(fixedSize - size) > SAME_SIZE_PRECISION) {
        isFixedSize = false;
      }
    }

    if (unicodes.every((code) => isCharAllowed(charRanges, code))) {
      if (sizes.has(size)) {
        const current = sizes.get(size) as Array<number>;

        unicodes.forEach((ch) => typeof ch === 'number' && insertCharCode(current, ch));
      } else {
        const sorted = unicodes.filter((a) => typeof a === 'number').sort();

        sorted.push(size);
        sizes.set(size, sorted);
      }
    }
  }

  return {
    sizes,
    isFixedSize,
    fixedSize,
    avg: decimalPlacesToFixed(sum / glyphs.length, FIXED_DECIMALS_PLACES),
  };
}
