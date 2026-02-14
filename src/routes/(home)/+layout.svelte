<script>
	import '../../app.css';
	import Nav from '$lib/components/nav.svelte';
</script>

<div class="w-1280 m-auto">
	<!-- <div class="min-h-screen flex flex-col"> -->
	<Nav />
	<!-- <div class="relative flex flex-grow "> -->
	<main class=""><slot /></main>
	<!-- </div> -->
	<!-- </div> -->
</div>
