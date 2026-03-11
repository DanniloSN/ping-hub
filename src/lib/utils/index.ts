import axios from 'axios';
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

		const response = await axios(url);
		if (response.status !== 200) throw new Error(`Failed to fetch '${url}' for favicon`);
		const html = response.data as string;

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

export function maskPhone(phone: string) {
	const onlyNumbers = extractNumbers(phone).slice(0, 13);
	if (onlyNumbers.length >= 13) {
		return onlyNumbers.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
	} else if (onlyNumbers.length >= 12) {
		return onlyNumbers.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4');
	} else if (onlyNumbers.length >= 11) {
		return onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
	} else if (onlyNumbers.length >= 7) {
		return onlyNumbers.replace(/(\d{2})(\d{5})/, '($1) $2');
	} else if (onlyNumbers.length >= 2) {
		return onlyNumbers.replace(/(\d{2})/, '($1');
	}
	return onlyNumbers;
}

export function formatPhoneToSendMessage(phone: string) {
	let fixedPhone = extractNumbers(phone);

	if (fixedPhone.startsWith('0')) {
		fixedPhone = fixedPhone.slice(1);
	}

	if (fixedPhone.length < 10) {
		throw new Error('Invalid phone number: must contain at least 10 digits');
	}

	if (!fixedPhone.startsWith('55')) {
		fixedPhone = `55${fixedPhone}`;
	}

	if (fixedPhone.length === 12) {
		fixedPhone = fixedPhone.slice(0, 4) + '9' + fixedPhone.slice(4);
	}

	return fixedPhone;
}
