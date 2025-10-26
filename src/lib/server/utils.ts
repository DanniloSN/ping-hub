import { COOKIE_APP_TOKEN } from '$lib/utils/static';
import type { RequestEvent } from '@sveltejs/kit';
import prisma from './prisma';

export async function getLoggedUser(request: RequestEvent) {
	const token = request.cookies.get(COOKIE_APP_TOKEN);
	if (!token) return null;

	const loggedUser = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			email: true
		},
		where: {
			AccessTokens: {
				some: { token }
			}
		}
	});
	if (!loggedUser) return request.cookies.delete(COOKIE_APP_TOKEN, { path: '/' });

	return loggedUser;
}
