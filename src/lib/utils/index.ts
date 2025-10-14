import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function checkUrlResponseTime(url: string) {
	try {
		const start = performance.now();
		await fetch(url).catch(() => {});
		const end = performance.now();
		return Math.round(end - start);
	} catch (error) {
		return null;
	}
}
