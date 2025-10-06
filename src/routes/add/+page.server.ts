import { create, get } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			const objectData = Object.fromEntries(formData.entries());

			const existingItem = get(objectData.url);
			if (existingItem) throw new Error('URL already exists');

			const url = new URL(objectData.url);
			const faviconUrl = `${url.origin}/favicon.ico`;

			create({ ...objectData, faviconUrl });

			throw redirect(302, '/');
		} catch (error) {
			console.error(error);
		}
	}
} satisfies Actions;
