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

<div class="min-h-screen bg-[#f3f4f8] p-4 md:p-6">
	<div class="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
		<RoadmapPanel />

		<section class="space-y-4">
			<div
				class="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
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

			<WorkspaceRenderer />
			<PlayerNav />
		</section>
	</div>
</div>
