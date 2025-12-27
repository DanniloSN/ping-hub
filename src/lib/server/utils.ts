import { getFavicon } from '$lib/utils';
import { COOKIE_APP_TOKEN } from '$lib/utils/static';
import type { UserType } from '@prisma/client';
import { fail, isRedirect, redirect, type RequestEvent } from '@sveltejs/kit';
import z from 'zod';
import prisma, { type Prisma } from './prisma';

interface LoggedUser {
	id: number;
	name: string;
	email: string;
	phone: string;
	settings: UserSettings;
	type: UserType;
	whatsappApiInstanceName: string;
	whatsappApiInstanceToken: string;
}

export interface UserSettings extends Prisma.JsonObject {
	slowResponse?: boolean;
	tooSlowResponse?: boolean;
	noResponse?: boolean;
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
			email: true,
			phone: true,
			settings: true,
			type: true,
			whatsappApiInstanceName: true,
			whatsappApiInstanceToken: true
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

	return {
		...loggedUser,
		settings: parseUserSettings(loggedUser.settings)
	};
}

export function logout(request: RequestEvent) {
	request.cookies.delete(COOKIE_APP_TOKEN, { path: '/' });
	return redirect(302, '/login');
}

export async function createInstance(url: string) {
	const urlObject = new URL(url);
	const favicon = await getFavicon(urlObject.origin);

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

export function buildActionCustomError(error: unknown) {
	return fail(400, buildCustomError(error));
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

	return customError;
}

export function parseUserSettings(settings: unknown): UserSettings {
	if (typeof settings === 'string') {
		try {
			return JSON.parse(settings) as UserSettings;
		} catch (error) {
			return {};
		}
	}

	if (typeof settings === 'object' && settings !== null) {
		return settings as UserSettings;
	}
	return {};
}
