<!-- C:\quizntalk\src\routes\player\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { getAllCourses } from '$lib/components/workplace/theme/courseRegistry';
	import { isReadMissionCourse } from '$lib/firebase/missionRoom/missionRoomService.js';
	import Nav from '../../lib/components/nav.svelte';

	const courses = getAllCourses();

	$: writeCourses = courses.filter((course) => !isReadMissionCourse(course));
	$: readCourses = courses.filter((course) => isReadMissionCourse(course));

	function openMockPlayer(course) {
		goto(`/player/${course.themeId}`);
	}

	function getRoleText(course) {
		return course.roles?.map((role) => role.roleName ?? role.name ?? role.id).join(' · ') ?? '';
	}

	function getMissionCount(course) {
		return course.missions?.length ?? 0;
	}

	function getChallengeLevel(course) {
		return course.difficulty ?? 'JSON 새싹';
	}

	function getChallengeLevelClass(course) {
		const level = getChallengeLevel(course);

		if (level === 'JSON 새싹') {
			return 'bg-sky-500 text-white ring-sky-200 shadow-[0_8px_18px_rgba(14,165,233,0.28)]';
		}

		if (level === 'JSON 도전자') {
			return 'bg-amber-500 text-white ring-amber-200 shadow-[0_8px_18px_rgba(245,158,11,0.28)]';
		}

		if (level === 'JSON 고수') {
			return 'bg-violet-600 text-white ring-violet-200 shadow-[0_8px_18px_rgba(124,58,237,0.30)]';
		}

		if (level === 'JSON 전설') {
			return 'bg-rose-600 text-white ring-rose-200 shadow-[0_8px_20px_rgba(225,29,72,0.35)]';
		}

		return 'bg-slate-600 text-white ring-slate-200 shadow-[0_8px_18px_rgba(71,85,105,0.25)]';
	}

	function getChallengeIcon(course) {
		const level = getChallengeLevel(course);

		if (level === 'JSON 새싹') return '🌱';
		if (level === 'JSON 실력자') return '⚡';
		if (level === 'JSON 고수') return '🔥';
		if (level === 'JSON 전설') return '👑';

		return '⭐';
	}
</script>

