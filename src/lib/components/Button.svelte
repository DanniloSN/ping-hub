<script>
	import { theme } from './theme';
</script>

<button {...$$restProps} class={theme.button}>
	<slot />
</button>
