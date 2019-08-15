"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertToArray(arr, el, index) {
    if (arr.length < index || index < 0) {
        throw new Error('out of range');
    }
    let current = el;
    for (let i = index; i < arr.length; i++) {
        const tmp = arr[i];
        arr[i] = current;
        current = tmp;
    }
    arr.push(current);
    return arr;
}
exports.default = insertToArray;
