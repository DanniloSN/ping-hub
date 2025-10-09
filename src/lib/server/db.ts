export interface Item {
	id: number;
	name: string;
	url: string;
	faviconUrl: string;
	responseTimeInMs: number;
}

const allItems: Item[] = [];

export function create(data: Omit<Item, 'id'>) {
	const newData: Item = {
		...data,
		id: Date.now(),
		responseTimeInMs: 0
	};
	allItems.push(newData);
}

export function get(url?: string) {
	if (url) return allItems.filter((item) => item.url === url);
	return allItems;
}

export function update(url: string, data: Omit<Item, 'id'>) {}

export function remove(url: string) {
	const index = allItems.findIndex((item) => item.url === url);
	if (index !== -1) allItems.splice(index, 1);
}
