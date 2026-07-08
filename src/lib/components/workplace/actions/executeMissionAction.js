// src/lib/components/workplace/actions/executeMissionAction.js

import { mapJsonToSimulationState, mergeSimulationState } from '../simulation/simulationMapper.js';
import { validateMissionJson } from '../validator/missionValidator.js';
import { submitReadMissionAction } from './readMissionSubmitAction.js';

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeMissionAction({ context, actions }) {
	const {
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
		simulationState,
	} = context;

	const {
		setStatus,
		setVerificationEnergy,
		setTransmissionState,
		setConsoleLogs,
		setHasExecuted,
		setSimulationState,

		recordCurrentAttempt,
		consumeEnergyOnWrongAnswer,
		getNextProgressForCurrentPlayer,
		getNextMissionIndexAfterMissionClear,
		getNextRoomStatusAfterMissionClear,
		syncMissionSuccessToFirestore,
		handleFinalMissionSubmit,
		markCurrentPlayerMissionCleared,
		unlockNextMissionIfReady,
		patchRoomState
	} = actions;

	if (status === 'sending') {
		return;
	}

	if (status === 'cleared') {
		setConsoleLogs([
			{
				type: 'success',
				text: '이미 코스를 클리어했습니다.'
			}
		]);
		return;
	}

	const currentProgress = currentPlayer?.missionProgress?.[currentMissionIndex];

	if (currentProgress === 'cleared' || currentProgress === 'submitted') {
		setConsoleLogs([
			{
				type: 'warning',
				text: '이미 완료한 미션입니다. 다른 요원의 완료를 기다려 주세요.'
			}
		]);
		return;
	}

	if (verificationEnergy <= 0) {
		setConsoleLogs([
			{
				type: 'error',
				text: '에너지가 모두 소진되었습니다. 선생님이 재시작할 때까지 기다려 주세요.'
			}
		]);

		setTransmissionState({
			visible: true,
			phase: 'error',
			roleName: currentPlayer?.roleName ?? '',
			message: '에너지가 모두 소진되었습니다.',
			progress: 100
		});

		return;
	}

	setStatus('sending');

	setTransmissionState({
		visible: true,
		phase: 'sending',
		roleName: currentPlayer?.roleName ?? '',
		message: isReadCourse ? 'JSON 제출서를 전송하는 중입니다.' : 'JSON 명령을 전송하는 중입니다.',
		progress: 20
	});

	setConsoleLogs([
		{
			type: 'send',
			text: isReadCourse ? 'JSON 제출서를 전송합니다.' : 'JSON 명령을 전송합니다.'
		}
	]);

	await wait(450);

	setTransmissionState({
		visible: true,
		phase: 'validating',
		roleName: currentPlayer?.roleName ?? '',
		message: 'JSON 문법과 미션 조건을 확인하는 중입니다.',
		progress: 45
	});

	await wait(450);

	if (isReadCourse) {
		try {
			const parsedJson = JSON.parse(jsonText);

			if (!parsedJson || typeof parsedJson !== 'object' || Array.isArray(parsedJson)) {
				setStatus('editing');
				setHasExecuted(false);

				setTransmissionState({
					visible: true,
					phase: 'error',
					roleName: currentPlayer?.roleName ?? '',
					message: '분석 결과는 { }로 감싼 JSON 객체 형태여야 합니다.',
					progress: 100
				});

				setConsoleLogs([
					{
						type: 'error',
						text: '분석 결과는 { }로 감싼 JSON 객체 형태여야 합니다.'
					}
				]);

				return;
			}
		} catch (error) {
			setStatus('editing');
			setHasExecuted(false);

			setTransmissionState({
				visible: true,
				phase: 'error',
				roleName: currentPlayer?.roleName ?? '',
				message: 'JSON 문법이 올바르지 않습니다.',
				progress: 100
			});

			setConsoleLogs([
				{
					type: 'error',
					text: 'JSON 문법이 올바르지 않습니다.'
				},
				{
					type: 'info',
					text: '읽기 미션은 정답을 맞히는 것이 아니라 분석 결과를 JSON 형식으로 제출하는 미션입니다.'
				}
			]);

			return;
		}

		await recordCurrentAttempt({
			ok: true,
			type: 'read-submit',
			messages: []
		});

		await submitReadMissionAction({
			useMockPlayers,
			lessonId,
			roomId,
			activeParticipantId,
			currentMission,
			currentMissionIndex,
			currentPlayer,
			jsonText,

			setStatus,
			setHasExecuted,
			setConsoleLogs,
			setTransmissionState
		});

		return;
	}

	const validateResult = validateMissionJson({
		jsonText,
		course,
		missionIndex: currentMissionIndex,
		roleId: currentPlayer?.roleId
	});

	if (!validateResult.ok) {
		await recordCurrentAttempt(validateResult);

		const energyResult = await consumeEnergyOnWrongAnswer();

		setStatus('editing');

		setTransmissionState({
			visible: true,
			phase: 'error',
			roleName: currentPlayer?.roleName ?? '',
			message: energyResult.message,
			progress: 100
		});

		setConsoleLogs([
			{
				type: energyResult.nextEnergy <= 0 ? 'error' : 'warning',
				text: energyResult.message
			},
			...(validateResult.messages ?? []),
			{
				type: validateResult.type === 'syntax' ? 'error' : 'warning',
				text:
					validateResult.type === 'syntax'
						? '문법 오류로 실행할 수 없습니다.'
						: '조건이 맞지 않습니다. 단서를 다시 확인하세요.'
			}
		]);

		return;
	}

	if (currentMission?.type === 'team-final') {
		setTransmissionState({
			visible: true,
			phase: 'mapping',
			roleName: currentPlayer?.roleName ?? '',
			message: '최종 JSON 값을 확인하는 중입니다.',
			progress: 65
		});

		await wait(450);

		await recordCurrentAttempt(validateResult);

		setTransmissionState({
			visible: true,
			phase: 'applying',
			roleName: currentPlayer?.roleName ?? '',
			message: '최종 값을 팀 동기화 목록에 제출하는 중입니다.',
			progress: 80
		});

		await wait(500);

		const nextMissionProgress = getNextProgressForCurrentPlayer('submitted');

		await syncMissionSuccessToFirestore({
			nextMissionProgress,
			nextSimulationState: null,
			nextMissionIndex: currentMissionIndex,
			nextRoomStatus: 'final',
			shouldSyncSimulationState: false
		});

		await handleFinalMissionSubmit(validateResult.finalPiece);

		setTransmissionState({
			visible: true,
			phase: 'success',
			roleName: currentPlayer?.roleName ?? '',
			message: '최종 값이 제출되었습니다.',
			progress: 100
		});

		return;
	}
	await recordCurrentAttempt(validateResult);

	setTransmissionState({
		visible: true,
		phase: 'mapping',
		roleName: currentPlayer?.roleName ?? '',
		message: 'JSON을 시뮬레이션 명령으로 변환하는 중입니다.',
		progress: 65
	});

	await wait(450);
	const simulationScope = currentMission?.simulationScope ?? 'room';

const shouldMapWithMissionContext = themeId === 'weatherApp';

const mapResult =
	simulationScope === 'none'
		? {
				ok: true,
				state: {
					layers: {},
					sprites: {},
					camera: {},
					flags: {}
				}
		  }
		: shouldMapWithMissionContext
		  ? mapJsonToSimulationState(themeId, {
					jsonText,
					missionId: currentMission?.id ?? null,
					roleId: currentPlayer?.roleId ?? null
		    })
		  : validateResult.simulationState
		    ? {
						ok: true,
						state: validateResult.simulationState
		      }
		    : mapJsonToSimulationState(themeId, jsonText);

	if (!mapResult.ok) {
		setStatus('editing');

		setTransmissionState({
			visible: true,
			phase: 'error',
			roleName: currentPlayer?.roleName ?? '',
			message: '시뮬레이션 명령 변환에 실패했습니다.',
			progress: 100
		});

		setConsoleLogs([
			{
				type: 'error',
				text: mapResult.message ?? '시뮬레이션 상태로 변환하지 못했습니다.'
			}
		]);

		return;
	}

	setTransmissionState({
		visible: true,
		phase: 'applying',
		roleName: currentPlayer?.roleName ?? '',
		message: '공용 시스템에 명령을 적용하는 중입니다.',
		progress: 85
	});

	await wait(500);

	const nextLocalSimulationState = mergeSimulationState(simulationState, mapResult.state);

const nextMissionProgress = getNextProgressForCurrentPlayer('cleared');
const nextMissionIndex = getNextMissionIndexAfterMissionClear();
const nextRoomStatus = getNextRoomStatusAfterMissionClear();

const isWeatherAppRegisterMission =
	themeId === 'weatherApp' &&
	currentMission?.id === 'register-lost-item' &&
	simulationScope === 'room';

if (isWeatherAppRegisterMission) {
	const nextFlags = mapResult.state?.flags ?? {};
	const itemKey = Object.keys(nextFlags).find((key) => /^item[1-4]$/.test(key));
	const item = itemKey ? nextFlags[itemKey] : null;

	if (!itemKey || !item) {
		setStatus('editing');

		setTransmissionState({
			visible: true,
			phase: 'error',
			roleName: currentPlayer?.roleName ?? '',
			message: '등록할 분실물 카드를 찾지 못했습니다.',
			progress: 100
		});

		setConsoleLogs([
			{
				type: 'error',
				text: '등록할 분실물 카드 정보가 만들어지지 않았습니다.'
			}
		]);

		return;
	}

	// 1. 내 화면에는 바로 카드 표시
	setSimulationState(nextLocalSimulationState);

	// 2. Firestore에는 전체 simulationState가 아니라 내 카드 하나만 저장
	await patchRoomState({
		patch: {
			[`simulationState.flags.${itemKey}`]: item,
			'simulationState.flags.managerConnected': true,
			'simulationState.flags.categoryReady': true,
			'simulationState.flags.registerMode': true
		}
	});

	// 3. 미션 진행 상태만 저장. simulationState 전체 저장 금지.
	await syncMissionSuccessToFirestore({
		nextMissionProgress,
		nextSimulationState: null,
		nextMissionIndex,
		nextRoomStatus,
		shouldSyncSimulationState: false
	});

	setHasExecuted(true);
	setStatus('executed');

	setTransmissionState({
		visible: true,
		phase: 'success',
		roleName: currentPlayer?.roleName ?? '',
		message: '분실물 카드가 앱 목록에 등록되었습니다.',
		progress: 100
	});

	setConsoleLogs([
		{
			type: 'success',
			text: `${currentPlayer?.roleName ?? '요원'}의 분실물 카드가 등록되었습니다.`
		},
		{
			type: 'success',
			text: `미션 ${currentMissionIndex + 1}이 완료되었습니다.`
		}
	]);

	await wait(600);

	markCurrentPlayerMissionCleared();
	unlockNextMissionIfReady();

	return;
}

const shouldUseMergedSimulationState = themeId === 'weatherApp';

const nextRoomSimulationState =
	simulationScope === 'room'
		? shouldUseMergedSimulationState
			? nextLocalSimulationState
			: mapResult.state
		: null;

await syncMissionSuccessToFirestore({
	nextMissionProgress,
	nextSimulationState: nextRoomSimulationState,
	nextMissionIndex,
	nextRoomStatus,
	shouldSyncSimulationState: simulationScope === 'room'
});

setSimulationState(nextLocalSimulationState);
setHasExecuted(true);
setStatus('executed');

	setTransmissionState({
		visible: true,
		phase: 'success',
		roleName: currentPlayer?.roleName ?? '',
		message: '명령이 공용 시스템에 적용되었습니다.',
		progress: 100
	});

	setConsoleLogs([
		{
			type: 'success',
			text: `${currentPlayer?.roleName ?? '요원'}의 명령이 적용되었습니다.`
		},
		{
			type: 'success',
			text: `미션 ${currentMissionIndex + 1}이 완료되었습니다.`
		}
	]);

	await wait(600);

	markCurrentPlayerMissionCleared();
	unlockNextMissionIfReady();
}
