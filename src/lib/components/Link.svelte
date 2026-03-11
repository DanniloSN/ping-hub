<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		children?: Snippet;
		external?: boolean;
	}

	const { external = false, children, ...rest }: Props = $props();
</script>

<a
	{...rest}
	target={external ? '_blank' : '_self'}
	rel={external ? 'noopener noreferrer' : undefined}
>
	{@render children?.()}
</a>
