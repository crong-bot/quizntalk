// src/lib/components/workplace/actions/readMissionSubmitAction.js

import { submitReadMissionForReview } from '$lib/firebase/missionRoom/missionRoomService.js';

export async function submitReadMissionAction({
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
}) {
	const isMockMode = useMockPlayers || !lessonId || !roomId || !activeParticipantId;

	try {
		if (!isMockMode) {
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
		}

		setStatus('submitted');
		setHasExecuted(true);

		setConsoleLogs([
			{
				type: 'success',
				text: '제출되었습니다.'
			},
			{
				type: 'info',
				text: isMockMode
					? '목업 모드입니다. 실제 저장 없이 제출 상태만 확인합니다.'
					: '교사 확인이 완료되면 다음 단계로 이동합니다.'
			}
		]);

		setTransmissionState({
			visible: true,
			phase: 'success',
			roleName: currentPlayer?.roleName ?? '',
			message: isMockMode ? '목업 제출 완료' : '제출 완료 · 교사 확인 대기',
			progress: 100
		});

		return {
			ok: true,
			isMockMode
		};
	} catch (error) {
		console.error(error);

		setConsoleLogs([
			{
				type: 'error',
				text: error?.message ?? '제출 내용을 저장하지 못했습니다.'
			}
		]);

		setTransmissionState({
			visible: true,
			phase: 'error',
			roleName: currentPlayer?.roleName ?? '',
			message: '제출 실패',
			progress: 100
		});

		return {
			ok: false,
			error
		};
	}
}