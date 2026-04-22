<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();

	let input = '';

	$: $playerStore;
	$: notes = $playerStore.notes;

	function add() {
		playerStore.actions.addNote(input);
		input = '';
	}
</script>

<div
	class="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
>
	<h3 class="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">우리 팀 메모</h3>

	<div class="mt-5 grid grid-cols-1 gap-3">
		{#each notes as note}
			<div class="rounded-2xl bg-blue-50 p-4 text-[18px] font-semibold leading-7 text-slate-700">
				{note}
			</div>
		{/each}
	</div>

	<div class="mt-4 flex gap-2">
		<input
			bind:value={input}
			placeholder="팀 메모를 입력하세요"
			class="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none ring-0"
		/>
		<button
			type="button"
			on:click={add}
			class="rounded-2xl bg-violet-500 px-4 py-3 text-base font-bold text-white"
		>
			추가
		</button>
	</div>
</div>
