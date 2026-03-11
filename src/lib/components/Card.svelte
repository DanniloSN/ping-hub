<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
	}

	const { children, ...rest }: Props = $props();
</script>

<div {...rest} class={cn('rounded border border-slate-300 bg-white p-4', rest.class)}>
	{@render children?.()}
</div>
