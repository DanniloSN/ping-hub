import { getLoggedUser } from '$lib/server/utils';

export async function load(event) {
	const loggedUser = await getLoggedUser(event, false);

	return { loggedUser };
}
