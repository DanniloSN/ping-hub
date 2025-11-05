import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateRandomToken() {
	return Math.random().toString(36).substring(2);
}

export function extractNumbers(input: string) {
	return input.replace(/\D/g, '');
}

export function formatDate(date: Date) {
	return date.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
}

export async function getFavicon(url: string) {
	try {
		const urlObj = new URL(url);
		const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

		const response = await fetch(url);
		if (!response.ok) throw new Error('Failed to fetch');
		const html = await response.text();

		const faviconPatterns = [
			/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
			/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
			/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i
		];

		for (const pattern of faviconPatterns) {
			const match = html.match(pattern);
			if (match && match[1]) {
				const faviconUrl = match[1];
				if (faviconUrl.startsWith('http')) return faviconUrl;
				if (faviconUrl.startsWith('//')) return `${urlObj.protocol}${faviconUrl}`;
				if (faviconUrl.startsWith('/')) return `${baseUrl}${faviconUrl}`;
				return `${baseUrl}/${faviconUrl}`;
			}
		}

		throw new Error('Favicon not found in HTML');
	} catch (error) {
		const urlObj = new URL(url);
		return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
	}
}
