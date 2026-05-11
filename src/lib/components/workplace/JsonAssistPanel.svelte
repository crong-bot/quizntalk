<script>
	export let keyChips = [];
	export let valueChips = [];
	export let onInsertKey = () => {};
	export let onInsertValue = () => {};
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div>
		<div class="text-base font-extrabold text-slate-900">입력 보조 키</div>
		<div class="mt-1 text-xs font-bold leading-5 text-slate-400">
			키를 누르면 에디터에 자동 입력돼요. 문자 값은 따옴표가 필요해요.
		</div>
	</div>

	<div class="mt-3">
		<div class="text-xs font-bold text-slate-400">키 Key</div>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each keyChips as key}
				<button
					type="button"
					on:click={() => onInsertKey(key)}
					class="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600 transition hover:-translate-y-0.5 hover:bg-violet-100"
				>
					{key}
				</button>
			{/each}
		</div>
	</div>

	<!-- <div class="mt-4">
		<div class="text-xs font-bold text-slate-400">값 Value</div>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each valueChips as value}
				<button
					type="button"
					on:click={() => onInsertValue(value)}
					class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
				>
					{value}
				</button>
			{/each}
		</div>
	</div> -->
</div>
