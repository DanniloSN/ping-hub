<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';

	export let form;
</script>

<form method="POST" class="flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Adicionar servidor</h1>
	<input name="name" placeholder="Name" required />
	<input name="url" placeholder="Url" type="url" required />
	<Button>Salvar</Button>
	{#if form?.message}
		<FormError>{form.message}</FormError>
	{/if}
</form>
