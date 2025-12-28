import prisma from '$lib/server/prisma';
import { getLoggedUser } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	const loggedUser = await getLoggedUser(event);

	if (loggedUser.type !== 'ADMIN') return redirect(302, '/');

	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			phone: true,
			createdAt: true
		},
		orderBy: { id: 'desc' }
	});

	const instances = await prisma.instance.findMany({
		select: {
			id: true,
			url: true,
			createdAt: true
		},
		orderBy: { id: 'desc' }
	});

	return {
		users,
		instances
	};
}) satisfies LayoutServerLoad;