<Nav />
<div class="min-h-screen bg-[#eef3fb] px-4 py-8 font-nanum">
	<div class="mx-auto flex max-w-[1180px] flex-col gap-6">
		<section
			class="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white p-7 shadow-sm"
		>
			<div
				class="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-200/45 blur-3xl"
			></div>

			<div
				class="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-200/35 blur-3xl"
			></div>

			<div class="relative z-10 flex flex-col gap-2">
				<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
					MOCK PLAYER
				</div>

				<h1 class="font-gmarket text-[34px] font-bold tracking-[-0.07em] text-slate-950">
					목업 테스트 테마 선택
				</h1>

				<p class="max-w-[720px] text-[15px] font-bold leading-7 text-slate-500">
					방을 만들지 않고 선택한 테마를 로컬 목업 데이터로 실행합니다. 테마별 역할, 미션, 초기JSON,
					시뮬레이션 동작을 빠르게 확인할 수 있습니다.
				</p>
			</div>
		</section>

		{#if writeCourses.length > 0}
			<section class="flex flex-col gap-3">
				<div class="flex items-end justify-between">
					<div>
						<div class="font-gmarket text-[24px] font-bold tracking-[-0.07em] text-slate-950">
							작성 미션
						</div>
						<div class="mt-1 text-[13px] font-bold text-slate-500">
							JSON 값을 직접 작성하고 실행하는 미션입니다.
						</div>
					</div>

					<div class="rounded-full bg-blue-100 px-3 py-1.5 text-[12px] font-black text-blue-700">
						{writeCourses.length}개
					</div>
				</div>

				<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					{#each writeCourses as course}
						<button
							type="button"
							on:click={() => openMockPlayer(course)}
							class="group relative min-h-[220px] overflow-hidden rounded-[26px] border border-blue-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
						>
							<div
								class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-100 blur-3xl transition group-hover:bg-blue-200"
							></div>

							<div class="relative z-10 flex h-full flex-col">
								<div class="flex items-start justify-between gap-3">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[26px] ring-1 ring-blue-100"
									>
										{course.icon ?? '🧩'}
									</div>

									<div
										class={`flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-[12px] font-black shadow-sm ${getChallengeLevelClass(
											course
										)}`}
									>
										<span class="text-[15px]">{getChallengeIcon(course)}</span>
										<span>{getChallengeLevel(course)}</span>
									</div>
								</div>

								<div class="mt-4">
									<div class="font-gmarket text-[22px] font-bold tracking-[-0.07em] text-slate-950">
										{course.title}
									</div>

									<div class="mt-1 flex items-center gap-2">
										<div class="text-[11px] font-black tracking-[0.12em] text-blue-500">
											{course.themeId}
										</div>

										<div class="h-1 w-1 rounded-full bg-slate-300"></div>

										<div class="text-[11px] font-black text-slate-500">
											{getMissionCount(course)}개 미션
										</div>
									</div>
								</div>

								<div class="mt-3 rounded-2xl bg-slate-50 px-3.5 py-2.5">
									<div class="text-[10px] font-black tracking-[0.14em] text-slate-400">ROLES</div>

									<div
										class="mt-1 line-clamp-2 text-[12px] font-extrabold leading-5 text-slate-700"
									>
										{getRoleText(course)}
									</div>
								</div>

								<div class="mt-auto pt-4">
									<div
										class="flex h-10 items-center justify-center rounded-2xl bg-blue-600 text-[13px] font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.20)] transition group-hover:bg-blue-700"
									>
										작성 미션 실행하기
									</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		{#if readCourses.length > 0}
			<section class="flex flex-col gap-3">
				<div class="flex items-end justify-between">
					<div>
						<div class="font-gmarket text-[24px] font-bold tracking-[-0.07em] text-slate-950">
							읽기 미션
						</div>
						<div class="mt-1 text-[13px] font-bold text-slate-500">
							JSON 단서를 읽고 분석 결과를 제출하는 미션입니다.
						</div>
					</div>

					<div
						class="rounded-full bg-emerald-100 px-3 py-1.5 text-[12px] font-black text-emerald-700"
					>
						{readCourses.length}개
					</div>
				</div>

				<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
					{#each readCourses as course}
						<button
							type="button"
							on:click={() => openMockPlayer(course)}
							class="group relative min-h-[220px] overflow-hidden rounded-[26px] border border-emerald-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
						>
							<div
								class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-100 blur-3xl transition group-hover:bg-emerald-200"
							></div>

							<div class="relative z-10 flex h-full flex-col">
								<div class="flex items-start justify-between gap-3">
									<div
										class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[26px] ring-1 ring-emerald-100"
									>
										{course.icon ?? '🔎'}
									</div>

									<div
										class={`rounded-full px-3 py-1.5 text-[11px] font-black ring-1 ${getChallengeLevelClass(
											course
										)}`}
									>
										{getChallengeLevel(course)}
									</div>
								</div>

								<div class="mt-4">
									<div class="font-gmarket text-[22px] font-bold tracking-[-0.07em] text-slate-950">
										{course.title}
									</div>

									<div class="mt-1 flex items-center gap-2">
										<div class="text-[11px] font-black tracking-[0.12em] text-emerald-500">
											{course.themeId}
										</div>

										<div class="h-1 w-1 rounded-full bg-slate-300"></div>

										<div class="text-[11px] font-black text-slate-500">
											{getMissionCount(course)}개 미션
										</div>
									</div>
								</div>

								<div class="mt-3 rounded-2xl bg-slate-50 px-3.5 py-2.5">
									<div class="text-[10px] font-black tracking-[0.14em] text-slate-400">ROLES</div>

									<div
										class="mt-1 line-clamp-2 text-[12px] font-extrabold leading-5 text-slate-700"
									>
										{getRoleText(course)}
									</div>
								</div>

								<div class="mt-auto pt-4">
									<div
										class="flex h-10 items-center justify-center rounded-2xl bg-emerald-600 text-[13px] font-black text-white shadow-[0_12px_24px_rgba(5,150,105,0.20)] transition group-hover:bg-emerald-700"
									>
										읽기 미션 실행하기
									</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		{#if courses.length === 0}
			<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
				<div class="text-[18px] font-black text-slate-900">등록된 코스가 없습니다.</div>
				<div class="mt-2 text-sm font-bold text-slate-500">
					courseRegistry.js에 테스트할 course를 등록해 주세요.
				</div>
			</div>
		{/if}
	</div>
</div>
