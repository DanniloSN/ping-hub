<script lang="ts">
	import { cn } from '$lib/utils';
	import { SLOW_RESPONSE_THRESHOLD_MS, TOO_SLOW_RESPONSE_THRESHOLD_MS } from '$lib/utils/static';

	interface Props {
		responseTimeInMs: number | null;
	}

	const { responseTimeInMs }: Props = $props();
</script>

<div
	class={cn('mt-4 w-full border-b-4 pb-1 text-center text-xs', {
		'border-gray-600 text-gray-600': responseTimeInMs === null,
		'border-green-600 text-green-600':
			responseTimeInMs !== null &&
			responseTimeInMs >= 0 &&
			responseTimeInMs < SLOW_RESPONSE_THRESHOLD_MS,
		'border-yellow-600 text-yellow-600':
			responseTimeInMs !== null &&
			responseTimeInMs >= SLOW_RESPONSE_THRESHOLD_MS &&
			responseTimeInMs < TOO_SLOW_RESPONSE_THRESHOLD_MS,
		'border-red-600 text-red-600':
			responseTimeInMs !== null && responseTimeInMs >= TOO_SLOW_RESPONSE_THRESHOLD_MS
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
