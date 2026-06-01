<!-- C:\quizntalk\src\routes\player\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { getAllCourses } from '$lib/components/workplace/theme/courseRegistry';
	import Nav from '../../lib/components/nav.svelte';

	const courses = getAllCourses();

	function openMockPlayer(course) {
		goto(`/player/${course.themeId}`);
	}

	function getRoleText(course) {
		return course.roles?.map((role) => role.roleName ?? role.name ?? role.id).join(' · ') ?? '';
	}

	function getMissionCount(course) {
		return course.missions?.length ?? 0;
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
				<a
					href="/"
					class="inline-flex w-fit self-start items-center justify-center rounded-2xl bg-slate-100 px-4 py-2.5 text-[13px] font-extrabold text-slate-600 transition hover:bg-slate-200"
				>
					← 홈으로
				</a>
				<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
					MOCK PLAYER
				</div>

				<h1 class="font-gmarket text-[34px] font-bold tracking-[-0.07em] text-slate-950">
					목업 테스트 테마 선택
				</h1>

				<p class="max-w-[720px] text-[15px] font-bold leading-7 text-slate-500">
					방을 만들지 않고 선택한 테마를 로컬 목업 데이터로 실행합니다. 테마별 역할, 미션, 초기
					JSON, 시뮬레이션 동작을 빠르게 확인할 수 있습니다.
				</p>
			</div>
		</section>

		<section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each courses as course}
				<button
					type="button"
					on:click={() => openMockPlayer(course)}
					class="group relative min-h-[260px] overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
				>
					<div
						class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-100 blur-3xl transition group-hover:bg-blue-200"
					></div>

					<div
						class="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-slate-100 blur-3xl"
					></div>

					<div class="relative z-10 flex h-full flex-col">
						<div class="flex items-start justify-between gap-3">
							<div
								class="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-[30px] ring-1 ring-blue-100"
							>
								🪐
							</div>

							<div
								class="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-black tracking-[-0.03em] text-white"
							>
								{getMissionCount(course)}개 미션
							</div>
						</div>

						<div class="mt-5">
							<div class="font-gmarket text-[24px] font-bold tracking-[-0.07em] text-slate-950">
								{course.title}
							</div>

							<div class="mt-1 text-[12px] font-black tracking-[0.12em] text-blue-500">
								{course.themeId}
							</div>
						</div>

						<div class="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
							<div class="text-[11px] font-black tracking-[0.14em] text-slate-400">ROLES</div>

							<div class="mt-1 text-[13px] font-extrabold leading-6 text-slate-700">
								{getRoleText(course)}
							</div>
						</div>

						<div class="mt-auto pt-5">
							<div
								class="flex h-12 items-center justify-center rounded-2xl bg-blue-600 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition group-hover:bg-blue-700"
							>
								이 테마로 목업 실행하기
							</div>
						</div>
					</div>
				</button>
			{/each}
		</section>

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
