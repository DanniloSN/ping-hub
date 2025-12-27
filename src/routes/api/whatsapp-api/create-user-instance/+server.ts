import { CodeChat } from '$lib/integrations/code-chat/api';
import prisma from '$lib/server/prisma';
import { buildApiCustomError, getLoggedUser } from '$lib/server/utils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (request) => {
	try {
		const loggedUser = await getLoggedUser(request);

		if (!loggedUser.whatsappApiInstanceName) {
			const codeChat = new CodeChat({ instanceName: loggedUser.email });
			const createInstanceResponse = await codeChat.createInstance();

			await prisma.user.update({
				data: {
					whatsappApiInstanceName: loggedUser.email,
					whatsappApiInstanceToken: createInstanceResponse.data.Auth.token
				},
				where: {
					id: loggedUser.id
				}
			});
		}

		return new Response(null, { status: 200 });
	} catch (error) {
		console.error(error);
		return buildApiCustomError(error);
	}
};
