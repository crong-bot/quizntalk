<script>
	export let players = [];
	export let currentPlayerId = '';
	export let currentMissionIndex = 0;
	export let verificationEnergy = 0;
	export let maxVerificationEnergy = 0;
	export let maxPlayers = 4;
	export let layout = 'grid';

	$: clearedCount = players.filter(
		(player) => player.missionProgress?.[currentMissionIndex] === 'cleared'
	).length;

	$: totalCount = maxPlayers;
	$: emptySlotCount = Math.max(maxPlayers - players.length, 0);
	$: emptySlots = Array.from({ length: emptySlotCount }, (_, index) => ({
		id: `empty_${index + 1}`
	}));

	function getStatus(player) {
		const progress = player.missionProgress?.[currentMissionIndex];

		if (progress === 'cleared') return '완료';
		if (progress === 'submitted') return '제출';
		if (progress === 'playing') return player.id === currentPlayerId ? '진행중' : '대기';
		if (progress === 'locked') return '잠김';

		return '대기';
	}

	function getDetail(player) {
		const progress = player.missionProgress?.[currentMissionIndex];

		if (progress === 'cleared') return `미션 ${currentMissionIndex + 1} 완료`;
		if (progress === 'submitted') return `미션 ${currentMissionIndex + 1} 제출 완료`;
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
		if (status === '제출') return 'bg-violet-100 text-violet-700';
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
		if (status === '제출') return 'border-violet-200 bg-violet-50';
		if (isCurrentPlayer) return 'border-amber-200 bg-amber-50';

		return 'border-slate-200 bg-slate-50';
	}
</script>

<div class="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
	<div class="flex items-start justify-between gap-3">
		<div>
			<div class="text-base font-extrabold text-slate-900">
				팀 실행 보드 :모든 팀원이 완료하면 다음 미션이 열
			</div>
			<!-- <div class="mt-1 text-xs font-bold text-slate-400">
				모든 팀원이 완료하면 다음 미션이 열립니다
			</div> -->
		</div>

		<div class="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-600">
			{clearedCount}/{totalCount} 완료
		</div>
	</div>

	<div class={layout === 'vertical' ? 'mt-3 flex flex-col gap-2' : 'mt-3 grid grid-cols-2 gap-2'}>
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
							<span
								class={`shrink-0 rounded-md px-1.5 py-1 text-[11px] font-black leading-none ${getRoleClass(
									isCurrentPlayer
								)}`}
							>
								{player.roleName}
							</span>
							<div class="mt-1 truncate text-xs font-semibold text-slate-500">
								{getDetail(player)}
							</div>
						</div>

						<div class="flex min-w-0 items-center gap-1.5">
							<span class="truncate text-sm font-extrabold text-slate-900">
								{player.name}
							</span>
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

		{#each emptySlots as slot}
			<div
				class="min-w-0 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-2.5"
			>
				<div class="flex min-w-0 items-center gap-2">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[18px] font-black text-slate-400 ring-2 ring-white"
					>
						+
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex min-w-0 items-center gap-1.5">
							<span
								class="shrink-0 rounded-md bg-slate-200 px-1.5 py-1 text-[11px] font-black leading-none text-slate-400"
							>
								빈 자리
							</span>

							<div class="mt-1 truncate text-xs font-semibold text-slate-400">
								학생이 입장하면 표시됩니다
							</div>
						</div>

						<div class="mt-1 truncate text-sm font-extrabold text-slate-400">참가 대기</div>
					</div>

					<span
						class="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-extrabold text-slate-400"
					>
						대기
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>
