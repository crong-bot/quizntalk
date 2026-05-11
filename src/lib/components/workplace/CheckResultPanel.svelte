<script>
	export let messages = [];

	function getMessageClass(type) {
		if (type === 'success') return 'bg-emerald-50 text-emerald-700';
		if (type === 'warning') return 'bg-amber-50 text-amber-700';
		return 'bg-rose-50 text-rose-700';
	}

	function getIcon(type) {
		if (type === 'success') return '✓';
		if (type === 'warning') return '!';
		return '×';
	}
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div class="text-base font-extrabold text-slate-900">검사 결과</div>

	<div class="mt-3 space-y-2 text-sm font-bold">
		{#each messages as message}
			<div class={`rounded-xl px-3 py-2 ${getMessageClass(message.type)}`}>
				{getIcon(message.type)}
				{message.text}
			</div>
		{/each}
	</div>
</div>
