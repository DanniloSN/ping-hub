import prisma from '$lib/server/prisma';
import { getLoggedUser } from '$lib/server/utils.js';

export async function load(event) {
	const loggedUser = await getLoggedUser(event);
	if (!loggedUser) return { instances: [] };

	const userInstances = await prisma.userInstance.findMany({
		select: {
			id: true,
			name: true,
			Instance: {
				select: {
					url: true,
					favicon: true
				}
			}
		},
		where: {
			userId: loggedUser.id
		}
	});

	const instances = userInstances.map(({ Instance, ...item }) => ({
		...item,
		url: Instance.url,
		favicon: Instance.favicon
	}));

	return { instances };
}

export const actions = {
	remove: async ({ request }) => {
		const { url } = await request.json();
		if (!url) throw new Error('Url obrigatória');

		await prisma.instance.deleteMany({
			where: { url }
		});
	}
};
