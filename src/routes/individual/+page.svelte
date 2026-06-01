<script>
	import { goto } from '$app/navigation';
	import { createIndividualWriteSession } from '$lib/firebase/missionRoom/missionRoomService.js';
	import { authUser } from '$lib/stores/authUser';

	let title = '공기질 알림 데이터 만들기';

	let description = `AI 공기질 알림 앱이 두 지역의 공기질 정보를 정리하려고 합니다.

전주는 미세먼지 82, 초미세먼지 38, 상태는 나쁨입니다.
마스크 쓰기와 바깥 활동 줄이기가 필요하고, 주의 알림이 필요합니다.

군산은 미세먼지 35, 초미세먼지 18, 상태는 보통입니다.
평소처럼 활동하면 되고, 주의 알림은 필요하지 않습니다.`;

	let notesText = `전체 데이터는 { } 안에 작성하세요.
지역정보는 목록 [ ]으로 작성하세요.
목록 안에는 전주와 군산, 두 지역 정보 상자 { }를 넣으세요.
미세먼지와 초미세먼지는 숫자 값으로 쓰세요.
주의알림은 true 또는 false로 쓰세요.`;

	let exampleCode = `{
  "데이터종류": "날씨알림",
  "지역정보": [
    {
      "지역": "서울",
      "날씨": {
        "상태": "비",
        "기온": 22
      },
      "준비물": ["우산"],
      "알림필요": true
    }
  ]
}`;

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
				href="/library"
				class="inline-flex w-fit items-center justify-center rounded-2xl bg-slate-100 px-4 py-2.5 text-[13px] font-extrabold text-slate-600 transition hover:bg-slate-200"
			>
				← 수업 만들기로
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

		<main class="grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
			<section class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
				<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-slate-400">
					MISSION CONTENT
				</div>

				<h2 class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950">
					왼쪽 안내판 내용
				</h2>

				<div class="mt-6">
					<label for="title" class="text-[13px] font-extrabold text-slate-600">
						미션 제목
					</label>

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
					<label for="notes" class="text-[13px] font-extrabold text-slate-600">
						주의할 점
					</label>

					<p class="mt-1 text-[12px] font-bold text-slate-400">
						한 줄에 하나씩 입력하세요.
					</p>

					<textarea
						id="notes"
						bind:value={notesText}
						class="mt-2 min-h-[180px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[14px] font-bold leading-7 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
					></textarea>
				</div>
			</section>

			<section class="flex flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
				<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-slate-400">
					EXAMPLE & CREATE
				</div>

				<h2 class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950">
					코드 예시와 방 생성
				</h2>

				<div class="mt-6">
					<label for="exampleCode" class="text-[13px] font-extrabold text-slate-600">
						코드 예시
					</label>

					<p class="mt-1 text-[12px] font-bold text-slate-400">
						학생에게 보여줄 참고용 JSON입니다. 오른쪽 작성창은 빈칸으로 시작합니다.
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

					<div class="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-[13px] font-bold leading-6 text-blue-700">
						방을 만들면 바로 관리 화면으로 이동합니다.
					</div>
				</div>
			</section>
		</main>
	</div>
</div>