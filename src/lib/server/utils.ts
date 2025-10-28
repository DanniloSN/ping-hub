import { COOKIE_APP_TOKEN } from '$lib/utils/static';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import prisma from './prisma';

interface LoggedUser {
	id: number;
	name: string;
	email: string;
}

export async function getLoggedUser(
	request: RequestEvent,
	redirectOnFail?: true
): Promise<LoggedUser>;

export async function getLoggedUser(
	request: RequestEvent,
	redirectOnFail: false
): Promise<LoggedUser | null>;

export async function getLoggedUser(request: RequestEvent, redirectOnFail = true) {
	const token = request.cookies.get(COOKIE_APP_TOKEN);
	if (!token) {
		if (redirectOnFail) return logout(request);
		return null;
	}

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
	if (!loggedUser) {
		if (redirectOnFail) return logout(request);
		return null;
	}

	return loggedUser;
}

export function logout(request: RequestEvent) {
	request.cookies.delete(COOKIE_APP_TOKEN, { path: '/' });
	return redirect(302, '/login');
}
