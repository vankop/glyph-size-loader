const path = require('path');

module.exports = {
	mode: 'development',
	target: 'node',
	devtool: false,
	entry: path.resolve(__dirname, 'index.js')
};
