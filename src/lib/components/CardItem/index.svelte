<script lang="ts">
	import { checkUrlResponseTime, cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Card from '../Card.svelte';
	import Link from '../Link.svelte';

	const { instance, removeItem }: CardItemProps = $props();
	let responseTimeInMs = $state<number | null>(null);

	async function updateUrlResponseTime() {
		responseTimeInMs = await checkUrlResponseTime(instance.url);
	}

	$effect(() => {
		updateUrlResponseTime();
		setInterval(updateUrlResponseTime, 60000);
	});
</script>

<Card>
	<div class="flex items-center justify-between">
		<img class="h-5 w-5 object-cover" src={instance.favicon} alt={`${instance.name}'s icon`} />
		<Link href={instance.url} external>
			<span class="px-2 text-sm font-semibold">{instance.name}</span>
		</Link>
		<button onclick={() => removeItem(instance.url)} class="p-2">
			<Icon icon="ic:baseline-close" />
		</button>
	</div>
	<div
		class={cn('mt-4 w-full border-b-4 pb-1 text-center text-xs', {
			'border-gray-600 text-gray-600': responseTimeInMs === null,
			'border-green-600 text-green-600':
				responseTimeInMs !== null && responseTimeInMs >= 0 && responseTimeInMs < 200,
			'border-yellow-600 text-yellow-600':
				responseTimeInMs !== null && responseTimeInMs >= 200 && responseTimeInMs < 500,
			'border-red-600 text-red-600': responseTimeInMs !== null && responseTimeInMs >= 500
		})}
	>
		{#if responseTimeInMs === null}
			-
		{/if}
		{#if responseTimeInMs !== null && responseTimeInMs >= 0}
			{responseTimeInMs}ms
		{/if}
		{#if responseTimeInMs !== null && responseTimeInMs < 0}
			Não foi possível verificar
		{/if}
	</div>
</Card>
