<script>
	import favicon from '$lib/assets/favicon.ico';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import Icon from '@iconify/svelte';
	import '../app.css';

	const { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col overflow-hidden">
	<div class="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
		<a href="/">
			<h1 class="text-xl font-bold">Ping Hub</h1>
		</a>
		<nav class="flex gap-2">
			<ButtonLink class="flex items-center gap-2" href="/add">
				<Icon class="text-lg" icon="ic:baseline-add" />
				<span class="hidden md:block">Adicionar</span>
			</ButtonLink>
			{#if data.loggedUser}
				<ButtonLink class="flex items-center gap-2" href="/settings">
					<Icon class="text-lg" icon="ic:round-settings" />
					<span class="hidden md:block">Configurações</span>
				</ButtonLink>
				<form method="POST" action="?/logout">
					<Button class="flex items-center gap-2">
						<Icon class="text-lg" icon="ic:round-logout" />
						<span class="hidden md:block">Sair</span>
					</Button>
				</form>
			{:else}
				<ButtonLink class="flex items-center gap-2" href="/login">
					<Icon class="text-lg" icon="ic:round-login" />
					<span class="hidden md:block">Entrar</span>
				</ButtonLink>
			{/if}
		</nav>
	</div>
	<main class="h-full overflow-auto bg-slate-200 p-4">
		<div class="h-full w-full md:m-auto md:max-w-3xl">
			{@render children?.()}
		</div>
	</main>
</div>
