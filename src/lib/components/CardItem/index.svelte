<script lang="ts">
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Card from '../Card.svelte';
	import Link from '../Link.svelte';
	import ResponseTimeline from '../ResponseTimeline/index.svelte';

	const { instance, removeItem }: CardItemProps = $props();
	const responseTimeInMs = instance.responseTimeMs;
</script>

<Card>
	<div class="flex items-center justify-between">
		<Link href={instance.url} class="-scale-x-100 p-2" external>
			<Icon icon="gridicons:external" />
		</Link>
		<Link class="flex items-center" href={`/edit/${instance.id}`}>
			<img class="h-5 w-5 object-cover" src={instance.favicon} alt={`${instance.name}'s icon`} />
			<span class="px-2 text-sm font-semibold">{instance.name}</span>
		</Link>
		<button onclick={() => removeItem(instance.url)} class="p-2">
			<Icon icon="ic:baseline-close" />
		</button>
	</div>
	<ResponseTimeline {responseTimeInMs} />
	{#if instance.lastPingAt}
		<div class="mt-1 text-center text-xs">
			Último ping em: {formatDate(instance.lastPingAt)}
		</div>
	{/if}
</Card>
