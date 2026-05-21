// src/lib/components/workplace/actions/finalMissionAction.js

import { setAllPlayersMissionState } from '../state/workspaceState.js';
import { validateMissionJson } from '../validator/missionValidator.js';

function getAutoFinalSubmissions({ course, currentMission, autoClearedRoles = [] }) {
	return autoClearedRoles.reduce((acc, roleId) => {
		const finalPiece = currentMission?.roleMissions?.[roleId]?.finalPiece;

		if (finalPiece) {
			acc[roleId] = {
				...finalPiece,
				auto: true
			};
		}

		return acc;
	}, {});
}

export function buildFinalJsonFromSubmissions({
	course,
	currentMission,
	finalSubmissions = {},
	autoClearedRoles = []
}) {
	const merged = {
		...getAutoFinalSubmissions({
			course,
			currentMission,
			autoClearedRoles
		}),
		...finalSubmissions
	};

	return Object.values(merged).reduce((acc, item) => {
		if (!item?.key) return acc;

		acc[item.key] = item.value;
		return acc;
	}, {});
}

export function createDebugFinalSubmissions({ currentMission }) {
	const roleMissions = currentMission?.roleMissions ?? {};

	return Object.entries(roleMissions).reduce((acc, [roleId, roleMission]) => {
		const finalPiece = roleMission?.finalPiece;

		if (finalPiece) {
			acc[roleId] = finalPiece;
		}

		return acc;
	}, {});
}

function isFinalMissionSubmittedByAllPlayersAfterCurrentSubmit({
	players,
	currentPlayerId,
	missionIndex
}) {
	return players.every((player) => {
		if (player.id === currentPlayerId) return true;
		return player.missionProgress?.[missionIndex] === 'submitted';
	});
}

export async function submitFinalMissionPieceAction({ context, actions }) {
	const {
		course,
		currentMission,
		currentMissionIndex,
		currentPlayer,
		currentPlayerId,
		players,
		finalPiece,
		finalSubmissions,
		autoClearedRoles,
		consoleLogs
	} = context;

	const {
		getNextProgressForCurrentPlayer,
		syncFinalPieceToFirestore,
		markCurrentPlayerMissionSubmitted,

		setFinalSubmissions,
		setJsonText,
		setStatus,
		setHasExecuted,
		setConsoleLogs,
		setTransmissionState,
		setCompletedMissionIndex,
		setPendingNextMissionIndex,
		setShowFinalReadyModal,
		setShowMissionCompleteModal,
		setShowFinalSuccessModal,
		setIsFinalSequencePlaying
	} = actions;

	const nextMissionProgress = getNextProgressForCurrentPlayer('submitted');

	const nextFinalSubmissions = {
		...finalSubmissions,
		[currentPlayer.roleId]: finalPiece
	};

	setFinalSubmissions(nextFinalSubmissions);

	await syncFinalPieceToFirestore({
		nextMissionProgress,
		roleId: currentPlayer.roleId,
		finalPiece
	});

	markCurrentPlayerMissionSubmitted();

	setStatus('submitted');

	const submittedLog = {
		type: 'success',
		text: `${currentPlayer.roleName} 요원의 최종 값이 제출되었습니다.`
	};

	const allSubmitted = isFinalMissionSubmittedByAllPlayersAfterCurrentSubmit({
		players,
		currentPlayerId,
		missionIndex: currentMissionIndex
	});

	if (!allSubmitted) {
		setConsoleLogs([
			...consoleLogs,
			submittedLog,
			{
				type: 'info',
				text: '다른 요원의 최종 제출을 기다리는 중입니다.'
			}
		]);

		return;
	}

	const finalJson = buildFinalJsonFromSubmissions({
		course,
		currentMission,
		finalSubmissions: nextFinalSubmissions,
		autoClearedRoles
	});

	const finalJsonText = JSON.stringify(finalJson, null, 2);

	const finalValidateResult = validateMissionJson({
		jsonText: finalJsonText,
		course,
		missionIndex: currentMissionIndex,
		roleId: 'team'
	});

	if (!finalValidateResult.ok) {
		setStatus('editing');

		setConsoleLogs([
			...consoleLogs,
			submittedLog,
			{
				type: 'error',
				text: '제출된 값은 모두 모였지만, 최종 JSON 조합 결과가 조건에 맞지 않습니다.'
			},
			...(finalValidateResult.messages ?? [])
		]);

		setTransmissionState({
			visible: true,
			phase: 'error',
			roleName: '팀 전체',
			message: '최종 JSON 조합 검증에 실패했습니다.',
			progress: 100
		});

		return;
	}

	setJsonText(finalJsonText);

	setCompletedMissionIndex(currentMissionIndex);
	setPendingNextMissionIndex(null);

	setShowFinalReadyModal(true);
	setShowMissionCompleteModal(false);
	setShowFinalSuccessModal(false);
	setIsFinalSequencePlaying(false);

	setStatus('finalReady');
	setHasExecuted(false);

	setConsoleLogs([
		...consoleLogs,
		submittedLog,
		{
			type: 'success',
			text: '모든 최종 값이 모였습니다. 최종 JSON이 완성되었습니다.'
		},
		{
			type: 'info',
			text: '최종 실행하기를 누르면 공용 시뮬레이션에 반영됩니다.'
		}
	]);
}

function createFinalSequenceState(currentMission) {
	return (
		currentMission?.successState ?? {
			layers: {}
		}
	);
}

export async function runFinalSequenceAction({ context, actions }) {
	const { currentMission, simulationState, players, currentMissionIndex, consoleLogs } = context;

	const {
		getNextProgressForCurrentPlayer,
		mergeLayerState,
		syncFinalSequenceToFirestore,

		setShowFinalReadyModal,
		setIsFinalSequencePlaying,
		setShowFinalSuccessModal,
		setSimulationState,
		setPlayers,
		setStatus,
		setHasExecuted,
		setConsoleLogs
	} = actions;

	const finalSequenceState = createFinalSequenceState(currentMission);
	const nextSimulationState = mergeLayerState(simulationState, finalSequenceState);

	setShowFinalReadyModal(false);
	setIsFinalSequencePlaying(false);
	setShowFinalSuccessModal(true);
	setSimulationState(nextSimulationState);

	await syncFinalSequenceToFirestore({
		nextMissionProgress: getNextProgressForCurrentPlayer('cleared'),
		nextSimulationState
	});

	setPlayers(
		setAllPlayersMissionState({
			players,
			missionIndex: currentMissionIndex,
			nextState: 'cleared'
		})
	);

	setStatus('cleared');
	setHasExecuted(true);

	setConsoleLogs([
		...consoleLogs,
		{
			type: 'send',
			text: '최종 JSON을 공용 시뮬레이션으로 전송합니다.'
		},
		{
			type: 'success',
			text: currentMission?.finalSuccessMessage ?? '최종 미션이 완료되었습니다.'
		}
	]);
}