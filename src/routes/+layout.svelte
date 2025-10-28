<script>
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import Icon from '@iconify/svelte';
	import '../app.css';

	const { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<nav class="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
	<a href="/">
		<h1 class="text-xl font-bold">Server Hub</h1>
	</a>
	<nav class="flex gap-2">
		<ButtonLink class="flex items-center gap-2" href="/add">
			<Icon icon="ic:baseline-add" />
			Adicionar
		</ButtonLink>
		{#if data.loggedUser}
			<form method="POST" action="?/logout">
				<Button class="flex items-center gap-2">
					<Icon icon="ic:round-logout" />
					Sair
				</Button>
			</form>
		{:else}
			<ButtonLink class="flex items-center gap-2" href="/login">
				<Icon icon="ic:round-login" />
				Entrar
			</ButtonLink>
		{/if}
	</nav>
</nav>
<main class="p-6">
	{@render children?.()}
</main>
