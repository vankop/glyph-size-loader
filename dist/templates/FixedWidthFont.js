"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
function fixedWidthFontTemplate(percent) {
    return `function multiplier(text) { return text.length * ${percent}; }
` + Base_1.default();
}
exports.default = fixedWidthFontTemplate;
;
