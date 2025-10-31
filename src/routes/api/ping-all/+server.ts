import prisma from '$lib/server/prisma';
import { pingUrl } from '$lib/server/utils';

export async function POST() {
	const instances = await prisma.instance.findMany({
		select: {
			id: true,
			url: true
		}
	});

	const responseTimes = await Promise.all(
		instances.map(async (instance) => {
			const responseTimeMs = await pingUrl(instance.url);

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
