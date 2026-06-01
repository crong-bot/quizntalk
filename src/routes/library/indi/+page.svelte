<!-- C:\quizntalk\src\routes\library\indi\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import {
		getIndividualWriteTemplate,
		individualWriteTemplates
	} from '$lib/components/individual/individualTemplate.js';
	import { createIndividualWriteSession } from '$lib/firebase/missionRoom/missionRoomService.js';
	import { authUser } from '$lib/stores/authUser';

	const defaultTemplate = getIndividualWriteTemplate('air');

	let selectedTemplateId = defaultTemplate.id;
	let title = defaultTemplate.title;
	let description = defaultTemplate.description;
	let notesText = defaultTemplate.notesText;
	let exampleCode = defaultTemplate.exampleCode;

	let maxParticipants = 40;
	let isCreating = false;
	let errorMessage = '';

	$: ownerUid = $authUser?.uid ?? '';

	function normalizeNotes(text) {
		return text
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);
	}

	function clampMaxParticipants(value) {
		const nextValue = Number(value);

		if (!Number.isFinite(nextValue)) return 40;

		return Math.max(1, Math.min(nextValue, 40));
	}

	function applyTemplate(template) {
		if (!template) return;

		const ok = confirm(
			'템플릿을 적용하면 현재 입력한 미션 제목, 상황 설명, 주의할 점, 코드 예시가 바뀝니다.\n적용할까요?'
		);

		if (!ok) return;

		selectedTemplateId = template.id;
		title = template.title;
		description = template.description;
		notesText = template.notesText;
		exampleCode = template.exampleCode;
	}

	async function createRoom() {
		if (isCreating) return;

		errorMessage = '';

		if (!ownerUid) {
			errorMessage = '교사 로그인 후 방을 만들 수 있습니다.';
			return;
		}

		if (!title.trim()) {
			errorMessage = '미션 제목을 입력하세요.';
			return;
		}

		if (!description.trim()) {
			errorMessage = '상황 설명을 입력하세요.';
			return;
		}

		try {
			isCreating = true;

			const result = await createIndividualWriteSession({
				ownerUid,
				title,
				description,
				notes: normalizeNotes(notesText),
				exampleCode,
				maxParticipants: clampMaxParticipants(maxParticipants)
			});

			goto(`/library/${result.lessonId}`);
		} catch (error) {
			console.error(error);
			errorMessage = error?.message ?? '방을 만들지 못했습니다.';
		} finally {
			isCreating = false;
		}
	}
</script>

