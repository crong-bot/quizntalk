<!-- src/lib/components/workplace/JsonEditorPanel.svelte -->

<script>
	import JsonCodeMirrorEditor from './JsonCodeMirrorEditor.svelte';

	export let jsonText = '';
	export let canExecute = false;

	export let title = '</> JSON 입력기';
	export let executeButtonText = '실행하기';
	export let resetButtonText = '다시하기';
	export let formatButtonText = '포맷 정리';

	export let onReady = () => {};
	export let onFormat = () => {};
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
		<div class="text-lg font-extrabold text-slate-900">{title}</div>

		<button
			type="button"
			on:click={onFormat}
			class="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
		>
			{formatButtonText}
		</button>
	</div>

	<div class="min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#101827]">
		<JsonCodeMirrorEditor
			value={jsonText}
			onChange={handleEditorChange}
			onReady={handleCodeMirrorReady}
		/>
	</div>

	<div class="mt-3 flex items-center gap-3">
		<button
			type="button"
			on:click={onReset}
			class="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
		>
			{resetButtonText}
		</button>

		<button
			type="button"
			on:click={onExecute}
			class={`h-12 rounded-2xl px-5 text-sm font-extrabold transition ${
				canExecute
					? 'bg-violet-600 text-white hover:bg-violet-700'
					: 'bg-violet-600 text-white hover:bg-violet-700'
			}`}
		>
			{executeButtonText}
		</button>
	</div>
</div>
