<!-- C:\quizntalk\src\lib\components\workplace\JsonMissionWorkspace.svelte -->
<script>
	import {
		applyMissionSuccess,
		leaveRoom,
		recordParticipantAttempt,
		updateRoomState
	} from '$lib/firebase/missionRoom/missionRoomRepository.js';
	import { executeMissionAction } from './actions/executeMissionAction.js';
	import CommandTransmissionPanel from './CommandTransmissionPanel.svelte';
	import JsonEditorConsole from './JsonEditorConsole.svelte';
	import JsonEditorPanel from './JsonEditorPanel.svelte';
	import MissionBriefingPanel from './MissionBriefingPanel.svelte';
	import FinalAnalyzingModal from './modals/FinalAnalyzingModal.svelte';
	import SharedSimulationPanel from './SharedSimulationPanel.svelte';
	import TeamExecutionBoard from './TeamExecutionBoard.svelte';
	import { moonBaseCourse } from './theme/spaceBase/spaceBaseCourse';

	import { isReadMissionCourse } from '$lib/firebase/missionRoom/missionRoomService.js';
	import {
		buildFinalJsonFromSubmissions,
		createDebugFinalSubmissions,
		runFinalSequenceAction,
		submitFinalMissionPieceAction
	} from './actions/finalMissionAction.js';
	import MissionWorkspaceHeader from './MissionWorkspaceHeader.svelte';
	import FinalSuccessModal from './modals/FinalSuccessModal.svelte';
	import MissionCompleteModal from './modals/MissionCompleteModal.svelte';
	import ReadMissionPanel from './ReadMissionPanel.svelte';
	import {
		buildWorkspacePlayers,
		getNextMissionProgressForPlayer,
		markPlayerMissionState,
		resetPlayersMissionProgress,
		setAllPlayersMissionState
	} from './state/workspaceState.js';

	import LeaveRoomModal from './modals/LeaveRoomModal.svelte';
	import RoomIntroModal from './modals/RoomIntroModal.svelte';
	import RoomWaitingModal from './modals/RoomWaitingModal.svelte';

	export let roomCode = '';
	export let lessonId = '';
	export let roomId = '';

	export let room = null;
	export let participants = [];
	export let participantId = '';
	export let useMockPlayers = false;

	export let course = moonBaseCourse;

	let lastRestartEventVersion = 0;

	$: localParticipantId =
		typeof localStorage !== 'undefined'
			? localStorage.getItem(`participant_id_${roomCode}`) ?? ''
			: '';

	$: activeParticipantId = participantId || localParticipantId;

	$: isReadCourse = isReadMissionCourse(course);

	let jsonText = '';
	let status = 'editing';

	let hasExecuted = false;
	//let canExecute = false;
	$: themeId = course?.themeId ?? 'spaceBase';
	let showMissionCompleteModal = false;
	let completedMissionIndex = null;
	let pendingNextMissionIndex = null;

	let showRoomIntroModal = Boolean(course?.intro);

	let lastIntroCourseId = '';

	$: {
		const introCourseId = course?.id ?? course?.themeId ?? '';

		if (introCourseId && introCourseId !== lastIntroCourseId) {
			lastIntroCourseId = introCourseId;
			showRoomIntroModal = Boolean(course?.intro);
		}
	}
	//--------- 테마완료멘트
	$: completion = course?.completion ?? {};

	$: completionBadge = completion.badge ?? 'MISSION COMPLETE';
	$: completionTitle = completion.title ?? '모든 미션 완료!';
	$: completionSubtitle =
		completion.subtitle ?? '팀의 JSON 분석과 최종 판단이 모두 승인되었습니다.';
	$: completionSummaryTitle = completion.summaryTitle ?? '최종 결과';
	$: completionSummary = completion.summary ?? '공용화면에서 최종 결과를 확인해 보세요.';
	$: completionPrimaryButtonText = completion.primaryButtonText ?? '홈으로';
	//----------------------------
	let lastSeenMissionEventKey = '';
	let lastHandledRestartVersion = 0;

	function getMissionEventKey(event) {
		if (!event) return '';
		return `${event.type}:${event.missionId}:${event.version}`;
	}
	function getInitialMissionProgress() {
		return Array.from({ length: course?.missions?.length ?? 1 }, (_, index) => {
			return index === 0 ? 'playing' : 'locked';
		});
	}

	function openMissionCompleteFromEvent(event) {
		if (!event) return;

		if (event.type === 'room_restarted') {
			return;
		}

		completedMissionIndex = event.missionIndex ?? currentMissionIndex;

		if (event.type === 'final_ready' || event.status === 'finalReady') {
			pendingNextMissionIndex = null;
			status = 'finalReady';
			hasExecuted = true;

			showMissionCompleteModal = false;
			showFinalReadyModal = false;
			showFinalSuccessModal = false;
			showFinalAnalyzingModal = true;

			transmissionState = {
				visible: true,
				phase: 'sending',
				roleName: currentPlayer?.roleName ?? '',
				message: event.message ?? '모든 JSON 데이터를 모아 최종 결과를 분석하고 있습니다.',
				progress: 70
			};

			consoleLogs = [
				{
					type: 'success',
					text: event.message ?? '모든 친구의 최종 JSON 데이터가 모였습니다.'
				},
				{
					type: 'info',
					text: '최종 결과를 자동으로 분석하고 있습니다.'
				}
			];

			return;
		}

		const isFinalCompletedEvent =
			event.type === 'final_completed' ||
			(event.status === 'completed' && currentMission?.type === 'team-final');

		if (isFinalCompletedEvent) {
			pendingNextMissionIndex = null;
			status = 'cleared';
			hasExecuted = true;

			showMissionCompleteModal = false;
			showFinalReadyModal = false;
			showFinalAnalyzingModal = false;
			showFinalSuccessModal = true;

			transmissionState = {
				visible: true,
				phase: 'success',
				roleName: currentPlayer?.roleName ?? '',
				message: event.message ?? '최종 결과가 완성되었습니다.',
				progress: 100
			};

			consoleLogs = [
				{
					type: 'success',
					text: event.message ?? '최종 결과가 완성되었습니다.'
				},
				{
					type: 'info',
					text: '최종 결과를 확인하세요.'
				}
			];

			return;
		}

		if (event.status === 'completed') {
			pendingNextMissionIndex = null;
			status = 'cleared';
			hasExecuted = true;

			transmissionState = {
				visible: true,
				phase: 'success',
				roleName: currentPlayer?.roleName ?? '',
				message: event.message ?? '모든 미션이 완료되었습니다.',
				progress: 100
			};

			consoleLogs = [
				{
					type: 'success',
					text: event.message ?? '모든 미션이 완료되었습니다.'
				},
				{
					type: 'info',
					text: isReadCourse ? '최종 분석 보고서를 확인하세요.' : '모든 팀 활동이 완료되었습니다.'
				}
			];

			showMissionCompleteModal = false;
			showFinalReadyModal = false;
			showFinalAnalyzingModal = false;
			showFinalSuccessModal = true;
			return;
		}

		pendingNextMissionIndex =
			typeof event.nextMissionIndex === 'number' ? event.nextMissionIndex : currentMissionIndex + 1;

		showFinalReadyModal = false;
		showFinalAnalyzingModal = false;
		showFinalSuccessModal = false;
		showMissionCompleteModal = true;

		transmissionState = {
			visible: true,
			phase: 'success',
			roleName: currentPlayer?.roleName ?? '',
			message: event.message ?? '미션이 완료되었습니다.',
			progress: 100
		};

		consoleLogs = [
			{
				type: 'success',
				text: event.message ?? '미션이 완료되었습니다.'
			},
			{
				type: 'info',
				text: '다음 미션을 확인하세요.'
			}
		];
	}
	let showFinalReadyModal = false;
	let showFinalAnalyzingModal = false;
	let showFinalSuccessModal = false;

	let isFinalSequencePlaying = false;
	let autoFinalExecutionStarted = false;

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
	async function consumeEnergyOnWrongAnswer() {
		if (verificationEnergy <= 0) {
			return {
				ok: false,
				nextEnergy: 0,
				message: '에너지가 모두 소진되었습니다. 작전 실패입니다.'
			};
		}

		const nextEnergy = Math.max(verificationEnergy - 1, 0);

		if (shouldUseFirebase) {
			await updateRoomState({
				lessonId,
				roomId,
				patch: {
					verificationEnergy: nextEnergy
				}
			});
		} else {
			localVerificationEnergy = nextEnergy;
		}

		return {
			ok: nextEnergy > 0,
			nextEnergy,
			message:
				nextEnergy > 0
					? `오답입니다. 에너지가 1개 줄었습니다. 남은 에너지: ${nextEnergy}`
					: '에너지가 모두 소진되었습니다. 작전 실패입니다.'
		};
	}

	function getNextProgressForCurrentPlayer(nextState) {
		return getNextMissionProgressForPlayer({
			player: currentPlayer,
			course,
			missionIndex: currentMissionIndex,
			nextState
		});
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
		nextRoomStatus,
		shouldSyncSimulationState = true
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
				simulationState: shouldSyncSimulationState ? nextSimulationState : null,
				currentMissionIndex: nextMissionIndex,
				status: nextRoomStatus,
				lastMissionEvent:
					nextMissionIndex !== currentMissionIndex || nextRoomStatus === 'completed'
						? {
								type: 'mission_completed',
								missionId: currentMission?.id ?? '',
								missionTitle: currentMission?.title ?? `미션 ${currentMissionIndex + 1}`,
								missionIndex: currentMissionIndex,
								nextMissionIndex,
								status: nextRoomStatus,
								message:
									nextRoomStatus === 'completed'
										? '모든 미션이 완료되었습니다.'
										: `${
												currentMission?.title ?? `미션 ${currentMissionIndex + 1}`
										  }이 완료되었습니다.`,
								version: Date.now(),
								createdAt: new Date().toISOString()
						  }
						: null
			});
		} catch (error) {
			console.error('미션 성공 동기화 실패:', error);
		}
	}
	function requestLeaveCurrentRoom() {
		if (isLeavingRoom) return;
		showLeaveRoomModal = true;
	}

	async function confirmLeaveCurrentRoom() {
		if (isLeavingRoom) return;

		try {
			isLeavingRoom = true;

			if (shouldUseFirebase && lessonId && roomId && activeParticipantId) {
				await leaveRoom({
					lessonId,
					roomId,
					participantId: activeParticipantId
				});
			}

			if (typeof localStorage !== 'undefined' && roomCode) {
				localStorage.removeItem(`participant_id_${roomCode}`);
				localStorage.removeItem(`participant_name_${roomCode}`);
			}

			showLeaveRoomModal = false;
			window.location.href = '/';
		} catch (error) {
			console.error('방 나가기 실패:', error);

			consoleLogs = [
				{
					type: 'error',
					text: error?.message ?? '방에서 나가지 못했습니다.'
				}
			];

			transmissionState = {
				visible: true,
				phase: 'error',
				roleName: currentPlayer?.roleName ?? '',
				message: error?.message ?? '방에서 나가지 못했습니다.',
				progress: 100
			};
		} finally {
			isLeavingRoom = false;
		}
	}
	async function executeMission() {
		if (shouldUseFirebase && !isRoomReadyToPlay) {
			showRoomWaitingModal = true;

			transmissionState = {
				visible: true,
				phase: 'error',
				roleName: currentPlayer?.roleName ?? '',
				message: '팀원이 모두 모여야 시작할 수 있습니다.',
				progress: 100
			};

			consoleLogs = [
				{
					type: 'warning',
					text: `아직 모든 팀원이 모이지 않았습니다. ${joinedParticipantCount}/${requiredParticipantCount}명 입장했습니다.`
				},
				{
					type: 'info',
					text: '모든 팀원이 입장하면 미션을 시작할 수 있습니다.'
				}
			];

			return;
		}
		await executeMissionAction({
			context: {
				status,
				jsonText,
				course,
				themeId,
				currentMission,
				currentMissionIndex,
				currentPlayer,
				currentPlayerId,
				isReadCourse,
				useMockPlayers,
				lessonId,
				roomId,
				activeParticipantId,
				verificationEnergy,
				simulationState
			},
			actions: {
				setStatus: (nextStatus) => {
					status = nextStatus;
				},
				setVerificationEnergy: (nextVerificationEnergy) => {
					localVerificationEnergy = nextVerificationEnergy;
				},
				setTransmissionState: (nextTransmissionState) => {
					transmissionState = nextTransmissionState;
				},
				setConsoleLogs: (nextConsoleLogs) => {
					consoleLogs = nextConsoleLogs;
				},
				setHasExecuted: (nextHasExecuted) => {
					hasExecuted = nextHasExecuted;
				},
				setSimulationState: (nextSimulationState) => {
					simulationState = nextSimulationState;
				},

				recordCurrentAttempt,
				consumeEnergyOnWrongAnswer,
				getNextProgressForCurrentPlayer,
				getNextMissionIndexAfterMissionClear,
				getNextRoomStatusAfterMissionClear,
				syncMissionSuccessToFirestore,
				handleFinalMissionSubmit,
				markCurrentPlayerMissionCleared,
				unlockNextMissionIfReady
			}
		});
	}

	function resetMission() {
		localCurrentPlayerId = 'player_1';
		currentMissionIndex = 0;
		localVerificationEnergy = maxVerificationEnergy;
		finalSubmissions = {};

		showMissionCompleteModal = false;
		completedMissionIndex = null;
		pendingNextMissionIndex = null;

		showFinalReadyModal = false;
		showFinalAnalyzingModal = false;
		showFinalSuccessModal = false;
		isFinalSequencePlaying = false;
		autoFinalExecutionStarted = false;

		const firstPlayer = players.find((player) => player.id === 'player_1') ?? players[0];
		jsonText = getInitialJsonForMission(0, firstPlayer);
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

		players = resetPlayersMissionProgress({
			players,
			course
		});

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
	function resetCurrentJsonToInitial() {
		jsonText = getInitialJsonForMission(currentMissionIndex, currentPlayer);
		status = 'editing';
		hasExecuted = false;

		transmissionState = {
			visible: false,
			phase: 'idle',
			roleName: '',
			message: '',
			progress: 0
		};

		consoleLogs = [
			{
				type: 'info',
				text: `미션 ${currentMissionIndex + 1}의 JSON을 처음 상태로 되돌렸습니다.`
			}
		];
	}
	let localCurrentPlayerId = 'player_1';

	let currentMissionIndex = 0;

	let localVerificationEnergy = 5;
	let maxVerificationEnergy = 5;

	$: verificationEnergy = shouldUseFirebase
		? room?.verificationEnergy ?? maxVerificationEnergy
		: localVerificationEnergy;

	let players = [];

	$: hasFirebaseParticipants = Array.isArray(participants) && participants.length > 0;
	$: shouldUseFirebase = hasFirebaseParticipants && !useMockPlayers;
	$: currentPlayerId = shouldUseFirebase ? activeParticipantId : localCurrentPlayerId;

	$: requiredParticipantCount = room?.maxParticipants ?? course?.roles?.length ?? 4;
	$: joinedParticipantCount = shouldUseFirebase ? participants.length : players.length;
	$: isRoomReadyToPlay = !shouldUseFirebase || joinedParticipantCount >= requiredParticipantCount;

	let showRoomWaitingModal = false;
	let isLeavingRoom = false;
	let showLeaveRoomModal = false;
	$: players = buildWorkspacePlayers({
		course,
		participants,
		room,
		useMockPlayers,
		shouldUseFirebase
	});

	$: currentPlayer = players.find((player) => player.id === currentPlayerId) ?? players[0];
	$: currentMission = course.missions[currentMissionIndex] ?? course.missions[0];
	$: currentRoleMission = currentMission?.roleMissions?.[currentPlayer?.roleId];

	let lastInitialJsonKey = '';

	$: initialJsonKey = `${course?.id ?? course?.themeId ?? ''}:${currentMissionIndex}:${
		currentPlayer?.roleId ?? ''
	}`;

	$: if (initialJsonKey && initialJsonKey !== lastInitialJsonKey && !hasExecuted) {
		lastInitialJsonKey = initialJsonKey;
		jsonText = getInitialJsonForMission(currentMissionIndex, currentPlayer);
	}

	$: shouldShowSupportGuide =
		isReadCourse && requiredParticipantCount === 3 && currentMission?.supportGuideForThreePlayers;

	$: readQuestion =
		currentRoleMission?.question ??
		currentMission?.question ??
		currentRoleMission?.story?.mission ??
		'JSON 단서를 읽고 분석 결과를 제출하세요.';

	$: currentReviewKey =
		currentMission?.type === 'team-json-report' ? 'team' : currentPlayer?.roleId;

	$: currentReview =
		isReadCourse && currentMission?.id && currentReviewKey
			? room?.pendingReviews?.[currentMission.id]?.[currentReviewKey] ?? null
			: null;

	$: isCurrentReviewRejected = currentReview?.status === 'rejected';

	$: currentRejectReason = currentReview?.rejectReason ?? '';

	$: isCurrentReviewApproved = currentReview?.status === 'approved';

	$: currentApproveMessage =
		currentReview?.approveMessage ??
		currentReview?.feedback ??
		'선생님이 분석 결과를 승인했습니다. 팀원들이 모두 승인되면 다음 미션으로 넘어갑니다.';
	$: {
		const event = room?.lastMissionEvent;
		const eventKey = getMissionEventKey(event);

		if (shouldUseFirebase && event && eventKey && eventKey !== lastSeenMissionEventKey) {
			lastSeenMissionEventKey = eventKey;
			openMissionCompleteFromEvent(event);
		}
	}
	$: {
		const restartVersion = room?.restartVersion ?? 0;

		if (shouldUseFirebase && restartVersion && restartVersion !== lastHandledRestartVersion) {
			lastHandledRestartVersion = restartVersion;

			resetWorkspaceFromRestartEvent({
				type: 'room_restarted',
				version: restartVersion,
				message: '선생님이 방을 미션 1부터 다시 시작했습니다.'
			});
		}
	}
	function getInitialJsonForMission(missionIndex, player = currentPlayer) {
		const mission = course.missions[missionIndex];
		if (!mission) return '';

		const roleMission = mission?.roleMissions?.[player?.roleId];

		return roleMission?.initialJson ?? mission?.initialJson ?? '';
	}

	function setJsonForCurrentMission(missionIndex) {
		const mission = course.missions[missionIndex];
		if (!mission) return;

		jsonText = getInitialJsonForMission(missionIndex, currentPlayer);
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
		players = markPlayerMissionState({
			players,
			playerId: currentPlayerId,
			missionIndex: currentMissionIndex,
			nextState: 'cleared'
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
		return (
			mission?.successState ?? {
				layers: {}
			}
		);
	}
	function mergeLayerState(prevState = {}, nextState = {}) {
		return {
			...prevState,
			...nextState,
			layers: {
				...(prevState.layers ?? {}),
				...(nextState.layers ?? {})
			},
			sprites: {
				...(prevState.sprites ?? {}),
				...(nextState.sprites ?? {})
			},
			camera: {
				...(prevState.camera ?? {}),
				...(nextState.camera ?? {})
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
		players = markPlayerMissionState({
			players,
			playerId: currentPlayerId,
			missionIndex: currentMissionIndex,
			nextState: 'submitted'
		});
	}

	async function syncFinalPieceToFirestore({ nextMissionProgress, roleId, finalPiece }) {
		if (!canSyncToFirestore()) {
			return;
		}

		const nextFinalSubmissions = {
			...(finalSubmissions ?? {}),
			[roleId]: finalPiece
		};

		const requiredRoleIds = currentMission?.requiredRoleIds ?? course.roles.map((role) => role.id);

		const autoClearedRoleIds = shouldUseFirebase ? room?.autoClearedRoles ?? [] : [];

		const isFinalReady = requiredRoleIds.every((requiredRoleId) => {
			return (
				Boolean(nextFinalSubmissions[requiredRoleId]) || autoClearedRoleIds.includes(requiredRoleId)
			);
		});

		try {
			await updateRoomState({
				lessonId,
				roomId,
				patch: {
					[`finalSubmissions.${roleId}`]: finalPiece
				}
			});

			await applyMissionSuccess({
				lessonId,
				roomId,
				participantId: activeParticipantId,
				missionProgress: nextMissionProgress,
				currentMissionIndex,
				status: isFinalReady ? 'finalReady' : 'final',
				lastMissionEvent: isFinalReady
					? {
							type: 'final_ready',
							missionId: currentMission?.id ?? '',
							missionTitle: currentMission?.title ?? `미션 ${currentMissionIndex + 1}`,
							missionIndex: currentMissionIndex,
							nextMissionIndex: currentMissionIndex,
							status: 'finalReady',
							message: '모든 친구의 최종 JSON 데이터가 모였습니다.',
							version: Date.now(),
							createdAt: new Date().toISOString()
					  }
					: null
			});
		} catch (error) {
			console.error('최종 미션 제출 동기화 실패:', error);
		}
	}

	async function handleFinalMissionSubmit(finalPiece) {
		await submitFinalMissionPieceAction({
			context: {
				course,
				currentMission,
				currentMissionIndex,
				currentPlayer,
				currentPlayerId,
				players,
				finalPiece,
				finalSubmissions,
				autoClearedRoles: shouldUseFirebase ? room?.autoClearedRoles ?? [] : [],
				consoleLogs
			},
			actions: {
				getNextProgressForCurrentPlayer,
				syncFinalPieceToFirestore,
				markCurrentPlayerMissionSubmitted,

				setFinalSubmissions: (nextFinalSubmissions) => {
					finalSubmissions = nextFinalSubmissions;
				},
				setJsonText: (nextJsonText) => {
					jsonText = nextJsonText;
				},
				setStatus: (nextStatus) => {
					status = nextStatus;
				},
				setHasExecuted: (nextHasExecuted) => {
					hasExecuted = nextHasExecuted;
				},
				setConsoleLogs: (nextConsoleLogs) => {
					consoleLogs = nextConsoleLogs;
				},
				setTransmissionState: (nextTransmissionState) => {
					transmissionState = nextTransmissionState;
				},
				setCompletedMissionIndex: (nextCompletedMissionIndex) => {
					completedMissionIndex = nextCompletedMissionIndex;
				},
				setPendingNextMissionIndex: (nextPendingNextMissionIndex) => {
					pendingNextMissionIndex = nextPendingNextMissionIndex;
				},
				setShowFinalReadyModal: (nextShowFinalReadyModal) => {
					showFinalReadyModal = nextShowFinalReadyModal;
				},
				setShowMissionCompleteModal: (nextShowMissionCompleteModal) => {
					showMissionCompleteModal = nextShowMissionCompleteModal;
				},
				setShowFinalSuccessModal: (nextShowFinalSuccessModal) => {
					showFinalSuccessModal = nextShowFinalSuccessModal;
				},
				setIsFinalSequencePlaying: (nextIsFinalSequencePlaying) => {
					isFinalSequencePlaying = nextIsFinalSequencePlaying;
				}
			}
		});
	}
	function debugCompleteCurrentMissionForAll() {
		players = setAllPlayersMissionState({
			players,
			missionIndex: currentMissionIndex,
			nextState: currentMission?.type === 'team-final' ? 'submitted' : 'cleared'
		});

		if (currentMission?.type === 'team-final') {
			finalSubmissions = createDebugFinalSubmissions({
				currentMission
			});

			const finalJson = buildFinalJsonFromSubmissions({
				course,
				currentMission,
				finalSubmissions,
				autoClearedRoles: shouldUseFirebase ? room?.autoClearedRoles ?? [] : []
			});

			jsonText = JSON.stringify(finalJson, null, 2);

			players = setAllPlayersMissionState({
				players,
				missionIndex: currentMissionIndex,
				nextState: 'submitted'
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
					text: '최종 결과를 자동으로 분석하고 있습니다.'
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

		if (isReadCourse && currentMissionIndex >= course.missions.length - 1) {
			status = 'cleared';
			hasExecuted = true;

			showMissionCompleteModal = false;
			showFinalReadyModal = false;
			showFinalSuccessModal = true;

			transmissionState = {
				visible: true,
				phase: 'success',
				roleName: currentPlayer?.roleName ?? '',
				message: '모든 분석 미션이 완료되었습니다.',
				progress: 100
			};

			consoleLogs = [
				{
					type: 'success',
					text: '테스트: 모든 분석 미션이 완료되었습니다.'
				},
				{
					type: 'info',
					text: '최종 분석 보고서를 확인하세요.'
				}
			];

			return;
		}

		unlockNextMissionIfReady();
	}

	async function syncFinalSequenceToFirestore({ nextMissionProgress, nextSimulationState }) {
		if (!canSyncToFirestore()) {
			return;
		}

		const themeResult =
			typeof course?.finalizeThemeResult === 'function'
				? course.finalizeThemeResult({
						room,
						course,
						currentMission,
						finalSubmissions
				  })
				: null;

		const roomPatch = themeResult
			? {
					themeResult
			  }
			: {};

		const finalMessage =
			themeResult?.status === 'success'
				? '방어 성공! 팀의 작전으로 도시를 지켰습니다.'
				: themeResult?.status === 'fail'
				  ? '방어 실패! 장치 방향이나 무기를 다시 확인해야 합니다.'
				  : '최종 결과가 완성되었습니다.';

		try {
			await applyMissionSuccess({
				lessonId,
				roomId,
				participantId: activeParticipantId,
				missionProgress: nextMissionProgress,
				simulationState: nextSimulationState,
				currentMissionIndex,
				status: 'completed',
				roomPatch,
				lastMissionEvent: {
					type: 'final_completed',
					missionId: currentMission?.id ?? '',
					missionTitle: currentMission?.title ?? `미션 ${currentMissionIndex + 1}`,
					missionIndex: currentMissionIndex,
					nextMissionIndex: currentMissionIndex,
					status: 'completed',
					message: finalMessage,
					version: Date.now(),
					createdAt: new Date().toISOString()
				}
			});
		} catch (error) {
			console.error('최종 실행 동기화 실패:', error);
		}
	}
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	$: if (showFinalReadyModal && !autoFinalExecutionStarted) {
		startAutoFinalExecution();
	}

	async function startAutoFinalExecution() {
		if (autoFinalExecutionStarted) return;

		autoFinalExecutionStarted = true;

		showMissionCompleteModal = false;
		showFinalReadyModal = false;
		showFinalSuccessModal = false;
		showFinalAnalyzingModal = true;

		transmissionState = {
			visible: true,
			phase: 'sending',
			roleName: currentPlayer?.roleName ?? '',
			message: '모든 JSON 데이터를 모아 최종 결과를 분석하고 있습니다.',
			progress: 70
		};

		consoleLogs = [
			{
				type: 'success',
				text: '모든 친구의 최종 JSON 데이터가 모였습니다.'
			},
			{
				type: 'info',
				text: '최종 결과를 자동으로 분석하고 있습니다.'
			}
		];

		await sleep(1600);

		await runFinalSequence();
	}

	async function runFinalSequence() {
		showMissionCompleteModal = false;
		showFinalReadyModal = false;
		showFinalSuccessModal = false;
		showFinalAnalyzingModal = true;
		isFinalSequencePlaying = true;

		await runFinalSequenceAction({
			context: {
				currentMission,
				simulationState,
				players,
				currentMissionIndex,
				consoleLogs
			},
			actions: {
				getNextProgressForCurrentPlayer,
				mergeLayerState,
				syncFinalSequenceToFirestore,

				setShowFinalReadyModal: (nextShowFinalReadyModal) => {
					showFinalReadyModal = nextShowFinalReadyModal;
				},
				setIsFinalSequencePlaying: (nextIsFinalSequencePlaying) => {
					isFinalSequencePlaying = nextIsFinalSequencePlaying;
				},
				setShowFinalSuccessModal: (nextShowFinalSuccessModal) => {
					showFinalAnalyzingModal = false;
					showFinalSuccessModal = nextShowFinalSuccessModal;
				},
				setSimulationState: (nextSimulationState) => {
					simulationState = nextSimulationState;
				},
				setPlayers: (nextPlayers) => {
					players = nextPlayers;
				},
				setStatus: (nextStatus) => {
					status = nextStatus;
				},
				setHasExecuted: (nextHasExecuted) => {
					hasExecuted = nextHasExecuted;
				},
				setConsoleLogs: (nextConsoleLogs) => {
					consoleLogs = nextConsoleLogs;
				}
			}
		});
	}
	function resetWorkspaceFromRestartEvent(event) {
		currentMissionIndex = 0;
		localVerificationEnergy = maxVerificationEnergy;
		finalSubmissions = {};

		showMissionCompleteModal = false;
		completedMissionIndex = null;
		pendingNextMissionIndex = null;

		showFinalReadyModal = false;
		showFinalAnalyzingModal = false;
		showFinalSuccessModal = false;
		isFinalSequencePlaying = false;
		autoFinalExecutionStarted = false;

		jsonText = course.missions[0]?.initialJson ?? '';
		status = 'editing';
		hasExecuted = false;

		simulationState = {
			layers: {}
		};

		lastRoomSimulationStateKey = '';

		if (typeof lastAppliedAutoClearSimulationKey !== 'undefined') {
			lastAppliedAutoClearSimulationKey = '';
		}

		transmissionState = {
			visible: true,
			phase: 'idle',
			roleName: currentPlayer?.roleName ?? '',
			message: event?.message ?? '선생님이 방을 미션 1부터 다시 시작했습니다.',
			progress: 0
		};

		consoleLogs = [
			{
				type: 'info',
				text: event?.message ?? '선생님이 방을 미션 1부터 다시 시작했습니다.'
			},
			{
				type: 'info',
				text: '미션 1의 JSON을 다시 작성해 주세요.'
			}
		];
	}
</script>

<div class="flex h-full w-full items-start justify-center bg-[#eef3fb]">
	<div class="h-[900px] w-[1440px] shrink-0 bg-[#f4f7fb] px-4 pb-4 pt-0">
		<div class="flex h-full min-h-0 flex-col gap-2">
			<MissionWorkspaceHeader
				title={course?.title ?? '미션'}
				subtitle={course?.subtitle ?? '미션 명령을 준비하세요.'}
				icon={course?.icon ?? '🧩'}
				missionTitle={currentMission?.title ?? ''}
				{currentMissionIndex}
				{verificationEnergy}
				{maxVerificationEnergy}
				roomNumber={room?.roomNumber}
				roomCode={room?.code ?? roomCode}
				onMenuClick={() => {}}
				onLeaveRoom={requestLeaveCurrentRoom}
			/>
			<!-- 테스트바 부분 -->
			{#if !shouldUseFirebase}
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
					<button
						type="button"
						on:click={resetMission}
						class="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-white transition hover:bg-slate-900"
					>
						처음부터 다시하기
					</button>
				</div>
			{/if}
			<div class="grid min-h-0 flex-1 grid-cols-[360px_470px_548px] gap-4">
				<aside class="flex min-h-0 flex-col gap-4 overflow-hidden">
					<!-- <MissionRoleCard role={powerMission.role} /> -->
					<MissionBriefingPanel
						variant={isReadCourse ? 'read' : 'write'}
						story={currentRoleMission?.story}
						role={currentRoleMission?.role}
						playerName={currentPlayer?.name ?? ''}
						clues={isReadCourse ? [] : currentRoleMission?.clues ?? []}
						keyChips={isReadCourse ? [] : currentRoleMission?.keyChips ?? []}
						panelLabel={isReadCourse ? 'DATA ANALYSIS PANEL' : 'MISSION PANEL'}
						onInsertKey={insertKey}
					/>
					{#if shouldShowSupportGuide}
						<div class="rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
							<div class="flex items-start gap-3">
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl"
								>
									🛰️
								</div>

								<div class="min-w-0">
									<div class="text-[14px] font-black text-emerald-700">
										{currentMission.supportGuideForThreePlayers.title}
									</div>

									<div class="mt-1 text-[12px] font-bold leading-5 text-emerald-700/80">
										{currentMission.supportGuideForThreePlayers.description}
									</div>

									<ul class="mt-3 flex flex-col gap-1.5">
										{#each currentMission.supportGuideForThreePlayers.items as item}
											<li class="flex gap-2 text-[12px] font-bold leading-5 text-slate-700">
												<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
												></span>
												<span>{item}</span>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					{/if}
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
					{#if isCurrentReviewRejected}
						<div class="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
							<div class="flex items-start gap-3">
								<div
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-lg"
								>
									↩
								</div>

								<div class="min-w-0">
									<div class="text-[14px] font-black text-rose-700">
										선생님이 다시 수정하라고 했어요
									</div>

									<div class="mt-1 text-[13px] font-bold leading-6 text-rose-600">
										{currentRejectReason || '내용을 다시 확인해서 수정한 뒤 다시 제출하세요.'}
									</div>

									<div class="mt-2 text-[12px] font-bold text-rose-400">
										JSON을 고친 뒤 다시 제출하면 선생님 확인 대기로 바뀝니다.
									</div>
								</div>
							</div>
						</div>
					{/if}
					{#if isCurrentReviewApproved}
						<div class="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
							<div class="flex items-start gap-3">
								<div
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg"
								>
									✓
								</div>

								<div class="min-w-0">
									<div class="text-[14px] font-black text-emerald-700">선생님이 승인했어요</div>

									<div class="mt-1 text-[13px] font-bold leading-6 text-emerald-600">
										{currentApproveMessage}
									</div>

									<div class="mt-2 text-[12px] font-bold text-emerald-400">
										팀원들이 모두 승인되면 다음 미션으로 넘어갑니다.
									</div>
								</div>
							</div>
						</div>
					{/if}

					{#if isReadCourse}
						<ReadMissionPanel
							clues={currentRoleMission?.clues ?? []}
							question={readQuestion}
							bind:answerText={jsonText}
							{status}
							logs={consoleLogs}
							onReady={handleEditorReady}
							onFormat={formatJson}
							onSubmit={executeMission}
							onReset={resetCurrentJsonToInitial}
						/>
					{:else}
						<JsonEditorPanel
							bind:jsonText
							canExecute={status === 'checked'}
							title="</> JSON 입력기"
							executeButtonText="실행하기"
							resetButtonText="처음코드로"
							onReady={handleEditorReady}
							onFormat={formatJson}
							onExecute={executeMission}
							onReset={resetCurrentJsonToInitial}
						/>

						<div class="h-[300px] shrink-0">
							<JsonEditorConsole logs={consoleLogs} {status} />
						</div>
					{/if}
				</main>

				<aside class="flex min-h-0 flex-col gap-2">
					<div class="shrink-0">
						<CommandTransmissionPanel state={transmissionState} />
					</div>

					<div class="h-[400px] z-0 shrink-0">
						<SharedSimulationPanel {themeId} {simulationState} />
					</div>
					<div class="shrink-0">
						<TeamExecutionBoard
							{players}
							{currentPlayerId}
							{currentMissionIndex}
							{verificationEnergy}
							{maxVerificationEnergy}
							maxPlayers={course?.roles?.length ?? 4}
						/>
					</div>

					<!-- <div class="shrink-0">
						<ExecutionLogPanel {status} {hasExecuted} />
					</div> -->
				</aside>
			</div>
		</div>
	</div>
	<RoomIntroModal
		show={showRoomIntroModal}
		intro={course?.intro}
		onClose={() => {
			showRoomIntroModal = false;
		}}
	/>
	<MissionCompleteModal
		show={showMissionCompleteModal}
		{course}
		{currentPlayer}
		{completedMissionIndex}
		{pendingNextMissionIndex}
		onStartNextMission={startPendingMission}
	/>

	<!-- <FinalReadyModal show={showFinalReadyModal} {jsonText} onRunFinalSequence={runFinalSequence} /> -->
	<FinalAnalyzingModal
		show={showFinalAnalyzingModal}
		title="모든 JSON 데이터 수신 완료"
		subtitle="팀원들의 데이터를 합치고 최종 결과를 분석하고 있어요."
	/>

	<FinalSuccessModal
		show={showFinalSuccessModal}
		{jsonText}
		{maxVerificationEnergy}
		{verificationEnergy}
		mode={isReadCourse ? 'read' : 'write'}
		completion={course?.completion}
		onExit={() => {
			showFinalSuccessModal = false;
		}}
	/>
	<RoomWaitingModal
		show={showRoomWaitingModal}
		{joinedParticipantCount}
		{requiredParticipantCount}
		onClose={() => {
			showRoomWaitingModal = false;
		}}
	/>
	<LeaveRoomModal
		show={showLeaveRoomModal}
		isLeaving={isLeavingRoom}
		roomNumber={room?.roomNumber}
		roomCode={room?.code ?? roomCode}
		onCancel={() => {
			if (!isLeavingRoom) {
				showLeaveRoomModal = false;
			}
		}}
		onConfirm={confirmLeaveCurrentRoom}
	/>
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
