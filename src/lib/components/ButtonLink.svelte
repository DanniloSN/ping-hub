<script>
	import { cn } from '$lib/utils';
	import Link from './Link.svelte';
	import { theme } from './theme';

	const { children, ...rest } = $props();
</script>

<Link {...rest} class={cn(theme.button, rest.class)}>
	{@render children?.()}
</Link>
