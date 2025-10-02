import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			console.log(Object.fromEntries(formData.entries()));
			// Check if url isn't already in the database
			// Get favicon from url
			// Save to the database
			// Redirect to the home page
		} catch (error) {
			console.error(error);
		}
	}
} satisfies Actions;
