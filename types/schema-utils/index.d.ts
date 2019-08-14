declare module 'schema-utils' {
	import {JSONSchema4, JSONSchema6, JSONSchema7} from 'json-schema';

	function validateOptions(schema: JSONSchema4 | JSONSchema6 | JSONSchema7, options: object, configuration?: object): void;

	export = validateOptions;
}
