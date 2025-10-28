<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
</script>

<form method="POST" class="flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Entrar</h1>
	<input name="email" placeholder="Email" type="email" required />
	<input name="password" placeholder="Senha" type="password" required />
	<Button>Entrar</Button>
	<ButtonLink href="/register">Não tenho conta</ButtonLink>
</form>
