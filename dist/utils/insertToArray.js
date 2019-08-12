"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertToArray(arr, el, index) {
    let current = el;
    for (let i = index; i < arr.length; i++) {
        let tmp = arr[i];
        arr[i] = current;
        current = tmp;
    }
    arr.push(current);
    return arr;
}
exports.default = insertToArray;
