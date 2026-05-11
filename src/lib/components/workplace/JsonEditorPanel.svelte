<script>
	import JsonCodeMirrorEditor from './JsonCodeMirrorEditor.svelte';

	export let jsonText = '';
	export let canExecute = false;

	export let onReady = () => {};
	export let onFormat = () => {};
	export let onCheck = () => {};
	export let onExecute = () => {};
	export let onReset = () => {};

	function handleCodeMirrorReady(api) {
		onReady({
			insertAtCursor: api.insertAtCursor
		});
	}

	function handleEditorChange(nextValue) {
		jsonText = nextValue;
	}
</script>

<div
	class="flex min-h-0 flex-1 flex-col rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
>
	<div class="mb-3 flex items-center justify-between">
		<div class="text-lg font-extrabold text-slate-900">&lt;/&gt; JSON 입력기</div>

		<button
			type="button"
			on:click={onFormat}
			class="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
		>
			포맷 정리
		</button>
	</div>

	<div class="min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#101827]">
		<JsonCodeMirrorEditor
			value={jsonText}
			onChange={handleEditorChange}
			onReady={handleCodeMirrorReady}
		/>
	</div>

	{#if canExecute}
		<div
			class="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
		>
			검사 성공! 이제 실행하면 전력 시스템이 공용 월드에 반영돼요.
		</div>
	{:else}
		<div
			class="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"
		>
			아직 완성되지 않았어요. 단서를 보고 마지막 값을 입력하세요.
		</div>
	{/if}

	<div class="mt-3 flex items-center gap-3">
		<button
			type="button"
			on:click={onReset}
			class="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
		>
			다시하기
		</button>

		<button
			type="button"
			on:click={onCheck}
			class="h-12 flex-1 rounded-2xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
		>
			검사하기
		</button>

		<button
			type="button"
			disabled={!canExecute}
			on:click={onExecute}
			class={`h-12 rounded-2xl px-5 text-sm font-extrabold transition ${
				canExecute
					? 'bg-violet-600 text-white hover:bg-violet-700'
					: 'cursor-not-allowed bg-slate-200 text-slate-400'
			}`}
		>
			{canExecute ? '실행하기' : '🔒 실행하기'}
		</button>
	</div>
</div>
