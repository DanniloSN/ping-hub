import prisma from '$lib/server/prisma.js';
import { buildActionCustomError, getLoggedUser } from '$lib/server/utils';
import { redirect, type Actions } from '@sveltejs/kit';
import z from 'zod';

export async function load(event) {
	const { name, email, phone, settings } = await getLoggedUser(event);

	return {
		user: { name, email, phone, settings }
	};
}

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();

			const { name, email, phone, ...formSettings } = z
				.object({
					name: z.string().min(1, 'Nome é obrigatório'),
					email: z.email('Email inválido'),
					phone: z.string().length(15, 'Telefone inválido'),
					settingsSlowResponse: z
						.string()
						.optional()
						.transform((val) => val === 'on'),
					settingsTooSlowResponse: z
						.string()
						.optional()
						.transform((val) => val === 'on'),
					settingsNoResponse: z
						.string()
						.optional()
						.transform((val) => val === 'on')
				})
				.parse(Object.fromEntries(formData.entries()));

			const { id, settings } = await getLoggedUser(event);

			const existingUserWithEmail = await prisma.user.findFirst({
				where: {
					email,
					id: { not: id }
				}
			});

			if (existingUserWithEmail) throw new Error('E-mail já cadastrado');

			const newSettings = Object.assign({}, settings, {
				slowResponse: formSettings['settingsSlowResponse'] || false,
				tooSlowResponse: formSettings['settingsTooSlowResponse'] || false,
				noResponse: formSettings['settingsNoResponse'] || false
			});

			await prisma.user.update({
				data: {
					name,
					email,
					phone,
					settings: newSettings
				},
				where: { id }
			});

			return redirect(302, '/');
		} catch (error) {
			return buildActionCustomError(error);
		}
	}
};
