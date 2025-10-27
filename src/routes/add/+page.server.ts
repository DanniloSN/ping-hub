import prisma from '$lib/server/prisma';
import { getLoggedUser } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import z from 'zod';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const { name, url } = z
			.object({
				name: z.string().min(1, 'Nome é obrigatório'),
				url: z.url('URL inválida')
			})
			.parse(Object.fromEntries(formData.entries()));

		const loggedUser = await getLoggedUser(event);

		let existingInstance = await prisma.instance.findFirst({
			where: { url }
		});

		if (!existingInstance) {
			const urlObject = new URL(url);
			const favicon = `${urlObject.origin}/favicon.ico`;

			existingInstance = await prisma.instance.create({
				data: {
					url,
					favicon
				}
			});
		}

		const existingUserInstance = await prisma.userInstance.findFirst({
			select: { id: true },
			where: {
				userId: loggedUser.id,
				instanceId: existingInstance.id
			}
		});

		await prisma.userInstance.upsert({
			where: { id: existingUserInstance?.id ?? 0 },
			create: {
				name,
				userId: loggedUser.id,
				instanceId: existingInstance.id
			},
			update: { name }
		});

		redirect(302, '/');
	}
};
