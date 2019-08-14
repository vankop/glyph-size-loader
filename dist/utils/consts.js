"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAR_RANGES = {
    latin: [0, 0x007F + 1],
    'latin-extended': [0x0080, 0x024F + 1],
    greek: [0x0370, 0x03FF + 1],
    coptic: [0x0370, 0x03FF + 1],
    cyrillic: [0x0400, 0x052F + 1],
    armenian: [0x0530, 0x058F + 1],
    hebrew: [0x0590, 0x05FF + 1],
    arabic: [0x0600, 0x077F + 1],
    currency: [0x20A0, 0x20CF + 1],
    math: [0x2200, 0x22FF + 1]
};
exports.SCHEMA = {
    type: 'object',
    properties: {
        charsets: {
            type: 'array',
            items: [
                {
                    type: 'string'
                },
                {
                    type: 'array',
                    items: {
                        type: 'number'
                    },
                    minLength: 2,
                    maxLength: 2,
                    additionalItems: false
                }
            ],
            additionalItems: false
        }
    }
};
