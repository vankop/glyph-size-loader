"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unicodeBlocks_json_1 = __importDefault(require("./unicodeBlocks.json"));
exports.CHAR_RANGES = Object.assign({ ru: [0x0410, 0x044F + 1], russian: [0x0410, 0x044F + 1], rus: [0x0410, 0x044F + 1] }, unicodeBlocks_json_1.default);
exports.SCHEMA = {
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
exports.FIXED_DECIMALS_PLACES = 3;
exports.SAME_SIZE_PRECISION = `${1}e-${exports.FIXED_DECIMALS_PLACES}` - 1;
