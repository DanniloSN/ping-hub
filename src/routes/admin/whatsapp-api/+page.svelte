<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();
	let instanceStatus = $state(data.instanceStatus);
	let qrCode = $state('');

	async function createInstance() {
		instanceStatus = 'INSTANCE_OFFLINE';
	}

	async function connectInstance() {
		instanceStatus = 'INSTANCE_ONLINE';
	}

	async function syncConnection() {}

	async function disconnectInstance() {
		instanceStatus = 'INSTANCE_OFFLINE';
	}
</script>

{#if instanceStatus === 'INSTANCE_NOT_FOUND'}
	<p>Instância não encontrada, crie agora</p>
	<div class="mt-2">
		<Button onclick={createInstance} class="h-max">Criar instância</Button>
	</div>
{/if}

{#if instanceStatus === 'INSTANCE_OFFLINE'}
	<p>Instância offline</p>
	<div class="mt-2 flex gap-2">
		<Button onclick={connectInstance} class="h-max">
			{#if qrCode}
				<img src={qrCode} alt="QR Code" class="h-32 w-auto object-contain" />
			{:else}
				<span>Conectar Instância</span>
			{/if}
		</Button>
		<Button onclick={syncConnection} class="h-max">Sincronizar conexão</Button>
	</div>
{/if}

{#if instanceStatus === 'INSTANCE_ONLINE'}
	<p>Instância online</p>
	<div class="mt-2 flex gap-2">
		<Button onclick={disconnectInstance} class="h-max">Desconectar instância</Button>
		<Button onclick={syncConnection} class="h-max">Sincronizar conexão</Button>
	</div>
{/if}
