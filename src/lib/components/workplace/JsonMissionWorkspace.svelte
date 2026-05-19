<!-- C:\quizntalk\src\lib\components\workplace\JsonMissionWorkspace.svelte -->
<script>
	import { moonBaseCourse } from './theme/spaceBase/spaceBaseCourse';
	import { validateMissionJson } from './validator/missionValidator';

	import CommandTransmissionPanel from './CommandTransmissionPanel.svelte';
	import JsonEditorConsole from './JsonEditorConsole.svelte';
	import JsonEditorPanel from './JsonEditorPanel.svelte';
	import MissionBriefingPanel from './MissionBriefingPanel.svelte';
	import SharedSimulationPanel from './SharedSimulationPanel.svelte';
	import TeamExecutionBoard from './TeamExecutionBoard.svelte';
	import { mapJsonToSimulationState, mergeSimulationState } from './simulation/simulationMapper';

	import {
		applyMissionSuccess,
		recordParticipantAttempt,
		updateRoomState
	} from '$lib/firebase/missionRoom/missionRoomRepository.js';

	import {
		isReadMissionCourse,
		submitReadMissionForReview
	} from '$lib/firebase/missionRoom/missionRoomService.js';

	export let roomCode = '';
	export let lessonId = '';
	export let roomId = '';
	export let lesson = null;
	export let room = null;
	export let participants = [];
	export let participantId = '';
	export let useMockPlayers = false;

	export let course = moonBaseCourse;

	$: participantName =
		typeof localStorage !== 'undefined'
			? localStorage.getItem(`participant_name_${roomCode}`) ?? ''
			: '';

	$: localParticipantId =
		typeof localStorage !== 'undefined'
			? localStorage.getItem(`participant_id_${roomCode}`) ?? ''
			: '';

	$: activeParticipantId = participantId || localParticipantId;

	$: isReadCourse = isReadMissionCourse(course);

	let jsonText = course.missions[0].initialJson;
	let status = 'editing';
	//let canExecute = false;
	let hasExecuted = false;
	$: themeId = course?.themeId ?? 'spaceBase';
	let showMissionCompleteModal = false;
	let completedMissionIndex = null;
	let pendingNextMissionIndex = null;

	let showFinalReadyModal = false;
	let showFinalSuccessModal = false;

	let isFinalSequencePlaying = false;

	let simulationState = {
		layers: {}
	};
	let lastRoomSimulationStateKey = '';

	$: if (shouldUseFirebase && room?.simulationState) {
		const nextRoomSimulationStateKey = JSON.stringify(room.simulationState);

		if (nextRoomSimulationStateKey !== lastRoomSimulationStateKey) {
			lastRoomSimulationStateKey = nextRoomSimulationStateKey;
			simulationState = mergeLayerState(simulationState, room.simulationState);
		}
	}
	let transmissionState = {
		visible: false,
		phase: 'idle', // idle | sending | validating | mapping | applying | success | error
		roleName: '',
		message: '',
		progress: 0
	};
	let consoleLogs = [
		{
			type: 'info',
			text: '복구 명령 JSON을 작성한 뒤 명령전송을 누르세요.'
		}
	];

	let editorApi;

	function wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

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
	function canSyncToFirestore() {
		return Boolean(shouldUseFirebase && lessonId && roomId && activeParticipantId);
	}
	async function recordCurrentAttempt(validateResult) {
		if (!canSyncToFirestore()) {
			return;
		}

		const concepts =
			validateResult.messages
				?.filter((message) => message.type === 'error')
				.map((message) => message.concept)
				.filter(Boolean) ?? [];

		try {
			await recordParticipantAttempt({
				lessonId,
				roomId,
				participantId: activeParticipantId,
				missionIndex: currentMissionIndex,
				ok: validateResult.ok,
				concepts
			});
		} catch (error) {
			console.error('학생 활동 기록 저장 실패:', error);
		}
	}
	function getNextProgressForCurrentPlayer(nextState) {
		const currentProgress = currentPlayer?.missionProgress ?? ['playing', 'locked', 'locked'];
		const nextProgress = [...currentProgress];

		nextProgress[currentMissionIndex] = nextState;

		return nextProgress;
	}

	function getNextMissionIndexAfterMissionClear() {
		const allClearedAfterCurrentSuccess = players.every((player) => {
			if (player.id === currentPlayerId) {
				return true;
			}

			return player.missionProgress[currentMissionIndex] === 'cleared';
		});

		if (!allClearedAfterCurrentSuccess) {
			return currentMissionIndex;
		}

		if (currentMissionIndex >= course.missions.length - 1) {
			return currentMissionIndex;
		}

		return currentMissionIndex + 1;
	}

	function getNextRoomStatusAfterMissionClear() {
		if (currentMissionIndex >= course.missions.length - 1) {
			return 'completed';
		}

		return 'playing';
	}

	async function syncMissionSuccessToFirestore({
		nextMissionProgress,
		nextSimulationState,
		nextMissionIndex,
		nextRoomStatus
	}) {
		if (!canSyncToFirestore()) {
			return;
		}

		try {
			await applyMissionSuccess({
				lessonId,
				roomId,
				participantId: activeParticipantId,
				missionProgress: nextMissionProgress,
				simulationState: nextSimulationState,
				currentMissionIndex: nextMissionIndex,
				status: nextRoomStatus
			});
		} catch (error) {
			console.error('미션 성공 동기화 실패:', error);
		}
	}

	async function executeMission() {
		if (status === 'sending') {
			return;
		}
		if (status === 'cleared') {
			consoleLogs = [
				{
					type: 'success',
					text: '이미 코스를 클리어했습니다.'
				}
			];
			return;
		}

		const currentProgress = currentPlayer?.missionProgress[currentMissionIndex];

		if (currentProgress === 'cleared' || currentProgress === 'submitted') {
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
					text: '검증 에너지가 부족합니다. 더 이상 명령을 전송할 수 없어요.'
				}
			];

			transmissionState = {
				visible: true,
				phase: 'error',
				roleName: currentPlayer.roleName,
				message: '검증 에너지가 부족합니다.',
				progress: 100
			};

			return;
		}

		verificationEnergy -= 1;
		status = 'sending';

		transmissionState = {
			visible: true,
			phase: 'sending',
			roleName: currentPlayer.roleName,
			message: 'JSON 명령을 전송하는 중입니다.',
			progress: 20
		};

		consoleLogs = [
			{
				type: 'send',
				text: 'JSON 명령을 전송합니다.'
			}
		];

		await wait(450);

		transmissionState = {
			...transmissionState,
			phase: 'validating',
			message: 'JSON 문법과 미션 조건을 확인하는 중입니다.',
			progress: 45
		};

		await wait(450);

		const validateResult = validateMissionJson({
			jsonText,
			course,
			missionIndex: currentMissionIndex,
			roleId: currentPlayer.roleId
		});

		await recordCurrentAttempt(validateResult);

		if (!validateResult.ok) {
			status = 'editing';

			transmissionState = {
				visible: true,
				phase: 'error',
				roleName: currentPlayer.roleName,
				message:
					validateResult.type === 'syntax'
						? '문법 오류로 명령 전송에 실패했습니다.'
						: '조건이 맞지 않아 명령 전송에 실패했습니다.',
				progress: 100
			};

			consoleLogs = [
				...validateResult.messages,
				{
					type: validateResult.type === 'syntax' ? 'error' : 'warning',
					text:
						validateResult.type === 'syntax'
							? '문법 오류로 실행할 수 없습니다.'
							: '조건이 맞지 않습니다. 단서를 다시 확인하세요.'
				}
			];

			return;
		}
		if (isReadCourse) {
			try {
				await submitReadMissionForReview({
					lessonId,
					roomId,
					mission: currentMission,
					missionIndex: currentMissionIndex,
					participantId: activeParticipantId,
					participantName: currentPlayer?.name,
					roleId: currentPlayer?.roleId,
					roleName: currentPlayer?.roleName,
					jsonText,
					missionProgress: currentPlayer?.missionProgress ?? []
				});

				status = 'submitted';
				hasExecuted = true;

				consoleLogs = [
					{
						type: 'success',
						text:
							currentMission?.type === 'team-json-report'
								? '포획계획보고서가 제출되었습니다.'
								: '분석 결과가 제출되었습니다.'
					},
					{
						type: 'info',
						text: '교사 확인이 완료되면 다음 단계로 이동합니다.'
					}
				];

				transmissionState = {
					visible: true,
					phase: 'success',
					roleName: currentPlayer?.roleName ?? '',
					message: '제출 완료 · 교사 확인 대기',
					progress: 100
				};
			} catch (error) {
				console.error(error);

				consoleLogs = [
					{
						type: 'error',
						text: error?.message ?? '제출 내용을 저장하지 못했습니다.'
					}
				];

				transmissionState = {
					visible: true,
					phase: 'error',
					roleName: currentPlayer?.roleName ?? '',
					message: '제출 실패',
					progress: 100
				};
			}

			return;
		}

		if (currentMission.type === 'team-final') {
			transmissionState = {
				...transmissionState,
				phase: 'applying',
				message: '최종 값을 팀 동기화 목록에 제출하는 중입니다.',
				progress: 80
			};

			await wait(500);

			await handleFinalMissionSubmit(validateResult.finalPiece);

			transmissionState = {
				visible: true,
				phase: 'success',
				roleName: currentPlayer.roleName,
				message: '최종 값이 제출되었습니다.',
				progress: 100
			};

			return;
		}

		transmissionState = {
			...transmissionState,
			phase: 'mapping',
			message: 'JSON을 시뮬레이션 명령으로 변환하는 중입니다.',
			progress: 65
		};

		await wait(450);

		const mapResult = mapJsonToSimulationState(themeId, jsonText);

		if (!mapResult.ok) {
			status = 'editing';

			transmissionState = {
				visible: true,
				phase: 'error',
				roleName: currentPlayer.roleName,
				message: '시뮬레이션 명령 변환에 실패했습니다.',
				progress: 100
			};

			consoleLogs = [
				{
					type: 'error',
					text: mapResult.message ?? '시뮬레이션 상태로 변환하지 못했습니다.'
				}
			];

			return;
		}

		transmissionState = {
			...transmissionState,
			phase: 'applying',
			message: '공용 시스템에 명령을 적용하는 중입니다.',
			progress: 85
		};

		await wait(500);

		const nextSimulationState = mergeSimulationState(simulationState, mapResult.state);
		const nextMissionProgress = getNextProgressForCurrentPlayer('cleared');
		const nextMissionIndex = getNextMissionIndexAfterMissionClear();
		const nextRoomStatus = getNextRoomStatusAfterMissionClear();

		await syncMissionSuccessToFirestore({
			nextMissionProgress,
			nextSimulationState,
			nextMissionIndex,
			nextRoomStatus
		});

		simulationState = nextSimulationState;

		hasExecuted = true;
		status = 'executed';

		transmissionState = {
			visible: true,
			phase: 'success',
			roleName: currentPlayer.roleName,
			message: '명령이 공용 시스템에 적용되었습니다.',
			progress: 100
		};

		consoleLogs = [
			{
				type: 'success',
				text: `${currentPlayer.roleName} 요원의 명령이 적용되었습니다.`
			},
			{
				type: 'success',
				text: `미션 ${currentMissionIndex + 1}이 완료되었습니다.`
			}
		];

		await wait(600);

		markCurrentPlayerMissionCleared();
		unlockNextMissionIfReady();
	}

	function resetMission() {
		currentPlayerId = 'player_1';
		currentMissionIndex = 0;
		verificationEnergy = maxVerificationEnergy;
		finalSubmissions = {};

		showMissionCompleteModal = false;
		completedMissionIndex = null;
		pendingNextMissionIndex = null;
		showFinalReadyModal = false;
		showFinalSuccessModal = false;
		isFinalSequencePlaying = false;

		jsonText = course.missions[0].initialJson;
		status = 'editing';
		//canExecute = false;
		hasExecuted = false;

		transmissionState = {
			visible: false,
			phase: 'idle',
			roleName: '',
			message: '',
			progress: 0
		};

		players = players.map((player) => ({
			...player,
			missionProgress: ['playing', 'locked', 'locked']
		}));

		simulationState = {
			layers: {}
		};

		consoleLogs = [
			{
				type: 'info',
				text: '복구 명령 JSON을 작성한 뒤 명령전송을 누르세요.'
			}
		];
	}

	let localCurrentPlayerId = 'player_1';

	let currentMissionIndex = 0;
	let verificationEnergy = 5;
	let maxVerificationEnergy = 5;

	let players = [];
	$: mockPlayers =
		course?.mockPlayers ??
		course?.roles?.map((role, index) => ({
			id: `player_${index + 1}`,
			name: role.name ?? `학생${index + 1}`,
			avatarSrc: role.avatarSrc ?? `/images/avatars/${index + 1}.png`,
			roleId: role.id,
			roleName: role.roleName ?? role.name ?? role.id,
			isAutoCleared: false,
			missionProgress:
				course?.missions?.map((mission, missionIndex) =>
					missionIndex === 0 ? 'playing' : 'locked'
				) ?? []
		})) ??
		[];

	function createAutoClearedPlayer(roleId) {
		const role = course.roles.find((item) => item.id === roleId);

		return {
			id: `auto_${roleId}`,
			name: '시스템',
			avatarSrc: role?.avatarSrc ?? '',
			roleId,
			roleName: role?.roleName ?? role?.name ?? roleId,
			isAutoCleared: true,
			missionProgress: course.missions.map((mission) => {
				return mission.type === 'team-final' ? 'submitted' : 'cleared';
			})
		};
	}
	$: hasFirebaseParticipants = Array.isArray(participants) && participants.length > 0;
	$: shouldUseFirebase = hasFirebaseParticipants && !useMockPlayers;
	$: currentPlayerId = shouldUseFirebase ? activeParticipantId : localCurrentPlayerId;
	$: basePlayers = shouldUseFirebase
		? participants.map((participant) => ({
				id: participant.id,
				name: participant.name,
				avatarSrc: participant.avatarSrc,
				roleId: participant.roleId,
				roleName: participant.roleName,
				isAutoCleared: false,
				missionProgress:
					participant.missionProgress ??
					course.missions.map((mission, missionIndex) =>
						missionIndex === 0 ? 'playing' : 'locked'
					)
		  }))
		: mockPlayers;

	$: autoClearedRoles = shouldUseFirebase ? room?.autoClearedRoles ?? [] : [];

	$: players = [
		...basePlayers,
		...autoClearedRoles.map((roleId) => createAutoClearedPlayer(roleId))
	];

	$: currentPlayer = players.find((player) => player.id === currentPlayerId) ?? players[0];
	$: currentMission = course.missions[currentMissionIndex];
	$: currentRoleMission = currentMission?.roleMissions?.[currentPlayer?.roleId];

	function setJsonForCurrentMission(missionIndex) {
		const mission = course.missions[missionIndex];
		if (!mission) return;

		jsonText = mission.initialJson ?? '';
		status = 'editing';
		hasExecuted = false;

		transmissionState = {
			visible: false,
			phase: 'idle',
			roleName: '',
			message: '',
			progress: 0
		};
	}

	function selectPlayer(playerId) {
		if (hasFirebaseParticipants && !useMockPlayers) {
			return;
		}

		localCurrentPlayerId = playerId;

		requestAnimationFrame(() => {
			setJsonForCurrentMission(currentMissionIndex);
		});
	}
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

		completedMissionIndex = currentMissionIndex;

		if (currentMissionIndex >= course.missions.length - 1) {
			pendingNextMissionIndex = null;
			showMissionCompleteModal = true;

			status = 'cleared';
			//canExecute = false;
			hasExecuted = true;

			consoleLogs = [
				...consoleLogs,
				{
					type: 'success',
					text: '모든 요원이 마지막 미션을 완료했습니다. 코스 클리어!'
				}
			];

			return;
		}

		pendingNextMissionIndex = currentMissionIndex + 1;
		showMissionCompleteModal = true;

		consoleLogs = [
			...consoleLogs,
			{
				type: 'success',
				text: `모든 요원이 미션 ${currentMissionIndex + 1}을 완료했습니다.`
			},
			{
				type: 'info',
				text: `미션 ${pendingNextMissionIndex + 1}이 열릴 준비가 되었습니다.`
			}
		];
	}
	function startPendingMission() {
		if (pendingNextMissionIndex === null) {
			showMissionCompleteModal = false;
			return;
		}

		const nextMissionIndex = pendingNextMissionIndex;

		players = players.map((player) => {
			const nextProgress = [...player.missionProgress];
			nextProgress[nextMissionIndex] = 'playing';

			return {
				...player,
				missionProgress: nextProgress
			};
		});
		currentMissionIndex = nextMissionIndex;

		setJsonForCurrentMission(nextMissionIndex);

		showMissionCompleteModal = false;
		completedMissionIndex = null;
		pendingNextMissionIndex = null;

		consoleLogs = [
			{
				type: 'success',
				text: `미션 ${currentMissionIndex + 1}이 시작되었습니다.`
			},
			{
				type: 'info',
				text: '새로운 단서를 확인하고 JSON 값을 완성하세요.'
			}
		];
	}
	function getMissionSuccessLayer(mission = currentMission) {
		return {
			layers: mission?.successLayers ?? {}
		};
	}
	function mergeLayerState(prevState, nextState) {
		return {
			...prevState,
			layers: {
				...(prevState.layers ?? {}),
				...(nextState.layers ?? {})
			}
		};
	}
	let finalSubmissions = {};

	let lastRoomFinalSubmissionsKey = '';

	$: if (shouldUseFirebase && room?.finalSubmissions) {
		const nextRoomFinalSubmissionsKey = JSON.stringify(room.finalSubmissions);

		if (nextRoomFinalSubmissionsKey !== lastRoomFinalSubmissionsKey) {
			lastRoomFinalSubmissionsKey = nextRoomFinalSubmissionsKey;
			finalSubmissions = room.finalSubmissions;
		}
	}

	function markCurrentPlayerMissionSubmitted() {
		players = players.map((player) => {
			if (player.id !== currentPlayerId) return player;

			const nextProgress = [...player.missionProgress];
			nextProgress[currentMissionIndex] = 'submitted';

			return {
				...player,
				missionProgress: nextProgress
			};
		});
	}

	function isFinalMissionSubmittedByAllPlayers() {
		return players.every((player) => {
			return player.missionProgress[currentMissionIndex] === 'submitted';
		});
	}

	function getAutoFinalSubmissions() {
		const finalMission = course.missions.find((mission) => mission.type === 'team-final');

		return autoClearedRoles.reduce((acc, roleId) => {
			const finalPiece = finalMission?.roleMissions?.[roleId]?.finalPiece;

			if (finalPiece) {
				acc[roleId] = {
					...finalPiece,
					auto: true
				};
			}

			return acc;
		}, {});
	}

	function getMergedFinalSubmissions() {
		return {
			...getAutoFinalSubmissions(),
			...finalSubmissions
		};
	}

	function buildFinalJsonFromSubmissions() {
		const merged = getMergedFinalSubmissions();

		return {
			전력: merged.power?.value ?? 0,
			산소: merged.oxygen?.value ?? false,
			통신코드: merged.communication?.value ?? '',
			탐사로봇: merged.rover?.value ?? false
		};
	}
	async function handleFinalMissionSubmit(finalPiece) {
		const nextMissionProgress = getNextProgressForCurrentPlayer('submitted');

		finalSubmissions = {
			...finalSubmissions,
			[currentPlayer.roleId]: finalPiece
		};

		if (canSyncToFirestore()) {
			try {
				await applyMissionSuccess({
					lessonId,
					roomId,
					participantId: activeParticipantId,
					missionProgress: nextMissionProgress,
					currentMissionIndex,
					status: 'final'
				});

				await updateRoomState({
					lessonId,
					roomId,
					patch: {
						[`finalSubmissions.${currentPlayer.roleId}`]: finalPiece
					}
				});
			} catch (error) {
				console.error('최종 미션 제출 동기화 실패:', error);
			}
		}

		markCurrentPlayerMissionSubmitted();

		//canExecute = false;
		status = 'submitted';

		consoleLogs = [
			...consoleLogs,
			{
				type: 'success',
				text: `${currentPlayer.roleName} 요원의 최종 값이 제출되었습니다.`
			}
		];

		if (!isFinalMissionSubmittedByAllPlayers()) {
			consoleLogs = [
				...consoleLogs,
				{
					type: 'info',
					text: '다른 요원의 최종 제출을 기다리는 중입니다.'
				}
			];

			return;
		}

		const finalJson = buildFinalJsonFromSubmissions();
		const finalJsonText = JSON.stringify(finalJson, null, 2);

		// 최종 JSON 전체 검증
		const finalValidateResult = validateMissionJson({
			jsonText: finalJsonText,
			course,
			missionIndex: currentMissionIndex,
			roleId: 'team'
		});

		if (!finalValidateResult.ok) {
			status = 'editing';

			consoleLogs = [
				...consoleLogs,
				{
					type: 'error',
					text: '4명의 값은 모두 제출되었지만, 최종 JSON 조합 결과가 조건에 맞지 않습니다.'
				},
				...finalValidateResult.messages
			];

			transmissionState = {
				visible: true,
				phase: 'error',
				roleName: '팀 전체',
				message: '최종 JSON 조합 검증에 실패했습니다.',
				progress: 100
			};

			return;
		}

		jsonText = finalJsonText;

		completedMissionIndex = currentMissionIndex;
		pendingNextMissionIndex = null;

		showFinalReadyModal = true;
		showMissionCompleteModal = false;
		showFinalSuccessModal = false;
		isFinalSequencePlaying = false;

		status = 'finalReady';
		hasExecuted = false;

		consoleLogs = [
			...consoleLogs,
			{
				type: 'success',
				text: '모든 최종 값이 모였습니다. 최종 JSON이 완성되었습니다.'
			},
			{
				type: 'info',
				text: '최종 실행하기를 누르면 공용 시뮬레이션에 반영됩니다.'
			}
		];
	}
	function debugCompleteCurrentMissionForAll() {
		players = players.map((player) => {
			const nextProgress = [...player.missionProgress];
			nextProgress[currentMissionIndex] =
				currentMission?.type === 'team-final' ? 'submitted' : 'cleared';

			return {
				...player,
				missionProgress: nextProgress
			};
		});

		if (currentMission?.type === 'team-final') {
			finalSubmissions = {
				power: {
					key: '전력',
					value: 100
				},
				oxygen: {
					key: '산소',
					value: true
				},
				communication: {
					key: '통신코드',
					value: 'AD32'
				},
				rover: {
					key: '탐사로봇',
					value: true
				}
			};

			const finalJson = buildFinalJsonFromSubmissions();

			jsonText = JSON.stringify(finalJson, null, 2);

			players = players.map((player) => {
				const nextProgress = [...player.missionProgress];
				nextProgress[currentMissionIndex] = 'submitted';

				return {
					...player,
					missionProgress: nextProgress
				};
			});

			completedMissionIndex = currentMissionIndex;
			pendingNextMissionIndex = null;

			showFinalReadyModal = true;
			showMissionCompleteModal = false;
			showFinalSuccessModal = false;
			isFinalSequencePlaying = false;

			//canExecute = false;
			status = 'finalReady';

			consoleLogs = [
				{
					type: 'success',
					text: '테스트: 모든 최종 값이 모였습니다. 최종 JSON이 완성되었습니다.'
				},
				{
					type: 'info',
					text: '최종 실행하기를 누르면 공용 시뮬레이션에 반영됩니다.'
				}
			];

			return;
		}

		simulationState = mergeLayerState(simulationState, getMissionSuccessLayer());

		consoleLogs = [
			{
				type: 'success',
				text: `테스트: 모든 요원이 미션 ${currentMissionIndex + 1}을 완료했습니다.`
			}
		];

		unlockNextMissionIfReady();
	}

	async function runFinalSequence() {
		showFinalReadyModal = false;
		isFinalSequencePlaying = false;
		showFinalSuccessModal = true;

		// 최종 실행 즉시 그래픽 효과 ON
		const nextSimulationState = mergeLayerState(simulationState, {
			layers: {
				finalSequence: true,
				energyLines: true,
				basePulse: true,
				baseOnline: true,
				systemOnline: false
			}
		});

		simulationState = nextSimulationState;

		if (canSyncToFirestore()) {
			try {
				await applyMissionSuccess({
					lessonId,
					roomId,
					participantId: activeParticipantId,
					missionProgress: getNextProgressForCurrentPlayer('cleared'),
					simulationState: nextSimulationState,
					currentMissionIndex,
					status: 'completed'
				});
			} catch (error) {
				console.error('최종 실행 동기화 실패:', error);
			}
		}

		players = players.map((player) => {
			const nextProgress = [...player.missionProgress];
			nextProgress[currentMissionIndex] = 'cleared';

			return {
				...player,
				missionProgress: nextProgress
			};
		});

		status = 'cleared';
		hasExecuted = true;

		consoleLogs = [
			...consoleLogs,
			{
				type: 'send',
				text: '최종 JSON을 공용 시뮬레이션으로 전송합니다.'
			},
			{
				type: 'success',
				text: '작전 성공! 4명의 JSON 값이 하나로 합쳐졌습니다.'
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
						on:click={() => selectPlayer(player.id)}
						class={`rounded-full px-3 py-1 text-xs font-black transition ${
							currentPlayerId === player.id
								? 'bg-blue-600 text-white'
								: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
						}`}
					>
						{player.roleName}
					</button>
				{/each}

				<div class="mx-1 h-5 w-px bg-slate-200"></div>

				<button
					type="button"
					on:click={debugCompleteCurrentMissionForAll}
					class="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white transition hover:bg-emerald-700"
				>
					현재 미션 전원 성공
				</button>
			</div>
			<div class="grid min-h-0 flex-1 grid-cols-[360px_480px_520px] gap-4">
				<aside class="flex min-h-0 flex-col gap-4 overflow-hidden">
					<!-- <MissionRoleCard role={powerMission.role} /> -->
					<MissionBriefingPanel
						variant={isReadCourse ? 'read' : 'write'}
						story={currentRoleMission?.story}
						role={currentRoleMission?.role}
						clues={currentRoleMission?.clues ?? []}
						keyChips={currentRoleMission?.keyChips ?? []}
						panelLabel={isReadCourse ? 'DATA ANALYSIS PANEL' : 'MISSION PANEL'}
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
						canExecute={status === 'checked'}
						title={isReadCourse ? '</> JSON 제출서' : '</> JSON 입력기'}
						executeButtonText={isReadCourse ? '제출하기' : '실행하기'}
						resetButtonText={isReadCourse ? '다시 작성' : '다시하기'}
						onReady={handleEditorReady}
						onFormat={formatJson}
						onExecute={executeMission}
						onReset={resetMission}
					/>

					<div class="h-[170px] shrink-0">
						<JsonEditorConsole logs={consoleLogs} {status} />
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
					<div class="shrink-0">
						<CommandTransmissionPanel state={transmissionState} />
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
	{#if showMissionCompleteModal}
		<div
			class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-[88px]"
		>
			<!-- 공용화면이 보이도록 아주 약한 오버레이만 사용 -->
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
							{pendingNextMissionIndex === null ? '🏆' : '⚡'}
						</div>

						<div class="min-w-0 flex-1">
							<div
								id="mission-complete-title"
								class="text-[24px] font-black tracking-[-0.06em] text-slate-950"
							>
								{pendingNextMissionIndex === null
									? '코스 클리어!'
									: `미션 ${(completedMissionIndex ?? 0) + 1} 완료!`}
							</div>

							<div class="mt-1 text-[14px] font-bold leading-6 text-slate-500">
								{#if pendingNextMissionIndex === null}
									모든 팀원이 마지막 미션을 완료했습니다.
								{:else}
									모든 팀원이 미션 {(completedMissionIndex ?? 0) + 1}을 완료했습니다. 공용 화면의
									변화를 확인해 보세요.
								{/if}
							</div>
						</div>
					</div>

					{#if pendingNextMissionIndex !== null}
						<div class="mt-4 rounded-2xl border border-blue-100 bg-blue-50/90 p-4">
							<div class="text-[11px] font-black tracking-[0.14em] text-blue-500">NEXT MISSION</div>

							<div class="mt-1 text-[20px] font-black tracking-[-0.06em] text-slate-950">
								미션 {pendingNextMissionIndex + 1}. {course.missions[pendingNextMissionIndex].title}
							</div>

							<div class="mt-2 text-[14px] font-bold leading-6 text-slate-600">
								{course.missions[pendingNextMissionIndex].roleMissions[currentPlayer.roleId].story
									.mission}
							</div>
						</div>
					{:else}
						<div class="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4">
							<div class="text-[11px] font-black tracking-[0.14em] text-emerald-600">
								COURSE CLEAR
							</div>

							<div class="mt-1 text-[20px] font-black tracking-[-0.06em] text-slate-950">
								달 기지가 온라인 상태로 전환되었습니다.
							</div>

							<div class="mt-2 text-[14px] font-bold leading-6 text-slate-600">
								공용 시뮬레이션에 최종 복구 결과가 반영되었습니다.
							</div>
						</div>
					{/if}

					<button
						type="button"
						on:click={startPendingMission}
						class="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-[15px] font-black tracking-[-0.04em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
					>
						{pendingNextMissionIndex === null
							? '결과 확인하기'
							: `미션 ${pendingNextMissionIndex + 1} 시작하기`}
					</button>
				</div>
			</div>
		</div>
	{/if}
	{#if showFinalReadyModal}
		<div
			class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-[88px]"
		>
			<div class="absolute inset-0 bg-slate-950/10"></div>

			<div
				role="dialog"
				aria-modal="true"
				class="mission-drop pointer-events-auto relative z-10 w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-md"
			>
				<div class="flex items-start gap-4">
					<div
						class="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-violet-100 text-[30px] shadow-[0_0_30px_rgba(139,92,246,0.28)]"
					>
						🧩
					</div>

					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<div class="text-[24px] font-black tracking-[-0.06em] text-slate-950">
								최종 JSON 완성!
							</div>

							<div
								class="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-violet-600"
							>
								READY
							</div>
						</div>

						<div class="mt-1 text-[14px] font-bold leading-6 text-slate-500">
							모든 요원의 값이 모였습니다. 공용 화면의 변화를 확인한 뒤 최종 실행을 눌러 주세요.
						</div>
					</div>
				</div>

				<pre
					class="mt-4 max-h-[130px] overflow-auto rounded-2xl bg-slate-950 p-4 text-[12px] font-bold leading-5 text-emerald-200">{jsonText}</pre>

				<button
					type="button"
					on:click={runFinalSequence}
					class="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
				>
					최종 실행하기
				</button>
			</div>
		</div>
	{/if}
	{#if showFinalSuccessModal}
		<div class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[72px]">
			<!-- 투명 클릭 방지 레이어: 뒤 그래픽은 보이지만 클릭은 막음 -->
			<button
				type="button"
				aria-label="작전 완료 보고서"
				class="absolute inset-0 cursor-default bg-transparent"
				tabindex="-1"
			></button>

			<div
				role="dialog"
				aria-modal="true"
				class="relative z-10 w-full max-w-[860px] -translate-x-[277px] overflow-hidden rounded-[34px] border border-white/70 bg-white/95 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.30)]"
			>
				<div
					class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-300/45 blur-3xl"
				></div>

				<div
					class="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-cyan-300/30 blur-3xl"
				></div>

				<div class="relative z-10">
					<div class="flex items-start justify-between gap-5">
						<div class="flex min-w-0 items-start gap-5">
							<div
								class="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-emerald-300 text-[42px] shadow-[0_0_36px_rgba(52,211,153,0.48)]"
							>
								🏆
							</div>

							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<div class="text-[31px] font-black tracking-[-0.075em] text-slate-950">
										작전 성공!
									</div>

									<div
										class="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-black text-emerald-700"
									>
										작전 완료 보고서
									</div>
								</div>

								<div class="mt-2 text-[15px] font-bold leading-7 text-slate-600">
									모둠원이 각자 맡은 JSON 값을 완성했습니다.
									<br />
									4개의 값이 하나로 합쳐져 최종 JSON이 완성되었고, 달 기지가 온라인 상태로 전환되었습니다.
								</div>
							</div>
						</div>

						<button
							type="button"
							on:click={console.log('')}
							class="shrink-0 rounded-2xl bg-slate-950 px-5 py-3 text-[14px] font-black text-white shadow-[0_12px_28px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
						>
							나가기
						</button>
					</div>

					<div class="mt-5 grid grid-cols-[1.05fr_1fr] gap-3">
						<!-- 왼쪽: 최종 JSON + 자료형 정리 -->
						<div class="space-y-3">
							<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
								<div class="flex items-center justify-between gap-3">
									<div>
										<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
											FINAL JSON
										</div>
										<div class="mt-1 text-[18px] font-black tracking-[-0.055em] text-slate-950">
											최종 JSON 완성
										</div>
									</div>

									<div
										class="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white"
									>
										4개 값 결합
									</div>
								</div>

								<pre
									class="mt-3 max-h-[150px] overflow-auto rounded-2xl bg-slate-950 p-4 text-[13px] font-bold leading-6 text-emerald-200">{jsonText}</pre>
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									JSON 학습 결과
								</div>

								<div class="mt-3 grid grid-cols-3 gap-2">
									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[11px] font-black text-slate-400">숫자 number</div>
										<div class="mt-1 text-[17px] font-black text-slate-950">100</div>
										<div class="mt-1 text-[11px] font-bold text-slate-500">따옴표 없이 입력</div>
									</div>

									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[11px] font-black text-slate-400">문자열 string</div>
										<div class="mt-1 text-[17px] font-black text-blue-600">"AD32"</div>
										<div class="mt-1 text-[11px] font-bold text-slate-500">따옴표로 감싸기</div>
									</div>

									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[11px] font-black text-slate-400">불리언 boolean</div>
										<div class="mt-1 text-[17px] font-black text-emerald-600">true</div>
										<div class="mt-1 text-[11px] font-bold text-slate-500">true / false</div>
									</div>
								</div>
							</div>
						</div>

						<!-- 오른쪽: 협동 결과 + 검증 기록 -->
						<div class="space-y-3">
							<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									모둠 협동 결과
								</div>

								<div class="mt-3 space-y-2">
									<div
										class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm"
									>
										<div class="text-[13px] font-black text-slate-800">전력 요원</div>
										<div
											class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-700"
										>
											"전력": 100
										</div>
									</div>

									<div
										class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm"
									>
										<div class="text-[13px] font-black text-slate-800">산소 요원</div>
										<div
											class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"
										>
											"산소": true
										</div>
									</div>

									<div
										class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm"
									>
										<div class="text-[13px] font-black text-slate-800">통신 요원</div>
										<div
											class="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700"
										>
											"통신코드": "AD32"
										</div>
									</div>

									<div
										class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm"
									>
										<div class="text-[13px] font-black text-slate-800">탐사로봇 요원</div>
										<div
											class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700"
										>
											"탐사로봇": true
										</div>
									</div>
								</div>

								<div
									class="mt-3 rounded-2xl bg-white px-3 py-3 text-[13px] font-bold leading-6 text-slate-500 shadow-sm"
								>
									각 요원이 맡은 한 줄의 값을 제출했고, 제출된 값이 모여 하나의 JSON 데이터가
									완성되었습니다.
								</div>
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">검증 기록</div>

								<div class="mt-3 grid grid-cols-3 gap-2">
									<div class="rounded-2xl bg-blue-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-blue-500">검증 에너지</div>
										<div class="mt-1 text-[22px] font-black text-blue-700">
											{maxVerificationEnergy - verificationEnergy}
										</div>
										<div class="mt-1 text-[10px] font-bold text-blue-500">회 사용</div>
									</div>

									<div class="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-emerald-500">완료한 값</div>
										<div class="mt-1 text-[22px] font-black text-emerald-700">12</div>
										<div class="mt-1 text-[10px] font-bold text-emerald-500">개</div>
									</div>

									<div class="rounded-2xl bg-amber-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-amber-500">검증하며 수정</div>
										<div class="mt-1 text-[22px] font-black text-amber-700">
											{Math.max(maxVerificationEnergy - verificationEnergy - 12, 0)}
										</div>
										<div class="mt-1 text-[10px] font-bold text-amber-500">회</div>
									</div>
								</div>

								<div
									class="mt-3 rounded-2xl bg-slate-50 px-3 py-3 text-[13px] font-bold leading-6 text-slate-500"
								>
									JSON은 한 번에 맞히는 것보다, 검증하고 수정하면서 정확한 데이터 구조를 만들어 가는
									과정이 중요합니다.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.mission-drop) {
		animation: missionDrop 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@keyframes missionDrop {
		from {
			opacity: 0;
			transform: translateY(-42px) scale(0.96);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
