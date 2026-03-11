<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { formatDate } from '$lib/utils';

	let { data } = $props();
	const users = data.users;
</script>

<div class="grid gap-2">
	{#each users as user (user.id)}
		<Card class="flex justify-between">
			<span class="truncate">{user.id}. {user.name}</span>
			<span>{formatDate(user.createdAt)}</span>
		</Card>
	{/each}
</div>
