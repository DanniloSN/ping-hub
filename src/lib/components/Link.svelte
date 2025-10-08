<script>
	const { external = false, children, ...rest } = $props();
</script>

<a
	{...rest}
	target={external ? '_blank' : '_self'}
	rel={external ? 'noopener noreferrer' : undefined}
>
	{@render children?.()}
</a>
