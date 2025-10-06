<script>
	export let data;
</script>

<ul>
	{#each data.allItems as item}
		<li>{item.url}</li>
	{/each}
</ul>
