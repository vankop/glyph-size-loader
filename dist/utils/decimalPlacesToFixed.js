"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function decimalPlacesToFixed(num, numbersAfterPoint) {
    const precision = 1 + `e+${numbersAfterPoint}` - 0;
    return Math.round(num * precision) / precision;
}
exports.default = decimalPlacesToFixed;
