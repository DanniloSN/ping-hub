<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';

	const { data, form } = $props();
	const user = data.user;
</script>

<form method="POST" class="flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Configurações</h1>
	<input name="name" placeholder="Nome" defaultValue={user.name} required />
	<input name="email" placeholder="E-mail" type="email" defaultValue={user.email} required />
	<input name="phone" placeholder="Telefone" required />
	<Button>Salvar</Button>
	{#if form?.message}
		<FormError>{form.message}</FormError>
	{/if}
</form>
