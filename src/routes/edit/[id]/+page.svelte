<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';

	const { data, form } = $props();
	const instance = data.instance;
</script>

<form method="POST" class="flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Editar servidor</h1>
	<input name="name" placeholder="Nome" defaultValue={instance.name} required />
	<input name="url" placeholder="Url" type="url" defaultValue={instance.url} required />
	<Button>Salvar</Button>
	{#if form?.message}
		<FormError>{form.message}</FormError>
	{/if}
</form>
