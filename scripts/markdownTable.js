function isSupportedType(type) {
	switch (type) {
		case 'default': case 'bold': case 'italic':
			return true;
		default:
			return false;
	}
}

function applyType(str, type) {
	switch (type) {
		case 'bold':
			return `**${str}**`;
		case 'italic':
			return `*${str}*`;
		default:
			return str;
	}
}

function buildRaw(texts, columns) {
	let result = '|';

	for (let i = 0; i < texts.length; i++) {
		result += ` ${applyType(texts[i].toString(), columns[i].type)} |`;
	}

	return result;
}

class MarkdownTableBuilder {
	constructor() {
		this.columns = [];
		this.raws = [];
	}

	addColumn(title, type = 'default') {
		if (!isSupportedType(type)) throw new Error(`unsupported column type: ${type}`);

		this.columns.push({title, type});
	}

	addRaw(data) {
		if (!Array.isArray(data)) throw new Error('can add only array raw data');
		if (data.length !== this.columns.length) throw new Error('wrong data length');

		this.raws.push(data);
	}

	build() {
		const header = buildRaw(this.columns.map(({title}) => title), this.columns);
		const body = this.raws.map(raw => buildRaw(raw, this.columns)).join('\n');

		return `\n[](Table created using automation)\n\n${header}\n${new Array(this.columns.length).fill(' --- ').join('|')}\n${body}`;
	}
}

module.exports = MarkdownTableBuilder;
