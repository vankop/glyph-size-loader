"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const insertToArray_1 = require("./insertToArray");
const consts_1 = require("./consts");
function addCharRange(charRange, charRanges) {
    let i = 0;
    while (i < charRanges.length && charRanges[i][0] < charRange[0])
        i++;
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
    insertToArray_1.default(charRanges, charRange, i);
    return charRanges;
}
function parseCharRanges(charRanges) {
    let i = 0;
    let startCharCode = -1;
    const result = [];
    while (i < charRanges.length) {
        const current = charRanges[i++];
        const isNumber = /\d/.test(current);
        if (isNumber) {
            const num = parseInt(current, 16);
            if (Number.isNaN(num)) {
                throw new Error(`Char range query param "${current}" is not valid hex number`);
            }
            if (startCharCode === -1) {
                startCharCode = num;
            }
            else {
                const charRange = [startCharCode, num + 1];
                if (charRange[1] <= charRange[0]) {
                    throw new Error(`char range range is invalid, got ${charRange}`);
                }
                addCharRange(charRange, result);
                startCharCode = -1;
            }
        }
        else {
            const charRange = consts_1.CHAR_RANGES[current];
            if (!Array.isArray(charRange)) {
                throw new Error(`Char range name "${current}" does not supported`);
            }
            addCharRange(charRange, result);
        }
    }
    if (startCharCode !== -1) {
        const charRange = [startCharCode, startCharCode + 1];
        addCharRange(charRange, result);
    }
    return result;
}
exports.parseCharRanges = parseCharRanges;
function isAllowed(charRanges, unicode) {
    let i = 0;
    while (i < charRanges.length && (charRanges[i][1] - 1) < unicode)
        i++;
    if (i === charRanges.length)
        return false;
    return charRanges[i][0] <= unicode;
}
exports.isAllowed = isAllowed;
