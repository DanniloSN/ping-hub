<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import { MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '$lib/utils/static';
</script>

<form method="POST" class="flex flex-col gap-2">
	<input name="name" placeholder="Nome" minlength={MIN_NAME_LENGTH} required />
	<input name="email" placeholder="Email" type="email" required />
	<input
		name="password"
		placeholder="Senha"
		type="password"
		minlength={MIN_PASSWORD_LENGTH}
		required
	/>
	<Button>Criar conta</Button>
	<ButtonLink href="/login">Já tenho conta</ButtonLink>
</form>
