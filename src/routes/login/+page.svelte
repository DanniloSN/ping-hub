<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<form method="POST" class="flex flex-col gap-2">
	<input name="email" placeholder="Email" type="email" required />
	<input name="password" placeholder="Senha" type="password" required />
	<Button>Entrar</Button>
</form>
