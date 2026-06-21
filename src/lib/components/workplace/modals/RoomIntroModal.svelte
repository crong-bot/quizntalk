<!-- src/lib/components/workplace/modals/RoomIntroModal.svelte -->

<script>
	export let show = false;
	export let intro = null;
	export let missions = [];
	export let onClose = () => {};

	$: missionSteps =
		missions?.length > 0
			? missions.map((mission) => mission.title).filter(Boolean)
			: intro?.steps ?? [];

	function cleanMissionTitle(title) {
		return String(title ?? '').replace(/^미션\s*\d+\.\s*/, '');
	}
</script>

{#if show && intro}
	<div
		class="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-8"
	>
		<div
			role="dialog"
			aria-modal="true"
			class="mission-drop w-full max-w-[760px] overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
		>
			{#if intro.image}
				<div class="relative h-[350px] overflow-hidden bg-slate-900">
					<img
						src={intro.image}
						alt={intro.imageAlt ?? intro.title ?? '미션 안내 이미지'}
						class="h-full w-full object-cover"
					/>

					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"
					></div>

					<div class="absolute bottom-5 left-5 right-5">
						<div
							class="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-blue-600 shadow-sm backdrop-blur-md"
						>
							{intro.badge ?? 'MISSION BRIEFING'}
						</div>

						<div
							class="mt-3 max-w-[680px] font-gmarket text-[38px] font-bold leading-tight tracking-[-0.075em] text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
						>
							{intro.title}
						</div>
					</div>
				</div>
			{:else}
				<div class="bg-slate-950 px-7 py-8">
					<div
						class="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-blue-600"
					>
						{intro.badge ?? 'MISSION BRIEFING'}
					</div>

					<div
						class="mt-3 font-gmarket text-[38px] font-bold leading-tight tracking-[-0.075em] text-white"
					>
						{intro.title}
					</div>
				</div>
			{/if}

			<div class="px-7 py-6">
				<div class="relative pl-5 text-left">
					<div
						class="absolute left-0 top-1 h-[calc(100%-4px)] w-1.5 rounded-full bg-blue-500"
					></div>

					<div class="text-[13px] font-black tracking-[0.16em] text-blue-600">STORY</div>

					<div
						class="mt-2 font-gmarket text-[25px] font-bold leading-[1.55] tracking-[-0.075em] text-slate-950"
					>
						{intro.summary}
					</div>
				</div>

				{#if missionSteps.length > 0}
					<div class="mt-6 rounded-[22px] bg-slate-50 px-4 py-4">
						<div class="mb-3 flex items-center justify-between">
							<div class="text-[13px] font-black tracking-[0.14em] text-slate-500">
								MISSION FLOW
							</div>

							<div class="text-[12px] font-extrabold text-slate-400">
								총 {Math.min(missionSteps.length, 3)}단계
							</div>
						</div>

						<div class="grid grid-cols-3 gap-3">
							{#each missionSteps.slice(0, 3) as step, index}
								<div
									class="relative rounded-[18px] border border-slate-100 bg-white px-3 py-3 text-left shadow-sm"
								>
									<div class="flex items-center gap-2">
										<div
											class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[12px] font-black text-white"
										>
											{index + 1}
										</div>

										<div class="text-[12px] font-black tracking-[0.08em] text-blue-500">
											STEP {index + 1}
										</div>
									</div>

									<div
										class="mt-2 text-[15px] font-black leading-5 tracking-[-0.055em] text-slate-800"
									>
										{cleanMissionTitle(step)}
									</div>

									{#if index < Math.min(missionSteps.length, 3) - 1}
										<div
											class="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-[13px] font-black text-white shadow-md"
										>
											›
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="mt-6 flex justify-center">
					<button
						type="button"
						on:click={onClose}
						class="rounded-2xl bg-slate-950 px-9 py-4 text-[16px] font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
					>
						{intro.buttonText ?? '미션 시작하기'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
