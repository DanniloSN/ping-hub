import prisma from '$lib/server/prisma';
import { getLoggedUser } from '$lib/server/utils.js';

export async function load(event) {
	const loggedUser = await getLoggedUser(event);

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
	remove: async (event) => {
		const { url } = await event.request.json();
		if (!url) throw new Error('Url obrigatória');

		const loggedUser = await getLoggedUser(event);

		await prisma.userInstance.deleteMany({
			where: {
				userId: loggedUser.id,
				Instance: { url }
			}
		});
	}
};
