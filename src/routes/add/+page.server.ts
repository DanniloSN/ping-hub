import prisma from '$lib/server/prisma';
import { buildActionCustomError, createInstance, getLoggedUser } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import z from 'zod';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		try {
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
				existingInstance = await createInstance(url);
			}

			const existingUserInstance = await prisma.userInstance.findFirst({
				select: { id: true },
				where: {
					userId: loggedUser.id,
					instanceId: existingInstance.id
				}
			});

			if (existingUserInstance) throw new Error('Você já adicionou esta instância');

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
		} catch (error) {
			return buildActionCustomError(error);
		}
	}
};
