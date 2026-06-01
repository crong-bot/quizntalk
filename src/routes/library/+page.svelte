<!-- C:\quizntalk\src\routes\library\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import { deleteClassroomSession } from '$lib/firebase/missionRoom/missionRoomService.js';
	import { createTeacherLessonsStore } from '$lib/firebase/missionRoom/missionRoomStore';
	import { authUser } from '$lib/stores/authUser';
	import { onDestroy } from 'svelte';
	export let data;

	const teacherLessonsStore = createTeacherLessonsStore();

	let deletingLessonId = '';
	let startedOwnerUid = '';

	$: ownerUid = $authUser?.uid ?? data?.ownerUid ?? data?.user?.uid ?? '';
	$: lessons = $teacherLessonsStore.lessons;
	$: activeLessons = lessons.filter((lesson) => lesson.status !== 'completed');
	$: completedLessons = lessons.filter((lesson) => lesson.status === 'completed');

	$: if (ownerUid && ownerUid !== startedOwnerUid) {
		startedOwnerUid = ownerUid;
		teacherLessonsStore.start(ownerUid);
	}

	onDestroy(() => {
		teacherLessonsStore.stop();
	});

	function openLesson(lessonId) {
		goto(`/library/${lessonId}`);
	}

	function getLessonTypeLabel(lesson) {
		if (lesson?.missionType === 'individual-write') return '개인 작성미션';
		if (lesson?.categoryId === 'read') return '팀 해석미션';
		if (lesson?.categoryId === 'write') return '팀 작성미션';
		return lesson?.categoryTitle ?? '미션';
	}

	function getLessonTypeClass(lesson) {
		if (lesson?.missionType === 'individual-write') {
			return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
		}

		if (lesson?.categoryId === 'read') {
			return 'bg-violet-50 text-violet-700 ring-violet-100';
		}

		return 'bg-blue-50 text-blue-700 ring-blue-100';
	}

	function getLessonSubText(lesson) {
		if (lesson?.missionType === 'individual-write') {
			return `${lesson.themeTitle ?? '데이터 작성 미션'} · 개인 방 1개 · ${lesson.status}`;
		}

		return `${lesson.themeTitle ?? '미션'} · 방 ${lesson.roomCount ?? 0}개 · ${lesson.status}`;
	}

	function getCompletedLessonSubText(lesson) {
		if (lesson?.missionType === 'individual-write') {
			return `참여 ${lesson.summary?.totalParticipants ?? 0}명 · 개인 작성미션`;
		}

		return `참여 ${lesson.summary?.totalParticipants ?? 0}명 · 완료 방 ${
			lesson.summary?.completedRoomCount ?? 0
		}/${lesson.summary?.roomCount ?? lesson.roomCount ?? 0}`;
	}

	async function deleteLesson(lesson) {
		if (!lesson?.id) return;

		const ok = confirm(
			`"${
				lesson.title ?? '수업'
			}"을 삭제할까요?\n\n이 수업의 방, 참여 학생 기록, 게임 코드가 함께 삭제됩니다.`
		);

		if (!ok) return;

		deletingLessonId = lesson.id;

		try {
			await deleteClassroomSession({
				lessonId: lesson.id
			});
		} catch (error) {
			console.error(error);
			alert(error?.message ?? '수업을 삭제하지 못했습니다.');
		} finally {
			deletingLessonId = '';
		}
	}
</script>