<div class="min-h-screen bg-[#f4f7fb] px-4 py-6 font-nanum text-slate-800">
	<div class="mx-auto flex w-full max-w-[1220px] flex-col gap-5">
		<header class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
			<a
				href="/library/new"
				class="inline-flex w-fit items-center justify-center rounded-2xl bg-slate-100 px-4 py-2.5 text-[13px] font-extrabold text-slate-600 transition hover:bg-slate-200"
			>
				← 새 수업 만들기로
			</a>

			<div class="mt-5 font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
				INDIVIDUAL WRITE MISSION
			</div>

			<div class="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
				<div>
					<h1 class="font-gmarket text-[34px] font-bold tracking-[-0.065em] text-slate-950">
						개인 작성미션 방 만들기
					</h1>

					<p class="mt-2 text-[15px] font-bold leading-7 text-slate-500">
						상황 설명을 읽고 학생이 직접 JSON을 작성해 제출하는 방을 만듭니다.
					</p>
				</div>

				<div class="rounded-2xl bg-blue-50 px-4 py-3 text-[13px] font-extrabold text-blue-700">
					1개 방 · 최대 40명
				</div>
			</div>
		</header>

		<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between gap-3">
				<div>
					<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-blue-500">
						MISSION TEMPLATE
					</div>

					<h2 class="mt-1 font-gmarket text-[23px] font-bold tracking-[-0.055em] text-slate-950">
						템플릿 선택
					</h2>

					<p class="mt-1 text-[13px] font-bold text-slate-500">
						자주 쓰는 개인 작성미션 예시를 불러와서 수정할 수 있습니다.
					</p>
				</div>

				<div class="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-black text-slate-500">
					{individualWriteTemplates.length}개
				</div>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
				{#each individualWriteTemplates as template}
					<button
						type="button"
						on:click={() => applyTemplate(template)}
						class={`rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
							selectedTemplateId === template.id
								? 'border-blue-300 bg-blue-50 ring-4 ring-blue-100'
								: 'border-slate-200 bg-slate-50 hover:bg-white'
						}`}
					>
						<div
							class={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${
								selectedTemplateId === template.id
									? 'bg-white text-blue-700'
									: 'bg-white text-slate-500'
							}`}
						>
							{template.label}
						</div>

						<div class="mt-3 text-[15px] font-black leading-6 text-slate-950">
							{template.title}
						</div>

						<div class="mt-2 line-clamp-2 text-[12px] font-bold leading-5 text-slate-500">
							{template.description}
						</div>
					</button>
				{/each}
			</div>
		</section>

		<main class="grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
			<section class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950">
					왼쪽 안내판 내용
				</h2>

				<div class="mt-6">
					<label for="title" class="text-[13px] font-extrabold text-slate-600"> 미션 제목 </label>

					<input
						id="title"
						bind:value={title}
						class="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-bold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
					/>
				</div>

				<div class="mt-5">
					<label for="description" class="text-[13px] font-extrabold text-slate-600">
						상황 설명
					</label>

					<textarea
						id="description"
						bind:value={description}
						class="mt-2 min-h-[260px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[14px] font-bold leading-7 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
					></textarea>
				</div>

				<div class="mt-5">
					<label for="notes" class="text-[13px] font-extrabold text-slate-600"> 주의할 점 </label>

					<p class="mt-1 text-[12px] font-bold text-slate-400">한 줄에 하나씩 입력하세요.</p>

					<textarea
						id="notes"
						bind:value={notesText}
						class="mt-2 min-h-[180px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[14px] font-bold leading-7 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
					></textarea>
				</div>
			</section>

			<section class="flex flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950">
					코드 예시와 방 생성
				</h2>

				<div class="mt-6">
					<label for="exampleCode" class="text-[13px] font-extrabold text-slate-600">
						코드 예시
					</label>

					<p class="mt-1 text-[12px] font-bold text-slate-400">
						학생에게 보여줄 참고용 JSON입니다. 학생 작성창은 빈칸으로 시작합니다.
					</p>

					<textarea
						id="exampleCode"
						bind:value={exampleCode}
						spellcheck="false"
						class="mt-2 min-h-[360px] w-full resize-y rounded-2xl border border-slate-800 bg-[#101827] p-4 font-mono text-[14px] font-bold leading-7 text-emerald-100 outline-none transition focus:ring-4 focus:ring-blue-100"
					></textarea>
				</div>

				<div class="mt-5">
					<label for="maxParticipants" class="text-[13px] font-extrabold text-slate-600">
						최대 참여 인원
					</label>

					<input
						id="maxParticipants"
						type="number"
						min="1"
						max="40"
						bind:value={maxParticipants}
						on:change={() => (maxParticipants = clampMaxParticipants(maxParticipants))}
						class="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-bold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
					/>
				</div>

				{#if errorMessage}
					<div
						class="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-[14px] font-extrabold text-rose-600"
					>
						{errorMessage}
					</div>
				{/if}

				<div class="mt-auto pt-6">
					<button
						type="button"
						on:click={createRoom}
						disabled={isCreating}
						class="h-14 w-full rounded-2xl bg-blue-600 px-5 text-[16px] font-extrabold text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isCreating ? '방 만드는 중...' : '4자리 코드 방 만들기'}
					</button>

					<div
						class="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-[13px] font-bold leading-6 text-blue-700"
					>
						방을 만들면 바로 관리 화면으로 이동합니다.
					</div>
				</div>
			</section>
		</main>
	</div>
</div>
