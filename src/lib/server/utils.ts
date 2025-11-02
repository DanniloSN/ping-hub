import { COOKIE_APP_TOKEN } from '$lib/utils/static';
import { fail, isRedirect, redirect, type RequestEvent } from '@sveltejs/kit';
import z from 'zod';
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

export async function createInstance(url: string) {
	const urlObject = new URL(url);
	const favicon = `${urlObject.origin}/favicon.ico`;

	const responseTimeMs = await pingUrl(url);

	return prisma.instance.create({
		data: {
			url,
			favicon,
			Pings: {
				create: { responseTimeMs }
			}
		}
	});
}

export async function pingUrl(url: string) {
	let responseTimeMs = -1;

	try {
		const start = performance.now();
		await fetch(url);
		const end = performance.now();

		responseTimeMs = Math.round(end - start);
	} catch (error) {}

	return responseTimeMs;
}

export function buildCustomError(error: unknown) {
	const customError = {
		message: 'Erro desconhecido'
	};

	switch (true) {
		case isRedirect(error):
			return redirect(error.status, error.location);
		case error instanceof z.ZodError:
			customError.message = error.issues.map((issue) => issue.message).join(', ');
			break;
		case error instanceof Error:
			customError.message = error.message;
			break;
		case typeof error === 'string':
			customError.message = error;
			break;
	}

	return fail(400, customError);
}
