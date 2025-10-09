<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CardItem from '$lib/components/CardItem.svelte';

	let { data } = $props();

	async function removeItem(url: string) {
		const response = await fetch('?/remove', {
			method: 'POST',
			body: JSON.stringify({ url })
		});

		if (!response.ok) return alert('Erro ao remover o item');

		await invalidateAll();

		alert('Item removido com sucesso');
	}

	async function checkResponseTime() {
		const newItems = await Promise.all(
			data.allItems.map(async (item) => {
				const start = performance.now();
				await fetch(item.url, { method: 'HEAD', mode: 'no-cors' }).catch((error) => {});
				const end = performance.now();
				item.responseTimeInMs = Math.round(end - start);
				return item;
			})
		);

		data.allItems = newItems;
	}

	$effect(() => {
		setInterval(checkResponseTime, 10000);
	});
</script>

<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
	{#each data.allItems as item}
		<CardItem {item} {removeItem} />
	{/each}
</div>
