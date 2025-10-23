import prisma from '$lib/server/prisma';
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

		const existingInstance = await prisma.instance.findFirst({
			where: { url }
		});
		if (existingInstance) throw new Error('URL already exists');

		const urlObject = new URL(url);
		const favicon = `${urlObject.origin}/favicon.ico`;

		await prisma.instance.create({
			data: {
				name,
				url,
				favicon
			}
		});

		throw redirect(303, '/');
	}
};
