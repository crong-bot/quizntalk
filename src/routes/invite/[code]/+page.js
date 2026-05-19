// src/routes/invite/[code]/+page.js

import { getRoomByInviteCode } from '$lib/firebase/missionRoom/missionRoomRepository.js';

import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const result = await getRoomByInviteCode(params.code);

		return {
			code: result.code,
			lessonId: result.lessonId,
			roomId: result.roomId,
			lesson: result.lesson,
			room: result.room,
			invite: result.invite
		};
	} catch (e) {
		throw error(404, e?.message ?? '방을 찾을 수 없습니다.');
	}
}
