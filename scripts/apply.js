const fs = require('fs');
const {promisify} = require('util');
const path = require('path');
const writeFileAsync = promisify(fs.writeFile);
const parse = require('./parse');
const MarkdownTableBuilder = require('./markdownTable');
const JSON_OUTPUT_PATH = path.resolve('../src/utils/unicodeBlocks.json');
const BLOCK_DOCS_OUTPUT_PATH = path.resolve('../docs/Blocks.md');
const VERSION = process.env.VERSION;
const BLOCKS_FILE_NAME = path.resolve(`../data/unicode-${VERSION}.blocks.txt`);
const NAMES_LIST_FILE_NAME = path.resolve(`../data/unicode-${VERSION}.names-list.txt`);

parse({
	blocksFileName: BLOCKS_FILE_NAME,
	namesListFileName: NAMES_LIST_FILE_NAME
}).then(([blocks, namesList]) => {
	console.log(`Writing ${JSON_OUTPUT_PATH}..`);
	writeFileAsync(JSON_OUTPUT_PATH, JSON.stringify(blocks)).then(() => console.log(`${JSON_OUTPUT_PATH} done`));

	const keys = Object.keys(blocks);
	console.log('Creating Blocks.md..');
	const builder = new MarkdownTableBuilder();

	builder.addColumn('Block name', 'bold');
	builder.addColumn('Start codepoint');
	builder.addColumn('End codepoint');

	keys.forEach(key => {
		builder.addRaw([
			key,
			'0x' + blocks[key][0].toString(16).toUpperCase(),
			'0x' + (blocks[key][1] - 1).toString(16).toUpperCase()
		]);
	});

	writeFileAsync(BLOCK_DOCS_OUTPUT_PATH, `### Supported unicode ${VERSION} blocks\n\n${builder.build()}\n`).then(() => console.log(`${BLOCK_DOCS_OUTPUT_PATH} done`));
});
