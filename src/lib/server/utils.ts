import { COOKIE_APP_TOKEN } from '$lib/utils/static';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import prisma from './prisma';

export async function getLoggedUser(request: RequestEvent) {
	const token = request.cookies.get(COOKIE_APP_TOKEN);
	if (!token) return logout(request);

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
	if (!loggedUser) return logout(request);

	return loggedUser;
}

export function logout(request: RequestEvent) {
	request.cookies.delete(COOKIE_APP_TOKEN, { path: '/' });
	return redirect(403, '/login');
}
