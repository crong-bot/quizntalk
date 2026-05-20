<!-- src/lib/components/workplace/modals/MissionCompleteModal.svelte -->

<script>
	export let show = false;
	export let course = null;
	export let currentPlayer = null;
	export let completedMissionIndex = null;
	export let pendingNextMissionIndex = null;
	export let onStartNextMission = () => {};

	$: completedMission = course?.missions?.[completedMissionIndex ?? 0];
	$: nextMission = pendingNextMissionIndex !== null ? course?.missions?.[pendingNextMissionIndex] : null;
	$: completeModal = completedMission?.completeModal ?? {};
</script>

{#if show}
	<div
		class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-[88px]"
	>
		<div class="absolute inset-0 bg-slate-950/10"></div>

		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="mission-complete-title"
			class="mission-drop pointer-events-auto relative z-10 w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-md"
		>
			<div
				class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-yellow-300/35 blur-3xl"
			></div>

			<div
				class="pointer-events-none absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-blue-300/30 blur-3xl"
			></div>

			<div class="relative z-10">
				<div class="flex items-start gap-4">
					<div
						class="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-yellow-300 text-[30px] shadow-[0_0_30px_rgba(250,204,21,0.45)]"
					>
						{completeModal.icon ?? (pendingNextMissionIndex === null ? '🏆' : '⚡')}
					</div>

					<div class="min-w-0 flex-1">
						<div
							id="mission-complete-title"
							class="text-[24px] font-black tracking-[-0.06em] text-slate-950"
						>
							{completeModal.title ??
								(pendingNextMissionIndex === null
									? '코스 클리어!'
									: `미션 ${(completedMissionIndex ?? 0) + 1} 완료!`)}
						</div>

						<div class="mt-1 text-[14px] font-bold leading-6 text-slate-500">
							{completeModal.description ??
								(pendingNextMissionIndex === null
									? '모든 팀원이 마지막 미션을 완료했습니다.'
									: `모든 팀원이 미션 ${(completedMissionIndex ?? 0) + 1}을 완료했습니다. 다음 미션을 확인하세요.`)}
						</div>
					</div>
				</div>

				{#if pendingNextMissionIndex !== null}
					<div class="mt-4 rounded-2xl border border-blue-100 bg-blue-50/90 p-4">
						<div class="text-[11px] font-black tracking-[0.14em] text-blue-500">
							{completeModal.nextLabel ?? 'NEXT MISSION'}
						</div>

						<div class="mt-1 text-[20px] font-black tracking-[-0.06em] text-slate-950">
							미션 {pendingNextMissionIndex + 1}. {nextMission?.title ?? '다음 미션'}
						</div>

						<div class="mt-2 text-[14px] font-bold leading-6 text-slate-600">
							{nextMission?.completeModal?.preview ??
								nextMission?.roleMissions?.[currentPlayer?.roleId]?.story?.mission ??
								'다음 미션을 확인하세요.'}
						</div>
					</div>
				{:else}
					<div class="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4">
						<div class="text-[11px] font-black tracking-[0.14em] text-emerald-600">
							COURSE CLEAR
						</div>

						<div class="mt-1 text-[20px] font-black tracking-[-0.06em] text-slate-950">
							{completeModal.resultTitle ?? '모든 미션이 완료되었습니다.'}
						</div>

						<div class="mt-2 text-[14px] font-bold leading-6 text-slate-600">
							{completeModal.resultDescription ??
								'팀 활동이 끝났습니다. 선생님의 안내에 따라 결과를 확인하세요.'}
						</div>
					</div>
				{/if}

				<button
					type="button"
					on:click={onStartNextMission}
					class="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-[15px] font-black tracking-[-0.04em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
				>
					{completeModal.buttonText ??
						(pendingNextMissionIndex === null
							? '결과 확인하기'
							: `미션 ${pendingNextMissionIndex + 1} 시작하기`)}
				</button>
			</div>
		</div>
	</div>
{/if}