import { CodeChat } from '$lib/integrations/code-chat/api';
import { buildApiCustomError, getLoggedUser } from '$lib/server/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (request) => {
	try {
		const loggedUser = await getLoggedUser(request);

		if (!loggedUser.whatsappApiInstanceName) {
			throw new Error('User does not have a WhatsApp API instance.');
		}

		const codeChat = new CodeChat({
			instanceName: loggedUser.whatsappApiInstanceName,
			instanceToken: loggedUser.whatsappApiInstanceToken
		});

		const instanceConnectResponse = await codeChat.instanceConnect();

		return Response.json({ qrCode: instanceConnectResponse.data.base64 }, { status: 200 });
	} catch (error) {
		console.error(error);
		return buildApiCustomError(error);
	}
};
