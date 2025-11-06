import prisma from '$lib/server/prisma.js';
import { buildCustomError, getLoggedUser } from '$lib/server/utils';
import { redirect, type Actions } from '@sveltejs/kit';
import z from 'zod';

export async function load(event) {
	const { name, email } = await getLoggedUser(event);

	return {
		user: { name, email }
	};
}

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();

			const { name, email, phone } = z
				.object({
					name: z.string().min(1, 'Nome é obrigatório'),
					email: z.email('Email inválido'),
					phone: z.string().length(11)
				})
				.parse(Object.fromEntries(formData.entries()));

			const { id } = await getLoggedUser(event);

			const existingUserWithEmail = await prisma.user.findFirst({
				where: {
					email,
					id: { not: id }
				}
			});

			if (existingUserWithEmail) throw new Error('E-mail já cadastrado');

			await prisma.user.update({
				data: {
					name,
					email,
					phone
				},
				where: { id }
			});

			return redirect(302, '/');
		} catch (error) {
			return buildCustomError(error);
		}
	}
};
