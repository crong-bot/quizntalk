<!-- C:\quizntalk\src\routes\library\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import {
		createClassroomSession,
		deleteClassroomSession,
		isReadMissionCourse
	} from '$lib/firebase/missionRoom/missionRoomService.js';
	import { createTeacherLessonsStore } from '$lib/firebase/missionRoom/missionRoomStore';
	import { authUser } from '$lib/stores/authUser';
	import { getAllCourses } from '$lib/components/workplace/theme/courseRegistry';
	import { onDestroy } from 'svelte';
	import Nav from '../../../lib/components/nav.svelte';

	export let data;

	const courses = getAllCourses();

	function getCourseDifficulty(course) {
		return course?.difficulty ?? course?.level ?? 'JSON 새싹';
	}

	function getCourseTags(course) {
		if (Array.isArray(course?.tags) && course.tags.length > 0) {
			return course.tags;
		}

		if (Array.isArray(course?.concepts) && course.concepts.length > 0) {
			return course.concepts;
		}

		return isReadMissionCourse(course)
			? ['데이터 해석', '근거 판단']
			: ['JSON 작성', '협동 미션'];
	}

	function courseToTheme(course) {
		const isRead = isReadMissionCourse(course);

		return {
			id: course.id,
			themeId: course.themeId ?? course.id,
			courseId: course.id,

			categoryId: isRead ? 'read' : 'write',
			categoryTitle: isRead ? '제이슨 해석' : '제이슨 작성',

			title: course.title ?? '이름 없는 미션',
			subtitle: course.subtitle ?? '미션 설명이 없습니다.',
			icon: course.icon ?? '🧩',
			level: getCourseDifficulty(course),
			players: course.roles?.length ?? 4,
			tags: getCourseTags(course),

			isRealData: course?.isRealData === true,
			enabled: course.enabled ?? true,

			course
		};
	}

	const themes = courses.map(courseToTheme);

	let selectedThemeId = themes[0]?.id ?? '';
	let roomCount = 4;
	let roomCapacities = [4, 4, 4, 4];
	let isCreating = false;
	let deletingLessonId = '';
	let startedOwnerUid = '';

	$: selectedTheme = themes.find((theme) => theme.id === selectedThemeId) ?? themes[0];
	$: writeThemes = themes.filter((theme) => theme.categoryId === 'write');
	$: readThemes = themes.filter((theme) => theme.categoryId === 'read');

	const teacherLessonsStore = createTeacherLessonsStore();

	$: ownerUid = $authUser?.uid ?? data?.ownerUid ?? data?.user?.uid ?? '';
	$: lessons = $teacherLessonsStore.lessons;
	$: activeLessons = lessons.filter((lesson) => lesson.status !== 'completed');
	$: completedLessons = lessons.filter((lesson) => lesson.status === 'completed');

	$: {
		if (roomCapacities.length < roomCount) {
			roomCapacities = [...roomCapacities, ...Array(roomCount - roomCapacities.length).fill(4)];
		}

		if (roomCapacities.length > roomCount) {
			roomCapacities = roomCapacities.slice(0, roomCount);
		}
	}

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

	function setRoomCapacity(index, capacity) {
		roomCapacities = roomCapacities.map((value, currentIndex) =>
			currentIndex === index ? capacity : value
		);
	}

	async function createSession() {
		if (isCreating) return;

		isCreating = true;

		try {
			const result = await createClassroomSession({
				ownerUid,
				selectedTheme,
				roomCount,
				roomCapacities
			});

			goto(`/library/${result.lessonId}`);
		} catch (error) {
			console.error(error);
			alert(error?.message ?? '수업을 만들지 못했습니다.');
		} finally {
			isCreating = false;
		}
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

	function selectTheme(theme) {
		if (!theme.enabled) return;
		selectedThemeId = theme.id;
	}

	function getCategoryTone(categoryId) {
		if (categoryId === 'write') {
			return {
				selectedBorder: 'border-blue-300',
				selectedBg: 'bg-blue-50',
				selectedShadow: 'shadow-[0_18px_40px_rgba(37,99,235,0.12)]'
			};
		}

		return {
			selectedBorder: 'border-violet-300',
			selectedBg: 'bg-violet-50',
			selectedShadow: 'shadow-[0_18px_40px_rgba(124,58,237,0.12)]'
		};
	}

	function decreaseRoomCount() {
		roomCount = Math.max(1, roomCount - 1);
	}

	function increaseRoomCount() {
		roomCount = Math.min(10, roomCount + 1);
	}

	function getThemeLevel(theme) {
		return theme?.level ?? '새싹';
	}

	function getThemeLevelClass(theme) {
		const level = getThemeLevel(theme);

		if (level === 'JSON 새싹') {
			return 'bg-sky-500 text-white ring-sky-200 shadow-[0_8px_18px_rgba(14,165,233,0.28)]';
		}

		if (level === 'JSON 중급') {
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

	function getThemeLevelIcon(theme) {
		const level = getThemeLevel(theme);

		if (level === 'JSON 새싹') return '🌱';
		if (level === 'JSON 중급') return '⚡';
		if (level === 'JSON 고수') return '🔥';
		if (level === 'JSON 전설') return '👑';

		return '⭐';
	}

	
	function getThemeDataLabel(theme) {
	return theme?.isRealData ? '실제데이터' : '가상데이터';
}

function getThemeDataTextClass(theme) {
	return theme?.isRealData ? 'text-emerald-500' : 'text-blue-500';
}

function getThemeDataIcon(theme) {
	return theme?.isRealData ? '📊' : '🧪';
}

function getThemeDataBarClass(theme) {
	return theme?.isRealData ? 'bg-emerald-300' : 'bg-blue-300';
}

function getThemeDataLabelClass(theme) {
	return theme?.isRealData ? 'text-emerald-600' : 'text-blue-500';
}
</script>

<Nav />

<div class="min-h-screen bg-[#f4f7fb] px-4 py-2 font-nanum text-slate-800">
	<div class="mx-auto flex w-full max-w-[1220px] flex-col gap-5">
		<header
			class="flex items-center justify-between rounded-[26px] border border-slate-200 bg-white px-6 py-5 shadow-sm"
		>
			<div>
				<h1 class="font-gmarket text-[30px] font-bold tracking-[-0.06em] text-slate-950">
					미션 생성 - 팀미션 만들기
				</h1>

				<p class="mt-2 text-[14px] font-bold leading-6 text-slate-500">
					미션 테마를 선택하고, 모둠 수에 맞게 방 코드를 생성하세요.
				</p>
			</div>
		</header>

		<div class="grid grid-cols-[1fr_360px] gap-5">
			<main class="flex flex-col gap-5">
				<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
					<div class="flex items-end justify-between gap-3">
						<div>
							<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-slate-400">
								STEP 01
							</div>

							<h2
								class="mt-1 font-gmarket text-[23px] font-bold tracking-[-0.055em] text-slate-950"
							>
								미션 테마 선택
							</h2>

							<p class="mt-1.5 text-[14px] font-bold leading-6 text-slate-500">
								제이슨 작성 미션과 제이슨 해석 미션 중 사용할 테마를 선택하세요.
							</p>
						</div>

						<div
							class="rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-extrabold text-slate-500"
						>
							총 {themes.length}개 테마
						</div>
					</div>

					<div class="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto_1fr]">
						<!-- 왼쪽: JSON 작성 -->
						<div>
							<div class="flex items-center gap-3">
								<div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[20px]">
									✍️
								</div>

								<div class="shrink-0">
									<div class="font-gmarket text-[18px] font-bold tracking-[-0.05em] text-slate-950">
										제이슨 작성 미션
									</div>
									<div class="text-[12px] font-bold text-slate-500">
										단서를 보고 JSON을 직접 완성하는 활동
									</div>
								</div>

								
							</div>

							<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
								{#each writeThemes as theme}
									{@const tone = getCategoryTone(theme.categoryId)}

									<button
										type="button"
										disabled={!theme.enabled}
										on:click={() => selectTheme(theme)}
										class={`group relative min-h-[226px] overflow-hidden rounded-[24px] border p-4 text-left transition ${
											selectedThemeId === theme.id
												? `${tone.selectedBorder} ${tone.selectedBg} ${tone.selectedShadow}`
												: 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
										} ${!theme.enabled ? 'cursor-not-allowed opacity-50' : ''}`}
									>
										<div class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/80 blur-2xl"></div>

										<div class="relative z-10 flex h-full flex-col">
											<div class="flex items-start justify-between gap-2">
												<div class="text-[34px]">{theme.icon}</div>

												{#if theme.enabled}
													<div
														class={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[11px] font-black ring-1 ${getThemeLevelClass(
															theme
														)}`}
													>
														<span class="text-[13px]">{getThemeLevelIcon(theme)}</span>
														<span>{getThemeLevel(theme)}</span>
													</div>
												{:else}
													<div class="rounded-2xl bg-slate-500 px-3 py-2 text-[11px] font-black text-white ring-1 ring-slate-300">
														준비 중
													</div>
												{/if}
											</div>

											<div class="mt-4 font-gmarket text-[17px] font-bold tracking-[-0.055em] text-slate-950">
												{theme.title}
											</div>

											<div class="mt-2 line-clamp-3 text-[12px] font-bold leading-5 text-slate-500">
												{theme.subtitle}
											</div>

											<div class="mt-4 flex flex-wrap gap-1.5">
												{#each theme.tags as tag}
													<span class="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-slate-500 ring-1 ring-slate-200">
														{tag}
													</span>
												{/each}
											</div>

											<div class="mt-auto pt-4">
												<div class={`h-[3px] rounded-full ${getThemeDataBarClass(theme)}`}></div>

												<div class="mt-2 flex items-center justify-end">
													<div class={`text-[11px] font-black ${getThemeDataLabelClass(theme)}`}>
														{getThemeDataLabel(theme)}
													</div>
												</div>
											</div>
										</div>
									</button>
								{/each}
							</div>
						</div>

						<!-- 가운데 세로 디바이더 -->
						<div class="hidden w-px bg-slate-300 xl:block"></div>

						<!-- 오른쪽: JSON 해석 -->
						<div>
							<div class="flex items-center gap-3">
								<div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-50 text-[20px]">
									🔎
								</div>

								<div class="shrink-0">
									<div class="font-gmarket text-[18px] font-bold tracking-[-0.05em] text-slate-950">
										제이슨 해석 미션
									</div>
									<div class="text-[12px] font-bold text-slate-500">
										주어진 JSON을 읽고 의미를 찾아내는 활동
									</div>
								</div>

								
							</div>

							<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
								{#each readThemes as theme}
									{@const tone = getCategoryTone(theme.categoryId)}

									<button
										type="button"
										disabled={!theme.enabled}
										on:click={() => selectTheme(theme)}
										class={`group relative min-h-[226px] overflow-hidden rounded-[24px] border p-4 text-left transition ${
											selectedThemeId === theme.id
												? `${tone.selectedBorder} ${tone.selectedBg} ${tone.selectedShadow}`
												: 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
										} ${!theme.enabled ? 'cursor-not-allowed opacity-50' : ''}`}
									>
										<div class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/80 blur-2xl"></div>

										<div class="relative z-10 flex h-full flex-col">
											<div class="flex items-start justify-between gap-2">
												<div class="text-[34px]">{theme.icon}</div>

												{#if theme.enabled}
													<div
														class={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[11px] font-black ring-1 ${getThemeLevelClass(
															theme
														)}`}
													>
														<span class="text-[13px]">{getThemeLevelIcon(theme)}</span>
														<span>{getThemeLevel(theme)}</span>
													</div>
												{:else}
													<div class="rounded-2xl bg-slate-500 px-3 py-2 text-[11px] font-black text-white ring-1 ring-slate-300">
														준비 중
													</div>
												{/if}
											</div>

											<div class="mt-4 font-gmarket text-[17px] font-bold tracking-[-0.055em] text-slate-950">
												{theme.title}
											</div>

											<div class="mt-2 line-clamp-3 text-[12px] font-bold leading-5 text-slate-500">
												{theme.subtitle}
											</div>

											<div class="mt-4 flex flex-wrap gap-1.5">
												{#each theme.tags as tag}
													<span class="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-slate-500 ring-1 ring-slate-200">
														{tag}
													</span>
												{/each}
											</div>

											<div class="mt-auto pt-4">
												<div class={`h-[3px] rounded-full ${getThemeDataBarClass(theme)}`}></div>

												<div class="mt-2 flex items-center justify-end">
													<div class={`text-[11px] font-black ${getThemeDataLabelClass(theme)}`}>
														{getThemeDataLabel(theme)}
													</div>
												</div>
											</div>
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</section>
			</main>

			<aside class="flex flex-col gap-5">
				<section
					class="sticky top-6 overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm"
				>
					<div
						class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl"
					></div>

					<div class="relative z-10">
						<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-blue-500">
							PREVIEW
						</div>

						<h2 class="mt-2 font-gmarket text-[25px] font-bold tracking-[-0.06em] text-slate-950">
							{selectedTheme?.title}
						</h2>

						<p class="mt-2 text-[14px] font-bold leading-6 text-slate-500">
							{selectedTheme?.subtitle}
						</p>

						<div class="mt-5 rounded-3xl bg-slate-950 p-4 text-white">
							<div class="flex items-start justify-between gap-3">
								<div>
									<div class="font-gmarket text-[10px] font-bold tracking-[0.16em] text-slate-400">
										SELECTED MISSION
									</div>

									<div class="mt-1 font-gmarket text-[20px] font-bold tracking-[-0.05em]">
										{selectedTheme?.icon}
										{selectedTheme?.title}
									</div>
								</div>

								<div
									class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-white"
								>
									{roomCount}개 방
								</div>
							</div>

							<div class="mt-4 grid grid-cols-2 gap-2">
								<div class="rounded-2xl bg-white/10 p-3">
									<div class="text-[11px] font-extrabold text-slate-400">미션 유형</div>
									<div class="mt-1 text-[14px] font-extrabold">
										{selectedTheme?.categoryTitle}
									</div>
								</div>

								<div class="rounded-2xl bg-white/10 p-3">
									<div class="text-[11px] font-extrabold text-slate-400">난이도</div>
									<div class="mt-1 text-[14px] font-extrabold">
										{getThemeLevelIcon(selectedTheme)} {getThemeLevel(selectedTheme)}
									</div>
								</div>

								<div class="rounded-2xl bg-white/10 p-3">
									<div class="text-[11px] font-extrabold text-slate-400">데이터</div>
									<div class="mt-1 text-[14px] font-extrabold">
										{getThemeDataIcon(selectedTheme)} {getThemeDataLabel(selectedTheme)}
									</div>
								</div>

								<div class="rounded-2xl bg-white/10 p-3">
									<div class="text-[11px] font-extrabold text-slate-400">학생 로그인</div>
									<div class="mt-1 text-[14px] font-extrabold">필요 없음</div>
								</div>
							</div>
						</div>

						<div class="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
							<div class="flex items-center justify-between gap-3">
								<div>
									<div class="text-[14px] font-extrabold text-slate-700">생성될 방</div>
									<div class="mt-1 text-[12px] font-bold text-slate-500">
										방 개수와 각 방의 인원을 정하세요.
									</div>
								</div>

								<div class="flex items-center gap-2">
									<button
										type="button"
										on:click={decreaseRoomCount}
										disabled={roomCount <= 1}
										class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[18px] font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
									>
										−
									</button>

									<div
										class="flex h-9 min-w-[58px] items-center justify-center rounded-xl bg-blue-600 px-3 text-[14px] font-black text-white shadow-sm"
									>
										{roomCount}개
									</div>

									<button
										type="button"
										on:click={increaseRoomCount}
										disabled={roomCount >= 10}
										class="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[18px] font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
									>
										+
									</button>
								</div>
							</div>

							<div
								class="mt-3 rounded-2xl bg-white px-3 py-2 text-[12px] font-bold text-slate-500 ring-1 ring-slate-200"
							>
								총 예상 인원:
								<span class="font-black text-slate-950">
									{roomCapacities.reduce((sum, value) => sum + value, 0)}명
								</span>
							</div>

							<div class="mt-3 grid max-h-[300px] grid-cols-2 gap-2 overflow-auto pr-1">
								{#each Array(roomCount) as _, index}
									<div class="rounded-2xl bg-white p-2.5 ring-1 ring-slate-200">
										<div class="flex items-center justify-between gap-2">
											<div class="text-[12px] font-black text-slate-800">
												{index + 1}번방
											</div>

											<div
												class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600"
											>
												{roomCapacities[index]}명
											</div>
										</div>

										<div class="mt-2 grid grid-cols-2 gap-1.5">
											<button
												type="button"
												on:click={() => setRoomCapacity(index, 3)}
												class={`h-8 rounded-lg text-[11px] font-black transition ${
													roomCapacities[index] === 3
														? 'bg-blue-600 text-white shadow-sm'
														: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
												}`}
											>
												3명
											</button>

											<button
												type="button"
												on:click={() => setRoomCapacity(index, 4)}
												class={`h-8 rounded-lg text-[11px] font-black transition ${
													roomCapacities[index] === 4
														? 'bg-blue-600 text-white shadow-sm'
														: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
												}`}
											>
												4명
											</button>
										</div>
									</div>
								{/each}
							</div>

							<div
								class="mt-3 rounded-2xl bg-blue-50 px-3 py-2 text-[12px] font-bold leading-5 text-blue-700"
							>
								기본은 4명 방입니다. 3명 방은 남는 역할이 자동 완료 처리됩니다.
							</div>
						</div>

						<button
							type="button"
							disabled={!selectedTheme?.enabled || isCreating}
							on:click={createSession}
							class="mt-2 h-16 w-full rounded-2xl bg-blue-600 text-[15px] font-extrabold text-white shadow-[0_16px_34px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
						>
							{isCreating ? '방 코드 생성 중...' : `${roomCount}개 방 코드 만들기`}
						</button>

						<div
							class="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-[13px] font-bold leading-6 text-blue-700"
						>
							학생은 자기 모둠 번호에 맞는 방 코드를 입력해 참여합니다.
						</div>
					</div>
				</section>
			</aside>
		</div>

		<!-- 필요하면 다시 살려서 사용 -->
		<!--
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
							<div class="text-[17px] font-black text-slate-950">{lesson.title}</div>
							<div class="mt-1 text-sm font-bold text-slate-500">
								{lesson.themeTitle} · 방 {lesson.roomCount}개 · {lesson.status}
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
		-->
	</div>
</div>