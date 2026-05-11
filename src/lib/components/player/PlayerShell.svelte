<script>
	import { createProjectPlayerStore } from '$lib/player/createProjectPlayerStore';
	import { setPlayerContext } from '$lib/player/playerContext';

	import PlayerNav from './PlayerNav.svelte';
	import RoadmapPanel from './RoadmapPanel.svelte';
	import WorkspaceRenderer from './WorkspaceRenderer.svelte';

	export let lesson;

	const playerStore = createProjectPlayerStore(lesson || {});
	setPlayerContext(playerStore);

	const currentStageStore = playerStore.currentStage;
	const progressStore = playerStore.progress;
</script>

<div class="min-h-screen overflow-x-auto bg-white">
	<div class="mx-auto flex h-[900px] w-full min-w-[1280px] max-w-[1440px] gap-[13px]">
		<div class="w-[416px] shrink-0">
			<RoadmapPanel />
		</div>

		<section class="flex h-[800px] w-[963px] shrink-0 flex-col gap-4">
			<div
				class="flex flex-wrap items-center justify-between gap-3 rounded-[28px] bg-white px-6 py-5"
			>
				<div
					class="inline-flex rounded-2xl bg-violet-500 px-5 py-3 text-[28px] font-extrabold tracking-[-0.03em] text-white shadow-sm"
				>
					현재 단계: {$currentStageStore?.subtitle ?? $currentStageStore?.title}
				</div>

				<div class="flex items-center gap-3">
					<div class="rounded-2xl bg-slate-50 px-4 py-3 text-base font-bold text-slate-600">
						진행률 {$progressStore}%
					</div>
					<div class="rounded-2xl bg-blue-50 px-4 py-3 text-base font-bold text-blue-600">
						{$currentStageStore?.title}
					</div>
				</div>
			</div>

			<div class="flex min-h-0 flex-1 flex-col rounded-[28px] border border-slate-200/80 bg-white">
				<div class="min-h-0 flex-1">
					<WorkspaceRenderer />
				</div>

				<div class="border-t border-slate-200/80">
					<PlayerNav />
				</div>
			</div>
		</section>
	</div>
</div>
