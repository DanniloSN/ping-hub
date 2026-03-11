<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Link from '$lib/components/Link.svelte';
	import { formatDate } from '$lib/utils';

	let { data } = $props();

	const instances = data.instances.map((instance) => {
		const url = new URL(instance.url);
		return {
			...instance,
			name: url.hostname.replace('www.', '')
		};
	});
</script>

<div class="grid gap-2">
	{#each instances as instance (instance.id)}
		<Card class="flex justify-between">
			<Link href={instance.url} external>
				<span class="truncate">{instance.id}. {instance.name}</span>
			</Link>
			<span>{formatDate(instance.createdAt)}</span>
		</Card>
	{/each}
</div>
