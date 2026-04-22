<script>
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let transition_delay;

	function handleLoad() {
		window.dispatchEvent(new CustomEvent('lesson:scroll-bottom'));
	}

	function handleIntroEnd() {
		window.dispatchEvent(new CustomEvent('lesson:scroll-bottom'));
	}
</script>

<div
	id="bubble"
	on:introend={handleIntroEnd}
	in:scale={{
		delay: transition_delay,
		duration: 400,
		easing: quintOut
	}}
	out:scale={{
		delay: 0,
		duration: 0
	}}
	class="flex justify-center py-8"
>
	<img src="/heartNumber.png" alt="heartNumber" on:load={handleLoad} />
</div>
