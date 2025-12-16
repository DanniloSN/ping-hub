<script lang="ts">
	import { cn } from '$lib/utils';
	const { responseTimeInMs }: ResponseTimelineProps = $props();
</script>

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
