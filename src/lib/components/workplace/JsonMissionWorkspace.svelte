<script>
	import { powerMission } from './missionData';
	import { validatePowerMission } from './missionValidator';

	import JsonEditorConsole from './JsonEditorConsole.svelte';
	import JsonEditorPanel from './JsonEditorPanel.svelte';
	import MissionBriefingPanel from './MissionBriefingPanel.svelte';
	import SharedSimulationPanel from './SharedSimulationPanel.svelte';
	import TeamExecutionBoard from './TeamExecutionBoard.svelte';
	import { mapJsonToSimulationState, mergeSimulationState } from './simulation/simulationMapper';
	let jsonText = powerMission.initialJson;
	let status = 'editing';
	let canExecute = false;
	let hasExecuted = false;
	let themeId = 'spaceBase';

	let simulationState = {
		layers: {}
	};
	let consoleLogs = [
		{
			type: 'info',
			text: '복구 명령 JSON을 작성한 뒤 검사하기를 누르세요.'
		}
	];

	let editorApi;

	function handleEditorReady(api) {
		editorApi = api;
	}

	function insertKey(key) {
		editorApi?.insertAtCursor(`"${key}": `);
	}

	function insertValue(value) {
		editorApi?.insertAtCursor(value);
	}

	function formatJson() {
		try {
			const parsed = JSON.parse(jsonText);
			jsonText = JSON.stringify(parsed, null, 2);

			consoleLogs = [
				{
					type: 'success',
					text: 'JSON 포맷을 정리했습니다.'
				}
			];
		} catch (e) {
			consoleLogs = [
				{
					type: 'error',
					text: '아직 JSON 문법이 완성되지 않아 포맷 정리를 할 수 없어요.'
				}
			];
		}
	}

	function checkJson() {
		if (currentPlayer?.missionProgress[currentMissionIndex] === 'cleared') {
			consoleLogs = [
				{
					type: 'warning',
					text: '이미 완료한 미션입니다. 다른 요원의 완료를 기다려 주세요.'
				}
			];

			return;
		}

		if (verificationEnergy <= 0) {
			consoleLogs = [
				{
					type: 'error',
					text: '검증 에너지가 부족합니다. 더 이상 JSON을 확인할 수 없어요.'
				}
			];

			return;
		}

		verificationEnergy -= 1;
		const result = validatePowerMission(jsonText);

		canExecute = result.ok;
		status = result.ok ? 'checked' : 'editing';

		consoleLogs = [
			{
				type: 'info',
				text: 'JSON 복구 명령 검사를 시작합니다.'
			},
			...result.messages,
			{
				type: result.ok ? 'success' : result.type === 'syntax' ? 'error' : 'warning',
				text: result.ok
					? '검사 통과. 실행하기를 누르면 공용 월드에 반영됩니다.'
					: result.type === 'syntax'
					  ? '문법 오류로 실행할 수 없습니다.'
					  : '조건이 맞지 않습니다. 단서를 다시 확인하세요.'
			}
		];
	}

	function executeMission() {
		if (!canExecute) return;
		if (currentPlayer?.missionProgress[currentMissionIndex] === 'cleared') {
			consoleLogs = [
				...consoleLogs,
				{
					type: 'warning',
					text: '이미 완료한 미션입니다. 다른 요원의 완료를 기다려 주세요.'
				}
			];

			return;
		}

		const result = mapJsonToSimulationState(themeId, jsonText);

		if (!result.ok) {
			status = 'editing';

			consoleLogs = [
				...consoleLogs,
				{
					type: 'error',
					text: result.message
				}
			];

			return;
		}

		simulationState = mergeSimulationState(simulationState, result.state);

		hasExecuted = true;
		status = 'executed';

		consoleLogs = [
			...consoleLogs,
			{
				type: 'send',
				text: '복구 명령을 공용 시뮬레이션으로 전송합니다.'
			},
			{
				type: 'success',
				text: result.message
			},
			{
				type: 'success',
				text: '전력센터 광원 레이어가 활성화되었습니다.'
			}
		];
		markCurrentPlayerMissionCleared();
		unlockNextMissionIfReady();
	}

	function resetMission() {
		jsonText = powerMission.initialJson;
		status = 'editing';
		canExecute = false;
		hasExecuted = false;

		simulationState = {
			layers: {}
		};

		consoleLogs = [
			{
				type: 'info',
				text: '복구 명령 JSON을 작성한 뒤 검사하기를 누르세요.'
			}
		];
	}

	let currentPlayerId = 'player_1';
	let currentMissionIndex = 0;
	let verificationEnergy = 5;
	let maxVerificationEnergy = 5;

	let players = [
		{
			id: 'player_1',
			name: '민서',
			avatarSrc: '/images/avatars/1.png',
			roleName: '전력',
			missionProgress: ['playing', 'locked', 'locked']
		},
		{
			id: 'player_2',
			name: '준호',
			avatarSrc: '/images/avatars/2.png',
			roleName: '산소',
			missionProgress: ['playing', 'locked', 'locked']
		},
		{
			id: 'player_3',
			name: '서연1',
			avatarSrc: '/images/avatars/3.png',
			roleName: '통신',
			missionProgress: ['playing', 'locked', 'locked']
		},
		{
			id: 'player_4',
			name: '도윤ㅈ',
			avatarSrc: '/images/avatars/4.png',
			roleName: '탐사로봇',
			missionProgress: ['playing', 'locked', 'locked']
		}
	];
	$: currentPlayer = players.find((player) => player.id === currentPlayerId);

	function isCurrentMissionClearedByAllPlayers() {
		return players.every((player) => {
			return player.missionProgress[currentMissionIndex] === 'cleared';
		});
	}

	function markCurrentPlayerMissionCleared() {
		players = players.map((player) => {
			if (player.id !== currentPlayerId) return player;

			const nextProgress = [...player.missionProgress];
			nextProgress[currentMissionIndex] = 'cleared';

			return {
				...player,
				missionProgress: nextProgress
			};
		});
	}

	function unlockNextMissionIfReady() {
		const allCleared = isCurrentMissionClearedByAllPlayers();

		if (!allCleared) {
			consoleLogs = [
				...consoleLogs,
				{
					type: 'info',
					text: '내 미션은 완료되었습니다. 다른 요원의 완료를 기다리는 중입니다.'
				}
			];

			return;
		}

		if (currentMissionIndex >= 2) {
			status = 'cleared';

			consoleLogs = [
				...consoleLogs,
				{
					type: 'success',
					text: '모든 요원이 마지막 미션을 완료했습니다. 코스 클리어!'
				}
			];

			return;
		}

		const nextMissionIndex = currentMissionIndex + 1;

		players = players.map((player) => {
			const nextProgress = [...player.missionProgress];
			nextProgress[nextMissionIndex] = 'playing';

			return {
				...player,
				missionProgress: nextProgress
			};
		});

		currentMissionIndex = nextMissionIndex;

		jsonText = powerMission.initialJson;
		status = 'editing';
		canExecute = false;
		hasExecuted = false;

		consoleLogs = [
			{
				type: 'success',
				text: `모든 요원이 미션 ${currentMissionIndex}을 완료했습니다.`
			},
			{
				type: 'info',
				text: `미션 ${currentMissionIndex + 1}이 열렸습니다.`
			}
		];
	}
