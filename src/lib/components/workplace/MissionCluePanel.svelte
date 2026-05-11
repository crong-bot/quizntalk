<script>
	export let clues = [];
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div class="flex items-center justify-between">
		<div class="text-base font-extrabold text-slate-900">내 단서</div>
		<div class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
			단서 {clues.length}/{clues.length}
		</div>
	</div>

	<ul class="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-slate-700">
		{#each clues as clue}
			<li>• {clue}</li>
		{/each}
	</ul>
</div>
