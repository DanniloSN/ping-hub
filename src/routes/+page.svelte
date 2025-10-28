<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CardItem from '$lib/components/CardItem/index.svelte';

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
</script>

{#if !data.instances.length}
	<p class="flex h-full items-center justify-center text-center">
		Nenhum servidor adicionado.
		<br />
		Clique em "Adicionar" para começar!
	</p>
{:else}
	<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
		{#each data.instances as instance}
			<CardItem {instance} {removeItem} />
		{/each}
	</div>
{/if}
