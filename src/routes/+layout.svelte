<script>
	import { startAuthListener } from '$lib/stores/authUser';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		startAuthListener();
	});
</script>

<slot />
