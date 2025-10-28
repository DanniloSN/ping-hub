<script>
	import { cn } from '$lib/utils';
	import { theme } from './theme';

	const { children, ...rest } = $props();
</script>

<button {...rest} class={cn(theme.button, rest.class)}>
	{@render children?.()}
</button>
