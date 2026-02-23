export const ssr = false;

import { db } from '$lib/firebase/client';
import { error, redirect } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

export async function load({ params }) {
	const code = (params.code ?? '').toUpperCase().trim();
	if (!code) throw error(404, 'invite code missing');

	// 1) invites/{code} 조회
	const invSnap = await getDoc(doc(db, 'invites', code));
	if (!invSnap.exists()) throw error(404, 'invalid invite code');

	const inv = invSnap.data();

	if (inv?.active === false) throw error(410, 'invite is inactive');

	// ✅ (신규) courseId 기반
	if (inv?.courseId) {
		const courseSnap = await getDoc(doc(db, 'courses', inv.courseId));
		if (!courseSnap.exists()) throw error(404, 'course not found');

		const course = courseSnap.data();
		const firstLessonId = course?.firstLessonId;
		const courseId = courseSnap.id;
		if (!firstLessonId) {
			// 코스는 있는데 차시가 아직 없을 때 (네 UX상 가능)
			// 임시로 코스 페이지가 없으니 메시지 페이지를 띄우거나 library로 보냄
			throw redirect(303, '/library');
		}
		throw redirect(303, `/study/c/${encodeURIComponent(courseId)}/0`);
		//throw redirect(303, `/study/u/${encodeURIComponent(firstLessonId)}/0`);
	}

	// ✅ (구버전 하위호환) lessonId 기반 invites가 남아있을 수 있음
	// if (inv?.courseId) {

	// 	throw redirect(303,  `/study/c/${encodeURIComponent(courseId)}/0`);
	// }

	// 둘 다 없으면 데이터 이상
	throw error(400, 'invalid invite data');
}
