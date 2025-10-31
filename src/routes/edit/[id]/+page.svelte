<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	const { data } = $props();
	const instance = data.instance;
</script>

<form method="POST" class="flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Editar servidor</h1>
	<input name="name" placeholder="Name" defaultValue={instance.name} required />
	<input name="url" placeholder="Url" type="url" defaultValue={instance.url} required />
	<Button>Salvar</Button>
</form>
