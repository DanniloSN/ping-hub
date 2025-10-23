import prisma from '$lib/server/prisma';

export async function load() {
	const instances = await prisma.instance.findMany({
		select: {
			id: true,
			name: true,
			url: true,
			favicon: true
		}
	});

	return { instances };
}

export const actions = {
	remove: async ({ request }) => {
		const { url } = await request.json();
		if (!url) throw new Error('Url obrigatória');

		await prisma.instance.deleteMany({
			where: { url }
		});
	}
};
