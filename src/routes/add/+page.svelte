<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>

<form method="POST" class="flex flex-col gap-2">
	<input name="name" placeholder="Name" required />
	<input name="url" placeholder="Url" type="url" required />
	<Button>Salvar</Button>
</form>
