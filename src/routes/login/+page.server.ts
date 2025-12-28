import prisma from '$lib/server/prisma';
import { buildActionCustomError } from '$lib/server/utils';
import { generateRandomToken } from '$lib/utils';
import { COOKIE_APP_TOKEN, COOKIE_APP_TOKEN_MAX_AGE_IN_DAYS } from '$lib/utils/static';
import { redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import z from 'zod';

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();

			const { email, password } = z
				.object({
					email: z.email('Email inválido'),
					password: z.string()
				})
				.parse(Object.fromEntries(formData.entries()));

			const existingUser = await prisma.user.findUnique({
				select: {
					id: true,
					email: true,
					password: true
				},
				where: { email }
			});
			if (!existingUser) throw new Error('Usuário não encontrado');

			const passwordMatch = await bcrypt.compare(password, existingUser.password);
			if (!passwordMatch) throw new Error('Senha incorreta');

			const token = generateRandomToken();
			await prisma.userAccessToken.create({
				data: {
					token,
					userId: existingUser.id
				}
			});

			const expires = dayjs().add(COOKIE_APP_TOKEN_MAX_AGE_IN_DAYS, 'day').toDate();
			event.cookies.set(COOKIE_APP_TOKEN, token, {
				path: '/',
				expires
			});

			redirect(302, '/');
		} catch (error) {
			return buildActionCustomError(error);
		}
	}
};