</script>

<div class="flex h-full w-full items-start justify-center bg-[#eef3fb]">
	<div class="h-[900px] w-[1440px] shrink-0 bg-[#f4f7fb] px-4 pb-4 pt-2">
		<div class="flex h-full min-h-0 flex-col gap-4">
			<header
				class="flex h-[64px] shrink-0 items-center justify-between rounded-[12px] border border-slate-200 bg-white px-5 text-slate-900 shadow-sm"
			>
				<!-- 왼쪽: 로고 + 타이틀 -->
				<div class="flex min-w-0 items-center gap-3">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 ring-1 ring-blue-100"
					>
						🪐
					</div>

					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<div class="truncate text-[15px] font-black tracking-[0.08em] text-slate-900">
								MOON BASE CONTROL CENTER
							</div>

							<div
								class="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-white shadow-sm"
							>
								SOS
							</div>

							<div
								class="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-extrabold text-rose-600"
							>
								긴급 호출
							</div>
						</div>

						<div class="mt-0.5 truncate text-xs font-bold text-slate-500">
							전력 담당 요원님, 복구 명령 JSON을 준비하세요.
						</div>
					</div>
				</div>

				<!-- 오른쪽: 포인트 / 레벨 / 알림 / 요원 -->
				<div class="flex shrink-0 items-center gap-3">
					<div
						class="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm lg:flex"
					>
						<div class="text-base">🌟</div>
						<div class="text-xs font-black text-slate-700">
							미션 포인트 <span class="text-slate-950">1,250</span>
						</div>
					</div>

					<div
						class="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm lg:flex"
					>
						<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">
							🛡️
						</div>

						<div class="text-xs font-black text-slate-700">레벨 3</div>

						<div class="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
							<div class="h-full w-[68%] rounded-full bg-blue-600"></div>
						</div>
					</div>

					<button
						type="button"
						class="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg shadow-sm transition hover:bg-slate-50"
					>
						🔔
					</button>

					<div
						class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
					>
						<div
							class="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm"
						>
							👨‍🚀
						</div>

						<div class="hidden text-xs font-black text-slate-700 sm:block">전력 요원</div>

						<div class="text-slate-400">⌄</div>
					</div>
				</div>
			</header>
			<!-- <div
				class="relative z-10 ml-5 flex w-[236px] shrink-0 flex-col justify-center rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10"
			>
				<div class="flex items-center justify-between">
					<div class="text-xs font-bold text-slate-300">팀 복구 진행률</div>
					<div class="text-xl font-black text-cyan-300">{hasExecuted ? '25%' : '0%'}</div>
				</div>

				<div class="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
					<div
						class="h-full rounded-full bg-cyan-300 transition-all duration-500 shadow-[0_0_16px_rgba(103,232,249,0.65)]"
						style={`width: ${hasExecuted ? 25 : 0}%`}
					></div>
				</div>

				<div class="mt-2 text-[11px] font-bold text-slate-400">
					{hasExecuted ? '전력센터 연결 완료' : '전력센터 연결 대기'}
				</div>
			</div> -->
			<div
				class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
			>
				<div class="text-xs font-black text-slate-500">테스트</div>

				{#each players as player}
					<button
						type="button"
						on:click={() => (currentPlayerId = player.id)}
						class={`rounded-full px-3 py-1 text-xs font-black transition ${
							currentPlayerId === player.id
								? 'bg-blue-600 text-white'
								: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
						}`}
					>
						{player.roleName}
					</button>
				{/each}
			</div>
			<div class="grid min-h-0 flex-1 grid-cols-[360px_480px_520px] gap-4">
				<aside class="flex min-h-0 flex-col gap-4 overflow-hidden">
					<!-- <MissionRoleCard role={powerMission.role} /> -->
					<MissionBriefingPanel
						story={powerMission.story}
						role={powerMission.role}
						clues={powerMission.clues}
						keyChips={powerMission.keyChips}
						onInsertKey={insertKey}
					/>
					<!-- <MissionCluePanel clues={powerMission.clues} /> -->

					<!-- <div class="min-h-0 flex-1 overflow-hidden">
						<JsonAssistPanel
							keyChips={powerMission.keyChips}
							valueChips={powerMission.valueChips}
							onInsertKey={insertKey}
							onInsertValue={insertValue}
						/>
					</div> -->
				</aside>

				<main class="flex min-h-0 flex-col gap-4">
					<JsonEditorPanel
						bind:jsonText
						{canExecute}
						onReady={handleEditorReady}
						onFormat={formatJson}
						onCheck={checkJson}
						onExecute={executeMission}
						onReset={resetMission}
					/>

					<div class="h-[170px] shrink-0">
						<JsonEditorConsole logs={consoleLogs} {canExecute} {status} />
						<!-- <CheckResultPanel messages={checkResult.messages} />
						<MissionStepPanel {status} /> -->
					</div>
				</main>

				<aside class="flex min-h-0 flex-col gap-4">
					<div class="shrink-0">
						<TeamExecutionBoard
							{players}
							{currentPlayerId}
							{currentMissionIndex}
							{verificationEnergy}
							{maxVerificationEnergy}
						/>
					</div>

					<div class="min-h-0 flex-1">
						<SharedSimulationPanel {simulationState} />
					</div>

					<!-- <div class="shrink-0">
						<ExecutionLogPanel {status} {hasExecuted} />
					</div> -->
				</aside>
			</div>
		</div>
	</div>
</div>
