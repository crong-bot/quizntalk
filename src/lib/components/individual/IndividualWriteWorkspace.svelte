<script>
	import JsonCodeMirrorEditor from '$lib/components/workplace/JsonCodeMirrorEditor.svelte';
	import { submitIndividualWriteMission } from '$lib/firebase/missionRoom/missionRoomRepository.js';

	export let roomCode = '';
	export let lessonId = '';
	export let roomId = '';

	export let lesson = null;
	export let room = null;
	export let participants = [];

	export let participantId = '';
	export let participantName = '';

	let jsonText = '';
	let editorApi = null;

	let isSubmitting = false;
	let localMessage = '';
	let localMessageType = 'info'; // info | success | error

	let lastLoadedKey = '';

	$: currentParticipant =
		participants.find((participant) => participant.id === participantId) ?? null;

	$: mission = room?.individualWriteMission ?? lesson?.individualWriteMission ?? {};

	$: writeStatus = currentParticipant?.individualWrite?.status ?? 'writing';
	$: submittedJsonText = currentParticipant?.individualWrite?.jsonText ?? '';
	$: feedback = currentParticipant?.individualWrite?.feedback ?? '';

	$: isWriting = writeStatus === 'writing';
	$: isSubmitted = writeStatus === 'submitted';
	$: isApproved = writeStatus === 'approved';
	$: isRejected = writeStatus === 'rejected';

	$: canEdit = isWriting || isRejected;

	$: statusLabel = getStatusLabel(writeStatus);
	$: statusClass = getStatusClass(writeStatus);
	$: submitButtonText = isRejected ? '다시 제출하기' : '선생님께 제출하기';

	// 제출했던 JSON이 있으면 다시 입장하거나 반려되었을 때 작성창에 불러오기
	$: {
		const nextKey = `${participantId}:${writeStatus}:${submittedJsonText}`;

		if (nextKey && nextKey !== lastLoadedKey) {
			lastLoadedKey = nextKey;

			if (submittedJsonText && (isSubmitted || isApproved || isRejected)) {
				jsonText = submittedJsonText;
			}
		}
	}

	function handleEditorReady(api) {
		editorApi = api;
	}

	function handleEditorChange(nextValue) {
		jsonText = nextValue;
	}

	function getStatusLabel(status) {
		if (status === 'submitted') return '선생님 확인 대기';
		if (status === 'approved') return '클리어 완료';
		if (status === 'rejected') return '다시 작성 필요';

		return '작성 중';
	}

	function getStatusClass(status) {
		if (status === 'submitted') {
			return 'bg-violet-50 text-violet-700 ring-violet-100';
		}

		if (status === 'approved') {
			return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
		}

		if (status === 'rejected') {
			return 'bg-rose-50 text-rose-700 ring-rose-100';
		}

		return 'bg-slate-100 text-slate-600 ring-slate-200';
	}

	function formatJson() {
		localMessage = '';

		try {
			const parsed = JSON.parse(jsonText);
			jsonText = JSON.stringify(parsed, null, 2);

			localMessage = 'JSON 포맷을 정리했습니다.';
			localMessageType = 'success';
		} catch (error) {
			localMessage = '아직 JSON 문법이 완성되지 않아 포맷을 정리할 수 없어요.';
			localMessageType = 'error';
		}
	}

	function validateJsonBeforeSubmit() {
		if (!jsonText.trim()) {
			return {
				ok: false,
				message: 'JSON을 작성한 뒤 제출하세요.'
			};
		}

		try {
			JSON.parse(jsonText);

			return {
				ok: true,
				message: ''
			};
		} catch (error) {
			return {
				ok: false,
				message: 'JSON 문법을 다시 확인하세요. 쉼표, 큰따옴표, 괄호가 빠졌을 수 있어요.'
			};
		}
	}

	async function submitJson() {
		if (isSubmitting || !canEdit) return;

		localMessage = '';
		localMessageType = 'info';

		const validateResult = validateJsonBeforeSubmit();

		if (!validateResult.ok) {
			localMessage = validateResult.message;
			localMessageType = 'error';
			return;
		}

		if (!lessonId || !roomId || !participantId) {
			localMessage = '방 정보 또는 참가자 정보가 없습니다. 다시 입장해 주세요.';
			localMessageType = 'error';
			return;
		}

		try {
			isSubmitting = true;

			await submitIndividualWriteMission({
				lessonId,
				roomId,
				participantId,
				jsonText
			});

			localMessage = '제출했습니다. 선생님 확인을 기다려 주세요.';
			localMessageType = 'success';
		} catch (error) {
			console.error(error);
			localMessage = error?.message ?? '제출하지 못했습니다.';
			localMessageType = 'error';
		} finally {
			isSubmitting = false;
		}
	}

	function requestLeave() {
		window.location.href = '/';
	}
</script>

