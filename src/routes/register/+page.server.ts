import prisma from '$lib/server/prisma';
import { buildCustomError } from '$lib/server/utils';
import { generateRandomToken } from '$lib/utils';
import {
	COOKIE_APP_TOKEN,
	COOKIE_APP_TOKEN_MAX_AGE_IN_DAYS,
	MIN_NAME_LENGTH,
	MIN_PASSWORD_LENGTH
} from '$lib/utils/static';
import { redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';
import z from 'zod';

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();

			const data = z
				.object({
					name: z
						.string()
						.min(MIN_NAME_LENGTH, `Nome deve ter ao menos ${MIN_NAME_LENGTH} caracteres`),
					email: z.email('Email inválido'),
					password: z
						.string()
						.min(MIN_PASSWORD_LENGTH, `Senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres`)
				})
				.parse(Object.fromEntries(formData.entries()));

			const existingUsers = await prisma.user.count({
				where: { email: data.email }
			});
			if (existingUsers > 0) throw new Error('E-mail já cadastrado');

			const hashedPassword = await bcrypt.hash(data.password, 10);
			const token = generateRandomToken();

			await prisma.user.create({
				data: {
					...data,
					password: hashedPassword,
					AccessTokens: {
						create: { token }
					}
				}
			});

			const expires = dayjs().add(COOKIE_APP_TOKEN_MAX_AGE_IN_DAYS, 'day').toDate();
			event.cookies.set(COOKIE_APP_TOKEN, token, {
				expires,
				path: '/'
			});

			return redirect(302, '/');
		} catch (error) {
			return buildCustomError(error);
		}
	}
};
