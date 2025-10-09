<script lang="ts">
	import type { Item } from '$lib/server/db';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Card from './Card.svelte';
	import Link from './Link.svelte';

	const {
		item,
		removeItem
	}: {
		item: Item;
		removeItem: (url: string) => void;
	} = $props();
</script>

<Card>
	<div class="flex items-center justify-between">
		<img class="h-5 w-5 object-cover" src={item.faviconUrl} alt={`${item.name}'s icon`} />
		<Link href={item.url} external>
			<span class="px-2 text-sm font-semibold">{item.name}</span>
		</Link>
		<button onclick={() => removeItem(item.url)} class="p-2">
			<Icon icon="ic:baseline-close" />
		</button>
	</div>
	<div
		class={cn('mt-4 w-full border-b-4 pb-1 text-center text-xs', {
			'border-green-600 text-green-600': true,
			'border-yellow-600 text-yellow-600': false,
			'border-red-600 text-red-600': false
		})}
	>
		{item.responseTimeInMs}ms
	</div>
</Card>
