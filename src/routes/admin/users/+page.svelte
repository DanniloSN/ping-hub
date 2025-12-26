<script lang="ts">
	let { data } = $props();
	const users = data.users;
</script>

<ul>
	{#each users as user}
		<li class="flex justify-between">
			<span>{user.id}. {user.name}</span>
			<span>{user.createdAt.toISOString()}</span>
		</li>
	{/each}
</ul>
