<!-- src/lib/components/workplace/MissionBriefingPanel.svelte -->

<script>
	export let variant = 'write'; // write | read

	export let story = null;
	export let role = null;
	export let playerName = '';
	export let clues = [];
	export let keyChips = [];
	export let onInsertKey = () => {};

	export let panelLabel = 'MISSION PANEL';
	export let backgroundImage = '/images/themes/space-base/missionpanel_back_space.png';

	let showMissionModal = false;

	$: isRead = variant === 'read';

	$: safeStory = story ?? {
		title: '미션 안내',
		call: '',
		summary: '',
		mission: ''
	};

	$: safeRole = role ?? {
		title: '미션 담당',
		icon: isRead ? '📄' : '🎯',
		description: ''
	};

	$: missionTitle = safeStory.title ?? '미션 안내';
	$: missionCall = safeStory.call ?? '';
	$: missionSummary = safeStory.summary ?? '';
	$: missionText = safeStory.mission ?? '';

	$: roleIcon = safeRole.icon ?? (isRead ? '📄' : '🎯');
	$: roleTitle = safeRole.title ?? '미션 담당';
	$: roleDescription = safeRole.description ?? '';

	$: safeClues = Array.isArray(clues) ? clues : [];
	$: textClues = safeClues.filter((clue) => typeof clue === 'string');
	$: jsonClues = safeClues.filter(
		(clue) => clue && typeof clue === 'object' && clue.type === 'json'
	);
	$: shouldShowKeyChips = !isRead && Array.isArray(keyChips) && keyChips.length > 0;

	function getJsonClueData(clue) {
		return clue?.data ?? clue?.json ?? clue?.value ?? {};
	}
	function escapeHtml(value) {
		return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
	}

	function highlightJson(value) {
		const json = JSON.stringify(value ?? {}, null, 2);

		return json.replace(
			/("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false)\b|\b(null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
			(match, stringValue, colon, booleanValue, nullValue) => {
				const escaped = escapeHtml(match);

				if (stringValue && colon) {
					return `<span class="json-key">${escapeHtml(stringValue)}</span>${colon}`;
				}

				if (stringValue) {
					return `<span class="json-string">${escapeHtml(stringValue)}</span>`;
				}

				if (booleanValue) {
					return `<span class="json-boolean">${escaped}</span>`;
				}

				if (nullValue) {
					return `<span class="json-null">${escaped}</span>`;
				}

				return `<span class="json-number">${escaped}</span>`;
			}
		);
	}

	function getHighlightedJsonLines(value) {
		return highlightJson(value).split('\n');
	}
	function stringifyJson(value) {
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
</script>

<div
	class={`relative flex  min-h-0 flex-col overflow-hidden rounded-[26px] border p-4 text-white ${
		isRead ? 'border-emerald-200 bg-[#082f2c]' : 'border-blue-200 bg-[#071a3d]'
	}`}
>
	<div
		class="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
		style={`background-image: url('${backgroundImage}');`}
	></div>

	<div class="pointer-events-none absolute inset-0 bg-[#020617]/55"></div>

	<div
		class={`pointer-events-none absolute inset-0 ${
			isRead
				? 'bg-[radial-gradient(circle_at_20%_8%,rgba(16,185,129,0.28),transparent_34%),radial-gradient(circle_at_88%_22%,rgba(245,158,11,0.22),transparent_34%)]'
				: 'bg-[radial-gradient(circle_at_20%_8%,rgba(59,130,246,0.34),transparent_34%),radial-gradient(circle_at_88%_22%,rgba(168,85,247,0.22),transparent_34%)]'
		}`}
	></div>

	<div class="relative z-10 flex min-h-0 flex-1 flex-col gap-3">
		<div class="flex items-center justify-between">
			<div
				class={`text-center text-[11px] font-black tracking-[0.18em] ${
					isRead ? 'text-emerald-200' : 'text-blue-200'
				}`}
			>
				{panelLabel}
			</div>

			{#if isRead}
				<div
					class="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-emerald-200"
				>
					READ MISSION
				</div>
			{/if}
		</div>

		<section
			class="rounded-[20px] border border-white/15 bg-white/10 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur"
		>
			<div class="flex items-center gap-3">
				<div
					class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-[0_10px_24px_rgba(251,191,36,0.28)] ${
						isRead ? 'text-emerald-600' : 'text-amber-500'
					}`}
				>
					{roleIcon}
				</div>

				<div class="min-w-0">
					<div class=" flex min-w-0 items-center gap-1">
						<span class="shrink-0 text-[12px]">📍</span>

						<span class="truncate text-[11px] font-extrabold tracking-[-0.03em] text-blue-50">
							{roleTitle}
						</span>
					</div>
					<div class="flex min-w-0 items-center gap-1.5">
						<span class="shrink-0 text-[16px]">🛡️</span>

						<span class="truncate text-[17px] font-black tracking-[-0.04em] text-white">
							{playerName}
						</span>
						<span class="truncate text-[14px] font-black tracking-[-0.04em] text-white">
							요원
						</span>
					</div>

					<div class="mt-0.5 truncate text-xs font-bold text-blue-100">
						{roleDescription}
					</div>
				</div>
			</div>
		</section>
		<!-- ////🥇📍🛡️🔱⚜️🔰 -->
		<button
			type="button"
			on:click={() => (showMissionModal = true)}
			class={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left shadow-[0_0_28px_rgba(250,204,21,0.38)] transition hover:-translate-y-0.5 active:translate-y-0 ${
				isRead
					? 'border-emerald-100 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 hover:shadow-[0_0_36px_rgba(45,212,191,0.5)]'
					: 'border-yellow-100 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 hover:shadow-[0_0_36px_rgba(250,204,21,0.6)]'
			}`}
		>
			<div class="min-w-0">
				<div
					class={`text-[11px] font-black tracking-[0.14em] ${
						isRead ? 'text-teal-950/75' : 'text-orange-900/75'
					}`}
				>
					{isRead ? 'DATA BRIEFING' : 'MISSION ORDER'}
				</div>

				<div class="mt-0.5 text-[18px] font-black leading-6 tracking-[-0.055em] text-slate-950">
					나의 미션 확인하기
				</div>
			</div>

			<div
				class={`shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-[12px] font-black shadow-[0_6px_14px_rgba(15,23,42,0.22)] ${
					isRead ? 'text-emerald-200' : 'text-yellow-200'
				}`}
			>
				OPEN
			</div>
		</button>

		{#if showMissionModal}
			<div class="fixed inset-0 z-50 flex items-center justify-center px-4">
				<button
					type="button"
					aria-label="미션 안내 닫기"
					class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
					on:click={() => (showMissionModal = false)}
				></button>

				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="mission-modal-title"
					class={`relative z-10 w-full max-w-[520px] overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)] ${
						isRead
							? 'border-emerald-200/25 bg-gradient-to-br from-[#062b2a] via-[#0f2638] to-[#06142f]'
							: 'border-blue-200/25 bg-gradient-to-br from-[#0b2558] via-[#10194d] to-[#06142f]'
					}`}
				>
					<div
						class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl"
					></div>

					<div
						class="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-amber-300/16 blur-3xl"
					></div>

					<div class="relative z-10">
						<div class="mb-4 flex items-center justify-between gap-3">
							<div class="flex min-w-0 items-center gap-3">
								<div
									class={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[22px] shadow-[0_0_24px_rgba(250,204,21,0.42)] ${
										isRead ? 'bg-emerald-300' : 'bg-yellow-300'
									}`}
								>
									{roleIcon}
								</div>

								<div class="min-w-0">
									<div
										class={`text-[11px] font-black tracking-[0.16em] ${
											isRead ? 'text-emerald-200' : 'text-amber-200'
										}`}
									>
										{isRead ? 'DATA ANALYSIS CENTER' : 'MISSION CONTROL'}
									</div>

									<div
										id="mission-modal-title"
										class="mt-0.5 text-[19px] font-black leading-6 tracking-[-0.055em] text-white"
									>
										{missionTitle}
									</div>
								</div>
							</div>

							<button
								type="button"
								aria-label="닫기"
								on:click={() => (showMissionModal = false)}
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[16px] font-black text-white/80 transition hover:bg-white/20 hover:text-white"
							>
								✕
							</button>
						</div>

						<div class="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
							{#if missionCall}
								<div class="text-[13px] font-black leading-6 text-blue-100">
									{missionCall}
								</div>
							{/if}

							<div
								class={`mt-2 text-[21px] font-black leading-8 tracking-[-0.06em] ${
									isRead ? 'text-emerald-200' : 'text-amber-200'
								}`}
							>
								{missionTitle}
							</div>

							{#if missionSummary}
								<div class="mt-3 text-[14px] font-bold leading-7 text-blue-50/90">
									{missionSummary}
								</div>
							{/if}
						</div>

						<div
							class={`mt-4 overflow-hidden rounded-2xl border-2 p-4 shadow-[0_0_32px_rgba(250,204,21,0.32)] ${
								isRead
									? 'border-emerald-100 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300'
									: 'border-yellow-100 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300'
							}`}
						>
							<div class="mb-2 flex items-center gap-2">
								<span
									class={`rounded-md bg-slate-950 px-2 py-1 text-[11px] font-black tracking-[-0.03em] ${
										isRead ? 'text-emerald-200' : 'text-yellow-200'
									}`}
								>
									{isRead ? 'ANALYZE' : 'MISSION'}
								</span>

								<span class="text-[11px] font-black tracking-[0.12em] text-slate-900/75">
									지금 해야 할 일
								</span>
							</div>

							<div class="text-[21px] font-black leading-8 tracking-[-0.06em] text-slate-950">
								{missionText}
							</div>
						</div>

						<button
							type="button"
							on:click={() => (showMissionModal = false)}
							class="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-[15px] font-black tracking-[-0.04em] text-slate-950 shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:bg-yellow-50 active:translate-y-0"
						>
							미션 시작하기
						</button>
					</div>
				</div>
			</div>
		{/if}

		<section
			class="h-[306px] shrink-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3.5 text-slate-900 shadow-sm"
		>
			<div class="mb-3 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="text-base">{isRead ? '📄' : '🔍'}</div>

					<div class="text-base font-black">
						{isRead ? 'JSON 단서' : '단서'}
					</div>
				</div>

				<div
					class={`rounded-full px-2.5 py-1 text-[11px] font-black ${
						isRead ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
					}`}
				>
					{isRead ? 'READ ONLY' : `단서 ${textClues.length}`}
				</div>
			</div>

			<div class="thin-scroll h-[calc(100%-36px)] overflow-auto pr-1 pb-2">
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
								class="flex items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
							>
								<div
									class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white"
								>
									{String(index + 1).padStart(2, '0')}
								</div>

								<div class="min-w-0 flex-1 text-xs font-bold leading-5 text-slate-700">
									{clue}
								</div>

								<div class="shrink-0 text-blue-300">💡</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-2xl bg-slate-50 px-3 py-4 text-xs font-bold leading-5 text-slate-500">
						표시할 단서가 없습니다.
					</div>
				{/if}
			</div>
		</section>

		{#if shouldShowKeyChips}
			<section
				class="shrink-0 rounded-[22px] border border-slate-200 bg-white p-3.5 text-slate-900 shadow-sm"
			>
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="flex items-center gap-2">
							<div class="text-base">⌕</div>
							<div class="text-base font-black">입력 보조 키</div>
						</div>

						<div class="mt-1 text-xs font-bold leading-5 text-slate-400">
							키를 누르면 에디터에 자동 입력돼요.
						</div>
					</div>
				</div>

				<div class="mt-3 flex flex-wrap gap-2">
					{#each keyChips as key}
						<button
							type="button"
							on:click={() => onInsertKey(key)}
							class="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-extrabold text-violet-600 transition hover:-translate-y-0.5 hover:bg-violet-100"
						>
							{key}
						</button>
					{/each}

					<button
						type="button"
						on:click={() => onInsertKey('')}
						class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-500 transition hover:-translate-y-0.5 hover:bg-slate-100"
					>
						&quot;
					</button>
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	.json-editor {
		border-radius: 14px;
		background: #020617;
		padding: 10px 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
			'Courier New', monospace;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.json-line {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr);
		min-height: 22px;
		padding-right: 12px;
	}

	.json-line:hover {
		background: rgba(255, 255, 255, 0.045);
	}

	.json-line-number {
		user-select: none;
		border-right: 1px solid rgba(148, 163, 184, 0.18);
		padding-right: 10px;
		text-align: right;
		font-size: 11px;
		font-weight: 800;
		line-height: 22px;
		color: rgba(148, 163, 184, 0.6);
	}

	.json-code {
		display: block;
		min-width: 0;
		white-space: pre-wrap;
		word-break: break-word;
		padding-left: 12px;
		font-size: 12px;
		font-weight: 800;
		line-height: 22px;
		color: #cbd5e1;
	}
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

	:global(.json-key) {
		color: #7dd3fc;
	}

	:global(.json-string) {
		color: #86efac;
	}

	:global(.json-number) {
		color: #fbbf24;
	}

	:global(.json-boolean) {
		color: #c084fc;
	}

	:global(.json-null) {
		color: #f87171;
	}
</style>
