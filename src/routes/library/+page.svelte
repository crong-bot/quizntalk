<script>
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import { onMount } from 'svelte';

	import LessonShare from '$lib/components/lessonShare.svelte';
	import { authUser } from '$lib/stores/authUser';

	import {
		addLessonToCourse,
		createCourse,
		deleteLessonFromCourse,
		listLessonsByCourse,
		listMyCourses,
		reorderLessonsInCourse
	} from '$lib/firebase/courses';

	import { updateLessonTitle } from '$lib/firebase/lessons';
	// ✅ 추가

	let loading = true;
	let error = '';

	let courses = [];
	let lessonsByCourse = {}; // courseId -> lessons[]

	// ✅ dialogs
	let showCreateCourse = false;
	let courseTitleInput = '새 강의';

	let showAddLesson = false;
	let targetCourse = null;
	let lessonTitleInput = '1차시';

	let showRenameLesson = false;
	let renameLessonId = '';
	let renameLessonTitle = '';

	let showAlert = false;
	let alertMessage = '';

	function openAlert(msg) {
		alertMessage = msg;
		showAlert = true;
	}

	function getLessonId(l) {
		// ✅ 편집/열기 안 되는 문제의 90%는 여기서 해결됨
		return l?.lessonId ?? l?.id ?? '';
	}

	async function refresh(uid) {
		loading = true;
		error = '';
		try {
			courses = await listMyCourses(uid);

			const entries = await Promise.all(
				courses.map(async (c) => {
					const ls = await listLessonsByCourse(c.id);
					return [c.id, ls];
				})
			);
			lessonsByCourse = Object.fromEntries(entries);
		} catch (e) {
			console.error(e);
			error = e?.message ?? '불러오기 실패';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const unsub = authUser.subscribe((u) => {
			if (u === undefined) return;
			if (!u) {
				goto('/login');
				return;
			}
			refresh(u.uid);
		});
		return () => unsub();
	});

	// ✅ Course create dialog
	function openCreateCourseDialog() {
		courseTitleInput = '새 강의';
		showCreateCourse = true;
	}

	async function submitCreateCourse() {
		const u = $authUser;
		if (!u) return;

		const title = (courseTitleInput ?? '').trim();
		if (!title) return openAlert('강의 이름을 입력해줘.');

		try {
			loading = true;
			showCreateCourse = false;

			await createCourse({
				ownerUid: u.uid,
				title
			});

			await refresh(u.uid);
		} catch (e) {
			console.error(e);
			error = e?.message ?? '생성 실패';
		} finally {
			loading = false;
		}
	}

	// ✅ Add lesson dialog
	function openAddLessonDialog(course) {
		targetCourse = course;
		lessonTitleInput = (course?.lessonCount ?? 0) === 0 ? '1차시' : '새 차시';
		showAddLesson = true;
	}

	async function submitAddLesson() {
		const u = $authUser;
		if (!u) return;

		if (!targetCourse?.id) return openAlert('대상 강의가 없습니다.');

		const title = (lessonTitleInput ?? '').trim();
		if (!title) return openAlert('차시 이름을 입력해줘.');

		try {
			loading = true;
			showAddLesson = false;

			const { lessonId } = await addLessonToCourse({
				courseId: targetCourse.id,
				ownerUid: u.uid,
				title
			});

			goto(`/builder?lessonId=${encodeURIComponent(lessonId)}`);
		} catch (e) {
			console.error(e);
			error = e?.message ?? '차시 추가 실패';
		} finally {
			loading = false;
		}
	}

	// ✅ lesson actions
	function openLesson(l) {
		const id = getLessonId(l);
		if (!id) return openAlert('lessonId를 찾지 못했어.');
		goto(`/study/u/${encodeURIComponent(id)}/0`);
	}

	function editLesson(l) {
		const id = getLessonId(l);
		if (!id) return openAlert('lessonId를 찾지 못했어.');
		goto(`/builder?lessonId=${encodeURIComponent(id)}`);
	}

	function openRenameLessonDialog(l) {
		const id = getLessonId(l);
		if (!id) return openAlert('lessonId를 찾지 못했어.');

		renameLessonId = id;
		renameLessonTitle = (l?.title ?? '').toString();
		showRenameLesson = true;
	}

	async function submitRenameLesson() {
		const u = $authUser;
		if (!u) return;

		const t = (renameLessonTitle ?? '').trim();
		if (!t) return openAlert('차시 이름을 입력해줘.');

		try {
			loading = true;
			showRenameLesson = false;

			await updateLessonTitle({ lessonId: renameLessonId, title: t });

			// ✅ 화면 즉시 반영: 전체 refresh가 가장 안전
			await refresh(u.uid);
		} catch (e) {
			console.error(e);
			error = e?.message ?? '이름 변경 실패';
		} finally {
			loading = false;
		}
	}

	function lessonBadge(i) {
		return `${i + 1}차시`;
	}
	// ✅ drag state
	let dragging = { courseId: '', lessonId: '' };

	// courseId별 저장중 표시(선택)
	let savingOrder = {}; // courseId -> boolean

	function setSaving(courseId, v) {
		savingOrder = { ...savingOrder, [courseId]: v };
	}

	function onDragStart(courseId, lessonId, e) {
		dragging = { courseId, lessonId };
		e.dataTransfer.effectAllowed = 'move';
		// 일부 브라우저에서 드래그가 안 먹는 경우 방지용
		e.dataTransfer.setData('text/plain', lessonId);
	}

	function onDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}

	async function onDrop(courseId, targetLessonId, e) {
		e.preventDefault();

		const srcCourseId = dragging.courseId;
		if (!srcCourseId || srcCourseId !== courseId) return;

		const sourceLessonId = dragging.lessonId || e.dataTransfer.getData('text/plain');

		if (!sourceLessonId || sourceLessonId === targetLessonId) return;

		const list = lessonsByCourse[courseId];
		if (!Array.isArray(list)) return;

		const from = list.findIndex((x) => (x.id ?? x.lessonId) === sourceLessonId);
		const to = list.findIndex((x) => (x.id ?? x.lessonId) === targetLessonId);
		if (from < 0 || to < 0) return;

		// ✅ optimistic reorder (UI 먼저)
		const next = [...list];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);

		lessonsByCourse = { ...lessonsByCourse, [courseId]: next };

		// ✅ persist (Firestore order 업데이트)
		try {
			setSaving(courseId, true);

			// orderedLessonIds는 "문서 id" 배열이어야 함
			const orderedLessonIds = next.map((x) => x.id ?? x.lessonId).filter(Boolean);

			await reorderLessonsInCourse({ courseId, orderedLessonIds });
		} catch (err) {
			console.error(err);
			openAlert('순서 저장에 실패했어. 새로고침 후 다시 시도해줘.');
			// 실패 시 서버 상태로 복구
			const u = $authUser;
			if (u) await refresh(u.uid);
		} finally {
			setSaving(courseId, false);
			dragging = { courseId: '', lessonId: '' };
		}
	}

	function onDragEnd() {
		dragging = { courseId: '', lessonId: '' };
	}
	///--------------------------------------------
	let showDeleteLesson = false;
	let deleteTarget = { courseId: '', lessonDocId: '', title: '' };

	function openDeleteLessonDialog(courseId, lessonDocId, title) {
		showDeleteLesson = true;
		deleteTarget = { courseId, lessonDocId, title: title ?? '' };
	}

	async function submitDeleteLesson() {
		const u = $authUser;
		if (!u) return;

		try {
			loading = true;
			showDeleteLesson = false;

			await deleteLessonFromCourse({
				courseId: deleteTarget.courseId,
				lessonDocId: deleteTarget.lessonDocId
			});

			await refresh(u.uid);
		} catch (e) {
			console.error(e);
			error = e?.message ?? '삭제 실패';
		} finally {
			loading = false;
		}
	}
