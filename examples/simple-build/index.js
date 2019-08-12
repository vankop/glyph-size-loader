import {
	widthFor
} from '../../dist/index.js?charset[]=cyrillic,charset[]=latin!./OpenSans-Regular.ttf';

const text = 'Hello world!';
const fontSizePx = 12;

console.log(`Size of string "${text}" in px: ${widthFor(text, fontSizePx)}`);
