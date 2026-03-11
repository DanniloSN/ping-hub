<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { theme } from './theme';

	interface Props extends HTMLButtonAttributes {
		children?: Snippet;
	}

	const { children, ...rest }: Props = $props();
</script>

<button {...rest} class={cn(theme.button, rest.class)}>
	{@render children?.()}
</button>
