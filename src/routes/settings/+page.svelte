<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import ResponseTimeline from '$lib/components/ResponseTimeline/index.svelte';
	import { maskPhone } from '$lib/utils/index.js';

	const { data, form } = $props();
	const user = data.user;
</script>

<h1 class="text-lg font-semibold">Configurações</h1>

<form action="" class="mt-4 flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Notificações</h1>
	<ul class="grid grid-cols-1 gap-2 md:grid-cols-3">
		<label for="slow">
			<Card>
				<div class="flex items-center gap-2">
					<input id="slow" type="checkbox" />
					<p>Resposta lenta</p>
				</div>
				<ResponseTimeline responseTimeInMs={200} />
			</Card>
		</label>
		<label for="too-slow">
			<Card>
				<div class="flex items-center gap-2">
					<input id="too-slow" type="checkbox" />
					<p>Resposta muito lenta</p>
				</div>
				<ResponseTimeline responseTimeInMs={500} />
			</Card>
		</label>
		<label for="no-response">
			<Card>
				<div class="flex items-center gap-2">
					<input id="no-response" type="checkbox" />
					<p>Sem resposta</p>
				</div>
				<ResponseTimeline responseTimeInMs={null} />
			</Card>
		</label>
	</ul>
</form>

<form method="POST" class="mt-4 flex flex-col gap-2">
	<h1 class="text-lg font-semibold">Seus Dados</h1>
	<input name="name" placeholder="Nome" defaultValue={user.name} required />
	<input name="email" placeholder="E-mail" type="email" defaultValue={user.email} required />
	<input
		name="phone"
		placeholder="Telefone"
		defaultvalue={user.phone}
		maxlength="15"
		oninput={(event) => (event.currentTarget.value = maskPhone(event.currentTarget.value))}
		required
	/>
	<Button>Salvar</Button>
	{#if form?.message}
		<FormError>{form.message}</FormError>
	{/if}
</form>
