import { CodeChat } from '$lib/integrations/code-chat/api';
import prisma from '$lib/server/prisma';
import { parseUserSettings, pingUrl } from '$lib/server/utils';
import { formatPhoneToSendMessage } from '$lib/utils';
import { SLOW_RESPONSE_THRESHOLD_MS, TOO_SLOW_RESPONSE_THRESHOLD_MS } from '$lib/utils/static';

interface ResponseTime {
	instanceId: number;
	responseTimeMs: number;
}

interface UserToNotify {
	phone: string;
	instanceName: string;
	type: 'slowResponse' | 'tooSlowResponse' | 'noResponse';
	responseTimeMs: number;
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

		instance.Users.forEach(({ name, User }) => {
			const settings = parseUserSettings(User.settings);
			const commonData = {
				instanceName: name,
				phone: User.phone
			};

			if (responseTimeMs === -1 && settings.noResponse) {
				usersToNotify.push({
					...commonData,
					type: 'noResponse',
					responseTimeMs
				});
			} else if (responseTimeMs > TOO_SLOW_RESPONSE_THRESHOLD_MS && settings.tooSlowResponse) {
				usersToNotify.push({
					...commonData,
					type: 'tooSlowResponse',
					responseTimeMs
				});
			} else if (responseTimeMs > SLOW_RESPONSE_THRESHOLD_MS && settings.slowResponse) {
				usersToNotify.push({
					...commonData,
					type: 'slowResponse',
					responseTimeMs
				});
			}
		});
	}

	await prisma.instancePing.createMany({
		data: responseTimes
	});

	if (usersToNotify.length) {
		const whatsappApiCredentials = await prisma.user.findFirst({
			select: {
				whatsappApiInstanceName: true,
				whatsappApiInstanceToken: true
			},
			where: {
				whatsappApiInstanceName: process.env.WHATSAPP_API_INSTANCE_NAME || 'NOT_SET'
			}
		});

		if (!whatsappApiCredentials?.whatsappApiInstanceName) {
			throw new Error('No notifier WhatsApp API instance configured');
		}

		const codeChat = new CodeChat({
			instanceName: whatsappApiCredentials.whatsappApiInstanceName,
			instanceToken: whatsappApiCredentials.whatsappApiInstanceToken
		});

		for (const userToNotify of usersToNotify) {
			let text = `A sua instância "${userToNotify.instanceName}"`;

			switch (userToNotify.type) {
				case 'slowResponse':
				case 'tooSlowResponse':
					text += ` demorou ${userToNotify.responseTimeMs}ms para responder.`;
					break;
				case 'noResponse':
					text += ' não respondeu.';
					break;
			}

			const number = formatPhoneToSendMessage(userToNotify.phone);

			await codeChat
				.sendText({
					number,
					textMessage: { text }
				})
				.catch((error) => {
					console.error(`Error sending notification message to ${number}:`, error);
				});

			await new Promise((resolve) => setTimeout(resolve, 7000));
		}
	}

	return new Response(JSON.stringify({ success: true }));
}
