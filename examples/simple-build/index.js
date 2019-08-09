import widthForRegularFontString from '../../dist/index.js!./OpenSans-Regular.ttf';

const text = 'Hello world!';
const fontSizePx = 12;

console.log(`Size of string "${text}" in px: ${widthForRegularFontString(text, fontSizePx)}`);
