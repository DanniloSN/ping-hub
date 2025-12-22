import prisma from '$lib/server/prisma';
import { pingUrl } from '$lib/server/utils';

interface ResponseTime {
	instanceId: number;
	responseTimeMs: number;
}

export async function POST() {
	const instances = await prisma.instance.findMany({
		select: {
			id: true,
			url: true
		}
	});

	const responseTimes: ResponseTime[] = [];
	for (const instance of instances) {
		const responseTimeMs = await pingUrl(instance.url);

		responseTimes.push({
			instanceId: instance.id,
			responseTimeMs
		});
	}

	await prisma.instancePing.createMany({
		data: responseTimes
	});

	return new Response(JSON.stringify({ sucess: true }));
}
