<!-- C:\quizntalk\src\routes\library\[lessonId]\+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { getCourseByThemeId } from '$lib/components/workplace/theme/courseRegistry';
	import { getConceptLabel, getTopConcepts } from '$lib/firebase/missionRoom/learningConcepts';
	import {
		completeLesson,
		deleteLessonCompletely
	} from '$lib/firebase/missionRoom/missionRoomRepository';
	import {
		approveReadMissionForRoom,
		buildRoomSummary,
		getReviewItemsForRoom,
		getRoomToneClass,
		isReadMissionCourse,
		rejectReadMissionForRoom
	} from '$lib/firebase/missionRoom/missionRoomService';
	import { createLessonRoomsStore } from '$lib/firebase/missionRoom/missionRoomStore';
	import { onDestroy, onMount } from 'svelte';

	export let data;

	let lesson = data.lesson;
	let isCompleting = false;
	let isDeleting = false;
	let errorMessage = '';

	const roomsStore = createLessonRoomsStore();

	$: rooms = lesson.status === 'completed' ? [] : $roomsStore.rooms;
	$: summary = lesson.summary ?? null;

	onMount(() => {
		if (lesson.status !== 'completed') {
			roomsStore.start(data.lessonId);
		}
	});

	onDestroy(() => {
		roomsStore.stop();
	});

	function goBack() {
		goto('/library');
	}

	async function handleCompleteLesson() {
		if (isCompleting) return;

		const ok = confirm('수업을 완료 처리할까요? 학생 활동 기록이 수업 요약으로 저장됩니다.');
		if (!ok) return;

		try {
			isCompleting = true;
			errorMessage = '';

			const nextSummary = await completeLesson({
				lessonId: data.lessonId
			});

			lesson = {
				...lesson,
				status: 'completed',
				completedAt: new Date(),
				summary: nextSummary
			};

			roomsStore.stop();
		} catch (error) {
			errorMessage = error?.message ?? '수업 완료 처리에 실패했습니다.';
		} finally {
			isCompleting = false;
		}
	}

	async function handleDeleteLesson() {
		if (isDeleting) return;

		const ok = confirm(
			'이 수업 기록을 삭제할까요?\n학생 활동 요약, 방 정보, 초대코드가 함께 삭제됩니다.'
		);

		if (!ok) return;

		try {
			isDeleting = true;
			errorMessage = '';

			await deleteLessonCompletely({
				lessonId: data.lessonId
			});

			goto('/library');
		} catch (error) {
			errorMessage = error?.message ?? '수업 삭제에 실패했습니다.';
		} finally {
			isDeleting = false;
		}
	}
	let processingReviewKey = '';

	$: course = getCourseByThemeId(lesson.themeId);
	$: isReadCourse = isReadMissionCourse(course);

	function getCurrentMission(room) {
		return course?.missions?.[room?.currentMissionIndex ?? 0] ?? null;
	}

	function getPendingReviewItems(room) {
		const mission = getCurrentMission(room);

		return getReviewItemsForRoom({ room, mission }).filter((item) => item.status === 'pending');
	}
	function formatDateTime(value) {
	if (!value) return '생성 시간 없음';

	const date = value?.toDate
		? value.toDate()
		: value instanceof Date
			? value
			: new Date(value);

	if (Number.isNaN(date.getTime())) return '생성 시간 없음';

	return new Intl.DateTimeFormat('ko-KR', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

	function getRoomCreatedAt(room) {
		return room?.createdAt ?? room?.updatedAt ?? lesson?.createdAt ?? '';
	}

	function getRoomParticipants(room) {
	if (Array.isArray(room?.participants)) {
		return room.participants;
	}

	if (room?.participants && typeof room.participants === 'object') {
		return Object.values(room.participants);
	}

	if (Array.isArray(room?.participantNames)) {
		return room.participantNames.map((name, index) => ({
			id: `name_${index}`,
			name
		}));
	}

		return [];
	}

	function getParticipantName(participant, index) {
		return (
			participant?.name ??
			participant?.participantName ??
			participant?.displayName ??
			`학생 ${index + 1}`
		);
	}

	function getParticipantRoleName(participant) {
		return participant?.roleName ?? participant?.roleId ?? '역할 배정 전';
	}

	function getParticipantTotalAttempts(participant) {
		return (
			participant?.totalAttempts ??
			participant?.attemptCount ??
			participant?.attempts ??
			(participant?.successCount ?? 0) + (participant?.failCount ?? 0) ??
			0
		);
	}

	function getParticipantFailCount(participant) {
		return participant?.failCount ?? participant?.wrongCount ?? participant?.errorCount ?? 0;
	}

	function getRoomTotalAttempts(room) {
		const participants = getRoomParticipants(room);

		const participantAttempts = participants.reduce((sum, participant) => {
			return sum + getParticipantTotalAttempts(participant);
		}, 0);

		return room?.totalAttempts ?? participantAttempts;
	}

	function getRoomFailCount(room) {
		const participants = getRoomParticipants(room);

		const participantFails = participants.reduce((sum, participant) => {
			return sum + getParticipantFailCount(participant);
		}, 0);

		return room?.failCount ?? room?.wrongCount ?? participantFails;
	}

	async function approveReview(room, reviewKey) {
		if (processingReviewKey) return;

		const approveMessage = prompt(
			'승인 피드백을 입력하세요.',
			'좋아요. JSON 단서에서 중요한 근거를 잘 찾았습니다.'
		);

		if (approveMessage === null) return;

		try {
			processingReviewKey = `${room.id}:${reviewKey}`;
			errorMessage = '';

			await approveReadMissionForRoom({
				lessonId: data.lessonId,
				room,
				course,
				missionIndex: room.currentMissionIndex ?? 0,
				reviewKey,
				approveMessage
			});
		} catch (error) {
			errorMessage = error?.message ?? '승인 처리에 실패했습니다.';
		} finally {
			processingReviewKey = '';
		}
	}
	async function rejectReview(room, reviewKey) {
		if (processingReviewKey) return;

		const reason = prompt('반려 사유를 입력하세요.', '근거를 조금 더 자세히 작성해 주세요.');
		if (reason === null) return;

		try {
			processingReviewKey = `${room.id}:${reviewKey}`;
			errorMessage = '';

			await rejectReadMissionForRoom({
				lessonId: data.lessonId,
				room,
				course,
				missionIndex: room.currentMissionIndex ?? 0,
				reviewKey,
				reason
			});
		} catch (error) {
			errorMessage = error?.message ?? '반려 처리에 실패했습니다.';
		} finally {
			processingReviewKey = '';
		}
	}
	let openedRoomIds = {};

	function getRoomOpenKey(room) {
		return room?.id ?? room?.roomId ?? room?.code ?? String(room?.roomNumber ?? '');
	}

	function isRoomOpened(room) {
		const key = getRoomOpenKey(room);
		return key ? openedRoomIds?.[key] === true : false;
	}

	function toggleRoomOpen(room) {
		const key = getRoomOpenKey(room);
		if (!key) return;

		openedRoomIds = {
			...openedRoomIds,
			[key]: !openedRoomIds?.[key]
		};
	}

	function handleRoomHeaderKeydown(event, room) {
		if (event.key !== 'Enter' && event.key !== ' ') return;

		event.preventDefault();
		toggleRoomOpen(room);
	}

</script>

<div class="min-h-screen bg-[#eef3fb] px-4 py-8 font-nanum">
	<div class="mx-auto flex max-w-[1180px] flex-col gap-5">
		<header class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
			<button
				type="button"
				on:click={goBack}
				class="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"
			>
				← 수업 목록
			</button>

			<div class="mt-4 flex items-start justify-between gap-4">
				<div>
					<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
						LESSON DETAIL
					</div>

					<h1 class="mt-1 font-gmarket text-[30px] font-bold tracking-[-0.07em] text-slate-950">
						{lesson.title}
					</h1>

					<p class="mt-2 text-sm font-bold text-slate-500">
						{lesson.themeTitle} · {lesson.status === 'completed' ? '완료된 수업' : '진행 중 수업'}
					</p>
				</div>

				{#if lesson.status === 'completed'}
					<button
						type="button"
						on:click={handleDeleteLesson}
						disabled={isDeleting}
						class="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white disabled:bg-slate-300"
					>
						{isDeleting ? '삭제 중...' : '수업 삭제'}
					</button>
				{:else}
					<button
						type="button"
						on:click={handleCompleteLesson}
						disabled={isCompleting}
						class="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:bg-slate-300"
					>
						{isCompleting ? '완료 처리 중...' : '수업 종료하기'}
					</button>
				{/if}
			</div>

			{#if errorMessage}
				<div class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
					{errorMessage}
				</div>
			{/if}
		</header>

		{#if lesson.status === 'completed'}
			<section class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
					<div class="text-xs font-black text-slate-400">참여 학생</div>
					<div class="mt-2 text-[32px] font-black text-slate-950">
						{summary?.totalParticipants ?? 0}
					</div>
				</div>

				<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
					<div class="text-xs font-black text-slate-400">완료 방</div>
					<div class="mt-2 text-[32px] font-black text-slate-950">
						{summary?.completedRoomCount ?? 0}/{summary?.roomCount ?? 0}
					</div>
				</div>

				<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
					<div class="text-xs font-black text-slate-400">기록 상태</div>
					<div class="mt-2 text-[22px] font-black text-emerald-600">저장됨</div>
				</div>
			</section>

			<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
				<div class="text-[18px] font-black text-slate-950">많이 막힌 개념</div>

				<div class="mt-4 flex flex-wrap gap-2">
					{#each summary?.topConcepts ?? [] as item}
						<div class="rounded-full bg-amber-50 px-3 py-2 text-sm font-black text-amber-700">
							{getConceptLabel(item.concept)}
							{item.count}회
						</div>
					{/each}

					{#if !summary?.topConcepts?.length}
						<div class="text-sm font-bold text-slate-500">기록된 오류 개념이 없습니다.</div>
					{/if}
				</div>
			</section>

			{#each summary?.rooms ?? [] as roomSummary}
				<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
					<div class="flex items-center justify-between gap-3">
						<div>
							<div class="text-[20px] font-black text-slate-950">
								{roomSummary.roomNumber}번 방
							</div>

							<div class="mt-1 text-sm font-bold text-slate-500">
								코드 {roomSummary.code} · 참여 {roomSummary.participantCount}/{roomSummary.maxParticipants}명
							</div>
						</div>

						<div
							class={`rounded-full px-3 py-1 text-xs font-black ${
								roomSummary.completed
									? 'bg-emerald-50 text-emerald-700'
									: 'bg-slate-100 text-slate-600'
							}`}
						>
							{roomSummary.completed ? '완료' : '미완료'}
						</div>
					</div>

					<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
						{#each roomSummary.students as student}
							<div class="rounded-3xl bg-slate-50 p-4">
								<div class="flex items-start justify-between gap-3">
									<div>
										<div class="text-[16px] font-black text-slate-950">
											{student.name}
										</div>
										<div class="mt-1 text-sm font-bold text-slate-500">
											{student.roleName} 요원
										</div>
									</div>

									<div class="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
										시도 {student.totalAttempts}회
									</div>
								</div>

								<div class="mt-3 grid grid-cols-2 gap-2">
									<div class="rounded-2xl bg-white px-3 py-2 text-center">
										<div class="text-xs font-black text-emerald-500">성공</div>
										<div class="text-[20px] font-black text-emerald-700">
											{student.successCount}
										</div>
									</div>

									<div class="rounded-2xl bg-white px-3 py-2 text-center">
										<div class="text-xs font-black text-rose-500">실패</div>
										<div class="text-[20px] font-black text-rose-700">
											{student.failCount}
										</div>
									</div>
								</div>

								<div class="mt-3 flex flex-wrap gap-2">
									{#each getTopConcepts(student.conceptErrors) as concept}
										<div
											class="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-600"
										>
											{concept.label}
											{concept.count}회
										</div>
									{/each}

									{#if getTopConcepts(student.conceptErrors).length === 0}
										<div class="text-xs font-bold text-slate-400">기록된 어려움 없음</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		{:else}
			<section class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
				<div class="text-[18px] font-black text-slate-950">방 관리</div>
				<div class="mt-1 text-sm font-bold text-slate-500">
					학생 입장 코드와 진행 상태를 확인합니다.
				</div>

				<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
					{#each rooms as room}
						{@const roomSummary = buildRoomSummary(room)}
						{@const roomParticipants = getRoomParticipants(room)}
						{@const roomCreatedAt = getRoomCreatedAt(room)}
						{@const totalAttempts = getRoomTotalAttempts(room)}
						{@const failCount = getRoomFailCount(room)}
						
<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
			<div
			role="button"
			tabindex="0"
			on:click={() => toggleRoomOpen(room)}
			on:keydown={(event) => handleRoomHeaderKeydown(event, room)}
			class="w-full cursor-pointer rounded-[26px] bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
		>
		<div class="flex items-center justify-between gap-4">
			<div class="min-w-0">
				<div class="flex items-center gap-2">
					<div class="text-[22px] font-black tracking-[-0.04em] text-slate-950">
						{room.roomNumber}번 방
					</div>

					<div
						class={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getRoomToneClass(
							roomSummary.tone
						)}`}
					>
						{roomSummary.label}
					</div>
				</div>

				<div class="mt-2 flex items-center gap-2 text-[12px] font-bold text-slate-400">
					<span>생성</span>
					<span class="rounded-full bg-slate-100 px-2.5 py-1 font-black text-slate-600">
						{formatDateTime(roomCreatedAt)}
					</span>
				</div>

				<div class="mt-2 flex flex-wrap gap-1.5">
					<div class="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700">
						입장 {room.participantCount ?? 0}/{room.maxParticipants ?? 4}
					</div>

					<div class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
						미션 {(room.currentMissionIndex ?? 0) + 1}
					</div>

					{#if roomParticipants.length > 0}
						<div class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
							{roomParticipants.map((participant, index) => getParticipantName(participant, index)).join(', ')}
						</div>
					{/if}
				</div>
			</div>

			<div class="flex shrink-0 items-center gap-3">
				<div class="text-right">
					<div class="text-[10px] font-black tracking-[0.18em] text-slate-400">
						입장 코드
					</div>

					<div
						class="mt-1 px-4 font-gmarket text-[72px] font-black leading-none tracking-[0.08em] text-blue-600"
					>
						{room.code}
					</div>
				</div>

				<div
					class={`flex h-9 w-9 items-center justify-center rounded-xl text-[18px] font-black transition ${
						isRoomOpened(room)
							? 'bg-blue-600 text-white'
							: 'bg-slate-100 text-slate-500'
					}`}
				>
					{isRoomOpened(room) ? '⌃' : '⌄'}
				</div>
			</div>
		</div>
	</div>

	{#if isRoomOpened(room)}
		<div class="mt-3">
			<div class="grid grid-cols-4 gap-2">
				<div class="rounded-2xl bg-white px-3 py-3 text-center ring-1 ring-slate-200">
					<div class="text-[11px] font-black text-slate-400">입장</div>
					<div class="mt-1 text-[20px] font-black text-slate-950">
						{room.participantCount ?? 0}/{room.maxParticipants ?? 4}
					</div>
				</div>

				<div class="rounded-2xl bg-white px-3 py-3 text-center ring-1 ring-slate-200">
					<div class="text-[11px] font-black text-slate-400">현재 미션</div>
					<div class="mt-1 text-[20px] font-black text-violet-700">
						{(room.currentMissionIndex ?? 0) + 1}
					</div>
				</div>

				<div class="rounded-2xl bg-white px-3 py-3 text-center ring-1 ring-slate-200">
					<div class="text-[11px] font-black text-slate-400">시도</div>
					<div class="mt-1 text-[20px] font-black text-blue-700">
						{totalAttempts}
					</div>
				</div>

				<div class="rounded-2xl bg-white px-3 py-3 text-center ring-1 ring-slate-200">
					<div class="text-[11px] font-black text-slate-400">실패</div>
					<div class="mt-1 text-[20px] font-black text-rose-700">
						{failCount}
					</div>
				</div>
			</div>

			<div class="mt-3 rounded-2xl bg-white px-3 py-3 text-sm font-bold text-slate-500 ring-1 ring-slate-200">
				{roomSummary.detail}
			</div>

			<div class="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
				<div class="flex items-center justify-between gap-2">
					<div class="text-[13px] font-black text-slate-800">
						현재 입장한 학생
					</div>

					<div class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
						{roomParticipants.length}명
					</div>
				</div>

				{#if roomParticipants.length > 0}
					<div class="mt-3 flex flex-wrap gap-2">
						{#each roomParticipants as participant, index}
							<div
								class="rounded-full bg-blue-50 px-3 py-1.5 text-[12px] font-black text-blue-700 ring-1 ring-blue-100"
							>
								{getParticipantName(participant, index)}
							</div>
						{/each}
					</div>
				{:else}
					<div class="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-[12px] font-bold text-slate-400">
						아직 입장한 학생이 없습니다.
					</div>
				{/if}
			</div>

			{#if isReadCourse}
				{@const currentMission = getCurrentMission(room)}
				{@const pendingReviews = getPendingReviewItems(room)}

				<div class="mt-3 rounded-2xl border border-violet-100 bg-violet-50 p-3">
					<div class="flex items-center justify-between gap-3">
						<div>
							<div class="text-[13px] font-black text-violet-800">읽기 미션 제출 확인</div>
							<div class="mt-1 text-xs font-bold text-violet-600">
								현재 미션: {currentMission?.title ?? '미션 정보 없음'}
							</div>
						</div>

						<div
							class="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-violet-700"
						>
							대기 {pendingReviews.length}개
						</div>
					</div>

					{#if pendingReviews.length > 0}
						<div class="mt-3 space-y-2">
							{#each pendingReviews as review}
								<div class="rounded-2xl bg-white p-3">
									<div class="flex items-center justify-between gap-3">
										<div class="min-w-0">
											<div class="text-sm font-black text-slate-950">
												{review.participantName}
											</div>
											<div class="mt-1 text-xs font-bold text-slate-500">
												{review.roleName} · 제출 대기
											</div>
										</div>

										<div class="flex shrink-0 gap-2">
											<button
												type="button"
												on:click={() => rejectReview(room, review.key)}
												disabled={processingReviewKey === `${room.id}:${review.key}`}
												class="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 disabled:opacity-50"
											>
												반려
											</button>

											<button
												type="button"
												on:click={() => approveReview(room, review.key)}
												disabled={processingReviewKey === `${room.id}:${review.key}`}
												class="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white disabled:bg-slate-300"
											>
												승인
											</button>
										</div>
									</div>

									<pre
										class="mt-3 max-h-28 overflow-auto rounded-xl bg-slate-950 p-3 text-xs font-bold leading-5 text-emerald-100">{review.jsonText}</pre>
								</div>
							{/each}
						</div>
					{:else}
						<div
							class="mt-3 rounded-2xl bg-white px-3 py-3 text-sm font-bold text-slate-500"
						>
							아직 승인할 제출물이 없습니다.
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
					{/each}

					{#if rooms.length === 0}
						<div class="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
							방 정보가 없습니다.
						</div>
					{/if}
				</div>
			</section>
		{/if}
	</div>
</div>
