interface CardItemProps {
	instance: Instance;
	removeItem: (id: string) => void;
}

interface Instance {
	id: number;
	name: string;
	url: string;
	favicon: string;
}
