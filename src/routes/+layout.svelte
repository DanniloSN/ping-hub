<script>
	import favicon from '$lib/assets/favicon.svg';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import '../app.css';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
	<a href="/">
		<h1 class="text-xl font-bold">Server Hub</h1>
	</a>
	<ButtonLink href="/add">+ Adicionar</ButtonLink>
</nav>
<main class="p-6">
	{@render children?.()}
</main>
