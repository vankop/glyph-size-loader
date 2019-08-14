import {JSONSchema7} from 'json-schema';

export const CHAR_RANGES: {[k: string]: [number, number]} = {
	latin: [0, 0x007F +1],
	'latin-extended': [0x0080, 0x024F +1],
	greek: [0x0370, 0x03FF + 1],
	coptic: [0x0370, 0x03FF + 1],
	cyrillic: [0x0400, 0x052F + 1],
	armenian: [0x0530, 0x058F + 1],
	hebrew: [0x0590, 0x05FF + 1],
	arabic: [0x0600, 0x077F + 1],
	currency: [0x20A0, 0x20CF + 1],
	math: [0x2200, 0x22FF + 1]
};

export const SCHEMA: JSONSchema7 = {
	type: 'object',
	properties: {
		ranges: {
			type: 'array',
			additionalItems: {
				oneOf: [
					{
						type: 'string'
					},
					{
						type: 'array',
						items: {type: 'number'},
						minLength: 2,
						maxLength: 2
					}
				]
			}
		}
	}
};

export const FIXED_DECIMALS_PLACES: number = 3;
export const SAME_SIZE_PRECISION: number = 1 + `e-${FIXED_DECIMALS_PLACES}` as any - 1;
