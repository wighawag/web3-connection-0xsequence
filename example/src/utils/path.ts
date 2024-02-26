import { base } from '$app/paths';
import { getParamsFromURL, queryStringifyNoArray } from './url';

export function route(p: string, hash?: string) {
	if (!p.endsWith('/')) {
		p += '/';
	}
	let path = `${base}${p}${hash ? `#${hash}` : ''}`;
	return path;
}

export function url(p: string, hash?: string) {
	return `${base}${p}`;
}

export function isSameRoute(a: string, b: string): boolean {
	return a === b || a === route(b);
}

export function isParentRoute(a: string, b: string): boolean {
	return a.startsWith(b) || a.startsWith(route(b));
}
