<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import Link from '$lib/components/Link.svelte';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	export let data;

	async function removeItem(url: string) {
		const response = await fetch('?/remove', {
			method: 'POST',
			body: JSON.stringify({ url })
		});

		if (!response.ok) return alert('Erro ao remover o item');

		await invalidateAll();

		alert('Item removido com sucesso');
	}
</script>

<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
	{#each data.allItems as item}
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
				0ms
			</div>
		</Card>
	{/each}
</div>
