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
	class="flex min-h-0 flex-1 flex-col rounded-[24px] border border-slate-200 bg-white p-3.5 shadow-sm"
>
	<div class="mb-2.5 flex items-center justify-between gap-3">
		<div class="min-w-0">
			<!-- <div class="text-[10px] font-black tracking-[0.16em] text-violet-500">
				JSON EDITOR
			</div> -->

			<div class="mt-0.5 truncate text-[15px] font-black tracking-[-0.04em] text-slate-900">
				{title}
			</div>
		</div>

		<button
			type="button"
			on:click={onFormat}
			class="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black text-slate-500 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
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

	<div class="mt-2.5 flex items-center justify-end gap-2">
		<button
			type="button"
			on:click={onReset}
			class="h-9 rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-extrabold text-slate-600 transition hover:bg-slate-50"
		>
			{resetButtonText}
		</button>

		<button
			type="button"
			on:click={onExecute}
			class={`h-9 rounded-xl px-4 text-[12px] font-extrabold shadow-[0_8px_18px_rgba(124,58,237,0.2)] transition ${
				canExecute
					? 'bg-violet-600 text-white hover:bg-violet-700'
					: 'bg-violet-600 text-white hover:bg-violet-700'
			}`}
		>
			{executeButtonText}
		</button>
	</div>
</div>