<!-- src/lib/components/workplace/ReadMissionPanel.svelte -->
<script>
	import JsonCodeMirrorEditor from './JsonCodeMirrorEditor.svelte';

	export let clues = [];
	export let question = '';
	export let answerText = '';
	export let status = 'editing';
	export let logs = [];

	export let onReady = () => {};
	export let onFormat = () => {};
	export let onSubmit = () => {};
	export let onReset = () => {};

	$: latestLog = logs?.[0] ?? null;

	$: safeClues = Array.isArray(clues) ? clues : [];
	$: jsonClues = safeClues.filter(
		(clue) => clue && typeof clue === 'object' && clue.type === 'json'
	);
	$: textClues = safeClues.filter((clue) => typeof clue === 'string');

	function handleAnswerChange(nextValue) {
		answerText = nextValue;
	}

	function getJsonClueData(clue) {
		return clue?.data ?? clue?.json ?? clue?.value ?? {};
	}

	function stringifyJson(value) {
		if (typeof value === 'string') {
			try {
				return JSON.stringify(JSON.parse(value), null, 2);
			} catch {
				return value;
			}
		}

		return JSON.stringify(value ?? {}, null, 2);
	}

	function tokenizeJsonLine(line) {
		const tokens = [];
		const pattern =
			/("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false)\b|\b(null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

		let lastIndex = 0;
		let match;

		while ((match = pattern.exec(line)) !== null) {
			if (match.index > lastIndex) {
				tokens.push({
					type: 'plain',
					text: line.slice(lastIndex, match.index)
				});
			}

			const [raw, stringValue, colon, booleanValue, nullValue] = match;

			if (stringValue && colon) {
				tokens.push({
					type: 'key',
					text: stringValue
				});
				tokens.push({
					type: 'plain',
					text: colon
				});
			} else if (stringValue) {
				tokens.push({
					type: 'string',
					text: stringValue
				});
			} else if (booleanValue) {
				tokens.push({
					type: 'boolean',
					text: raw
				});
			} else if (nullValue) {
				tokens.push({
					type: 'null',
					text: raw
				});
			} else {
				tokens.push({
					type: 'number',
					text: raw
				});
			}

			lastIndex = pattern.lastIndex;
		}

		if (lastIndex < line.length) {
			tokens.push({
				type: 'plain',
				text: line.slice(lastIndex)
			});
		}

		return tokens.length > 0 ? tokens : [{ type: 'plain', text: line || ' ' }];
	}

	function getJsonLines(value) {
		return stringifyJson(value)
			.split('\n')
			.map((line, index) => ({
				id: index,
				number: index + 1,
				tokens: tokenizeJsonLine(line)
			}));
	}

	function getTokenClass(type) {
		if (type === 'key') return 'text-sky-300';
		if (type === 'string') return 'text-emerald-300';
		if (type === 'number') return 'text-amber-300';
		if (type === 'boolean') return 'text-violet-300';
		if (type === 'null') return 'text-red-300';
		return 'text-slate-300';
	}

	function getResultClass(type) {
		if (type === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
		if (type === 'error') return 'border-rose-200 bg-rose-50 text-rose-700';
		if (type === 'warning') return 'border-amber-200 bg-amber-50 text-amber-700';
		if (type === 'info') return 'border-blue-200 bg-blue-50 text-blue-700';

		if (status === 'cleared') return 'border-emerald-200 bg-emerald-50 text-emerald-700';

		return 'border-slate-200 bg-slate-50 text-slate-500';
	}
</script>

<div class="flex min-h-0 flex-1 flex-col gap-3">
	<section
		class="flex min-h-0 flex-[1.05] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
	>
		<div class="shrink-0 border-b border-slate-100 px-4 py-3">
			<!-- <div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-violet-500">
				JSON CLUE
			</div> -->

			<div class="mt-1 flex items-center justify-between gap-3">
				<div class="font-gmarket text-[18px] font-bold tracking-[-0.05em] text-slate-950">
					읽기 전용 JSON 단서
				</div>

				<div class="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-black text-violet-600">
					READ ONLY
				</div>
			</div>
		</div>

		<div class="thin-scroll min-h-0 flex-1 overflow-auto bg-slate-950 p-3">
			{#if jsonClues.length > 0}
				<div class="space-y-3">
					{#each jsonClues as clue}
						<div
							class="w-max min-w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
						>
							<div class="flex items-center justify-between border-b border-white/10 px-3 py-2">
								<div class="text-[12px] font-black text-emerald-300">
									{clue.title ?? 'JSON 단서'}
								</div>

								<div
									class="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-slate-300"
								>
									JSON
								</div>
							</div>

							<div class="min-w-max bg-slate-950 py-2 font-mono">
								{#each getJsonLines(getJsonClueData(clue)) as line}
									<div
										class="grid min-h-[22px] w-max min-w-full grid-cols-[34px_max-content] hover:bg-white/[0.045]"
									>
										<div
											class="select-none border-r border-slate-700/60 pr-2 text-right text-[10px] font-black leading-[22px] text-slate-500"
										>
											{line.number}
										</div>

										<code
											class="block whitespace-pre pl-3 pr-8 text-[12px] font-bold leading-[22px]"
										>
											{#each line.tokens as token}
												<span class={getTokenClass(token.type)}>{token.text}</span>
											{/each}
										</code>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else if textClues.length > 0}
				<div class="space-y-2">
					{#each textClues as clue, index}
						<div
							class="flex items-start gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2"
						>
							<div
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[11px] font-black text-white"
							>
								{String(index + 1).padStart(2, '0')}
							</div>

							<div class="min-w-0 flex-1 text-xs font-bold leading-5 text-slate-200">
								{clue}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="rounded-2xl bg-slate-900 px-3 py-4 text-xs font-bold leading-5 text-slate-400">
					표시할 JSON 단서가 없습니다.
				</div>
			{/if}
		</div>
	</section>

	<section
		class="flex min-h-0 flex-[0.95] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
	>
		<div class="shrink-0 border-b border-slate-100 px-4">
			<!-- <div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-blue-500">
				ANSWER CONSOLE
			</div> -->

			<!-- <div class="mt-1 font-gmarket text-[18px] font-bold tracking-[-0.05em] text-slate-950">
				정답 제출 콘솔
			</div> -->

			{#if question}
				<div
					class="mt-2 rounded-2xl bg-blue-50 px-3 py-1 text-[13px] font-bold leading-5 text-blue-700"
				>
					{question}
				</div>
			{/if}
		</div>

		<div class="min-h-0 flex-1 overflow-hidden bg-[#101827]">
			<JsonCodeMirrorEditor bind:value={answerText} onChange={handleAnswerChange} {onReady} />
		</div>

		<div class="shrink-0 border-t border-slate-100 bg-white p-3">
			<div
				class={`mb-3 min-h-[44px] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-[13px] font-extrabold leading-5 ${getResultClass(
					latestLog?.type
				)}`}
			>
				{#if latestLog?.text}
					{latestLog.text}
				{:else}
					위 JSON 단서를 읽고, 분석 결과를 아래 형식에 맞게 제출하세요.
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<button
					type="button"
					on:click={onFormat}
					class="h-10 rounded-xl bg-slate-100 px-3 text-[12px] font-extrabold text-slate-600 transition hover:bg-slate-200"
				>
					포맷 정리
				</button>

				<button
					type="button"
					on:click={onReset}
					class="h-10 rounded-xl bg-slate-100 px-3 text-[12px] font-extrabold text-slate-600 transition hover:bg-slate-200"
				>
					처음코드로
				</button>

				<button
					type="button"
					on:click={onSubmit}
					class="ml-auto h-10 rounded-xl bg-blue-600 px-4 text-[13px] font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
				>
					분석 결과 제출
				</button>
			</div>
		</div>
	</section>
</div>

<style>
	.thin-scroll {
		scrollbar-width: thin;
		scrollbar-color: rgba(148, 163, 184, 0.55) transparent;
	}

	.thin-scroll::-webkit-scrollbar {
		width: 5px;
		height: 5px;
	}

	.thin-scroll::-webkit-scrollbar-track {
		background: transparent;
	}

	.thin-scroll::-webkit-scrollbar-thumb {
		border-radius: 999px;
		background: rgba(148, 163, 184, 0.55);
	}

	.thin-scroll::-webkit-scrollbar-thumb:hover {
		background: rgba(100, 116, 139, 0.75);
	}
</style>
