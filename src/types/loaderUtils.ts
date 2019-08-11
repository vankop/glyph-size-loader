declare module 'loader-utils' {
	export function parseQuery(resourceQuery: string): {[k: string]: Array<string>|string|boolean}
	export function getOptions<T>(loaderContext: { query: string; }): T | null;
}
