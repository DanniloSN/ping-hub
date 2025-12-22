<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import ResponseTimeline from '$lib/components/ResponseTimeline/index.svelte';
	import { maskPhone } from '$lib/utils/index.js';
	import { SLOW_RESPONSE_THRESHOLD_MS, TOO_SLOW_RESPONSE_THRESHOLD_MS } from '$lib/utils/static.js';

	const { data, form } = $props();
	const user = data.user;
</script>

<h1 class="text-lg font-semibold">Configurações</h1>

<form method="POST">
	<div class="mt-4 flex flex-col gap-2">
		<h1 class="text-lg font-semibold">Notificações</h1>
		<ul class="grid grid-cols-1 gap-2 md:grid-cols-3">
			<label for="settingsSlowResponse">
				<Card>
					<div class="flex items-center gap-2">
						<input
							id="settingsSlowResponse"
							type="checkbox"
							defaultChecked={user.settings?.slowResponse ?? false}
							name="settingsSlowResponse"
						/>
						<p>Resposta lenta</p>
					</div>
					<ResponseTimeline responseTimeInMs={SLOW_RESPONSE_THRESHOLD_MS} />
				</Card>
			</label>
			<label for="settingsTooSlowResponse">
				<Card>
					<div class="flex items-center gap-2">
						<input
							id="settingsTooSlowResponse"
							type="checkbox"
							defaultChecked={user.settings?.tooSlowResponse ?? false}
							name="settingsTooSlowResponse"
						/>
						<p>Resposta muito lenta</p>
					</div>
					<ResponseTimeline responseTimeInMs={TOO_SLOW_RESPONSE_THRESHOLD_MS} />
				</Card>
			</label>
			<label for="settingsNoResponse">
				<Card>
					<div class="flex items-center gap-2">
						<input
							id="settingsNoResponse"
							type="checkbox"
							defaultChecked={user.settings?.noResponse ?? false}
							name="settingsNoResponse"
						/>
						<p>Sem resposta</p>
					</div>
					<ResponseTimeline responseTimeInMs={null} />
				</Card>
			</label>
		</ul>
	</div>
	<div class="mt-4 flex flex-col gap-2">
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
	</div>
</form>