</script>

<Nav />

<div class="w-1280 m-auto px-10 py-10">
	<div class="flex items-end justify-between">
		<div>
			<div class="text-slate-400 text-sm font-semibold">My Library</div>
			<div class="font-dodum font-extrabold text-3xl text-slate-900 mt-2">내 강의실</div>
			<div class="text-slate-500 mt-2">
				코스 안에 차시를 추가하고, 각 차시를 열거나 편집/이름변경할 수 있어요.
			</div>
		</div>

		<button
			class="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
			on:click={openCreateCourseDialog}
		>
			+ 새 강의 만들기
		</button>
	</div>

	{#if loading}
		<div class="mt-10 text-slate-500">불러오는 중...</div>
	{:else if error}
		<div class="mt-10 text-rose-600">에러: {error}</div>
	{:else if courses.length === 0}
		<div class="mt-10 text-slate-500">아직 만든 강의가 없어요. “새 강의 만들기”로 시작해봐.</div>
	{:else}
		<div class="mt-8 grid grid-cols-3 gap-6">
			{#each courses as c (c.id)}
				<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<div class="text-slate-400 text-xs font-semibold">COURSE</div>
							<div class="text-slate-900 font-extrabold text-xl mt-1 truncate">
								{c.title || c.id}
							</div>
							<div class="text-slate-500 text-sm mt-2">
								{c.info || `${c.lessonCount ?? lessonsByCourse[c.id]?.length ?? 0}개`}
							</div>
						</div>

						<button
							class="shrink-0 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100"
							on:click={() => openAddLessonDialog(c)}
						>
							+ 차시
						</button>
					</div>

					{#if Array.isArray(lessonsByCourse[c.id]) && lessonsByCourse[c.id].length > 0}
						<div class="mt-5 text-slate-400 text-xs font-semibold">차시 목록</div>

						<ul class="mt-2 space-y-2">
							{#each lessonsByCourse[c.id] as l, i (getLessonId(l))}
								<li
									class="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 hover:bg-slate-50"
									draggable="true"
									on:dragstart={(e) => onDragStart(c.id, getLessonId(l), e)}
									on:dragover={onDragOver}
									on:drop={(e) => onDrop(c.id, getLessonId(l), e)}
									on:dragend={onDragEnd}
								>
									<!-- ✅ drag handle (항상 보이는 SVG) -->
									<div
										class="w-7 flex items-start justify-center pt-1 text-slate-300 cursor-grab select-none"
									>
										<svg
											width="14"
											height="18"
											viewBox="0 0 14 18"
											fill="currentColor"
											aria-hidden="true"
										>
											<circle cx="4" cy="3" r="1.2" />
											<circle cx="10" cy="3" r="1.2" />
											<circle cx="4" cy="9" r="1.2" />
											<circle cx="10" cy="9" r="1.2" />
											<circle cx="4" cy="15" r="1.2" />
											<circle cx="10" cy="15" r="1.2" />
										</svg>
									</div>

									<!-- ✅ left: title/meta -->
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2">
											<span
												class="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
											>
												{lessonBadge(i)}
											</span>
											<div class="min-w-0">
												<div class="text-slate-900 font-extrabold truncate">
													{l.title || l.id}
												</div>
												{#if l.info}
													<div class="text-xs text-slate-500 mt-1 truncate">
														{l.info}
													</div>
												{/if}
											</div>

											{#if savingOrder[c.id]}
												<span class="text-xs text-slate-400 ml-2">저장중…</span>
											{/if}
										</div>
									</div>

									<!-- ✅ right: actions (기성앱처럼 정돈) -->
									<div class="shrink-0 flex flex-col gap-2 items-end">
										<div class="flex gap-2">
											<button
												class="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
												on:click|stopPropagation={() => openLesson(l)}
												on:mousedown|stopPropagation
											>
												열기
											</button>

											<button
												class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold hover:bg-slate-50"
												on:click|stopPropagation={() => editLesson(l)}
												on:mousedown|stopPropagation
											>
												편집
											</button>
										</div>

										<div class="flex gap-2">
											<button
												class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold hover:bg-slate-50"
												on:click|stopPropagation={() => openRenameLessonDialog(l)}
												on:mousedown|stopPropagation
											>
												이름
											</button>

											<button
												class="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50"
												on:click|stopPropagation={() =>
													openDeleteLessonDialog(c.id, l.id ?? l.lessonId, l.title || '차시')}
												on:mousedown|stopPropagation
											>
												삭제
											</button>
										</div>
									</div>
								</li>
							{/each}
						</ul>
					{:else}
						<div class="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-4">
							<div class="text-slate-700 font-bold">차시가 아직 없어요</div>
							<div class="text-slate-500 text-sm mt-1">
								오른쪽 위 “+ 차시”로 첫 차시를 추가해줘.
							</div>
						</div>
					{/if}

					<div class="mt-4">
						<LessonShare
							lesson={{ id: c.id, ownerUid: c.ownerUid, title: c.title, inviteCode: c.inviteCode }}
							authUid={$authUser?.uid ?? ''}
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- ✅ Create Course Dialog -->
{#if showCreateCourse}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black/40" on:click={() => (showCreateCourse = false)}></div>

		<div class="relative bg-white rounded-3xl p-6 w-[520px] shadow-xl">
			<div class="flex items-start justify-between">
				<div>
					<div class="text-sm text-slate-500">새 강의 만들기</div>
					<div class="text-lg font-bold mt-1">강의 이름을 입력해줘</div>
				</div>
				<button
					class="px-2 py-1 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
					on:click={() => (showCreateCourse = false)}
				>
					닫기
				</button>
			</div>

			<div class="mt-5">
				<div class="text-sm font-semibold text-slate-700 mb-2">강의 이름</div>
				<input
					class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
					bind:value={courseTitleInput}
					placeholder="예) 인공지능의 인식"
				/>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				<button
					class="px-4 py-3 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50"
					on:click={() => (showCreateCourse = false)}
				>
					취소
				</button>
				<button
					class="px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
					on:click={submitCreateCourse}
				>
					만들기
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ✅ Add Lesson Dialog -->
{#if showAddLesson}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black/40" on:click={() => (showAddLesson = false)}></div>

		<div class="relative bg-white rounded-3xl p-6 w-[520px] shadow-xl">
			<div class="flex items-start justify-between">
				<div>
					<div class="text-sm text-slate-500">차시 추가</div>
					<div class="text-lg font-bold mt-1">{targetCourse?.title ?? '강의'}</div>
				</div>
				<button
					class="px-2 py-1 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
					on:click={() => (showAddLesson = false)}
				>
					닫기
				</button>
			</div>

			<div class="mt-5">
				<div class="text-sm font-semibold text-slate-700 mb-2">차시 이름</div>
				<input
					class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
					bind:value={lessonTitleInput}
					placeholder="예) 1차시"
				/>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				<button
					class="px-4 py-3 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50"
					on:click={() => (showAddLesson = false)}
				>
					취소
				</button>
				<button
					class="px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
					on:click={submitAddLesson}
				>
					추가하고 편집하기
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ✅ Rename Lesson Dialog -->
{#if showRenameLesson}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black/40" on:click={() => (showRenameLesson = false)}></div>

		<div class="relative bg-white rounded-3xl p-6 w-[520px] shadow-xl">
			<div class="flex items-start justify-between">
				<div>
					<div class="text-sm text-slate-500">차시 이름 변경</div>
					<div class="text-lg font-bold mt-1">새 이름을 입력해줘</div>
				</div>
				<button
					class="px-2 py-1 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
					on:click={() => (showRenameLesson = false)}
				>
					닫기
				</button>
			</div>

			<div class="mt-5">
				<div class="text-sm font-semibold text-slate-700 mb-2">차시 이름</div>
				<input
					class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
					bind:value={renameLessonTitle}
					placeholder="예) 2차시 - RGB란?"
				/>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				<button
					class="px-4 py-3 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50"
					on:click={() => (showRenameLesson = false)}
				>
					취소
				</button>
				<button
					class="px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
					on:click={submitRenameLesson}
				>
					저장
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ✅ Alert Dialog -->
{#if showAlert}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black/40" on:click={() => (showAlert = false)}></div>

		<div class="relative bg-white rounded-3xl p-6 w-[460px] shadow-xl">
			<div class="text-sm text-slate-500">안내</div>
			<div class="text-base font-bold mt-2 text-slate-900">{alertMessage}</div>

			<div class="mt-6 flex justify-end">
				<button
					class="px-4 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800"
					on:click={() => (showAlert = false)}
				>
					확인
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showDeleteLesson}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="absolute inset-0 bg-black/40" on:click={() => (showDeleteLesson = false)}></div>

		<div class="relative bg-white rounded-3xl p-6 w-[480px] shadow-xl">
			<div class="text-sm text-slate-500">차시 삭제</div>
			<div class="text-lg font-bold mt-2 text-slate-900">
				“{deleteTarget.title}”를 삭제할까요?
			</div>
			<div class="text-sm text-slate-500 mt-2">삭제하면 복구할 수 없어요.</div>

			<div class="mt-6 flex justify-end gap-2">
				<button
					class="px-4 py-3 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50"
					on:click={() => (showDeleteLesson = false)}
				>
					취소
				</button>
				<button
					class="px-4 py-3 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700"
					on:click={submitDeleteLesson}
				>
					삭제하기
				</button>
			</div>
		</div>
	</div>
{/if}
