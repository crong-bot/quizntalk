// src/lib/components/workplace/actions/finalMissionAction.js

import { mergeSimulationState } from '../simulation/simulationMapper.js';
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
function normalizeFinalFullValue(item) {
	if (!item?.value) return null;

	// value가 이미 { 최종방어작전: {...} } 전체 형태면 그대로 비교
	if (item.value?.최종방어작전) {
		return item.value;
	}

	// value가 내부 계획 {...}이고 key가 있으면 감싸서 비교
	if (item.key) {
		return {
			[item.key]: item.value
		};
	}

	return item.value;
}

function stableStringify(value) {
	if (Array.isArray(value)) {
		return `[${value.map(stableStringify).join(',')}]`;
	}

	if (value && typeof value === 'object') {
		return `{${Object.keys(value)
			.sort()
			.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
			.join(',')}}`;
	}

	return JSON.stringify(value);
}

function normalizeFullSubmissionValue(item) {
	if (!item?.value) return null;

	if (item.value && typeof item.value === 'object' && !Array.isArray(item.value)) {
		return item.value;
	}

	if (item.key) {
		return {
			[item.key]: item.value
		};
	}

	return item.value;
}

function getFullSubmissionMismatch({ finalSubmissions = {}, autoClearedRoles = [] }) {
	const submissions = Object.entries(finalSubmissions)
		.filter(([roleId]) => !autoClearedRoles.includes(roleId))
		.map(([roleId, item]) => ({
			roleId,
			value: normalizeFullSubmissionValue(item)
		}))
		.filter((item) => item.value !== null);

	if (submissions.length <= 1) {
		return null;
	}

	const firstKey = stableStringify(submissions[0].value);
	const mismatch = submissions.find((item) => stableStringify(item.value) !== firstKey);

	return mismatch ?? null;
}
export function buildFinalJsonBySubmitMode({
	course,
	currentMission,
	finalSubmissions = {},
	autoClearedRoles = []
}) {
	const mode = currentMission?.finalSubmitMode ?? 'pieces';

	if (mode === 'full') {
		const merged = {
			...getAutoFinalSubmissions({
				course,
				currentMission,
				autoClearedRoles
			}),
			...finalSubmissions
		};

		const submissions = Object.values(merged).filter(Boolean);

		const fullSubmission =
			submissions.find((item) => item?.mode === 'full' && item?.value) ??
			submissions.find((item) => item?.key && item?.value) ??
			submissions.find((item) => item?.value);

		if (!fullSubmission) {
			return {};
		}

		// value가 이미 { 최종방어작전: {...} } 전체 형태면 그대로 사용
		if (fullSubmission.value?.최종방어작전) {
			return fullSubmission.value;
		}

		// value가 내부 계획 {...} 형태면 key로 감싸기
		if (fullSubmission.key) {
			return {
				[fullSubmission.key]: fullSubmission.value
			};
		}

		return fullSubmission.value;
	}

	return buildFinalJsonFromSubmissions({
		course,
		currentMission,
		finalSubmissions,
		autoClearedRoles
	});
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

	if (
		currentMission?.finalSubmitMode === 'full' &&
		currentMission?.requireSameFinalSubmissions === true
	) {
		const mismatch = getFullSubmissionMismatch({
			finalSubmissions: nextFinalSubmissions,
			autoClearedRoles
		});

		if (mismatch) {
			const message =
				currentMission?.finalMismatchMessage ??
				'팀원들의 최종 JSON 값이 서로 다릅니다. 회의 후 같은 결론을 다시 제출하세요.';

			setStatus('editing');

			setConsoleLogs([
				...consoleLogs,
				submittedLog,
				{
					type: 'error',
					text: message
				}
			]);

			setTransmissionState({
				visible: true,
				phase: 'error',
				roleName: '팀 전체',
				message,
				progress: 100
			});

			return;
		}
	}

	const finalJson = buildFinalJsonBySubmitMode({
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

function createFinalSequenceState({ finalValidateResult }) {
	return (
		finalValidateResult?.simulationState ??
		finalValidateResult?.extra?.simulationState ??
		finalValidateResult?.data?.simulationState ?? {
			layers: {},
			sprites: {},
			camera: {},
			flags: {}
		}
	);
}

export async function runFinalSequenceAction({ context, actions }) {
	const {
		course,
		currentMission,
		simulationState,
		players,
		currentMissionIndex,
		consoleLogs,
		finalSubmissions,
		autoClearedRoles
	} = context;

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

	const finalJson = buildFinalJsonBySubmitMode({
		course,
		currentMission,
		finalSubmissions,
		autoClearedRoles
	});

	const finalJsonText = JSON.stringify(finalJson, null, 2);
	// console.log('FINAL JSON TEXT', finalJsonText);
	// console.log('FINAL SUBMISSIONS', finalSubmissions);

	const finalValidateResult = validateMissionJson({
		jsonText: finalJsonText,
		course,
		missionIndex: currentMissionIndex,
		roleId: 'team'
	});
	// console.log('FINAL VALIDATE RESULT', finalValidateResult);

	if (!finalValidateResult.ok) {
		setShowFinalReadyModal(false);
		setIsFinalSequencePlaying(false);
		setShowFinalSuccessModal(false);

		setStatus('editing');
		setHasExecuted(false);

		setConsoleLogs([
			...consoleLogs,
			{
				type: 'error',
				text: '최종 JSON 실행 검증에 실패했습니다.'
			},
			...(finalValidateResult.messages ?? [])
		]);

		return;
	}

	const finalSequenceState = createFinalSequenceState({
		finalValidateResult
	});

	const nextSimulationState =
		course?.themeId === 'weatherApp'
			? mergeSimulationState(simulationState, finalSequenceState)
			: mergeLayerState(simulationState, finalSequenceState);

	const waitForFinalResultCallback = currentMission?.waitForFinalResultCallback === true;

	setShowFinalReadyModal(false);
	setIsFinalSequencePlaying(waitForFinalResultCallback);
	setShowFinalSuccessModal(!waitForFinalResultCallback);
	setSimulationState(nextSimulationState);

	await syncFinalSequenceToFirestore({
		nextMissionProgress: getNextProgressForCurrentPlayer('cleared'),
		nextSimulationState,
		waitForFinalResultCallback: currentMission?.waitForFinalResultCallback === true
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
			type: finalValidateResult?.finalCorrect === false ? 'warning' : 'success',
			text:
				finalValidateResult?.finalCorrect === false
					? '방어 계획이 실행되었습니다. 공용화면에서 실패 결과를 확인하세요.'
					: currentMission?.finalSuccessMessage ?? '최종 미션이 완료되었습니다.'
		}
	]);
}
