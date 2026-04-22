<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();
	const progressStore = playerStore.progress;

	$: lesson = $playerStore?.lesson || {};
	$: stages = Array.isArray(lesson?.stages) ? lesson.stages : [];
	$: currentStageId = $playerStore?.currentStageId ?? null;
	$: completedStageIds = Array.isArray($playerStore?.completedStageIds)
		? $playerStore.completedStageIds
		: [];
	$: unlockedStageIds = Array.isArray($playerStore?.unlockedStageIds)
		? $playerStore.unlockedStageIds
		: [];

	function handleClick(stageId) {
		playerStore.actions.goToStage(stageId);
	}
</script>

<aside
	class="rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
>
	<div class="border-b border-slate-100 px-6 py-6">
		<div class="flex items-start gap-4">
			<div
				class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-3xl"
			>
				🤖
			</div>
			<div class="min-w-0">
				<h1 class="text-[34px] font-extrabold tracking-[-0.03em] text-slate-900">
					{lesson?.title || '프로젝트 플레이어'}
				</h1>
				<p class="mt-1 text-[17px] text-slate-600">{lesson?.subtitle || ''}</p>
			</div>
		</div>

		<div class="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
			<span class="text-sm font-bold text-slate-600">학습 로드맵</span>
			<span class="rounded-full bg-emerald-50 px-3 py-1 text-sm font-extrabold text-emerald-600">
				{$progressStore}%
			</span>
		</div>
	</div>

	<div class="px-6 py-5">
		<div class="relative">
			<div class="absolute bottom-2 left-[21px] top-2 w-[3px] rounded-full bg-slate-200"></div>

			<div class="space-y-7">
				{#each stages as stage, index}
					{@const isCurrent = currentStageId === stage.id}
					{@const isDone = completedStageIds.includes(stage.id)}
					{@const isUnlocked = unlockedStageIds.includes(stage.id)}

					<div class="relative pl-14">
						<button
							type="button"
							on:click={() => handleClick(stage.id)}
							disabled={!isUnlocked}
							class="w-full text-left disabled:cursor-not-allowed disabled:opacity-60"
						>
							<div
								class={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-base font-extrabold text-white shadow-sm ${
									isDone
										? 'bg-emerald-500'
										: isCurrent
										  ? 'bg-blue-500'
										  : isUnlocked
										    ? 'bg-slate-400'
										    : 'bg-slate-300'
								}`}
							>
								{index + 1}
							</div>

							<div class="pt-1">
								<div class="flex items-center gap-2">
									<h2 class="text-[24px] font-extrabold tracking-[-0.03em] text-slate-900">
										{stage?.title || `단계 ${index + 1}`}
									</h2>

									{#if isDone}
										<span
											class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-white"
										>
											✓
										</span>
									{/if}

									{#if !isUnlocked}
										<span class="text-slate-400">🔒</span>
									{/if}
								</div>

								<p class="mt-1 text-[16px] text-slate-500">{stage?.subtitle || ''}</p>

								<div class="mt-3">
									<span
										class={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
											isDone
												? 'bg-emerald-50 text-emerald-600'
												: isCurrent
												  ? 'bg-blue-50 text-blue-600'
												  : isUnlocked
												    ? 'bg-slate-100 text-slate-600'
												    : 'bg-slate-100 text-slate-400'
										}`}
									>
										{isDone ? '완료' : isCurrent ? '현재 단계' : isUnlocked ? '이동 가능' : '잠김'}
									</span>
								</div>
							</div>
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</aside>
