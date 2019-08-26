const path = require('path');

module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: path.resolve('./src/tsconfig.json')
		}
	},
	testEnvironment: "node",
	roots: [
		"<rootDir>/src"
	],
	"collectCoverageFrom": [
		"**/*.ts",
		"!**/node_modules/**",
		"!**/vendor/**"
	],
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
};
