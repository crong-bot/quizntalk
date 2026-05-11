<script>
	export let players = [];
	export let currentPlayerId = '';
	export let currentMissionIndex = 0;
	export let verificationEnergy = 0;
	export let maxVerificationEnergy = 0;

	$: clearedCount = players.filter(
		(player) => player.missionProgress?.[currentMissionIndex] === 'cleared'
	).length;

	$: totalCount = players.length;

	function getStatus(player) {
		const progress = player.missionProgress?.[currentMissionIndex];

		if (progress === 'cleared') return '완료';
		if (progress === 'playing') return player.id === currentPlayerId ? '진행중' : '대기';
		if (progress === 'locked') return '잠김';

		return '대기';
	}

	function getDetail(player) {
		const progress = player.missionProgress?.[currentMissionIndex];

		if (progress === 'cleared') return `미션 ${currentMissionIndex + 1} 완료`;
		if (progress === 'playing') {
			return player.id === currentPlayerId
				? `미션 ${currentMissionIndex + 1} JSON 작성 중`
				: `미션 ${currentMissionIndex + 1} 진행 대기`;
		}
		if (progress === 'locked') return '아직 열리지 않은 미션';

		return '단서 확인 전';
	}

	function getStatusClass(status) {
		if (status === '완료') return 'bg-emerald-100 text-emerald-700';
		if (status === '진행중') return 'bg-amber-100 text-amber-700';
		if (status === '잠김') return 'bg-slate-200 text-slate-500';
		return 'bg-blue-50 text-blue-600';
	}

	function getRoleClass(isCurrentPlayer) {
		return isCurrentPlayer ? 'bg-amber-200/90 text-amber-900' : 'bg-slate-200 text-slate-600';
	}

	function getCardClass(player) {
		const status = getStatus(player);
		const isCurrentPlayer = player.id === currentPlayerId;

		if (status === '완료') return 'border-emerald-200 bg-emerald-50';
		if (isCurrentPlayer) return 'border-amber-200 bg-amber-50';
		return 'border-slate-200 bg-slate-50';
	}
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div class="flex items-start justify-between gap-3">
		<div>
			<div class="text-base font-extrabold text-slate-900">팀 실행 보드</div>
			<div class="mt-1 text-xs font-bold text-slate-400">
				모든 팀원이 완료하면 다음 미션이 열립니다
			</div>
		</div>

		<div class="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-600">
			{clearedCount}/{totalCount} 완료
		</div>
	</div>

	<div class="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2.5">
		<div class="flex items-center justify-between gap-3">
			<div>
				<div class="text-[11px] font-black tracking-[0.12em] text-amber-700/70">검증 에너지</div>
				<div class="mt-0.5 text-xs font-bold text-amber-900/80">JSON 확인 시 1개 사용</div>
			</div>

			<div class="flex shrink-0 items-center gap-1.5">
				{#each Array(maxVerificationEnergy) as _, i}
					<div
						class={`h-3 w-3 rounded-full ${
							i < verificationEnergy
								? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
								: 'bg-slate-300'
						}`}
					></div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
		<div>
			<div class="text-[11px] font-black tracking-[0.14em] text-slate-400">CURRENT MISSION</div>
			<div class="mt-0.5 text-sm font-black text-slate-900">
				미션 {currentMissionIndex + 1} / 3
			</div>
		</div>

		<div class="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
			<div
				class="h-full rounded-full bg-blue-600 transition-all duration-300"
				style={`width: ${(clearedCount / Math.max(totalCount, 1)) * 100}%`}
			></div>
		</div>
	</div>

	<div class="mt-3 grid grid-cols-2 gap-2">
		{#each players as player}
			{@const status = getStatus(player)}
			{@const isCurrentPlayer = player.id === currentPlayerId}

			<div class={`min-w-0 rounded-2xl border px-3 py-2.5 transition ${getCardClass(player)}`}>
				<div class="flex min-w-0 items-center gap-2">
					<div class="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
						<img
							src={player.avatarSrc}
							alt={`${player.name} 아바타`}
							class="h-full w-full object-cover"
						/>
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex min-w-0 items-center gap-1.5">
							<span class="truncate text-sm font-extrabold text-slate-900">
								{player.name}
							</span>

							<span
								class={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black leading-none ${getRoleClass(
									isCurrentPlayer
								)}`}
							>
								[{player.roleName}]
							</span>
						</div>

						<div class="mt-1 truncate text-xs font-semibold text-slate-500">
							{getDetail(player)}
						</div>
					</div>

					<span
						class={`shrink-0 rounded-full px-2 py-1 text-[11px] font-extrabold ${getStatusClass(
							status
						)}`}
					>
						{status}
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>
