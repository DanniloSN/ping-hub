<script lang="ts">
	import { cn, formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Card from '../Card.svelte';
	import Link from '../Link.svelte';

	const { instance, removeItem }: CardItemProps = $props();
	const responseTimeInMs = instance.responseTimeMs;
</script>

<Card>
	<div class="flex items-center justify-between">
		<button class="p-2">
			<Icon icon="ic:baseline-edit" />
		</button>
		<Link class="flex items-center" href={instance.url} external>
			<img class="h-5 w-5 object-cover" src={instance.favicon} alt={`${instance.name}'s icon`} />
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
	{#if instance.lastPingAt}
		<div class="mt-1 text-center text-xs">
			Último ping em: {formatDate(instance.lastPingAt)}
		</div>
	{/if}
</Card>
