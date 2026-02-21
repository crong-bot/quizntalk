<script>
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import { addToClassroom, removeFromClassroom } from '$lib/firebase/classroom';
	import { authUser } from '$lib/stores/authUser';
	import { Toaster, toast } from 'svelte-french-toast';

	export let data;

	let addLessonId = '';
	let loading = false;
	let items = data?.lessons ?? [];

	// load() 결과 갱신되면 items도 갱신
	$: items = data?.lessons ?? items;

	async function onAdd() {
		const uid = $authUser?.uid;
		if (!uid) {
			toast.error('로그인이 필요합니다.');
			goto('/login');
			return;
		}

		const lessonId = addLessonId.trim();
		if (!lessonId) return toast.error('lessonId를 입력하세요.');

		try {
			loading = true;
			await addToClassroom({ uid, lessonId });
			toast.success('강의실에 추가했습니다.');

			// 간단히: 새로고침(가장 확실)
			location.reload();
		} catch (e) {
			toast.error(e?.message ?? '추가 실패');
		} finally {
			loading = false;
		}
	}

	async function onRemove(lessonId) {
		const uid = $authUser?.uid;
		if (!uid) return toast.error('로그인이 필요합니다.');

		if (!confirm('강의실에서 제거할까요? (원본 강의는 삭제되지 않습니다)')) return;

		try {
			loading = true;
			await removeFromClassroom({ uid, lessonId });
			toast.success('제거했습니다.');
			// 즉시 UI 반영
			items = items.filter((x) => x.lessonId !== lessonId);
		} catch (e) {
			toast.error(e?.message ?? '삭제 실패');
		} finally {
			loading = false;
		}
	}

	function openLesson(lessonId) {
		// 네 플레이어 라우트에 맞춰 수정:
		// 예) /study/u/[lessonId]/[step]
		goto(`/study/u/${lessonId}/0`);
	}
</script>

<Toaster />
<Nav />
<div class="w-1280 m-auto">
	<main class="px-10 py-10">
		<div class="flex items-end justify-between">
			<div>
				<h1 class="text-3xl font-bold">강의실</h1>
				<p class="text-slate-500 mt-2">추가한 강의 목록입니다. 삭제해도 원본 강의는 유지돼요.</p>
			</div>

			<div class="flex gap-2 items-center">
				<input
					class="w-80 px-4 py-2 rounded-xl border border-slate-200 bg-white"
					placeholder="lessonId 입력 (또는 링크에서 ID)"
					bind:value={addLessonId}
					disabled={loading}
				/>
				<button
					class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
					on:click={onAdd}
					disabled={loading}
				>
					+ 추가
				</button>
			</div>
		</div>

		<div class="mt-8 grid grid-cols-3 gap-4">
			{#if !items || items.length === 0}
				<div class="col-span-3 p-8 rounded-2xl bg-white border border-slate-100 text-slate-500">
					아직 추가한 강의가 없습니다. lessonId로 추가해보세요.
				</div>
			{:else}
				{#each items as lesson (lesson.lessonId)}
					<div class="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
						{#if lesson.missing}
							<div class="text-sm text-rose-600 font-semibold">원본 강의를 찾을 수 없음</div>
							<div class="mt-2 text-slate-700">{lesson.lessonId}</div>
							<div class="mt-4 flex gap-2">
								<button
									class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
									on:click={() => onRemove(lesson.lessonId)}
								>
									목록에서 제거
								</button>
							</div>
						{:else}
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<div class="text-xs text-slate-400">lessonId</div>
									<div class="text-sm text-slate-500 truncate">{lesson.lessonId}</div>

									<h2 class="mt-2 text-lg font-bold text-slate-900 truncate">
										{lesson.title || '(제목 없음)'}
									</h2>

									{#if lesson.info}
										<p class="mt-1 text-sm text-slate-600 line-clamp-2">{lesson.info}</p>
									{/if}

									<div class="mt-3 text-xs text-slate-400">
										제작자: {lesson.ownerUid || 'unknown'} · 공개: {lesson.visibility}
									</div>
								</div>

								<div class="flex flex-col gap-2 shrink-0">
									<button
										class="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
										on:click={() => openLesson(lesson.lessonId)}
										disabled={loading}
									>
										열기
									</button>
									<button
										class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
										on:click={() => onRemove(lesson.lessonId)}
										disabled={loading}
									>
										삭제
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</main>
</div>
