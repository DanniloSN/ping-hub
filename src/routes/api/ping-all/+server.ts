import prisma from '$lib/server/prisma';
import { parseUserSettings, pingUrl } from '$lib/server/utils';
import { SLOW_RESPONSE_THRESHOLD_MS, TOO_SLOW_RESPONSE_THRESHOLD_MS } from '$lib/utils/static';

interface ResponseTime {
	instanceId: number;
	responseTimeMs: number;
}

interface UserToNotify {
	phone: string;
	instanceName: string;
	type: 'slowResponse' | 'tooSlowResponse' | 'noResponse';
}

export async function POST() {
	const instances = await prisma.instance.findMany({
		select: {
			id: true,
			url: true,
			Users: {
				select: {
					name: true,
					User: {
						select: {
							phone: true,
							settings: true
						}
					}
				},
				where: {
					User: {
						phone: { not: '' }
					}
				}
			}
		}
	});

	const responseTimes: ResponseTime[] = [];
	const usersToNotify: UserToNotify[] = [];
	for (const instance of instances) {
		const responseTimeMs = await pingUrl(instance.url);

		responseTimes.push({
			instanceId: instance.id,
			responseTimeMs
		});

		instance.Users.flatMap(({ name, User }) => ({
			instanceName: name,
			phone: User.phone,
			settings: parseUserSettings(User.settings)
		})).forEach(({ settings, ...commonData }) => {
			if (responseTimeMs === -1 && settings.noResponse) {
				usersToNotify.push({
					...commonData,
					type: 'noResponse'
				});
			} else if (responseTimeMs > TOO_SLOW_RESPONSE_THRESHOLD_MS && settings.tooSlowResponse) {
				usersToNotify.push({
					...commonData,
					type: 'tooSlowResponse'
				});
			} else if (responseTimeMs > SLOW_RESPONSE_THRESHOLD_MS && settings.slowResponse) {
				usersToNotify.push({
					...commonData,
					type: 'slowResponse'
				});
			}
		});
	}

	await prisma.instancePing.createMany({
		data: responseTimes
	});

	for (const userToNotify of usersToNotify) {
		// Implement your notification logic here.
		console.log('Notify', userToNotify);
	}

	return new Response(JSON.stringify({ sucess: true }));
}
