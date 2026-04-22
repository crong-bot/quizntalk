<script>
	import ChatBubble from '$lib/components/chatscreen/chat_bubble.svelte';
	import View_button from '$lib/components/chatscreen/view_button.svelte';
	import Modal from '$lib/components/chatscreen/view_modal.svelte';
	import Sidebar from '$lib/components/chatscreen/view_sidebar.svelte';
	import { moduleRegistry } from '$lib/components/classmodule/moduledeliver.js';
	import Quiz from '$lib/components/quizmodule.svelte';
	import { LessonManager } from '$lib/stores/LessonManager.js';
	import { onDestroy, onMount, tick } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let data;

	let scrollEl; // ✅ 스크롤 컨테이너
	let showSidebarDrawer = false;
	let showModalDrawer = false;

	$: post = data?.post ?? null;
	$: lessonKey = data?.lessonKey ?? post?.slug ?? post?.id ?? data?.lessonId ?? '';
	$: chapter = data?.step ?? 0;

	// ✅ "총 챕터 수" (너 프로젝트 기준에 맞게 계산)
	// 보통 /study/{lessonKey}/{chapter} 에서 chapter가 페이지면
	// lessons.length - 1 이 마지막 인덱스인 경우가 많음.
	$: totalPages = Math.max(0, (data?.lessons?.length ?? 1) - 1);

	function closeDrawers() {
		showSidebarDrawer = false;
		showModalDrawer = false;
	}

	function onKeydown(e) {
		if (e.key === 'Escape') closeDrawers();
	}

	// ----------------------------
	// ✅ 진행(Progress) helpers
	// ----------------------------
	const getProg = () => $LessonManager?.progress?.[lessonKey]?.[chapter] ?? {};
	const setProg = (patch) => {
		LessonManager.update((s) => {
			if (s.progress == null) s.progress = {};
			if (s.progress[lessonKey] == null) s.progress[lessonKey] = {};

			s.progress[lessonKey][chapter] = {
				...(s.progress[lessonKey][chapter] || {}),
				...patch
			};

			return s;
		});
	};

	// ----------------------------
	// ✅ "몇 번째 step까지 보여줄지" (핵심)
	// ----------------------------
	let revealedIndex = -1; // 지금까지 보여준 마지막 step index
	let blockingIndex = null; // 잠금을 만든 step index (quiz/module)

	// 챕터/레슨 바뀌면 저장된 reveal을 복원
	$: {
		const p = getProg();
		const savedReveal = typeof p.reveal === 'number' ? p.reveal : -1;
		const savedBlocking = typeof p.blockingIndex === 'number' ? p.blockingIndex : null;

		// lessonKey/chapter 바뀔 때만 세팅되게 가드
		// (Svelte 반응형 특성상 자주 도는 걸 막기 위해)
		// 조건: post가 있고, revealedIndex가 초기상태거나 chapter가 바뀐 경우에만 "복원"
		if (
			post &&
			(revealedIndex === -1 || p._chapterMarker !== chapter || p._lessonMarker !== lessonKey)
		) {
			revealedIndex = savedReveal;
			blockingIndex = savedBlocking;

			// 마커 저장 (이거 없으면 반응형 루프 가능)
			setProg({ _chapterMarker: chapter, _lessonMarker: lessonKey });
		}
	}

	// ✅ 잠금 상태: "blockingIndex가 있고, 해당 퀴즈가 아직 success가 아니면" 잠금
	$: locked = (() => {
		const p = getProg();
		return blockingIndex != null && p.success !== true;
	})();
	// ✅ revealedIndex가 block step(quiz/module)을 포함하면, 자동 잠금 걸기
	function enforceBlockingIfNeeded() {
		if (!post?.steps) return;

		const step = post.steps[revealedIndex];
		if (!step) return;

		const isBlock =
			step.kind === 'quiz' ||
			(step.kind === 'module' && (step.block === true || step?.props?.block === true));
		if (!isBlock) return;

		// 이미 다른 block으로 잠긴 상태면 유지
		if (blockingIndex !== null) return;

		blockingIndex = revealedIndex;
		setProg({ lock: true, success: false, stepIndex: revealedIndex, blockingIndex: revealedIndex });
	}

	async function scrollToBottom(force = false) {
		await tick();
		if (!scrollEl) return;

		scrollEl.scrollTo({
			top: scrollEl.scrollHeight,
			behavior: force ? 'auto' : 'smooth'
		});

		requestAnimationFrame(() => {
			if (!scrollEl) return;
			scrollEl.scrollTo({
				top: scrollEl.scrollHeight,
				behavior: 'auto'
			});

			requestAnimationFrame(() => {
				if (!scrollEl) return;
				scrollEl.scrollTo({
					top: scrollEl.scrollHeight,
					behavior: 'auto'
				});
			});
		});
	}

	// ✅ 다음 step 하나 공개
	async function next() {
		if (!post?.steps || post.steps.length === 0) return;
		// 잠겨있으면 안내
		if (locked) {
			toast('먼저 퀴즈를 완료해주세요.', { icon: '🔒', position: 'bottom-center' });
			return;
		}

		const lastIdx = post.steps.length - 1;

		// ✅ 이미 끝까지 보여줬으면 "끝났습니다"
		if (revealedIndex >= lastIdx) {
			toast('끝났습니다.', { icon: '💯💯', position: 'bottom-center' });
			return;
		}

		// 다음 step 공개
		const nextIdx = Math.min(revealedIndex + 1, lastIdx);
		revealedIndex = nextIdx;
		setProg({ reveal: revealedIndex });

		enforceBlockingIfNeeded();
		await scrollToBottom();
	}

	// ✅ 퀴즈가 풀렸을 때(=progress success true), block 해제
	$: {
		const p = getProg();
		// 지금 잠금 만든 step이 성공이면 unlock
		if (blockingIndex != null && p.stepIndex === blockingIndex && p.success === true) {
			blockingIndex = null;
			setProg({ lock: false, blockingIndex: null });
		}
	}
	function markCurrentStepSuccess(stepIndex) {
		blockingIndex = null;
		setProg({
			success: true,
			lock: false,
			stepIndex,
			blockingIndex: null
		});
	}
	function handleForceScrollBottom() {
		console.log('[SCROLL EVENT]', {
			scrollTop: scrollEl?.scrollTop,
			scrollHeight: scrollEl?.scrollHeight,
			clientHeight: scrollEl?.clientHeight
		});
		scrollToBottom(true);
	}

	onMount(async () => {
		window.addEventListener('keydown', onKeydown);
		window.addEventListener('lesson:scroll-bottom', handleForceScrollBottom);

		// 처음 진입했는데 reveal이 없으면 첫 step 자동 1개 보여주기
		await tick();
		if (revealedIndex < 0) {
			await next();
		} else {
			// 복원된 경우에도 block 체크
			enforceBlockingIfNeeded();
			await scrollToBottom(true);
		}
	});

	onDestroy(() => {
		window.removeEventListener('keydown', onKeydown);
		window.removeEventListener('lesson:scroll-bottom', handleForceScrollBottom);
	});
