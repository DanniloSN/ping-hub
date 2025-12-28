<script lang="ts">
	let { data } = $props();
	const instances = data.instances;
</script>

<ul>
	{#each instances as instance}
		<li class="flex justify-between">
			<span>{instance.id}. {instance.url}</span>
			<span>{instance.createdAt.toISOString()}</span>
		</li>
	{/each}
</ul>
