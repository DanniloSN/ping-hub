<script>
	import { cn } from '$lib/utils/index';
</script>

<div {...$$restProps} class={cn('rounded border border-slate-300 bg-white p-4', $$restProps.class)}>
	<slot />
</div>
