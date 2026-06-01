// src/routes/individual/[lessonId]/+page.js

import { getLessonById } from '$lib/firebase/missionRoom/missionRoomRepository.js';

export async function load({ params }) {
	const { lessonId } = params;

	const result = await getLessonById(lessonId);

	return {
		lessonId,
		lesson: result.lesson
	};
}