<Nav />
<div class="min-h-screen bg-[#f4f7fb] px-4 py-6 font-nanum text-slate-800">
	<div class="mx-auto flex w-full max-w-[1220px] flex-col gap-5">
		<header class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
				<div>
					<div class=" font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
						MISSION LIBRARY
					</div>

					<h1 class="mt-2 font-gmarket text-[34px] font-bold tracking-[-0.065em] text-slate-950">
						수업 목록
					</h1>

					<p class="mt-2 text-[15px] font-bold leading-7 text-slate-500">
						진행 중인 팀미션과 개인 작성미션을 한곳에서 관리합니다.
					</p>
				</div>

				<a
					href="/library/new"
					class="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-[14px] font-extrabold text-white shadow-sm transition hover:bg-blue-700"
				>
					+ 새 수업 만들기
				</a>
			</div>
		</header>

		<section class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
				<div class="text-xs font-black text-slate-400">전체 수업</div>
				<div class="mt-2 text-[32px] font-black text-slate-950">
					{lessons.length}
				</div>
			</div>

			<div class="rounded-[28px] border border-blue-100 bg-blue-50 p-5 shadow-sm">
				<div class="text-xs font-black text-blue-500">진행 중</div>
				<div class="mt-2 text-[32px] font-black text-blue-700">
					{activeLessons.length}
				</div>
			</div>

			<div class="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
				<div class="text-xs font-black text-emerald-500">완료됨</div>
				<div class="mt-2 text-[32px] font-black text-emerald-700">
					{completedLessons.length}
				</div>
			</div>
		</section>

		<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-[18px] font-black text-slate-950">진행 중인 수업</div>
					<div class="mt-1 text-sm font-bold text-slate-500">
						방 관리와 학생 입장 현황을 확인합니다.
					</div>
				</div>

				<div class="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
					{activeLessons.length}개
				</div>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each activeLessons as lesson}
					<div
						class="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-white"
					>
						<button
							type="button"
							on:click={() => openLesson(lesson.id)}
							class="block w-full text-left"
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<div class="truncate text-[17px] font-black text-slate-950">
										{lesson.title}
									</div>

									<div class="mt-1 text-sm font-bold text-slate-500">
										{getLessonSubText(lesson)}
									</div>
								</div>

								<div
									class={`shrink-0 rounded-full px-3 py-1 text-xs font-black ring-1 ${getLessonTypeClass(
										lesson
									)}`}
								>
									{getLessonTypeLabel(lesson)}
								</div>
							</div>
						</button>

						<div class="mt-4 flex justify-end">
							<button
								type="button"
								disabled={deletingLessonId === lesson.id}
								on:click|stopPropagation={() => deleteLesson(lesson)}
								class="rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{deletingLessonId === lesson.id ? '삭제 중...' : '삭제'}
							</button>
						</div>
					</div>
				{/each}

				{#if activeLessons.length === 0}
					<div class="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
						진행 중인 수업이 없습니다.
					</div>
				{/if}
			</div>
		</section>

		<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-[18px] font-black text-slate-950">완료된 수업</div>
					<div class="mt-1 text-sm font-bold text-slate-500">
						완료된 팀미션과 개인 작성미션 기록을 확인합니다.
					</div>
				</div>

				<div class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
					{completedLessons.length}개
				</div>
			</div>

			<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each completedLessons as lesson}
					<div
						class="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-200 hover:bg-white"
					>
						<button
							type="button"
							on:click={() => openLesson(lesson.id)}
							class="block w-full text-left"
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<div class="truncate text-[17px] font-black text-slate-950">
										{lesson.title}
									</div>

									<div class="mt-1 text-sm font-bold text-slate-500">
										{getCompletedLessonSubText(lesson)}
									</div>
								</div>

								<div
									class={`shrink-0 rounded-full px-3 py-1 text-xs font-black ring-1 ${getLessonTypeClass(
										lesson
									)}`}
								>
									{getLessonTypeLabel(lesson)}
								</div>
							</div>
						</button>

						<div class="mt-4 flex justify-end">
							<button
								type="button"
								disabled={deletingLessonId === lesson.id}
								on:click|stopPropagation={() => deleteLesson(lesson)}
								class="rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{deletingLessonId === lesson.id ? '삭제 중...' : '삭제'}
							</button>
						</div>
					</div>
				{/each}

				{#if completedLessons.length === 0}
					<div class="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
						완료된 수업이 없습니다.
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>
