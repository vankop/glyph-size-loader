import insert from './insertToArray';
import { CHAR_RANGES } from './consts';
import {
  Range,
  Ranges,
} from '../types';

function addCharRange(charRange: Range, charRanges: Ranges): Ranges {
  let i = 0;

  while (i < charRanges.length && charRanges[i][0] < charRange[0]) i++;

  if (i - 1 > -1 && charRange[0] <= charRanges[i - 1][1]) {
    charRanges[i - 1][0] = Math.min(charRanges[i - 1][0], charRange[0]);
    charRanges[i - 1][1] = Math.max(charRanges[i - 1][1], charRange[1]);
    return charRanges;
  }

  if (i === charRanges.length) {
    charRanges.push(charRange);
    return charRanges;
  }

  if (charRanges[i][0] <= charRange[1]) {
    charRanges[i][0] = Math.min(charRanges[i][0], charRange[0]);
    charRanges[i][1] = Math.max(charRanges[i][1], charRange[1]);
    return charRanges;
  }

  insert(charRanges, charRange, i);
  return charRanges;
}

export function parseCharRanges(charRanges: Array<string|[number, number]>): Ranges {
  let i = 0;
  const result: Ranges = [];

  while (i < charRanges.length) {
    const current = charRanges[i++];

    if (Array.isArray(current)) {
      addCharRange([current[0], current[1] + 1], result);
      continue;
    }

    const ranges = /([\d|A|B|C|D|E|F]+)-([\d|A|B|C|D|E|F]+)/i.exec(current);

    if (ranges) {
      const num1 = parseInt(ranges[1], 16);
      const num2 = parseInt(ranges[2], 16);

      if (Number.isNaN(num1) || Number.isNaN(num2) || num1 > num2) {
        throw new Error(`Char range "${current}" is not a valid range`);
      }

      addCharRange([num1, num2 + 1], result);
    } else {
      const charRange = CHAR_RANGES[current];

      if (!Array.isArray(charRange)) {
        throw new Error(`Char range name "${current}" does not supported`);
      }

      addCharRange(charRange, result);
    }
  }

  return result;
}

export function isAllowed(charRanges: Ranges, unicode: number): boolean {
  let i = 0;

  while (i < charRanges.length && (charRanges[i][1] - 1) < unicode) i++;

  if (i === charRanges.length) return false;

  return charRanges[i][0] <= unicode;
}