<div class="flex h-full w-full items-start justify-center bg-[#eef3fb]">
	<div class="h-[900px] w-[1440px] shrink-0 bg-[#f4f7fb] px-4 pb-4 pt-0">
		<div class="flex h-full min-h-0 flex-col gap-3">
			<header
				class="flex h-[86px] shrink-0 items-center justify-between rounded-b-[28px] border border-slate-200 bg-white px-5 shadow-sm"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[24px]"
					>
						✍️
					</div>

					<div>
						<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
							DATA WRITE MISSION
						</div>

						<h1 class="font-gmarket text-[25px] font-bold tracking-[-0.06em] text-slate-950">
							{mission.title ?? lesson?.title ?? '데이터 작성 미션'}
						</h1>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<div class={`rounded-full px-4 py-2 text-[13px] font-black ring-1 ${statusClass}`}>
						{statusLabel}
					</div>

					<div class="rounded-2xl bg-slate-950 px-4 py-2 text-right text-white">
						<div class="text-[10px] font-black text-slate-400">방 코드</div>
						<div class="font-gmarket text-[22px] font-black tracking-[0.16em] text-blue-300">
							{room?.code ?? roomCode}
						</div>
					</div>

					<button
						type="button"
						on:click={requestLeave}
						class="rounded-2xl bg-slate-100 px-4 py-3 text-[13px] font-black text-slate-600 transition hover:bg-slate-200"
					>
						나가기
					</button>
				</div>
			</header>

			<div class="grid min-h-0 flex-1 grid-cols-[440px_1fr] gap-4">
				<!-- 왼쪽 안내판 -->
				<aside
					class="min-h-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm"
				>
					<div class="flex h-full min-h-0 flex-col">
						<div class="shrink-0">
							<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-blue-500">
								MISSION GUIDE
							</div>

							<h2
								class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950"
							>
								미션 안내
							</h2>
						</div>

						<div class="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
							<section class="rounded-[24px] bg-blue-50 p-4">
								<div class="text-[13px] font-extrabold text-blue-700">상황 설명</div>

								<p class="mt-3 whitespace-pre-line text-[14px] font-bold leading-7 text-slate-700">
									{mission.description ?? '상황 설명이 없습니다.'}
								</p>
							</section>

							<section class="mt-4 rounded-[24px] bg-amber-50 p-4">
								<div class="text-[13px] font-extrabold text-amber-700">주의할 점</div>

								{#if mission.notes?.length}
									<ul class="mt-3 flex flex-col gap-2">
										{#each mission.notes as note}
											<li class="flex gap-2 text-[13px] font-bold leading-6 text-slate-700">
												<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
												></span>
												<span>{note}</span>
											</li>
										{/each}
									</ul>
								{:else}
									<p class="mt-3 text-[13px] font-bold text-slate-400">
										주의할 점이 없습니다.
									</p>
								{/if}
							</section>

							<section class="mt-4 rounded-[24px] bg-slate-950 p-4">
								<div class="text-[13px] font-extrabold text-slate-400">코드 예시</div>

								<pre
									class="mt-3 max-h-[330px] overflow-auto whitespace-pre-wrap font-mono text-[13px] font-bold leading-6 text-emerald-100">{mission.exampleCode ?? '// 예시 코드가 없습니다.'}</pre>
							</section>
						</div>
					</div>
				</aside>

				<!-- 오른쪽 작성창 -->
				<main
					class="flex min-h-0 flex-col rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm"
				>
					<div class="flex shrink-0 items-center justify-between gap-3">
						<div>
							<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-slate-400">
								JSON EDITOR
							</div>

							<h2
								class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950"
							>
								JSON 작성창
							</h2>
						</div>

						<div class="text-right">
							<div class="text-[12px] font-black text-slate-400">참가자</div>
							<div class="mt-1 text-[15px] font-black text-slate-800">
								{participantName || currentParticipant?.name || '이름 없음'}
							</div>
						</div>
					</div>

					{#if isSubmitted}
						<div class="mt-4 rounded-[22px] border border-violet-200 bg-violet-50 px-4 py-3">
							<div class="text-[14px] font-black text-violet-700">
								제출 완료! 선생님 확인을 기다리고 있어요.
							</div>
							<div class="mt-1 text-[12px] font-bold text-violet-500">
								확인 중에는 JSON을 수정할 수 없습니다.
							</div>
						</div>
					{/if}

					{#if isApproved}
						<div
							class="mt-4 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3"
						>
							<div class="text-[14px] font-black text-emerald-700">
								클리어! 데이터 작성 미션을 완료했어요.
							</div>
							<div class="mt-1 text-[12px] font-bold text-emerald-500">
								선생님이 제출한 JSON을 승인했습니다.
							</div>
						</div>
					{/if}

					{#if isRejected}
						<div class="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3">
							<div class="text-[14px] font-black text-rose-700">
								선생님이 다시 수정하라고 했어요.
							</div>

							<div class="mt-1 whitespace-pre-line text-[13px] font-bold leading-6 text-rose-600">
								{feedback || '내용을 다시 확인해서 수정한 뒤 다시 제출하세요.'}
							</div>
						</div>
					{/if}

					{#if localMessage}
						<div
							class={`mt-4 rounded-[22px] px-4 py-3 text-[13px] font-black leading-6 ${
								localMessageType === 'error'
									? 'border border-rose-200 bg-rose-50 text-rose-700'
									: localMessageType === 'success'
										? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
										: 'border border-blue-200 bg-blue-50 text-blue-700'
							}`}
						>
							{localMessage}
						</div>
					{/if}

					<div
						class={`mt-4 min-h-0 flex-1 overflow-hidden rounded-[24px] border ${
							canEdit ? 'border-slate-800' : 'border-slate-200 opacity-70'
						}`}
					>
						<JsonCodeMirrorEditor
							bind:value={jsonText}
							onChange={handleEditorChange}
							onReady={handleEditorReady}
						/>
					</div>

					<div class="mt-4 flex shrink-0 items-center gap-3">
						<button
							type="button"
							on:click={formatJson}
							disabled={!canEdit || isSubmitting}
							class="h-12 rounded-2xl bg-slate-100 px-5 text-[14px] font-extrabold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
						>
							포맷 정리
						</button>

						<button
							type="button"
							on:click={submitJson}
							disabled={!canEdit || isSubmitting}
							class="h-12 flex-1 rounded-2xl bg-blue-600 px-5 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
						>
							{isSubmitting ? '제출 중...' : submitButtonText}
						</button>
					</div>
				</main>
			</div>
		</div>
	</div>
</div>