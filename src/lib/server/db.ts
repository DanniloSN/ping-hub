const allItems = [];

export function create(data: any) {
	const newData = { id: Date.now(), ...data };
	allItems.push(newData);
}

export function get(url?: string) {
	if (url) return allItems.find((item) => item.url === url);
	return allItems;
}

export function update(url: string, data: any) {}

export function remove(url: string) {
	const index = allItems.findIndex((item) => item.url === url);
	if (index !== -1) allItems.splice(index, 1);
}
