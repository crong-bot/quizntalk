<!-- src/lib/components/workplace/modals/RoomIntroModal.svelte -->

<script>
	export let show = false;
	export let intro = null;
	export let onClose = () => {};

	$: steps = intro?.steps ?? [];
</script>

{#if show && intro}
	<div
		class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-8"
	>
		<div
			role="dialog"
			aria-modal="true"
			class="mission-drop w-full max-w-[780px] overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.30)]"
		>
			{#if intro.image}
				<div class="relative h-[290px] overflow-hidden bg-slate-900">
					<img
						src={intro.image}
						alt={intro.imageAlt ?? intro.title ?? '미션 안내 이미지'}
						class="h-full w-full object-cover"
					/>

					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent"
					></div>

					<div class="absolute bottom-5 left-5 right-5 flex flex-col items-start">
						<!-- <div
							class="inline-flex rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-blue-600 shadow-sm backdrop-blur-md"
						>
							{intro.badge ?? 'MISSION BRIEFING'}
						</div> -->

						<div
							class="mt-3 inline-block max-w-[680px] rounded-2xl bg-slate-950/42 px-4 py-2.5 font-gmarket text-[34px] font-bold leading-tight tracking-[-0.075em] text-white shadow-[0_12px_34px_rgba(15,23,42,0.22)] backdrop-blur-[6px]"
						>
							{intro.title}
						</div>

						{#if intro.subtitle}
							<div
								class="mt-2 inline-block max-w-[620px] rounded-xl bg-slate-950/34 px-3.5 py-2 text-[15px] font-extrabold leading-6 text-white shadow-[0_10px_26px_rgba(15,23,42,0.18)] backdrop-blur-[5px]"
							>
								{intro.subtitle}
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="border-b border-slate-100 bg-white px-6 pb-5 pt-6">
					<div
						class="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-blue-600 ring-1 ring-blue-100"
					>
						{intro.badge ?? 'MISSION BRIEFING'}
					</div>

					<div
						class="mt-3 font-gmarket text-[34px] font-bold leading-tight tracking-[-0.075em] text-slate-950"
					>
						{intro.title}
					</div>

					{#if intro.subtitle}
						<div class="mt-2 max-w-[640px] text-[15px] font-extrabold leading-6 text-slate-500">
							{intro.subtitle}
						</div>
					{/if}
				</div>
			{/if}

			<div class="p-6">
				<div class="grid grid-cols-[1fr_0.92fr] gap-4">
					<div class="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
						<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
							CURRENT SITUATION
						</div>

						<div class="mt-2 text-[20px] font-black tracking-[-0.06em] text-slate-950">
							{intro.summaryTitle ?? '현재 상황'}
						</div>

						<div class="mt-2 text-[14px] font-bold leading-7 text-slate-600">
							{intro.summary}
						</div>
					</div>

					<div class="rounded-[26px] border border-blue-100 bg-blue-50 p-5">
						<div class="text-[11px] font-black tracking-[0.16em] text-blue-500">TEAM GOAL</div>

						<div class="mt-2 text-[20px] font-black tracking-[-0.06em] text-slate-950">
							{intro.goalTitle ?? '우리의 임무'}
						</div>

						<div class="mt-2 text-[14px] font-bold leading-7 text-slate-600">
							{intro.missionGoal}
						</div>
					</div>
				</div>

				{#if steps.length > 0}
					<div class="mt-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
						<div class="mb-3 text-[11px] font-black tracking-[0.16em] text-slate-400">
							HOW TO PLAY
						</div>

						<div class="grid grid-cols-2 gap-2">
							{#each steps as step, index}
								<div class="flex gap-3 rounded-2xl bg-slate-50 px-3 py-3">
									<div
										class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[12px] font-black text-white"
									>
										{index + 1}
									</div>

									<div class="text-[13px] font-extrabold leading-6 text-slate-600">
										{step}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="mt-5 flex items-center gap-3">
					{#if intro.tip}
						<div
							class="min-w-0 flex-1 rounded-2xl bg-amber-50 px-4 py-3 text-[13px] font-bold leading-5 text-amber-800"
						>
							{intro.tip}
						</div>
					{/if}

					<button
						type="button"
						on:click={onClose}
						class="h-13 shrink-0 rounded-2xl bg-slate-950 px-6 py-4 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
					>
						{intro.buttonText ?? '미션 시작하기'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
