<script>
	export let story = {
		title: '우주기지 긴급 복구',
		call: '전력 담당 요원님, 들리나요?',
		summary:
			'달 기지의 전력이 끊어졌습니다. 산소 센터와 통신 안테나, 탐사로봇이 모두 대기 상태입니다.11',
		mission: '미션1 : 전력기지와 통신을 연결하세요!'
	};

	export let role = {
		title: '전력 담당',
		icon: '⚡',
		description: '전력 시스템 복구 임무'
	};

	export let clues = [];

	export let keyChips = [];

	export let onInsertKey = () => {};
	let showMissionModal = false;
</script>

<div
	class="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[26px] border border-blue-200 bg-[#071a3d] p-4 text-white shadow-[0_18px_42px_rgba(15,23,42,0.18)]"
>
	<!-- 배경 이미지 -->
	<div
		class="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('/images/themes/space-base/missionpanel_back_space.png');"
	></div>

	<!-- 어둡게 덮는 레이어 -->
	<div class="pointer-events-none absolute inset-0 bg-[#020617]/45"></div>

	<!-- 은은한 상단 광원 -->
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(59,130,246,0.34),transparent_34%),radial-gradient(circle_at_88%_22%,rgba(168,85,247,0.22),transparent_34%)]"
	></div>

	<div class="relative z-10 flex min-h-0 flex-1 flex-col gap-3">
		<!-- 상단 라벨 -->
		<div class="flex items-center justify-between">
			<div class="text-center text-[11px] font-black tracking-[0.18em] text-blue-200">
				MISSION PANEL
			</div>
		</div>

		<!-- 내 역할 -->
		<section
			class="rounded-[20px] border border-white/15 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl text-amber-500 shadow-[0_10px_24px_rgba(251,191,36,0.28)]"
				>
					{role.icon}
				</div>

				<div class="min-w-0">
					<div class="truncate text-[17px] font-black tracking-[-0.04em] text-white">
						{role.title} 요원
					</div>
					<div class="mt-0.5 truncate text-xs font-bold text-blue-100">
						{role.description}
					</div>
				</div>
			</div>
		</section>

		<button
			type="button"
			on:click={() => (showMissionModal = true)}
			class="flex w-full items-center justify-between rounded-2xl border-2 border-yellow-100 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 px-4 py-3 text-left shadow-[0_0_28px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(250,204,21,0.6)] active:translate-y-0"
		>
			<div class="flex min-w-0 items-center gap-3">
				<!-- <div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[20px] shadow-[0_8px_18px_rgba(15,23,42,0.28)]"
				>
					⚡
				</div> -->

				<div class="min-w-0">
					<div class="text-[11px] font-black tracking-[0.14em] text-orange-900/75">
						MISSION ORDER
					</div>

					<div class="mt-0.5 text-[18px] font-black leading-6 tracking-[-0.055em] text-slate-950">
						미션 확인하기
					</div>
				</div>
			</div>

			<div
				class="shrink-0 rounded-full bg-slate-950 px-3 py-1.5 text-[12px] font-black text-yellow-200 shadow-[0_6px_14px_rgba(15,23,42,0.22)]"
			>
				OPEN
			</div>
		</button>

		{#if showMissionModal}
			<div class="fixed inset-0 z-50 flex items-center justify-center px-4">
				<!-- 배경 닫기 버튼 -->
				<button
					type="button"
					aria-label="미션 안내 닫기"
					class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
					on:click={() => (showMissionModal = false)}
				></button>

				<!-- 모달 본문 -->
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="mission-modal-title"
					class="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[28px] border border-blue-200/25 bg-gradient-to-br from-[#0b2558] via-[#10194d] to-[#06142f] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)]"
				>
					<div
						class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl"
					></div>

					<div
						class="pointer-events-none absolute -left-14 bottom-0 h-40 w-40 rounded-full bg-amber-300/16 blur-3xl"
					></div>

					<div class="relative z-10">
						<div class="mb-4 flex items-center justify-between gap-3">
							<div class="flex min-w-0 items-center gap-3">
								<div
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-[22px] shadow-[0_0_24px_rgba(250,204,21,0.42)]"
								>
									⚡
								</div>

								<div class="min-w-0">
									<div class="text-[11px] font-black tracking-[0.16em] text-amber-200">
										MOON BASE CONTROL
									</div>

									<div
										id="mission-modal-title"
										class="mt-0.5 text-[19px] font-black leading-6 tracking-[-0.055em] text-white"
									>
										긴급 미션 안내
									</div>
								</div>
							</div>

							<button
								type="button"
								aria-label="닫기"
								on:click={() => (showMissionModal = false)}
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[16px] font-black text-white/80 transition hover:bg-white/20 hover:text-white"
							>
								✕
							</button>
						</div>

						<div class="rounded-2xl border border-white/10 bg-white/[0.08] p-4">
							<div class="text-[13px] font-black leading-6 text-blue-100">
								{story.call}
							</div>

							<div class="mt-2 text-[21px] font-black leading-8 tracking-[-0.06em] text-amber-200">
								달 기지의 전력이 끊겼습니다.
							</div>

							<div class="mt-3 text-[14px] font-bold leading-7 text-blue-50/90">
								{story.summary}
							</div>
						</div>

						<div
							class="mt-4 overflow-hidden rounded-2xl border-2 border-yellow-100 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 p-4 shadow-[0_0_32px_rgba(250,204,21,0.42)]"
						>
							<div class="mb-2 flex items-center gap-2">
								<span
									class="rounded-md bg-slate-950 px-2 py-1 text-[11px] font-black tracking-[-0.03em] text-yellow-200"
								>
									MISSION
								</span>

								<span class="text-[11px] font-black tracking-[0.12em] text-orange-900/80">
									지금 해야 할 일
								</span>
							</div>

							<div class="text-[21px] font-black leading-8 tracking-[-0.06em] text-slate-950">
								{story.mission}
							</div>
						</div>

						<button
							type="button"
							on:click={() => (showMissionModal = false)}
							class="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-[15px] font-black tracking-[-0.04em] text-slate-950 shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:bg-yellow-50 active:translate-y-0"
						>
							미션 시작하기
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- 단서 -->
		<section class="rounded-[22px] border border-slate-200 bg-white p-3.5 text-slate-900 shadow-sm">
			<div class="mb-3 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="text-base">🔍</div>
					<div class="text-base font-black">단서</div>
				</div>

				<div class="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-600">
					단서 {clues.length}/3
				</div>
			</div>

			<div class="space-y-2">
				{#each clues as clue, index}
					<div
						class="flex items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
					>
						<div
							class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white"
						>
							{String(index + 1).padStart(2, '0')}
						</div>

						<div class="min-w-0 flex-1 text-xs font-bold leading-5 text-slate-700">
							{clue}
						</div>

						<div class="shrink-0 text-blue-300">💡</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- 입력 보조 키 -->
		<section
			class="min-h-0 rounded-[22px] border border-slate-200 bg-white p-3.5 text-slate-900 shadow-sm"
		>
			<div class="flex items-start justify-between gap-3">
				<div>
					<div class="flex items-center gap-2">
						<div class="text-base">⌕</div>
						<div class="text-base font-black">입력 보조 키</div>
					</div>

					<div class="mt-1 text-xs font-bold leading-5 text-slate-400">
						키를 누르면 에디터에 자동 입력돼요.
					</div>
				</div>
			</div>

			<div class="mt-3 flex flex-wrap gap-2">
				{#each keyChips as key}
					<button
						type="button"
						on:click={() => onInsertKey(key)}
						class="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-extrabold text-violet-600 transition hover:-translate-y-0.5 hover:bg-violet-100"
					>
						{key}
					</button>
				{/each}

				<button
					type="button"
					on:click={() => onInsertKey('')}
					class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-500 transition hover:-translate-y-0.5 hover:bg-slate-100"
				>
					&quot;
				</button>
			</div>
		</section>
	</div>
</div>
