<script>
	export let title = '미션';
	export let subtitle = '미션 명령을 준비하세요.';
	export let icon = '🧩';

	export let missionTitle = '';
	export let currentMissionIndex = 0;

	export let verificationEnergy = 5;
	export let maxVerificationEnergy = 5;

	$: energySlots = Array(Math.max(maxVerificationEnergy, 0));

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<header
	class="relative z-50 flex h-[64px] shrink-0 items-center rounded-[12px]  bg-white px-4 text-slate-900 "
>
	<!-- 왼쪽: 메뉴 + 아이콘 + 제목묶음 + 현재미션 -->
	<div class="flex min-w-0 flex-1 items-center gap-3">
		<!-- 메뉴 버튼 + 드롭다운 -->
		<div class="relative shrink-0">
			<button
				type="button"
				on:click={toggleMenu}
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
				aria-label="메뉴 열기"
			>
				☰
			</button>

			{#if isMenuOpen}
				<div
					class="absolute left-0 top-[48px] z-[999] w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
				>
					<a
						href="/"
						on:click={closeMenu}
						class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100"
					>
						<span>🏠</span>
						<span>홈</span>
					</a>

					<a
						href="/learn"
						on:click={closeMenu}
						class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100"
					>
						<span>📘</span>
						<span>학습하기</span>
					</a>
					<a
						href="/player"
						on:click={closeMenu}
						class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100"
					>
						<span>📘</span>
						<span>테스트하기</span>
					</a>
				</div>
			{/if}
		</div>

		<!-- 코스 아이콘 -->
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 ring-1 ring-blue-100"
		>
			{icon}
		</div>

		<!-- 타이틀 + 서브타이틀 한 묶음 -->
		<div class="min-w-0 shrink-0">
			<div class="flex min-w-0 items-center gap-2">
				<div class="truncate text-[15px] font-black tracking-[-0.01em] text-slate-900">
					{title}
				</div>
			</div>

			<div class="mt-0.5 max-w-[360px] truncate text-xs font-bold text-slate-500">
				{subtitle}
			</div>
		</div>

		<!-- 타이틀/서브타이틀 묶음 오른쪽에 붙는 현재 미션 -->
		<div class="hidden min-w-0 items-center gap-2 lg:flex">
			<div class="h-8 w-px shrink-0 bg-slate-200"></div>

			<div class="flex min-w-0 items-baseline gap-2">
				<span
					class="shrink-0 text-[21px] font-black leading-none tracking-[-0.04em] text-slate-950"
				>
					미션 {currentMissionIndex + 1}
				</span>

				<span class="min-w-0 max-w-[220px] truncate text-[15px] font-extrabold text-slate-500">
					{missionTitle || '미션 준비'}
				</span>
			</div>
		</div>
	</div>

	<!-- 오른쪽: 검증 에너지 + 알림 -->
	<div class="ml-4 flex shrink-0 items-center gap-3">
		<div
			class="flex shrink-0 items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 shadow-sm"
		>
			<div>
				<div class="text-[12px] font-black tracking-[0.1em] text-amber-700/80">
					에너지 {verificationEnergy}/{maxVerificationEnergy}
				</div>
			</div>

			<div class="flex shrink-0 items-center gap-1.5">
				{#each energySlots as _, i}
					<div
						class={`h-3 w-3 rounded-full transition ${
							i < verificationEnergy
								? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
								: 'bg-slate-300'
						}`}
					></div>
				{/each}
			</div>
		</div>

		<button
			type="button"
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg shadow-sm transition hover:bg-slate-50 active:scale-95"
			aria-label="알림"
		>
			🔔
		</button>
	</div>
</header>
