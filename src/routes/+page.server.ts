import prisma from '$lib/server/prisma';
import { getLoggedUser, logout } from '$lib/server/utils.js';
import { type Actions } from '@sveltejs/kit';

export async function load(event) {
	const loggedUser = await getLoggedUser(event, false);

	if (!loggedUser) {
		return { instances: [] };
	}

	const userInstances = await prisma.userInstance.findMany({
		select: {
			id: true,
			name: true,
			Instance: {
				select: {
					url: true,
					favicon: true,
					Pings: {
						select: {
							createdAt: true,
							responseTimeMs: true
						},
						orderBy: { createdAt: 'desc' },
						take: 1
					}
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
		favicon: Instance.favicon,
		responseTimeMs: Instance.Pings[0]?.responseTimeMs ?? null,
		lastPingAt: Instance.Pings[0]?.createdAt ?? null
	}));

	return { instances };
}

export const actions: Actions = {
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
	},
	logout
};
