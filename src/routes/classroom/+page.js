export const ssr = false;

import { listClassroomLessons } from '$lib/firebase/classroom';
import { authUser } from '$lib/stores/authUser';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

export async function load() {
	const user = get(authUser);
	if (!user) throw error(401, '로그인이 필요합니다.');

	const lessons = await listClassroomLessons({ uid: user.uid });

	return {
		lessons
	};
}
