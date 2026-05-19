// C:\quizntalk\src\routes\library\[lessonId]\+page.js
import { getLessonById, getLessonRooms } from '$lib/firebase/missionRoom/missionRoomRepository.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const { lessonId, lesson } = await getLessonById(params.lessonId);

		let rooms = [];

		if (lesson.status !== 'completed') {
			rooms = await getLessonRooms(params.lessonId);
		}

		return {
			lessonId,
			lesson,
			rooms
		};
	} catch (e) {
		throw error(404, e?.message ?? '수업 정보를 찾을 수 없습니다.');
	}
}
