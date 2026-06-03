<!-- C:\quizntalk\src\routes\library\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import {
		createClassroomSession,
		deleteClassroomSession
	} from '$lib/firebase/missionRoom/missionRoomService.js';
	import { createTeacherLessonsStore } from '$lib/firebase/missionRoom/missionRoomStore';
	import { authUser } from '$lib/stores/authUser';
	import { onDestroy } from 'svelte';
	import Nav from '../../../lib/components/nav.svelte';

	export let data;

	const themes = [
		{
			id: 'spaceBase',
			categoryId: 'write',
			categoryTitle: '제이슨 작성',
			title: '달 기지 복구',
			subtitle: 'JSON 명령을 작성해 멈춰버린 달 기지를 복구합니다.',
			icon: '🪐',
			level: '초5~6',
			players: 4,
			tags: ['객체', '문자열', '숫자', '불리언'],
			enabled: true
		},
		{
			id: 'rescueDrone',
			categoryId: 'write',
			categoryTitle: '제이슨 작성',
			title: '구조 드론 작전',
			subtitle: '드론 설정 JSON을 완성해 구조 지점을 찾아냅니다.',
			icon: '🚁',
			level: '준비 중',
			players: 4,
			tags: ['좌표', '센서', '객체'],
			enabled: true
		},
		{
			id: 'monster-defense',
			categoryId: 'write',
			categoryTitle: '제이슨 작성',
			title: '몬스터 디펜스',
			subtitle: '교실 장치의 상태를 JSON으로 제어합니다.',
			icon: '🏫',
			level: '준비 중',
			players: 4,
			tags: ['상태값', 'true/false', '숫자'],
			enabled: true
		},
		{
			id: 'deepSeaBase',
			categoryId: 'write',
			categoryTitle: '제이슨 작성',
			title: '심해 기지 탐사',
			subtitle: '탐사 장비 설정 JSON을 완성해 심해 기지를 가동합니다.',
			icon: '🌊',
			level: '준비 중',
			players: 4,
			tags: ['중첩 객체', '장비 상태', '조건'],
			enabled: true
		},
		{
			id: 'animalRescue',
			categoryId: 'read',
			categoryTitle: '제이슨 해석',
			title: '동물구조대: 늑구 추적 작전',
			subtitle: '제보 JSON과 흔적 데이터를 분석해 늑구 구조 계획서를 만들어보세요.',
			icon: '🐾',
			level: '초5~6',
			players: 4,
			tags: ['배열', '데이터 해석', '근거 판단'],
			enabled: true
		},
		{
			id: 'hackerTrace',
			categoryId: 'read',
			categoryTitle: '제이슨 해석',
			title: '해커 추적대: 사라진 학생정보',
			subtitle: '흩어진 로그를 연결해 진짜 의심 아이디를 찾아보세요!',
			icon: '👻',
			level: '준비 중',
			players: 4,
			tags: ['데이터 읽기', '분류', '상태 판단'],
			enabled: true
		},
		{
			id: 'marketBasket',
			categoryId: 'read',
			categoryTitle: '제이슨 해석',
			title: '장바구니 탐정단: 숨은 구매 패턴을 찾아라',
			subtitle: '마트 판매 JSON 데이터를 분석해 함께 잘 팔리는 상품의 비밀을 밝혀보세요!',
			icon: '🛒',
			level: '준비 중',
			players: 4,
			tags: ['배열', '객체', '조건 찾기'],
			enabled: true
		},
		{
			id: 'securityLog',
			categoryId: 'read',
			categoryTitle: '제이슨 해석',
			title: '보안 로그 분석',
			subtitle: '접속 기록 JSON을 읽고 이상한 기록을 찾아냅니다.',
			icon: '🛡️',
			level: '준비 중',
			players: 4,
			tags: ['로그 읽기', '패턴 찾기', '이상 탐지'],
			enabled: true
		}
	];

	let selectedThemeId = 'spaceBase';
	let roomCount = 4;
	let roomCapacities = [4, 4, 4, 4];
	let isCreating = false;

	$: selectedTheme = themes.find((theme) => theme.id === selectedThemeId);
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

	let startedOwnerUid = '';

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

	// onMount(() => {
	// 	if (ownerUid) {
	// 		teacherLessonsStore.start(ownerUid);
	// 	}
	// });

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
	let deletingLessonId = '';

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
				sectionIconBg: 'bg-blue-50',
				sectionTitle: 'text-blue-700',
				selectedBorder: 'border-blue-300',
				selectedBg: 'bg-blue-50',
				selectedShadow: 'shadow-[0_18px_40px_rgba(37,99,235,0.12)]',
				badge: 'bg-blue-600 text-white',
				sideBadge: 'bg-blue-50 text-blue-700'
			};
		}

		return {
			sectionIconBg: 'bg-violet-50',
			sectionTitle: 'text-violet-700',
			selectedBorder: 'border-violet-300',
			selectedBg: 'bg-violet-50',
			selectedShadow: 'shadow-[0_18px_40px_rgba(124,58,237,0.12)]',
			badge: 'bg-violet-600 text-white',
			sideBadge: 'bg-violet-50 text-violet-700'
		};
	}
	function decreaseRoomCount() {
		roomCount = Math.max(1, roomCount - 1);
	}

	function increaseRoomCount() {
		roomCount = Math.min(10, roomCount + 1);
	}
