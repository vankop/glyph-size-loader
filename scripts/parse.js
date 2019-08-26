const fs = require('fs');
const {promisify} = require('util');
const path = require('path');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

function toKebabCase(str) {
	return str.trim().split(' ').map(s => s.toLowerCase()).join('-');
}

function readLine(blocksString, i) {
	let j = i;

	while (blocksString[j++] !== '\n');

	const result = blocksString.substr(i, j - i - 1);

	while (blocksString[j++] === '\n');

	return [result, j - 1];
}

function parseBlocks(blocksString, index = 0) {
	let readLineResult;
	const result = {};

	while (!(readLineResult = readLine(blocksString, index))[0].includes('# EOF')) {
		const [line, newIndex] = readLineResult;
		index = newIndex;

		if (line[0] === '#') {
			continue;
		}

		const match = line.match(/^([\d|A|B|C|D|E|F]{4,})\.\.([\d|A|B|C|D|E|F]{4,}); (.*)$/);

		if (!match) {
			continue;
		}

		const [_, first, second, name] = match;
		const kebabCaseName = toKebabCase(name);
		const firstNumber = parseInt(first, 16);
		const secondNumber = parseInt(second, 16);
		result[kebabCaseName] = [firstNumber, secondNumber + 1];
	}

	return result;
}

module.exports = function ({
	blocksFileName,
	namesListFileName
}) {
	return Promise.all([
		readFileAsync(blocksFileName, {encoding: 'utf-8'}),
		readFileAsync(namesListFileName) /* TODO */
	]).then(([blocks, namesList]) => {
		console.log('Parsing blocks..');
		return [parseBlocks(blocks), namesList];
	});
};
