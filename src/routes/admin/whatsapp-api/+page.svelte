<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import axios from 'axios';

	let { data } = $props();
	let instanceStatus = $state(data.instanceStatus);
	let qrCode = $state('');

	async function createInstance() {
		axios.post('/api/whatsapp-api/create-user-instance').then(() => {
			invalidate('/admin/whatsapp-api');
		});
	}

	async function connectInstance() {
		axios.get('/api/whatsapp-api/generate-qr-code').then((response) => {
			qrCode = response.data.qrCode;
		});
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
		{#if qrCode}
			<img src={qrCode} alt="QR Code" class="h-32 w-auto object-contain" />
		{:else}
			<Button onclick={connectInstance} class="h-max">
				<span>Conectar Instância</span>
			</Button>
		{/if}
	</div>
{/if}

{#if instanceStatus === 'INSTANCE_ONLINE'}
	<p>Instância online</p>
{/if}