</script>

<Toaster />

<div class="min-h-screen w-full max-w-[1280px] mx-auto flex flex-col">
	<div class="relative flex flex-grow">
		<main id="mainframe" class="flex-1">
			<!-- ✅ md 미만: 상단바 + drawer -->
			<div class="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
				<div class="flex items-center justify-between px-3 py-2">
					<button
						type="button"
						class="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold"
						on:click={() => {
							showSidebarDrawer = true;
							showModalDrawer = false;
						}}
					>
						☰ 목차
					</button>

					<div class="text-sm font-extrabold text-slate-800 truncate max-w-[50%]">
						{data?.course?.title ?? data?.post?.title ?? 'Study'}
					</div>

					<button
						type="button"
						class="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold"
						on:click={() => {
							showModalDrawer = true;
							showSidebarDrawer = false;
						}}
					>
						ℹ️ 학습정보
					</button>
				</div>
			</div>

			{#if showSidebarDrawer || showModalDrawer}
				<button
					type="button"
					class="md:hidden fixed inset-0 z-40 bg-black/40"
					aria-label="닫기"
					on:click={closeDrawers}
				/>
			{/if}

			<aside
				class="md:hidden fixed top-0 left-0 z-50 h-dvh w-[82%] max-w-[320px] bg-white shadow-2xl
        transform transition-transform duration-200 -translate-x-full"
				class:translate-x-0={showSidebarDrawer}
				aria-hidden={!showSidebarDrawer}
			>
				<div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
					<div class="font-extrabold text-slate-900">목차</div>
					<button
						type="button"
						class="px-3 py-2 rounded-xl border border-slate-200 font-bold"
						on:click={() => (showSidebarDrawer = false)}
					>
						닫기
					</button>
				</div>

				<div class="h-full overflow-y-auto">
					<Sidebar course={data.course} lessons={data.lessons} />
				</div>
			</aside>

			<aside
				class="md:hidden fixed top-0 right-0 z-50 h-dvh w-[82%] max-w-[320px] bg-white shadow-2xl
        transform transition-transform duration-200 translate-x-full"
				class:translate-x-0={showModalDrawer}
				aria-hidden={!showModalDrawer}
			>
				<div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
					<div class="font-extrabold text-slate-900">학습정보</div>
					<button
						type="button"
						class="px-3 py-2 rounded-xl border border-slate-200 font-bold"
						on:click={() => (showModalDrawer = false)}
					>
						닫기
					</button>
				</div>

				<div class="h-full overflow-y-auto">
					<Modal
						course={data.course}
						lessons={data.lessons}
						currentLessonId={data.lessonKey}
						currentLessonTitle={data.post?.title}
					/>
				</div>
			</aside>

			<!-- ✅ 데스크탑/태블릿 레이아웃 -->
			<div id="view" class="w-full grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-1">
				<div class="hidden md:block md:col-span-3 min-w-0">
					<Sidebar course={data.course} lessons={data.lessons} />
				</div>

				<div id="main_content" class="md:col-span-9 lg:col-span-7 min-w-0 flex flex-col rounded-lg">
					<div
						id="chat_box_container"
						class="relative h-[85vh] mx-3 mt-3 md:mx-6 md:mt-6 lg:mx-8 lg:mt-8 bg-white rounded-3xl min-w-0"
					>
						<div
							bind:this={scrollEl}
							id="scrollbar"
							class="overflow-y-auto h-full pr-1 pl-2 pt-1 min-w-0"
						>
							{#if !post}
								<div class="p-6 text-slate-500">
									레슨 데이터를 불러오는 중이거나 존재하지 않습니다.
								</div>
							{:else if !Array.isArray(post.steps) || post.steps.length === 0}
								<div class="p-6 text-slate-500">steps가 비어있습니다.</div>
							{:else}
								{#each post.steps as step, index (index)}
									{#if index <= revealedIndex}
										{#if step.kind === 'chat'}
											<div class="min-w-0">
												<ChatBubble
													isTeacher={step.role === 'teacher'}
													name={post?.actors?.[step.role]?.name}
													badges={post?.actors?.[step.role]?.badges}
												>
													{step.text}
												</ChatBubble>
											</div>
										{:else if step.kind === 'quiz'}
											<div class="min-w-0">
												<Quiz {step} {lessonKey} {chapter} stepIndex={index} />
											</div>
										{:else if step.kind === 'module'}
											<div class="min-w-0">
												{#if moduleRegistry?.[step.module]}
													<svelte:component
														this={moduleRegistry[step.module]}
														{...step.props || {}}
														{lessonKey}
														{chapter}
														stepIndex={index}
														onSuccess={() => markCurrentStepSuccess(index)}
													/>
												{:else if data?.components?.[step.module]}
													<svelte:component
														this={data.components[step.module]}
														{...step.props || {}}
														{lessonKey}
														{chapter}
														stepIndex={index}
														onSuccess={() => markCurrentStepSuccess(index)}
													/>
												{:else}
													<div class="p-4 m-2 rounded-xl bg-rose-50 text-rose-700 text-sm">
														모듈을 찾을 수 없음: {step.module}
													</div>
												{/if}
											</div>
										{:else}
											<div class="p-4 m-2 rounded-xl bg-slate-100 text-slate-700 text-sm">
												알 수 없는 step.kind: {step.kind}
											</div>
										{/if}
									{/if}
								{/each}
							{/if}
						</div>
					</div>

					<!-- ✅ DOM 넘기기 X / 상태만 넘기기 -->
					<View_button
						onNext={next}
						{locked}
						{lessonKey}
						{chapter}
						{totalPages}
						courseId={data.courseId}
					/>
				</div>

				<div class="hidden lg:block lg:col-span-2 min-w-0">
					<Modal
						course={data.course}
						lessons={data.lessons}
						currentLessonId={data.lessonKey}
						currentLessonTitle={data.post?.title}
						prevCourse={data.prevCourse}
						nextCourse={data.nextCourse}
					/>
				</div>
			</div>
		</main>
	</div>
</div>

<style>
	:global([slot='main']) {
		overflow-y: auto;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 1.5rem;
		height: 85vh;
	}

	#mainframe {
		background: #f2f2f2;
		background-image: radial-gradient(#d2d6db 2px, transparent 0);
		background-size: 28px 28px;
		background-position: -3px -3px;
	}
</style>
