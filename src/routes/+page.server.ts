import { get } from '$lib/server/db';

export function load() {
	const allItems = get();
	return { allItems };
}
