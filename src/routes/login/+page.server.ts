import prisma from '$lib/server/prisma';
import type { Actions } from '@sveltejs/kit';
import z from 'zod';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const { email, password } = z
			.object({
				email: z.email('Email inválido'),
				password: z.string()
			})
			.parse(Object.fromEntries(formData.entries()));

		const existingUser = await prisma.user.findUnique({
			select: {
				email: true,
				password: true
			},
			where: { email }
		});

		if (!existingUser) throw new Error('Usuário não encontrado');

		// Criptografar senha e comparar com a do banco

		if (existingUser.password !== password) throw new Error('Senha incorreta');

		// Criar sessão ou token

		// Redicionar para a página inicial
	}
};
