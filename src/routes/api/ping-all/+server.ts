import prisma from '$lib/server/prisma';

export async function POST() {
	const instances = await prisma.instance.findMany({
		select: {
			id: true,
			url: true
		}
	});

	const responseTimes = await Promise.all(
		instances.map(async (instance) => {
			let responseTimeMs = -1;

			try {
				const start = performance.now();
				await fetch(instance.url);
				const end = performance.now();

				responseTimeMs = Math.round(end - start);
			} catch (error) {}

			return {
				instanceId: instance.id,
				responseTimeMs
			};
		})
	);

	await prisma.instancePing.createMany({
		data: responseTimes
	});

	return new Response(JSON.stringify({ sucess: true }));
}
