<script>
	import ChatBubble from '$lib/components/chatscreen/chat_bubble.svelte';
	import View_button from '$lib/components/chatscreen/view_button.svelte';
	import Modal from '$lib/components/chatscreen/view_modal.svelte';
	import Sidebar from '$lib/components/chatscreen/view_sidebar.svelte';
	import { moduleRegistry } from '$lib/components/classmodule/moduledeliver.js';
	import Quiz from '$lib/components/quizmodule.svelte';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	export let data;

	let htmlchild;

	// ✅ 공통 키: local(내장)면 post.slug, user(업로드)면 post.id(문서ID) 또는 data.lessonId
	$: post = data?.post ?? null;
	$: lessonKey = data?.lessonKey ?? post?.slug ?? post?.id ?? data?.lessonId ?? '';

	// ✅ 기존 코드 호환: chapter를 step(인덱스)로 사용
	$: chapter = data?.chapter ?? 0;

	onMount(() => {
		if (!htmlchild?.children) return;
		for (const i of htmlchild.children) {
			i.style.display = 'none';
		}
	});
</script>

<Toaster />

<div class="min-h-screen w-1280 flex flex-col m-auto">
	<div class="relative flex flex-grow">
		<main id="mainframe" class="flex-1">
			<div id="view" class="h-full w-full grid grid-cols-12 gap-1">
				<Sidebar />

				<div id="main_content" class="h-full flex-grow flex flex-col rounded-lg col-span-7">
					<div id="chat_box_container" class="relative h-vh85 mx-8 mt-8 bg-white rounded-3xl">
						<div bind:this={htmlchild} id="scrollbar" class="overflow-y-auto h-vh85 pr-1 pl-2 pt-1">
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

				<Modal {data} />
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
