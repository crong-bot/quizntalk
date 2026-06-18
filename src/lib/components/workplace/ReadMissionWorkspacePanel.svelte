<!-- src/lib/components/workplace/ReadMissionWorkspacePanel.svelte -->
<script>
	import TeamExecutionBoard from './TeamExecutionBoard.svelte';

	export let clues = [];
	export let question = '';
	export let answerText = '';
	export let status = 'editing';
	export let logs = [];

	export let players = [];
	export let currentPlayerId = '';
	export let currentMissionIndex = 0;
	export let verificationEnergy = 5;
	export let maxVerificationEnergy = 5;
	export let maxPlayers = 4;

	export let missionTitle = '';
	export let roleName = '';
	export let playerName = '';
	export let image = '';
	export let imageAlt = '미션 이미지';

	export let onSubmit = () => {};
	export let onReset = () => {};

	export let submitButtonText = '분석 결과 제출';

	// 화면에는 일반 정답칸처럼 보이지만,
	// 내부 제출값은 기존 검증 로직을 위해 JSON 문자열로 유지
	export let answerFields = [];

	let formAnswer = {};
	let lastParsedAnswerText = '';
	$: latestLog = logs?.[0] ?? null;

	$: safeClues = Array.isArray(clues) ? clues : [];

	$: jsonClues = safeClues.filter(
		(clue) => clue && typeof clue === 'object' && clue.type === 'json'
	);

	$: textClues = safeClues.filter((clue) => typeof clue === 'string');

	$: safeAnswerFields =
		Array.isArray(answerFields) && answerFields.length > 0
			? answerFields.map((field) => {
					if (typeof field === 'string') {
						return {
							key: field,
							label: field,
							placeholder: `${field}을 입력하세요.`,
							multiline: false
						};
					}

					return {
						key: field.key,
						label: field.label ?? field.key,
						placeholder: field.placeholder ?? `${field.label ?? field.key}을 입력하세요.`,
						multiline: field.multiline ?? false
					};
			  })
			: [
					{
						key: '정답',
						label: '정답',
						placeholder: '정답을 입력하세요.',
						multiline: false
					}
			  ];

	$: if (answerText && answerText !== lastParsedAnswerText) {
		lastParsedAnswerText = answerText;

		try {
			const parsed = JSON.parse(answerText);

			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				formAnswer = {
					...formAnswer,
					...parsed
				};
			}
		} catch {
			const firstKey = safeAnswerFields[0]?.key ?? '정답';

			formAnswer = {
				...formAnswer,
				[firstKey]: answerText
			};
		}
	}

	function updateAnswerField(key, value) {
		formAnswer = {
			...formAnswer,
			[key]: value
		};

		answerText = JSON.stringify(formAnswer, null, 2);
		lastParsedAnswerText = answerText;
	}

	function resetAnswer() {
		formAnswer = {};

		answerText = JSON.stringify(
			Object.fromEntries(safeAnswerFields.map((field) => [field.key, ''])),
			null,
			2
		);

		lastParsedAnswerText = answerText;
		onReset();
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

<div class="grid h-full min-h-0 grid-cols-[320px_650px_420px] gap-4">
	<!-- 왼쪽: 이미지 + 팀 실행 보드 -->
	<aside class="flex min-h-0 flex-col gap-4">
		<section
			class="shrink-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
		>
			<div class="border-b border-slate-100 px-4 py-3">
				<div class="font-gmarket text-[18px] font-black tracking-[-0.05em] text-slate-950">
					상황 이미지
				</div>
			</div>

			<div class="bg-slate-100 p-3">
				{#if image}
					<img src={image} alt={imageAlt} class="h-[250px] w-full rounded-[18px] object-cover" />
				{:else}
					<div
						class="flex h-[250px] w-full items-center justify-center rounded-[18px] bg-slate-900 text-center"
					>
						<div>
							<div class="text-5xl">🧩</div>
							<div class="mt-3 text-[13px] font-black text-slate-300">미션 상황 이미지</div>
						</div>
					</div>
				{/if}
			</div>
		</section>

		<div class="min-h-0 flex-1 overflow-hidden">
			<TeamExecutionBoard
				{players}
				{currentPlayerId}
				{currentMissionIndex}
				{verificationEnergy}
				{maxVerificationEnergy}
				{maxPlayers}
				layout="vertical"
			/>
		</div>
	</aside>

	<!-- 가운데: JSON 조각 단서 -->
	<section
		class="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-slate-800 bg-slate-950 shadow-sm"
	>
		<div class="shrink-0 border-b border-white/10 px-4 py-3">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="text-[11px] font-black tracking-[0.16em] text-emerald-300">JSON CLUE</div>

					<div class="mt-1 font-gmarket text-[20px] font-black tracking-[-0.05em] text-white">
						JSON 조각 단서
					</div>
				</div>

				<div class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-slate-300">
					READ ONLY
				</div>
			</div>
		</div>

		<div class="thin-scroll min-h-0 flex-1 overflow-auto p-3">
			{#if jsonClues.length > 0}
				<div class="space-y-3">
					{#each jsonClues as clue}
						<div
							class="w-max min-w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
						>
							<div class="flex items-center justify-between border-b border-white/10 px-3 py-2">
								<div class="text-[14px] font-black text-emerald-300">
									{clue.title ?? 'JSON 단서'}
								</div>

								<div
									class="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-slate-300"
								>
									JSON
								</div>
							</div>

							<div class="min-w-max bg-slate-950 py-3 font-mono">
								{#each getJsonLines(getJsonClueData(clue)) as line}
									<div
										class="grid min-h-[28px] w-max min-w-full grid-cols-[42px_max-content] hover:bg-white/[0.045]"
									>
										<div
											class="select-none border-r border-slate-700/60 pr-2 text-right text-[11px] font-black leading-[28px] text-slate-500"
										>
											{line.number}
										</div>

										<code
											class="block whitespace-pre pl-3 pr-8 text-[15px] font-bold leading-[28px]"
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
							class="flex items-start gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3"
						>
							<div
								class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[11px] font-black text-white"
							>
								{String(index + 1).padStart(2, '0')}
							</div>

							<div class="min-w-0 flex-1 text-[14px] font-bold leading-6 text-slate-200">
								{clue}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="rounded-2xl bg-slate-900 px-3 py-4 text-sm font-bold leading-6 text-slate-400">
					표시할 JSON 단서가 없습니다.
				</div>
			{/if}
		</div>
	</section>

	<!-- 오른쪽: 설명 + 정답 입력 -->
	<section class="flex min-h-0 flex-col gap-4">
		<div class="shrink-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="text-[11px] font-black tracking-[0.16em] text-blue-500">MISSION GUIDE</div>

			<div
				class="mt-2 font-gmarket text-[24px] font-black leading-tight tracking-[-0.06em] text-slate-950"
			>
				이번 미션에서 해야 할 일!
			</div>

			{#if question}
				<div
					class="mt-4 rounded-[22px] border-2 border-blue-200 bg-blue-50 p-4 shadow-[0_10px_24px_rgba(37,99,235,0.10)]"
				>
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm"
						>
							?
						</div>

						<div class="min-w-0 flex-1">
							<div class="mt-1 text-[19px] font-black leading-7 tracking-[-0.04em] text-slate-950">
								{question}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<div class="mt-4 rounded-2xl bg-slate-50 p-4">
				<div class="text-[13px] font-black text-slate-700">진행 순서</div>

				<ol class="mt-3 flex flex-col gap-2">
					<li class="flex gap-2 text-[13px] font-bold leading-5 text-slate-600">
						<span
							class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white"
						>
							1
						</span>
						<span>가운데 JSON 조각 단서를 읽습니다.</span>
					</li>

					<li class="flex gap-2 text-[13px] font-bold leading-5 text-slate-600">
						<span
							class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white"
						>
							2
						</span>
						<span>질문에서 요구하는 값을 찾습니다.</span>
					</li>

					<li class="flex gap-2 text-[13px] font-bold leading-5 text-slate-600">
						<span
							class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white"
						>
							3
						</span>
						<span>아래 정답 입력칸에 답을 적고 제출합니다.</span>
					</li>
				</ol>
			</div>
		</div>

		<div
			class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
		>
			<div class="shrink-0 border-b border-slate-100 px-4 py-3">
				<div class="font-gmarket text-[19px] font-black tracking-[-0.05em] text-slate-950">
					정답 입력
				</div>

				<!-- <div class="mt-1 text-[12px] font-bold text-slate-400">찾은 답을 짧게 적어 제출하세요.</div> -->
			</div>

			<div class="flex min-h-0 flex-1 flex-col p-4">
				<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-auto">
					{#each safeAnswerFields as field}
						<div>
							<label class="mb-1.5 block text-[13px] font-black text-slate-700">
								{field.label ?? field.key}
							</label>

							{#if field.multiline}
								<textarea
									rows="2"
									value={formAnswer[field.key] ?? ''}
									on:input={(event) => updateAnswerField(field.key, event.currentTarget.value)}
									class="h-[76px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[16px] font-bold leading-6 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
								></textarea>
							{:else}
								<input
									type="text"
									value={formAnswer[field.key] ?? ''}
									on:input={(event) => updateAnswerField(field.key, event.currentTarget.value)}
									class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[16px] font-bold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
								/>
							{/if}
						</div>
					{/each}
				</div>

				<div
					class={`mt-3 min-h-[54px] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-[13px] font-extrabold leading-5 ${getResultClass(
						latestLog?.type
					)}`}
				>
					{#if latestLog?.text}
						{latestLog.text}
					{:else}
						JSON 단서를 읽고 정답을 입력하세요.
					{/if}
				</div>

				<div class="mt-3 flex items-center gap-2">
					<button
						type="button"
						on:click={resetAnswer}
						class="h-11 rounded-xl bg-slate-100 px-4 text-[12px] font-extrabold text-slate-600 transition hover:bg-slate-200"
					>
						처음으로
					</button>

					<button
						type="button"
						on:click={onSubmit}
						class="ml-auto h-11 rounded-xl bg-blue-600 px-5 text-[14px] font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
					>
						{submitButtonText}
					</button>
				</div>
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