</script>

<Nav />
<div class="min-h-screen bg-[#f4f7fb] px-4 py-2 font-nanum text-slate-800">
	<div class="mx-auto flex w-full max-w-[1220px] flex-col gap-5">
		<header
			class="flex items-center justify-between rounded-[26px] border border-slate-200 bg-white px-6 py-5 shadow-sm"
		>
			<div>
				<!-- <button
					type="button"
					on:click={() => goto('/')}
					class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-extrabold text-slate-600 transition hover:bg-slate-50"
				>
					홈으로
				</button> -->
				<!-- <div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
					CREATE GAME
				</div> -->

				<h1 class=" font-gmarket text-[30px] font-bold tracking-[-0.06em] text-slate-950">
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

					<!-- JSON 작성 -->
					<div class="mt-6">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[20px]"
							>
								✍️
							</div>

							<div>
								<div class="font-gmarket text-[18px] font-bold tracking-[-0.05em] text-slate-950">
									제이슨 작성 미션
								</div>
								<div class="text-[12px] font-bold text-slate-500">
									단서를 보고 JSON을 직접 완성하는 활동
								</div>
							</div>
						</div>

						<div class="mt-3 grid grid-cols-4 gap-3">
							{#each writeThemes as theme}
								{@const tone = getCategoryTone(theme.categoryId)}

								<button
									type="button"
									disabled={!theme.enabled}
									on:click={() => selectTheme(theme)}
									class={`group relative min-h-[216px] overflow-hidden rounded-[24px] border p-4 text-left transition ${
										selectedThemeId === theme.id
											? `${tone.selectedBorder} ${tone.selectedBg} ${tone.selectedShadow}`
											: 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
									} ${!theme.enabled ? 'cursor-not-allowed opacity-50' : ''}`}
								>
									<div
										class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/80 blur-2xl"
									></div>

									<div class="relative z-10 flex h-full flex-col">
										<div class="flex items-start justify-between">
											<div class="text-[34px]">{theme.icon}</div>

											{#if theme.enabled}
												<div
													class={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
														selectedThemeId === theme.id ? tone.badge : 'bg-white text-slate-500'
													}`}
												>
													선택 가능
												</div>
											{:else}
												<div
													class="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-extrabold text-slate-500"
												>
													준비 중
												</div>
											{/if}
										</div>

										<div
											class="mt-4 font-gmarket text-[17px] font-bold tracking-[-0.055em] text-slate-950"
										>
											{theme.title}
										</div>

										<div class="mt-2 line-clamp-3 text-[12px] font-bold leading-5 text-slate-500">
											{theme.subtitle}
										</div>

										<div class="mt-4 flex flex-wrap gap-1.5">
											{#each theme.tags as tag}
												<span
													class="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-slate-500 ring-1 ring-slate-200"
												>
													{tag}
												</span>
											{/each}
										</div>

										<div class="mt-auto flex items-center justify-between pt-4">
											<div class="text-[11px] font-extrabold text-slate-400">
												{theme.level}
											</div>

											<div class="text-[11px] font-extrabold text-slate-400">
												{theme.players}인 협동
											</div>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- JSON 해석 -->
					<div class="mt-8 border-t border-slate-100 pt-6">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-50 text-[20px]"
							>
								🔎
							</div>

							<div>
								<div class="font-gmarket text-[18px] font-bold tracking-[-0.05em] text-slate-950">
									제이슨 해석 미션
								</div>
								<div class="text-[12px] font-bold text-slate-500">
									주어진 JSON을 읽고 의미를 찾아내는 활동
								</div>
							</div>
						</div>

						<div class="mt-3 grid grid-cols-4 gap-3">
							{#each readThemes as theme}
								{@const tone = getCategoryTone(theme.categoryId)}

								<button
									type="button"
									disabled={!theme.enabled}
									on:click={() => selectTheme(theme)}
									class={`group relative min-h-[216px] overflow-hidden rounded-[24px] border p-4 text-left transition ${
										selectedThemeId === theme.id
											? `${tone.selectedBorder} ${tone.selectedBg} ${tone.selectedShadow}`
											: 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
									} ${!theme.enabled ? 'cursor-not-allowed opacity-50' : ''}`}
								>
									<div
										class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/80 blur-2xl"
									></div>

									<div class="relative z-10 flex h-full flex-col">
										<div class="flex items-start justify-between">
											<div class="text-[34px]">{theme.icon}</div>

											{#if theme.enabled}
												<div
													class={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
														selectedThemeId === theme.id ? tone.badge : 'bg-white text-slate-500'
													}`}
												>
													선택 가능
												</div>
											{:else}
												<div
													class="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-extrabold text-slate-500"
												>
													준비 중
												</div>
											{/if}
										</div>

										<div
											class="mt-4 font-gmarket text-[17px] font-bold tracking-[-0.055em] text-slate-950"
										>
											{theme.title}
										</div>

										<div class="mt-2 line-clamp-3 text-[12px] font-bold leading-5 text-slate-500">
											{theme.subtitle}
										</div>

										<div class="mt-4 flex flex-wrap gap-1.5">
											{#each theme.tags as tag}
												<span
													class="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-slate-500 ring-1 ring-slate-200"
												>
													{tag}
												</span>
											{/each}
										</div>

										<div class="mt-auto flex items-center justify-between pt-4">
											<div class="text-[11px] font-extrabold text-slate-400">
												{theme.level}
											</div>

											<div class="text-[11px] font-extrabold text-slate-400">
												{theme.players}인 협동
											</div>
										</div>
									</div>
								</button>
							{/each}
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
									<div class="mt-1 text-[14px] font-extrabold">{selectedTheme?.categoryTitle}</div>
								</div>

								<div class="rounded-2xl bg-white/10 p-3">
									<div class="text-[11px] font-extrabold text-slate-400">참여 방식</div>
									<div class="mt-1 text-[14px] font-extrabold">게임 코드</div>
								</div>

								<div class="rounded-2xl bg-white/10 p-3">
									<div class="text-[11px] font-extrabold text-slate-400">방 정원</div>
									<div class="mt-1 text-[14px] font-extrabold">방별 선택</div>
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
							class="mt-5 h-13 w-full rounded-2xl bg-blue-600 text-[15px] font-extrabold text-white shadow-[0_16px_34px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
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

		<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-[18px] font-black text-slate-950">완료된 수업</div>
					<div class="mt-1 text-sm font-bold text-slate-500">
						학생별 기록과 개념별 어려움을 확인합니다.
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
							<div class="text-[17px] font-black text-slate-950">{lesson.title}</div>
							<div class="mt-1 text-sm font-bold text-slate-500">
								참여 {lesson.summary?.totalParticipants ?? 0}명 · 완료 방
								{lesson.summary?.completedRoomCount ?? 0}/{lesson.summary?.roomCount ??
									lesson.roomCount ??
									0}
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
