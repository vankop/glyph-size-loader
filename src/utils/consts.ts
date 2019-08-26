// eslint-disable-next-line
import { JSONSchema7 } from 'json-schema';
import unicodeBlocks from './unicodeBlocks.json';

export const CHAR_RANGES: {[k: string]: [number, number]} = <any> {
  ru: [0x0410, 0x044F + 1],
  russian: [0x0410, 0x044F + 1],
  rus: [0x0410, 0x044F + 1],
  ...unicodeBlocks
};

export const SCHEMA: JSONSchema7 = {
  type: 'object',
  properties: {
    ranges: {
      type: 'array',
      additionalItems: {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
            items: { type: 'number' },
            minLength: 2,
            maxLength: 2,
          },
        ],
      },
    },
  },
};

export const FIXED_DECIMALS_PLACES = 3;
export const SAME_SIZE_PRECISION: number = `${1}e-${FIXED_DECIMALS_PLACES}` as any - 1;
