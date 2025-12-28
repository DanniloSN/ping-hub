import { CodeChat } from '$lib/integrations/code-chat/api';
import { getLoggedUser } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

type ResponseEnum = 'INSTANCE_NOT_FOUND' | 'INSTANCE_OFFLINE' | 'INSTANCE_ONLINE';

export const load = (async (event) => {
	const loggedUser = await getLoggedUser(event);

	let instanceStatus = 'INSTANCE_NOT_FOUND' as ResponseEnum;
	if (loggedUser.whatsappApiInstanceName) {
		const codeChat = new CodeChat({
			instanceName: loggedUser.whatsappApiInstanceName,
			instanceToken: loggedUser.whatsappApiInstanceToken
		});

		const connectionStatusResponse = await codeChat.connectionStatus();
		if (connectionStatusResponse.data.state === 'open') {
			instanceStatus = 'INSTANCE_ONLINE';
		} else {
			instanceStatus = 'INSTANCE_OFFLINE';
		}
	}

	return { instanceStatus };
}) satisfies PageServerLoad;
