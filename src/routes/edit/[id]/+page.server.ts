import prisma from '$lib/server/prisma';
import { buildCustomError, createInstance, getLoggedUser } from '$lib/server/utils';
import { redirect, type Actions } from '@sveltejs/kit';
import z from 'zod';

export async function load(event) {
	const id = Number(event.params.id);
	const loggedUser = await getLoggedUser(event);

	const userInstance = await prisma.userInstance.findUnique({
		select: {
			name: true,
			Instance: {
				select: {
					url: true
				}
			}
		},
		where: {
			id,
			userId: loggedUser.id
		}
	});

	if (!userInstance) throw new Error('Instância não encontrada');

	const instance = {
		name: userInstance.name,
		url: userInstance.Instance.url
	};

	return { instance };
}

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			formData.append('id', event.params.id ?? '');

			const { id, name, url } = z
				.object({
					id: z.coerce.number(),
					name: z.string().min(1, 'Nome é obrigatório'),
					url: z.url('URL inválida')
				})
				.parse(Object.fromEntries(formData.entries()));

			const loggedUser = await getLoggedUser(event);

			const existingUserInstance = await prisma.userInstance.findFirst({
				select: {
					id: true,
					Instance: {
						select: {
							id: true,
							url: true
						}
					}
				},
				where: {
					id,
					userId: loggedUser.id
				}
			});

			if (!existingUserInstance) throw new Error('Instância não encontrada');

			if (existingUserInstance.Instance.url === url) {
				await prisma.userInstance.update({
					data: { name },
					where: {
						id: existingUserInstance.id
					}
				});

				return redirect(302, `/`);
			}

			let existingInstance = await prisma.instance.findUnique({
				select: { id: true },
				where: { url }
			});

			if (!existingInstance) {
				existingInstance = await createInstance(url);
			}

			await prisma.userInstance.delete({
				where: {
					id: existingUserInstance.id
				}
			});

			await prisma.userInstance.create({
				data: {
					name,
					userId: loggedUser.id,
					instanceId: existingInstance.id
				}
			});

			return redirect(302, `/`);
		} catch (error) {
			return buildCustomError(error);
		}
	}
};
