import type { PageServerLoad } from './$types';

type ResponseEnum = 'INSTANCE_NOT_FOUND' | 'INSTANCE_OFFLINE' | 'INSTANCE_ONLINE';

export const load = (async () => {
	const instanceStatus = 'INSTANCE_NOT_FOUND' as ResponseEnum;
	return { instanceStatus };
}) satisfies PageServerLoad;
