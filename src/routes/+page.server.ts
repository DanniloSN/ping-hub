import { get, remove } from '$lib/server/db';

export function load() {
	const allItems = get();
	return { allItems };
}

export const actions = {
	remove: async ({ request }) => {
		const { url } = await request.json();
		if (!url) throw new Error('Url obrigatória');
		remove(url);
	}
};
