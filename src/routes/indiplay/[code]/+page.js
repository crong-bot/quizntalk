import { getRoomByInviteCode } from '$lib/firebase/missionRoom/missionRoomRepository.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const result = await getRoomByInviteCode(params.code);

		const isIndividualWriteRoom =
			result.invite?.missionType === 'individual-write' ||
			result.room?.missionType === 'individual-write' ||
			result.lesson?.missionType === 'individual-write';

		if (!isIndividualWriteRoom) {
			throw redirect(302, `/invite/${result.code}`);
		}

		return {
			code: result.code,
			lessonId: result.lessonId,
			roomId: result.roomId,
			lesson: result.lesson,
			room: result.room,
			invite: result.invite
		};
	} catch (e) {
		if (e?.status === 302) {
			throw e;
		}

		throw error(404, e?.message ?? '방을 찾을 수 없습니다.');
	}
}