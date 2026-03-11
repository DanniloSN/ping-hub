<script lang="ts">
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Card from './Card.svelte';
	import Link from './Link.svelte';
	import ResponseTimeline from './ResponseTimeline.svelte';

	interface Instance {
		id: number;
		name: string;
		url: string;
		favicon: string;
		responseTimeMs: number | null;
		lastPingAt: Date | null;
	}

	interface Props {
		instance: Instance;
		removeItem: (id: string) => void;
	}

	const { instance, removeItem }: Props = $props();
	const responseTimeInMs = instance.responseTimeMs;

	function confirmRemove() {
		if (confirm(`Tem certeza que deseja remover a instância "${instance.name}"?`)) {
			removeItem(instance.url);
		}
	}
</script>

<Card>
	<div class="flex items-center justify-between">
		<Link class="flex items-center" href={`/edit/${instance.id}`}>
			<img class="h-5 w-5 object-cover" src={instance.favicon} alt={`${instance.name}'s icon`} />
			<span class="pl-2 text-sm font-semibold">{instance.name}</span>
		</Link>
		<div class="flex">
			<Link href={instance.url} class="-scale-x-100 p-2" external>
				<Icon icon="gridicons:external" />
			</Link>
			<button onclick={confirmRemove} class="cursor-pointer p-2">
				<Icon icon="ic:baseline-close" />
			</button>
		</div>
	</div>
	<ResponseTimeline {responseTimeInMs} />
	{#if instance.lastPingAt}
		<div class="mt-1 text-center text-xs">
			Último ping em: {formatDate(instance.lastPingAt)}
		</div>
	{/if}
</Card>
