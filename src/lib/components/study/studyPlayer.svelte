<script>
	import ChatBubble from '$lib/components/chatscreen/chat_bubble.svelte';
	import View_button from '$lib/components/chatscreen/view_button.svelte';
	import Modal from '$lib/components/chatscreen/view_modal.svelte';
	import Sidebar from '$lib/components/chatscreen/view_sidebar.svelte';
	import { moduleRegistry } from '$lib/components/classmodule/moduledeliver.js';
	import Quiz from '$lib/components/quizmodule.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	export let data;

	let htmlchild;

	// ✅ 공통 키: local(내장)면 post.slug, user(업로드)면 post.id(문서ID) 또는 data.lessonId
	$: post = data?.post ?? null;
	$: lessonKey = data?.lessonKey ?? post?.slug ?? post?.id ?? data?.lessonId ?? '';

	// ✅ 기존 코드 호환: chapter를 step(인덱스)로 사용
	$: chapter = data?.chapter ?? 0;

	// ✅ 모바일 드로어 상태
	let showSidebarDrawer = false;
	let showModalDrawer = false;

	function closeDrawers() {
		showSidebarDrawer = false;
		showModalDrawer = false;
	}

	function onKeydown(e) {
		if (e.key === 'Escape') closeDrawers();
	}

	onMount(() => {
		if (!htmlchild?.children) return;
		for (const i of htmlchild.children) {
			i.style.display = 'none';
		}
		window.addEventListener('keydown', onKeydown);
	});
	onDestroy(() => {
		window.removeEventListener('keydown', onKeydown);
	});
</script>

<Toaster />

<div class="min-h-screen w-full max-w-[1280px] mx-auto flex flex-col">
	<div class="relative flex flex-grow">
		<main id="mainframe" class="flex-1">
			<!-- ✅ 모바일 상단 바 (lg 이상에서는 숨김) -->
			<div class="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
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

			<!-- ✅ 모바일 오버레이 (드로어 열렸을 때만) -->
			{#if showSidebarDrawer || showModalDrawer}
				<button
					type="button"
					class="lg:hidden fixed inset-0 z-40 bg-black/40"
					aria-label="닫기"
					on:click={closeDrawers}
				/>
			{/if}

			<!-- ✅ 모바일 Sidebar Drawer (왼쪽) -->
			<aside
				class="lg:hidden fixed top-0 left-0 z-50 h-full w-[82%] max-w-[320px] bg-white shadow-2xl
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

			<!-- ✅ 모바일 Modal Drawer (오른쪽) -->
			<aside
				class="lg:hidden fixed top-0 right-0 z-50 h-full w-[82%] max-w-[320px] bg-white shadow-2xl
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

			<!-- ✅ 데스크탑 레이아웃 -->
			<div id="view" class="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-1">
				<!-- Sidebar: 데스크탑에서만 표시 -->
				<div class="hidden lg:block lg:col-span-3 min-w-0">
					<Sidebar course={data.course} lessons={data.lessons} />
				</div>

				<!-- Main -->
				<div id="main_content" class="lg:col-span-7 flex flex-col rounded-lg">
					<div
						id="chat_box_container"
						class="relative h-[85vh] mx-3 mt-3 lg:mx-8 lg:mt-8 bg-white rounded-3xl"
					>
						<div bind:this={htmlchild} id="scrollbar" class="overflow-y-auto h-full pr-1 pl-2 pt-1">
							{#if !post}
								<div class="p-6 text-slate-500">
									레슨 데이터를 불러오는 중이거나 존재하지 않습니다.
								</div>
							{:else if !Array.isArray(post.steps) || post.steps.length === 0}
								<div class="p-6 text-slate-500">steps가 비어있습니다.</div>
							{:else}
								{#each post.steps as step, index (index)}
									{#if step.kind === 'chat'}
										<ChatBubble chat_direction={step.role === 'teacher'}>
											{step.text}
										</ChatBubble>
									{:else if step.kind === 'quiz'}
										<Quiz {step} {lessonKey} {chapter} stepIndex={index} />
									{:else if step.kind === 'module'}
										{#if moduleRegistry?.[step.module]}
											<svelte:component this={moduleRegistry[step.module]} {...step.props ?? {}} />
										{:else if data?.components?.[step.module]}
											<svelte:component this={data.components[step.module]} {...step.props ?? {}} />
										{:else}
											<div class="p-4 m-2 rounded-xl bg-rose-50 text-rose-700 text-sm">
												모듈을 찾을 수 없음: {step.module}
											</div>
										{/if}
									{:else}
										<div class="p-4 m-2 rounded-xl bg-slate-100 text-slate-700 text-sm">
											알 수 없는 step.kind: {step.kind}
										</div>
									{/if}
								{/each}
							{/if}
						</div>
					</div>

					<View_button childs={htmlchild} {lessonKey} {chapter} />
				</div>

				<!-- Modal: 데스크탑에서만 표시 -->
				<div class="hidden lg:block lg:col-span-2">
					<Modal
						course={data.course}
						lessons={data.lessons}
						currentLessonId={data.lessonKey}
						currentLessonTitle={data.post?.title}
					/>
				</div>
			</div>
		</main>
	</div>
</div>
<h1 class="fixed top-2 left-2 z-[9999] bg-red-500 text-white px-2 py-1">STUDY PLAYER FILE</h1>

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
